#!/usr/bin/env python3
"""Capture the public HTML pages linked from Robert J. Fleming's sitemap."""

from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit

import requests
from bs4 import BeautifulSoup, Comment

BASE = "https://www.robertjfleming.com"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = PROJECT_ROOT / "app/data/source-pages.json"
CSS_FILE = PROJECT_ROOT / "app/reference-source.css"
USER_AGENT = "Mozilla/5.0 (compatible; public-site-replica/1.0)"
ALLOWED_HOSTS = {"www.robertjfleming.com", "robertjfleming.com"}


def fetch(url: str) -> requests.Response:
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=40,
    )
    response.raise_for_status()
    return response


def canonical_page_url(url: str, base_url: str = BASE) -> str | None:
    """Return a normalized first-party HTML URL, or None for other resources."""
    absolute = urljoin(base_url, url)
    parts = urlsplit(absolute)
    host = (parts.hostname or "").lower()
    if host not in ALLOWED_HOSTS:
        return None
    path = parts.path or "/"
    if path == "/index.html":
        path = "/"
    if path != "/" and not path.lower().endswith(".html"):
        return None
    return urlunsplit(("https", "www.robertjfleming.com", path, "", ""))


def local_href(value: str, page_url: str) -> str:
    value = value.strip()
    if not value or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return value

    absolute = urljoin(page_url, value)
    parts = urlsplit(absolute)
    if (parts.hostname or "").lower() in ALLOWED_HOSTS:
        path = parts.path or "/"
        if path == "/index.html":
            path = "/"
        return urlunsplit(("", "", path, parts.query, parts.fragment))
    return value


def absolute_asset_url(value: str, page_url: str) -> str:
    value = (value or "").strip()
    if not value or value.startswith(("data:", "blob:", "javascript:", "#", "mailto:", "tel:")):
        return value
    return urljoin(page_url, value)


def clean_html(page_url: str, response: requests.Response) -> dict:
    soup = BeautifulSoup(response.content, "html.parser")
    body = soup.body
    if body is None:
        raise ValueError(f"No body element at {page_url}")

    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description_tag = soup.select_one('meta[name="description"]')
    description = description_tag.get("content", "").strip() if description_tag else ""
    headings = [node.get_text(" ", strip=True) for node in soup.select("h1")]
    headings = [heading for heading in headings if heading]

    page_id = body.get("id", "")
    body_classes = " ".join(body.get("class", []))

    for node in body.find_all(["script", "noscript"]):
        node.decompose()

    # Strip tracking comments and noscript-text remnants, without changing page copy.
    for node in list(body.find_all(string=True)):
        if isinstance(node, Comment) and any(
            marker in str(node).lower()
            for marker in ("google tag manager", "google analytics", "end gtm")
        ):
            node.extract()
        elif re.fullmatch(
            r"\s*(?:Google Tag Manager \(noscript\)|End Google Tag Manager \(noscript\))\s*",
            str(node),
            re.IGNORECASE,
        ):
            node.extract()

    for anchor in body.find_all("a", href=True):
        anchor["href"] = local_href(anchor["href"], page_url)

    for node in body.find_all(True):
        for attribute in ("src", "poster", "data-src", "data-original", "data-lazy-src"):
            if node.has_attr(attribute):
                node[attribute] = absolute_asset_url(node.get(attribute), page_url)

        lazy_image = next(
            (
                node.get(attribute)
                for attribute in ("data-src", "data-original", "data-lazy-src")
                if node.get(attribute)
            ),
            None,
        )
        current_src = node.get("src", "")
        if lazy_image and (not current_src or current_src.startswith("data:image/gif")):
            node["src"] = absolute_asset_url(lazy_image, page_url)

        if node.has_attr("srcset"):
            candidates = []
            for candidate in node["srcset"].split(","):
                item = candidate.strip().split()
                if item:
                    item[0] = absolute_asset_url(item[0], page_url)
                    candidates.append(" ".join(item))
            node["srcset"] = ", ".join(candidates)

        # Never allow source markup to submit or run JavaScript in this static replica.
        for attribute in list(node.attrs):
            if attribute.lower().startswith("on"):
                del node.attrs[attribute]
        for attribute in ("href", "src", "action", "formaction"):
            value = node.get(attribute)
            if isinstance(value, str) and value.strip().lower().startswith("javascript:"):
                node[attribute] = "#"

        if node.name == "form":
            node["action"] = "#"
            node["method"] = "post"
            node.attrs.pop("target", None)

        if node.has_attr("style"):
            style = node["style"]
            node["style"] = re.sub(
                r'''url\(\s*(["']?)([^)"']+)\1\s*\)''',
                lambda match: "url('" + absolute_asset_url(match.group(2), page_url) + "')",
                style,
                flags=re.IGNORECASE,
            )

    for style_node in body.find_all("style"):
        style_node.string = re.sub(
            r'''url\(\s*(["']?)([^)"']+)\1\s*\)''',
            lambda match: "url('" + absolute_asset_url(match.group(2), page_url) + "')",
            style_node.get_text(),
            flags=re.IGNORECASE,
        )

    return {
        "path": urlsplit(page_url).path or "/",
        "url": page_url,
        "status": response.status_code,
        "title": title,
        "description": description,
        "h1": headings,
        "body_id": page_id,
        "body_class": body_classes,
        "html": "".join(str(child) for child in body.contents),
    }


def fetch_page(url: str) -> tuple[dict, set[str]]:
    response = fetch(url)
    record = clean_html(url, response)
    soup = BeautifulSoup(response.content, "html.parser")
    discovered = set()
    for anchor in soup.select("a[href]"):
        candidate = canonical_page_url(anchor.get("href", ""), url)
        if candidate:
            discovered.add(candidate)
    return record, discovered


def fetch_css() -> str:
    homepage = BeautifulSoup(fetch(BASE + "/").content, "html.parser")
    stylesheets = [
        link.get("href")
        for link in homepage.select('link[rel~="stylesheet"][href]')
        if "global.css" in link.get("href", "")
    ]
    if not stylesheets:
        raise RuntimeError("The reference homepage no longer links a global.css stylesheet")

    css_url = urljoin(BASE, stylesheets[0])
    css = fetch(css_url).text
    css_url_pattern = re.compile(
        r'''url\(\s*(["']?)([^)"']+?)(["']?)\s*\)''', re.IGNORECASE
    )

    def rewrite_css_asset(match: re.Match[str]) -> str:
        quote = match.group(1) or match.group(3) or ""
        value = match.group(2).strip()
        if value.startswith(("data:", "http:", "https:", "//", "#")):
            return f"url({quote}{value}{quote})"
        return f"url({quote}{urljoin(css_url, value)}{quote})"

    css = css_url_pattern.sub(rewrite_css_asset, css)
    css = re.sub(
        r"@import\s+(['\"])((?!https?:|//|data:)[^'\"]+)(['\"])",
        lambda match: "@import " + match.group(1) + urljoin(css_url, match.group(2)) + match.group(3),
        css,
        flags=re.IGNORECASE,
    )

    # Page-specific source selectors target a wrapper carrying the source body's ID/classes.
    css = re.sub(
        r"(?<![\w#.-])\.js\s+body#([A-Za-z_-][\w-]*)",
        r"#\1.js",
        css,
    )
    css = re.sub(
        r"(?<![\w#.-])body#([A-Za-z_-][\w-]*)",
        r"#\1",
        css,
    )
    css = re.sub(
        r"(?<![\w#.-])body(?=\.[A-Za-z_-])",
        ".source-page-body",
        css,
    )
    css = re.sub(r"(?<![\w#.-])body\s*>\s*", ".source-page-body > ", css)

    # Remove three obsolete IE star-property hacks rejected by modern CSS tooling.
    css = re.sub(
        r"(?<![\w-])\*(?:display|float|text-indent|line-height)\s*:\s*[^;{}]+;?",
        "",
        css,
        flags=re.IGNORECASE,
    )
    return css


def main() -> None:
    sitemap = BeautifulSoup(fetch(BASE + "/sitemap.xml").content, "xml")
    urls = set()
    for node in sitemap.find_all("loc"):
        normalized = canonical_page_url(node.get_text(strip=True))
        if normalized:
            urls.add(normalized)

    records: dict[str, dict] = {}
    pending = set(urls)
    while pending:
        batch = sorted(pending - set(records))
        if not batch:
            break
        pending.clear()
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = {pool.submit(fetch_page, url): url for url in batch}
            for future in as_completed(futures):
                url = futures[future]
                record, discovered = future.result()
                records[url] = record
                pending.update(discovered - set(records))
        print(f"Captured {len(records)} pages; next linked pages: {len(pending)}")

    ordered = sorted(records.values(), key=lambda record: (record["path"] != "/", record["path"]))
    if not ordered or ordered[0]["path"] != "/":
        raise RuntimeError("The source sitemap did not contain a homepage")
    paths = [record["path"] for record in ordered]
    if len(paths) != len(set(paths)):
        raise RuntimeError("Duplicate local routes were discovered")
    invalid_paths = [path for path in paths if path != "/" and "/" in path.strip("/")]
    if invalid_paths:
        raise RuntimeError(f"Nested routes require review: {invalid_paths[:10]}")

    css = fetch_css()
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    CSS_FILE.write_text(css, encoding="utf-8")
    DATA_FILE.write_text(
        json.dumps(ordered, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "pages": len(ordered),
                "unique_routes": len(paths),
                "first_party_linked_pages": len(set(paths) - urls_to_paths(urls)),
                "titles_missing": sum(not page["title"] for page in ordered),
                "body_missing": sum(not page["html"].strip() for page in ordered),
                "css_bytes": len(css.encode("utf-8")),
                "data_bytes": DATA_FILE.stat().st_size,
                "routes": paths,
            },
            indent=2,
        )
    )


def urls_to_paths(urls: set[str]) -> set[str]:
    return {urlsplit(url).path or "/" for url in urls}


if __name__ == "__main__":
    main()

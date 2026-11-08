import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routes = [
  { path: '/', name: 'Home Page' },
  { path: '/projects', name: 'Projects Showcase' },
  { path: '/projects/financial-telemetry-pipeline', name: 'Project Detail' },
  { path: '/pricing', name: 'Pricing & SOW' },
  { path: '/lab', name: 'Systems Lab' },
  { path: '/blog', name: 'Blog Index' },
  { path: '/blog/nextjs-16-cloudflare-pages-architecture', name: 'Blog Detail' },
  { path: '/resume', name: 'Resume / CV' },
  { path: '/status', name: 'Status Dashboard' },
  { path: '/services', name: 'Services Hub' },
  { path: '/services/architecture-audit', name: 'Service Detail' },
  { path: '/orders', name: 'Orders Hub' },
  { path: '/orders/tracker?orderId=ORD-7821-DEMO', name: 'Order Tracker' },
  { path: '/orders/invoice?orderId=ORD-7821-DEMO', name: 'Invoice View' },
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/non-existent-page-test', name: '404 Page' },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log('Launching headless Chrome with remote debugging on port 9222...');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'about:blank',
  ]);

  await sleep(2500);

  let versionData;
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    versionData = await res.json();
    console.log('Connected to Chrome via CDP:', versionData.Browser);
  } catch (e) {
    console.error('Failed to connect to Chrome on port 9222:', e.message);
    chromeProcess.kill();
    process.exit(1);
  }

  // Get list of targets
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await listRes.json();
  const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let messageId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Set device emulation
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
    hasTouch: true,
  });

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  const auditResults = [];

  for (const r of routes) {
    const targetUrl = `http://localhost:3000${r.path}`;
    console.log(`Auditing mobile UX for: ${r.name} (${targetUrl})...`);

    await sendCommand('Page.navigate', { url: targetUrl });
    await sleep(3000); // Allow turbopack / hydration / animations to settle

    // Run evaluation script inside the page
    const evalScript = `
      (() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const hasHorizontalOverflow = docWidth > vw || bodyWidth > vw;
        const overflowPixels = Math.max(docWidth, bodyWidth) - vw;

        // Elements causing overflow
        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 2 && rect.width > 20) {
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || undefined,
              className: el.className && typeof el.className === 'string' ? el.className.slice(0, 80) : undefined,
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflow: Math.round(rect.right - vw)
            });
          }
        });

        // Touch targets audit (< 44px)
        const touchTargets = [];
        const clickableSelectors = 'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [tabindex="0"]';
        document.querySelectorAll(clickableSelectors).forEach((el) => {
          // Check visibility
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.width > 0 &&
            rect.height > 0
          ) {
            const isSmall = rect.width < 44 || rect.height < 44;
            if (isSmall) {
              touchTargets.push({
                tag: el.tagName.toLowerCase(),
                text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('value') || '').trim().slice(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
              });
            }
          }
        });

        // Font sizes audit (< 12px)
        const smallFonts = [];
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue && node.nodeValue.trim().length > 2) {
            const parent = node.parentElement;
            if (parent) {
              const style = window.getComputedStyle(parent);
              const fontSize = parseFloat(style.fontSize);
              if (fontSize < 12 && style.display !== 'none' && style.visibility !== 'hidden') {
                smallFonts.push({
                  fontSize: Math.round(fontSize * 10) / 10,
                  text: node.nodeValue.trim().slice(0, 40),
                  tag: parent.tagName.toLowerCase(),
                  className: typeof parent.className === 'string' ? parent.className.slice(0, 50) : ''
                });
              }
            }
          }
        }

        // Form Inputs iOS zoom audit (< 16px font-size causes iOS Safari auto-zoom)
        const zoomRiskInputs = [];
        document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select').forEach((el) => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize < 16) {
            zoomRiskInputs.push({
              tag: el.tagName.toLowerCase(),
              name: el.name || el.id || el.placeholder || '',
              fontSize: Math.round(fontSize * 10) / 10
            });
          }
        });

        // Fixed/Sticky layout elements
        const fixedElements = [];
        document.querySelectorAll('*').forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            const rect = el.getBoundingClientRect();
            if (rect.height > 0 && rect.width > 0) {
              fixedElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                className: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
                position: style.position,
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                height: Math.round(rect.height),
                zIndex: style.zIndex
              });
            }
          }
        });

        // Bottom dock overlap check
        const bottomDock = document.querySelector('.mobile-bottom-dock');
        const bottomDockVisible = bottomDock && window.getComputedStyle(bottomDock).display !== 'none';
        const bodyPaddingBottom = window.getComputedStyle(document.body).paddingBottom;
        const mainPaddingBottom = document.querySelector('main') ? window.getComputedStyle(document.querySelector('main')).paddingBottom : null;

        // Viewport meta
        const viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';

        // Safe area support
        const hasSafeAreaPadding = document.body.style.paddingBottom?.includes('env(safe-area-inset-bottom)') ||
                                   document.querySelector('.mobile-bottom-dock')?.style.paddingBottom?.includes('env(safe-area-inset-bottom)');

        return {
          vw,
          vh,
          docWidth,
          bodyWidth,
          hasHorizontalOverflow,
          overflowPixels,
          overflowingCount: overflowingElements.length,
          topOverflowElements: overflowingElements.slice(0, 10),
          touchTargetsCount: touchTargets.length,
          sampleSmallTouchTargets: touchTargets.slice(0, 15),
          smallFontsCount: smallFonts.length,
          sampleSmallFonts: smallFonts.slice(0, 10),
          zoomRiskInputsCount: zoomRiskInputs.length,
          zoomRiskInputs,
          fixedElements,
          bottomDockVisible,
          bodyPaddingBottom,
          mainPaddingBottom,
          viewportMeta,
        };
      })()
    `;

    const result = await sendCommand('Runtime.evaluate', {
      expression: evalScript,
      returnByValue: true,
    });

    const metrics = result.result.value;
    auditResults.push({
      route: r.path,
      name: r.name,
      metrics,
    });

    console.log(`  ✓ ${r.name}: Overflow=${metrics.hasHorizontalOverflow} (+${metrics.overflowPixels}px), SmallTargets=${metrics.touchTargetsCount}, SmallFonts=${metrics.smallFontsCount}, ZoomRiskInputs=${metrics.zoomRiskInputsCount}`);
  }

  // Close Chrome
  ws.close();
  chromeProcess.kill();

  const auditPath = path.resolve('.audit-screens', 'mobile-deep-audit.json');
  fs.writeFileSync(auditPath, JSON.stringify(auditResults, null, 2));
  console.log(`Full deep audit saved to ${auditPath}`);
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});

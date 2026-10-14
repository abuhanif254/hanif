import { SourcePageRecord } from "./source-pages";

export function getEngineerHomepage(): SourcePageRecord {
  const html = `
    <div class="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
      <ul>
        <li>
          Available for High-Impact Contracts &amp; Consulting: <strong> contact@abuhanif.dev </strong>
          <a class="tnv3-button" href="#contactform">Request Project Quote</a>
        </li>
      </ul>
    </div>
    <div class="index" id="container">
      <div class="cwrap">
        <!-- Header -->
        <div id="header">
          <div class="wrapper">
            <div id="head">
              <div id="logo">
                <a data-title="Abu Hanif - Staff Software Engineer" href="/" title="Back to Home">
                  <img alt="Abu Hanif - Staff Software Engineer" id="mainlogo" src="/images/abuhanif-logo-v3.svg"/>
                  Abu Hanif Staff Software Engineer Home
                </a>
              </div>
              <div id="tagline">
                <a href="#contactform" title="Discuss an Engineering Project">
                  Discuss an Engineering Project with Abu Hanif
                </a>
              </div>
            </div>
            <div id="topnav">
              <ul id="tnav-toplevel">
                <li class="index selected priority_1" id="fc"><a href="/">Home</a></li>
                <li class="attorney_34 priority_3"><a href="#about">About Abu Hanif</a></li>
                <li class="section_10 priority_4"><a href="#competencies">Engineering Focus</a></li>
                <li class="practiceareasub_11 priority_2"><a href="#work">Work Showcase</a></li>
                <li class="section_29 priority_4"><a href="#pricing">Work Prices</a></li>
                <li class="section_83 priority_5"><a href="/blog">Technical Blog</a></li>
                <li class="section_28 priority_6"><a href="#feedback">Client Feedback</a></li>
                <li class="category_141"><a href="/admin">Admin Panel</a></li>
                <li class="contactus priority_1" id="lc"><a href="#contactform">Contact</a></li>
              </ul>
            </div>
          </div>
          <div id="ed"></div>
          <div class="clr"></div>
        </div>
        <!-- End Header -->

        <div id="main">
          <div class="mwrap">
            <div class="imgwrap">
              <div id="img1">
                <div class="text-wrapper">
                  <div id="banner-tagline">Clean Architecture • High Performance • Scalable Systems</div>
                  <div id="slideshow">
                    <div class="slide slide1">99.99% Production Uptime for 10M+ Daily Users</div>
                    <div class="slide slide2">Sub-25ms Global P99 Latency at the Edge</div>
                    <div class="slide slide3">Reduced Cloud Infrastructure Costs by 64%</div>
                    <div class="slide slide4">Zero Security Incidents Across 3.5M Identities</div>
                    <div class="slide slide5">10x PostgreSQL Query Throughput via Index Optimization</div>
                  </div>
                </div>
              </div>
              <div id="img2">
                <div class="wrapper">
                  <a class="pabttn pa1" href="#work">Distributed <br/> Systems</a>
                  <a class="pabttn pa2" href="#work">Full-Stack <br/> Engineering</a>
                  <a class="pabttn pa3" href="#pricing">Architecture <br/> &amp; Pricing</a>
                </div>
              </div>
            </div>

            <div class="tcfrags"></div>

            <div id="content">
              <div id="breadcrumbs">
                <div class="wrapper"></div>
              </div>

              <!-- Main Content Body -->
              <div class="bodytext">
                <div class="description">
                  <div id="badges">
                    <span class="badge" title="Full-Stack Senior Engineer">
                      <strong style="display:inline-block;padding:8px 14px;background:#0d223f;color:#38bdf8;border:1px solid #1e293b;border-radius:4px;font-size:13px;font-weight:bold;">
                        9+ YRS EXP
                      </strong>
                    </span>
                    <span class="badge" title="99.99% Production Uptime">
                      <strong style="display:inline-block;padding:8px 14px;background:#064e3b;color:#4ade80;border:1px solid #059669;border-radius:4px;font-size:13px;font-weight:bold;">
                        99.99% UPTIME
                      </strong>
                    </span>
                    <span class="badge" title="50+ Shipped Deployments">
                      <strong style="display:inline-block;padding:8px 14px;background:#1e1b4b;color:#c084fc;border:1px solid #4338ca;border-radius:4px;font-size:13px;font-weight:bold;">
                        50+ SHIPPED APPS
                      </strong>
                    </span>
                  </div>

                  <img src="/images/profile.png" alt="MD Abu Hanif Mia" class="profilepic" style="max-width:220px;float:right;margin:0 0 20px 24px;border:1px solid #d9d9d9;padding:4px;border-radius:4px;background:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.08);"/>

                  <h1 id="about">MD Abu Hanif Mia (Abu Hanif)</h1>
                  <strong class="heading4" style="color:#053056;margin-top:0;display:block;">
                    Staff Software Engineer &amp; Systems Architect
                  </strong>

                  <p>
                    <strong>MD Abu Hanif Mia</strong> (known professionally as <strong>Abu Hanif</strong>) is an experienced software engineer and systems architect whose technical rigor, deep full-stack mastery, and execution velocity have resulted in high-concurrency, fault-tolerant production platforms for startups and enterprise organizations worldwide. Specializing in TypeScript, Next.js, Go, PostgreSQL, and Cloudflare Pages, Abu Hanif operates at the intersection of clean architecture, database performance, and edge network delivery.
                  </p>
                  <p>
                    Whether eliminating complex architectural bottlenecks, restructuring legacy codebases, or deploying new greenfield products from technical requirements to production, Abu Hanif brings over 9 years of battle-tested engineering leadership. Every system is built with high observability, rigorous test coverage, and strict performance SLAs.
                  </p>

                  <!-- WORK SHOWCASE SECTION -->
                  <h2 id="work" style="font-size:1.5em;margin:1.4em 0 0.5em 0;color:#053056;border-bottom:2px solid #9CBE41;padding-bottom:6px;">
                    Work Showcase &amp; Engineering Case Studies
                  </h2>
                  <p>
                    Below is a selection of recent production systems delivered, detailing the core architectural challenge, solution, and measurable production outcome:
                  </p>

                  <!-- Project 1 -->
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #053056;padding:16px 20px;margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
                      <strong style="font-size:17px;color:#053056;">Real-Time Financial Telemetry Pipeline</strong>
                      <span style="font-size:13px;font-weight:bold;color:#16a34a;background:#ecfdf5;padding:3px 8px;border-radius:3px;border:1px solid #a7f3d0;">$18,500 Scope</span>
                    </div>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>The Challenge:</strong> Aggregate and normalize raw order-book streams from 14 exchanges and fan out live market depth to over 45,000 concurrent browser clients with sub-25ms latency.
                    </p>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>Architecture:</strong> Concurrent Go ingestion workers, Redis Pub/Sub cluster, TimescaleDB continuous aggregates, and Next.js WebSocket UI with Canvas charts.
                    </p>
                    <div style="font-size:13px;color:#053056;font-weight:bold;">
                      ✓ Outcome: Processed 12,000,000 events/sec at peak with 22ms P99 delivery and 99.995% uptime across 18 months.
                    </div>
                  </div>

                  <!-- Project 2 -->
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #053056;padding:16px 20px;margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
                      <strong style="font-size:17px;color:#053056;">Cloudflare Edge Multi-Tenant E-Commerce Platform</strong>
                      <span style="font-size:13px;font-weight:bold;color:#16a34a;background:#ecfdf5;padding:3px 8px;border-radius:3px;border:1px solid #a7f3d0;">$24,000 Scope</span>
                    </div>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>The Challenge:</strong> High serverless cold starts and dynamic database queries caused slow product catalog loads and high shopping cart abandonment during international flash sales.
                    </p>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>Architecture:</strong> Next.js 16 App Router on Cloudflare Pages, Supabase PostgreSQL with read-replicas, regional edge caching, and optimistic UI transitions.
                    </p>
                    <div style="font-size:13px;color:#053056;font-weight:bold;">
                      ✓ Outcome: Cut global page render time from 1.8s down to 95ms; lifted checkout conversions by 28% and reduced cloud hosting costs by 64%.
                    </div>
                  </div>

                  <!-- Project 3 -->
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #053056;padding:16px 20px;margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
                      <strong style="font-size:17px;color:#053056;">Enterprise AI Document Search &amp; RAG Pipeline</strong>
                      <span style="font-size:13px;font-weight:bold;color:#16a34a;background:#ecfdf5;padding:3px 8px;border-radius:3px;border:1px solid #a7f3d0;">$14,000 Scope</span>
                    </div>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>The Challenge:</strong> Engineering and operations teams were losing over 4 hours per week hunting down scattered technical documentation and API specifications across Confluence and GitHub.
                    </p>
                    <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">
                      <strong>Architecture:</strong> Python/FastAPI ingestion service, PostgreSQL with pgvector embeddings, hybrid BM25 + semantic reranking, and citation-enforced interactive AI assistant.
                    </p>
                    <div style="font-size:13px;color:#053056;font-weight:bold;">
                      ✓ Outcome: Reduced technical query resolution time by 82% across 500,000+ indexed documents with 96.4% citation accuracy.
                    </div>
                  </div>

                  <!-- WORK PRICES & SERVICES SECTION -->
                  <h2 id="pricing" style="font-size:1.5em;margin:1.4em 0 0.5em 0;color:#053056;border-bottom:2px solid #9CBE41;padding-bottom:6px;">
                    Services &amp; Transparent Work Pricing
                  </h2>
                  <p>
                    All engineering engagements are scoped transparently with defined deliverables, clear milestone schedules, and zero hidden overages:
                  </p>

                  <table style="width:100%;border-collapse:collapse;margin:16px 0 24px 0;font-size:14px;">
                    <thead>
                      <tr style="background:#053056;color:#ffffff;text-align:left;">
                        <th style="padding:10px 14px;">Service Package</th>
                        <th style="padding:10px 14px;">Investment / Rate</th>
                        <th style="padding:10px 14px;">Timeline</th>
                        <th style="padding:10px 14px;">Core Deliverables</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom:1px solid #e2e8f0;background:#ffffff;">
                        <td style="padding:12px 14px;font-weight:bold;color:#053056;">Architecture &amp; Codebase Audit</td>
                        <td style="padding:12px 14px;font-weight:bold;color:#16a34a;">$2,500 Fixed</td>
                        <td style="padding:12px 14px;">3–5 Days</td>
                        <td style="padding:12px 14px;">25+ page diagnostic report, SQL slow query analysis, security audit, cloud hosting savings plan, 60-min debrief call.</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                        <td style="padding:12px 14px;font-weight:bold;color:#053056;">Full-Stack MVP &amp; Feature Sprint</td>
                        <td style="padding:12px 14px;font-weight:bold;color:#16a34a;">$8,500 Fixed</td>
                        <td style="padding:12px 14px;">2–3 Weeks</td>
                        <td style="padding:12px 14px;">Production-grade Next.js 16 + React 19 app, Supabase PostgreSQL schema with RLS, auth, CI/CD, 30-day warranty.</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e2e8f0;background:#ffffff;">
                        <td style="padding:12px 14px;font-weight:bold;color:#053056;">Fractional Staff / Principal Eng</td>
                        <td style="padding:12px 14px;font-weight:bold;color:#16a34a;">$4,800 / month</td>
                        <td style="padding:12px 14px;">Ongoing (15-20h/wk)</td>
                        <td style="padding:12px 14px;">Dedicated Slack access, weekly architecture reviews, PR approvals, core subsystem coding, engineering hiring support.</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- 12 COMPETENCIES LIST -->
                  <h3 id="competencies" style="font-size:1.25em;margin:1.4em 0 0.5em 0;color:#053056;">
                    Core Technical Competencies
                  </h3>
                  <p>
                    Abu Hanif provides deep technical expertise across the following core software engineering disciplines:
                  </p>
                  <ul class="no-spacing-list">
                    <li><a href="#work">Distributed Systems Architecture</a></li>
                    <li><a href="#work">High-Throughput API Engineering</a></li>
                    <li><a href="#work">Next.js 16 &amp; React Applications</a></li>
                    <li><a href="#work">PostgreSQL Query &amp; Index Optimization</a></li>
                    <li><a href="#work">Cloudflare Pages &amp; Edge Infrastructure</a></li>
                    <li><a href="#work">AI &amp; LLM Semantic Vector Search</a></li>
                    <li><a href="#work">Zero-Trust Authentication &amp; RBAC</a></li>
                    <li><a href="#work">CI/CD &amp; Infrastructure Automation</a></li>
                    <li><a href="#work">Microservices &amp; Event Sourcing</a></li>
                    <li><a href="#work">Technical Debt Remediation</a></li>
                    <li><a href="#work">System Performance &amp; Load Auditing</a></li>
                    <li><a href="#work">Mobile &amp; Cross-Platform Apps</a></li>
                  </ul>

                  <strong class="heading4">Email contact@abuhanif.dev Today for Architecture Inquiries</strong>
                  <p>
                    Every technical engagement receives the direct, personal attention of Abu Hanif who can quickly evaluate requirements, untangle complex bottlenecks, and ship high-velocity solutions.
                  </p>
                </div>
              </div>

              <div class="sidebar primary-sidebar"></div>

              <!-- RSS / TECHNICAL BLOG FEED -->
              <div class="cfrags">
                <div class="widget rss_feed" id="rss_feed">
                  <strong class="heading4 widget-title"><a href="/blog">Engineering Architecture Blog</a></strong>
                  <div class="fragcontent">
                    <div class="rss_items jwfeeds jwfeeds-length-150 jwfeeds-has-description jwfeeds-no-dates jwfeeds-count-3 jwfeeds-order-desc" id="jwfeeds-feed-1347">
                      <ul class="rss_items">
                        <li class="rss_item jwfeed-post" id="jwfeeds-item-251679">
                          <meta content="October 14, 2026" itemprop="dateCreated" name="dateCreated"/>
                          <strong>
                            <a href="/blog/nextjs-16-cloudflare-pages-architecture" itemprop="url" rel="bookmark" target="_self">
                              <span class="entry-title" itemprop="name">Architecting High-Throughput Next.js 16 Applications on Cloudflare Pages</span>
                            </a>
                          </strong>
                          <span class="rss_item_descr entry-summary" itemprop="description">
                            How to leverage Next.js App Router, edge caching, and serverless compute on Cloudflare to achieve sub-50ms global latency...
                          </span>
                        </li>
                        <li class="rss_item jwfeed-post" id="jwfeeds-item-241537">
                          <meta content="September 28, 2026" itemprop="dateCreated" name="dateCreated"/>
                          <strong>
                            <a href="/blog/realtime-telemetry-supabase-postgres-cdc" itemprop="url" rel="bookmark" target="_self">
                              <span class="entry-title" itemprop="name">Zero-Latency Real-Time Telemetry with Supabase and Postgres CDC</span>
                            </a>
                          </strong>
                          <span class="rss_item_descr entry-summary" itemprop="description">
                            A deep dive into Postgres Write-Ahead Logs (WAL), Change Data Capture, and broadcasting live state across tens of thousands of WebSocket clients...
                          </span>
                        </li>
                        <li class="rss_item jwfeed-post" id="jwfeeds-item-219813">
                          <meta content="August 15, 2026" itemprop="dateCreated" name="dateCreated"/>
                          <strong>
                            <a href="/blog/swapping-microservices-for-modular-monolith" itemprop="url" rel="bookmark" target="_self">
                              <span class="entry-title" itemprop="name">Why We Swapped 12 Microservices for a Modular Monolith in 2026</span>
                            </a>
                          </strong>
                          <span class="rss_item_descr entry-summary" itemprop="description">
                            How distributed complexity, gRPC serialization overhead, and debugging friction led our engineering team back to a clean modular monolith...
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SIDEBAR SECONDARY -->
            <div class="sidebar secondary-sidebar">
              <div class="widget" id="articles-thumbs">
                <div class="description" style="text-align:center;padding:6px 0;">
                  <div style="background:#053056;color:#ffffff;padding:14px;border-radius:3px;">
                    <div style="font-size:11px;font-weight:bold;color:#9CBE41;text-transform:uppercase;letter-spacing:1px;">Production Track Record</div>
                    <div style="font-size:22px;font-weight:bold;margin:4px 0;">99.99% UPTIME</div>
                    <div style="font-size:12px;color:#d9d9d9;">50+ Shipped Deployments</div>
                  </div>
                </div>
              </div>

              <!-- Contact Form Widget -->
              <div class="widget contactform" id="contactform">
                <strong class="heading4 widget-title"><a href="#contactform">Project Inquiry</a></strong>
                <form action="#" id="genericcontactform" method="post" name="genericcontactform">
                  <div class="formdesc">
                    <span class="free-consultation">Free Consultation</span>
                    <span class="phone-numbers">
                      contact@abuhanif.dev <br/>
                      +880 1700-000000
                    </span>
                  </div>
                  <div class="col-1">
                    <span class="fld">
                      <label for="Name">Name (Required)</label>
                      <input autocomplete="name" id="Name" name="10_Name" placeholder="Name (Required)" required="" size="40" type="text"/>
                    </span>
                    <span class="fld">
                      <label for="Email">Email (Required)</label>
                      <input autocomplete="email" id="Email" name="20_Email" placeholder="Work Email (Required)" required="" size="40" type="email"/>
                    </span>
                    <span class="fld">
                      <label for="Phone">Phone (Optional)</label>
                      <input autocomplete="tel" id="Phone" name="30_Phone" placeholder="Phone (Optional)" size="40" type="tel"/>
                    </span>
                  </div>
                  <span class="option">
                    <label for="CaseType">Scope / Project Type:</label>
                    <select id="CaseType" name="40_Type_of_Case">
                      <option value="">Select Project Scope:</option>
                      <option value="Full-Stack Web App">Full-Stack Web App (Next.js/React)</option>
                      <option value="Cloud &amp; Edge Architecture">Cloud &amp; Edge Architecture</option>
                      <option value="Database Optimization">Database Optimization &amp; Indexing</option>
                      <option value="Architecture &amp; Code Audit">Architecture &amp; Code Audit</option>
                      <option value="Fractional Tech Lead">Fractional Tech Lead Retainer</option>
                      <option value="AI / LLM Integration">AI / LLM Agent Integration</option>
                      <option value="Other Project">Other Technical Scope</option>
                    </select>
                  </span>
                  <span class="fld">
                    <label for="malpracticeinput">Budget Range</label>
                    <select id="malpracticeinput" name="50_Budget" style="width:100%;height:2.5em;margin-bottom:0.5em;padding:0 10px;border-radius:3px;">
                      <option value="$2,500 - $5,000">$2,500 – $5,000 (Small Scope / Audit)</option>
                      <option value="$5,000 - $15,000" selected="selected">$5,000 – $15,000 (MVP / Feature Sprint)</option>
                      <option value="$15,000 - $30,000">$15,000 – $30,000 (Full-Stack Platform)</option>
                      <option value="$30,000+">$30,000+ (Enterprise / Retainer)</option>
                    </select>
                  </span>
                  <span class="textarea">
                    <label for="Message">Project Details</label>
                    <textarea cols="20" id="Message" name="60_Message" placeholder="Brief overview of challenges, existing stack, timeline..." rows="5"></textarea>
                  </span>
                  <span class="disc">
                    <input class="checkb" id="scf_Disclaimer" name="70_Disclaimer" required="" type="checkbox" value="I consent to be contacted"/>
                    <label for="scf_Disclaimer">
                      <span>I consent to be contacted regarding this project. (Required)</span>
                    </label>
                    <p>Direct confidentiality: All shared requirements and architecture specifications remain strictly confidential.</p>
                  </span>
                  <div class="clr"></div>
                  <span class="submit">
                    <button name="submitbtn" type="submit">Submit Inquiry</button>
                  </span>
                </form>
              </div>

              <!-- Evaluation / Estimate CTA Button -->
              <div class="widget amp-include" id="wdgt-evaluation-button">
                <div class="description">
                  <center><a class="btn" href="#contactform">Click Here for <br/> Free Project Consultation</a></center>
                </div>
              </div>

              <!-- Competencies Widget -->
              <div class="widget" id="pr_ar">
                <strong class="heading4 widget-title"><a href="#work">Core Competencies</a></strong>
                <div class="fragcontent">
                  <ul class="toplevel">
                    <li class="li2 practiceareasub_11">
                      <strong><a href="#work">Systems &amp; Architecture</a></strong>
                      <ul>
                        <li class="li1"><a href="#work">Distributed Systems</a></li>
                        <li class="li2"><a href="#work">High-Throughput APIs</a></li>
                        <li class="li3"><a href="#work">PostgreSQL Optimization</a></li>
                        <li class="li4"><a href="#work">Cloudflare Edge Architecture</a></li>
                        <li class="li5"><a href="#work">Zero-Trust Authentication</a></li>
                        <li class="li6"><a href="#work">Microservices Decomposition</a></li>
                      </ul>
                    </li>
                    <li class="li3 practiceareasub_21">
                      <strong><a href="#work">Frontend &amp; Platform</a></strong>
                      <ul>
                        <li class="li1"><a href="#work">Next.js 16 App Router</a></li>
                        <li class="li2"><a href="#work">React 19 &amp; Server Components</a></li>
                        <li class="li3"><a href="#work">TypeScript Architecture</a></li>
                        <li class="li4"><a href="#work">AI &amp; LLM RAG Pipelines</a></li>
                        <li class="li5"><a href="#work">CI/CD &amp; Infrastructure as Code</a></li>
                        <li class="li6"><a href="#work">System Performance Audits</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Client Feedback Widget -->
              <div class="widget amp-include" id="wdgt-feedback">
                <strong class="heading4 widget-title"><a href="#feedback">Client Feedback</a></strong>
                <div class="description">
                  <p>
                    "Abu Hanif transformed our core API architecture in just three weeks. Our P99 latency dropped by 75% and our infrastructure bill was cut in half. Clear technical communication, pristine documentation, and zero fluff. If you need a top-tier software architect, I wholeheartedly recommend Abu Hanif!"<br/><br/>
                    <em>- D. Vance</em> <br/>VP of Engineering, Apex Telemetry Labs
                  </p>
                  <p>
                    "Working with Abu Hanif felt like having a Principal Architect and a full delivery team rolled into one. He took our complex distributed specifications and delivered our Next.js edge platform ahead of schedule with 99.99% uptime. You could not ask for a better engineering partner."<br/><br/>
                    <em>- E. Rostova</em> <br/>Founder &amp; CEO, Synthetix Cloud
                  </p>
                </div>
              </div>
            </div>
            <!-- End Sidebar -->
          </div>
          <div class="stpr"></div>
        </div>

        <!-- Bottom Stripe Section -->
        <div class="stripes">
          <div class="stripe stripe-01" id="stripe-01">
            <div class="stripewrap">
              <div class="widget contactform" id="bottom-scf">
                <form action="#" class="form_designer" id="genericcontactform_bottom-scf" method="post" name="genericcontactform_bottom-scf">
                  <strong class="heading4 widget-title">
                    <a href="#contactform">Contact Abu Hanif <span>Free Technical Consultation</span></a>
                  </strong>
                  <div class="cfyaw">
                    <span class="fld">
                      <label for="20_Name_Required">Name (Required)</label>
                      <input id="20_Name_Required" name="20_Name_Required" placeholder="Name (Required)" required="" type="text"/>
                    </span>
                    <span class="fld">
                      <label for="30_Email_Required">Work Email (Required)</label>
                      <input id="30_Email_Required" name="30_Email_Required" placeholder="Email (Required)" required="" type="email"/>
                    </span>
                    <span class="fld">
                      <label for="40_Phone_Required">Phone (Optional)</label>
                      <input id="40_Phone_Required" name="40_Phone_Required" placeholder="Phone (Optional)" type="text"/>
                    </span>
                    <span class="option">
                      <label for="bcf_CaseType">Project Scope:</label>
                      <select id="bcf_CaseType" name="40_Type_of_Case">
                        <option value="Full-Stack Web App">Full-Stack Web App (Next.js/React)</option>
                        <option value="Cloud Architecture">Cloud &amp; Edge Architecture</option>
                        <option value="Database Optimization">Database Optimization &amp; Indexing</option>
                        <option value="Architecture Audit">Architecture &amp; Codebase Audit</option>
                        <option value="Fractional Tech Lead">Fractional Tech Lead Retainer</option>
                      </select>
                    </span>
                    <span class="fld">
                      <label for="70_Message">Project Scope Description</label>
                      <textarea cols="20" id="70_Message" name="70_Message" placeholder="Brief description of the challenge or project requirements..." rows="5"></textarea>
                    </span>
                    <span class="disc">
                      <input class="checkb" id="bcf_Disclaimer" name="60_Disclaimer" required="" type="checkbox" value="I consent"/>
                      <label for="bcf_Disclaimer">
                        <span>I consent to be contacted regarding this technical project. (Required)</span>
                      </label>
                    </span>
                  </div>
                  <span class="submit">
                    <button name="submitbtn" type="submit">Submit Consultation Request</button>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div id="footer">
          <div class="fcontainer">
            <div id="address">
              <div class="slocation location_86">
                <div><strong>MD Abu Hanif Mia (Abu Hanif)</strong></div>
                <div>Staff Software Engineer &amp; Systems Architect</div>
                <div itemprop="streetAddress">Dhaka, Bangladesh / Remote Worldwide</div>
                <span class="contacts">
                  <span>Email: <a href="mailto:contact@abuhanif.dev">contact@abuhanif.dev</a></span>
                  <span>Phone: +880 1700-000000</span>
                </span>
              </div>
            </div>
            <div class="footerlocalities">
              <div class="block">
                <span>Available for technical consulting and high-impact software engineering contracts worldwide. Active timezones: US Pacific (UTC-8) to Central European (UTC+2) to Asia/Dhaka (UTC+6).</span>
              </div>
            </div>
            <div id="footernav">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="#work">Work Showcase</a></li>
                <li><a href="#pricing">Services &amp; Pricing</a></li>
                <li><a href="/blog">Technical Blog</a></li>
                <li><a href="/admin" style="font-weight:bold;color:#053056;">Admin Panel</a></li>
                <li><a href="#contactform">Contact</a></li>
              </ul>
            </div>
            <div class="copyright">
              <div id="footer-title">
                <p>Staff Software Engineer | Systems Architecture &amp; Cloud Performance | MD Abu Hanif Mia</p>
              </div>
              <p>Copyright © 2026 MD Abu Hanif Mia. All rights reserved. Deployed to Cloudflare Pages.</p>
            </div>
            <div class="credits">
              <a href="/admin"><span>Admin</span> System Portal</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    path: "/",
    url: "https://www.robertjfleming.com/",
    status: 200,
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description: "MD Abu Hanif Mia - Staff Software Engineer & Systems Architect. View portfolio work showcase, transparent engineering pricing, and technical blog.",
    h1: ["MD Abu Hanif Mia (Abu Hanif)"],
    body_id: "index",
    body_class: "justia-robertjfleming-com",
    html: html.trim(),
  };
}

import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('.audit-screens', 'mobile');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { url: 'http://localhost:3000/', out: '01-home-mobile.png', name: 'Home' },
  { url: 'http://localhost:3000/projects', out: '02-projects-mobile.png', name: 'Projects' },
  { url: 'http://localhost:3000/projects/financial-telemetry-pipeline', out: '03-project-detail-mobile.png', name: 'Project Detail' },
  { url: 'http://localhost:3000/pricing', out: '04-pricing-mobile.png', name: 'Pricing' },
  { url: 'http://localhost:3000/lab', out: '05-lab-mobile.png', name: 'Lab' },
  { url: 'http://localhost:3000/blog', out: '06-blog-mobile.png', name: 'Blog' },
  { url: 'http://localhost:3000/blog/nextjs-16-cloudflare-pages-architecture', out: '07-blog-detail-mobile.png', name: 'Blog Detail' },
  { url: 'http://localhost:3000/resume', out: '08-resume-mobile.png', name: 'Resume' },
  { url: 'http://localhost:3000/status', out: '09-status-mobile.png', name: 'Status Dashboard' },
  { url: 'http://localhost:3000/services', out: '10-services-mobile.png', name: 'Services Hub' },
  { url: 'http://localhost:3000/services/architecture-audit', out: '11-service-detail-mobile.png', name: 'Service Detail' },
  { url: 'http://localhost:3000/orders', out: '12-orders-mobile.png', name: 'Orders Hub' },
  { url: 'http://localhost:3000/orders/tracker?orderId=ORD-7821-DEMO', out: '13-orders-tracker-mobile.png', name: 'Orders Tracker' },
  { url: 'http://localhost:3000/orders/invoice?orderId=ORD-7821-DEMO', out: '14-orders-invoice-mobile.png', name: 'Invoice' },
  { url: 'http://localhost:3000/admin/login', out: '15-admin-login-mobile.png', name: 'Admin Login' },
  { url: 'http://localhost:3000/not-found-page', out: '16-404-mobile.png', name: '404 Page' },
];

console.log(`Starting mobile screenshot audit (${pages.length} pages) in 390x844 (iPhone 14/15/16 viewport)...`);

for (const p of pages) {
  const target = path.join(outDir, p.out);
  console.log(`Capturing ${p.name}: ${p.url} -> ${p.out}`);
  try {
    execFileSync(chromePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=390,844',
      '--hide-scrollbars',
      '--virtual-time-budget=5000',
      `--screenshot=${target}`,
      p.url,
    ], { stdio: 'ignore', timeout: 35000 });
    const size = fs.statSync(target).size;
    console.log(`  ✓ Saved ${p.out} (${(size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ Error auditing ${p.url}:`, err.message);
  }
}

console.log('Mobile screenshots capture finished!');

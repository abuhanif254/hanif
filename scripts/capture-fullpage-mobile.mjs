import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('.audit-screens', 'mobile-full');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { path: '/', name: '01-home-full.png' },
  { path: '/projects', name: '02-projects-full.png' },
  { path: '/projects/financial-telemetry-pipeline', name: '03-project-detail-full.png' },
  { path: '/pricing', name: '04-pricing-full.png' },
  { path: '/lab', name: '05-lab-full.png' },
  { path: '/blog', name: '06-blog-full.png' },
  { path: '/blog/nextjs-16-cloudflare-pages-architecture', name: '07-blog-detail-full.png' },
  { path: '/resume', name: '08-resume-full.png' },
  { path: '/status', name: '09-status-full.png' },
  { path: '/services', name: '10-services-full.png' },
  { path: '/services/architecture-audit', name: '11-service-detail-full.png' },
  { path: '/orders', name: '12-orders-full.png' },
  { path: '/admin/login', name: '13-admin-login-full.png' },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching headless Chrome for full-page mobile audit...');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--window-size=390,844',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'about:blank',
  ]);

  await sleep(2500);

  const listRes = await fetch('http://127.0.0.1:9223/json/list');
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

  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    hasTouch: true,
  });

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  for (const r of routes) {
    const targetUrl = `http://localhost:3000${r.path}`;
    console.log(`Navigating to ${targetUrl}...`);
    await sendCommand('Page.navigate', { url: targetUrl });
    await sleep(2500);

    // Dismiss privacy banner via localStorage and hide dev overlay
    await sendCommand('Runtime.evaluate', {
      expression: `
        window.localStorage.setItem("hanif-privacy-dismissed", "true");
        const notice = document.querySelector(".privacy-telemetry-notice");
        if (notice) notice.remove();
        // Hide next dev overlay icon if present
        const nextBadge = document.querySelector('nextjs-portal');
        if (nextBadge) nextBadge.remove();
      `,
    });
    await sleep(500);

    // Capture full-page screenshot
    const shot = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });

    const buf = Buffer.from(shot.data, 'base64');
    const targetFile = path.join(outDir, r.name);
    fs.writeFileSync(targetFile, buf);
    console.log(`  ✓ Saved ${r.name} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  // Also capture mobile menu opened state!
  console.log('Capturing mobile menu drawer opened state...');
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(2000);
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
    `,
  });
  await sleep(1000);
  const menuShot = await sendCommand('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(outDir, '00-mobile-menu-drawer.png'), Buffer.from(menuShot.data, 'base64'));
  console.log('  ✓ Saved 00-mobile-menu-drawer.png');

  // Also capture command palette opened state!
  console.log('Capturing mobile command palette opened state...');
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    `,
  });
  await sleep(1000);
  const paletteShot = await sendCommand('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(outDir, '00-command-palette-mobile.png'), Buffer.from(paletteShot.data, 'base64'));
  console.log('  ✓ Saved 00-command-palette-mobile.png');

  ws.close();
  chromeProcess.kill();
  console.log('All full-page screenshots done!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

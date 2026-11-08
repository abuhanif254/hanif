import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('.audit-screens', 'mobile-sections');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--window-size=390,844',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'about:blank',
  ]);

  await sleep(2500);

  const listRes = await fetch('http://127.0.0.1:9224/json/list');
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

  await sendCommand('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(3000);

  await sendCommand('Runtime.evaluate', {
    expression: `
      window.localStorage.setItem("hanif-privacy-dismissed", "true");
      const notice = document.querySelector(".privacy-telemetry-notice");
      if (notice) notice.remove();
      const nextBadge = document.querySelector('nextjs-portal');
      if (nextBadge) nextBadge.remove();
    `,
  });

  const sections = [
    { name: '01-home-hero.png', scrollY: 0 },
    { name: '02-home-badges-bio.png', scrollY: 650 },
    { name: '03-home-work-showcase.png', scrollY: 1500 },
    { name: '04-home-testimonials.png', scrollY: 2600 },
    { name: '05-home-blog-feed.png', scrollY: 3400 },
    { name: '06-home-sidebar-timeline.png', scrollY: 4300 },
    { name: '07-home-footer.png', scrollY: 5300 },
  ];

  for (const s of sections) {
    await sendCommand('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${s.scrollY}, behavior: 'instant' });`,
    });
    await sleep(600);
    const shot = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    fs.writeFileSync(path.join(outDir, s.name), Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${s.name}`);
  }

  // Now also capture Pricing page SOW modal!
  console.log('Capturing Pricing SOW modal on mobile...');
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/pricing' });
  await sleep(2500);
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.localStorage.setItem("hanif-privacy-dismissed", "true");
      const notice = document.querySelector(".privacy-telemetry-notice");
      if (notice) notice.remove();
      // Click SOW Generator button if found
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.includes('SOW Builder') || el.innerText.includes('Generate Custom SOW') || el.innerText.includes('Customize'));
      if (btn) btn.click();
    `,
  });
  await sleep(1000);
  const sowShot = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '08-pricing-sow-modal.png'), Buffer.from(sowShot.data, 'base64'));
  console.log('Saved 08-pricing-sow-modal.png');

  // Now also capture Lab Postgres Planner on mobile!
  console.log('Capturing Lab Postgres Planner on mobile...');
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/lab' });
  await sleep(2500);
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.localStorage.setItem("hanif-privacy-dismissed", "true");
      const notice = document.querySelector(".privacy-telemetry-notice");
      if (notice) notice.remove();
      window.scrollTo({ top: 750, behavior: 'instant' });
    `,
  });
  await sleep(800);
  const labShot = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '09-lab-postgres-planner.png'), Buffer.from(labShot.data, 'base64'));
  console.log('Saved 09-lab-postgres-planner.png');

  // Now capture Project Detail Architecture Viewer on mobile!
  console.log('Capturing Project Detail Architecture Viewer on mobile...');
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/projects/financial-telemetry-pipeline' });
  await sleep(2500);
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.localStorage.setItem("hanif-privacy-dismissed", "true");
      const notice = document.querySelector(".privacy-telemetry-notice");
      if (notice) notice.remove();
      window.scrollTo({ top: 900, behavior: 'instant' });
    `,
  });
  await sleep(800);
  const projArchShot = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '10-project-architecture-viewer.png'), Buffer.from(projArchShot.data, 'base64'));
  console.log('Saved 10-project-architecture-viewer.png');

  ws.close();
  chromeProcess.kill();
  console.log('All mobile section screenshots captured!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('.audit-screens', 'mobile-admin');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--window-size=390,844',
    '--disable-gpu',
    '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'about:blank',
  ]);

  await sleep(2500);

  const listRes = await fetch('http://127.0.0.1:9225/json/list');
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

  // Go to login page
  console.log('Navigating to /admin/login...');
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/admin/login' });
  await sleep(2000);

  // Enter passcode and submit
  console.log('Entering passcode hanif2026 and submitting...');
  await sendCommand('Runtime.evaluate', {
    expression: `
      const input = document.querySelector('input[type="password"]');
      if (input) {
        input.value = 'hanif2026';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    `,
  });

  await sleep(2500);

  // Now capture /admin view
  console.log('Capturing admin dashboard on mobile...');
  const shot1 = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '01-admin-dashboard-top.png'), Buffer.from(shot1.data, 'base64'));

  // Scroll down in admin
  await sendCommand('Runtime.evaluate', { expression: `window.scrollTo({ top: 600, behavior: 'instant' });` });
  await sleep(800);
  const shot2 = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '02-admin-dashboard-mid.png'), Buffer.from(shot2.data, 'base64'));

  // Switch to Inquiries / Leads tab
  await sendCommand('Runtime.evaluate', {
    expression: `
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText && (b.innerText.includes('Inquiries') || b.innerText.includes('Leads') || b.innerText.includes('Orders')));
      if (tab) tab.click();
    `,
  });
  await sleep(800);
  const shot3 = await sendCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, '03-admin-inquiries-tab.png'), Buffer.from(shot3.data, 'base64'));

  ws.close();
  chromeProcess.kill();
  console.log('Admin mobile audit screenshots saved!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

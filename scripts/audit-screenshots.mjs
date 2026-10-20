import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('.audit-screens');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { url: 'http://localhost:3000/', out: '01-home.png' },
  { url: 'http://localhost:3000/projects', out: '02-projects.png' },
  { url: 'http://localhost:3000/projects/financial-telemetry-pipeline', out: '03-project-detail.png' },
  { url: 'http://localhost:3000/pricing', out: '04-pricing.png' },
  { url: 'http://localhost:3000/lab', out: '05-lab.png' },
  { url: 'http://localhost:3000/blog', out: '06-blog.png' },
  { url: 'http://localhost:3000/resume', out: '07-resume.png' },
  { url: 'http://localhost:3000/status', out: '08-status.png' },
  { url: 'http://localhost:3000/services/architecture-audit', out: '09-service-detail.png' },
];

for (const p of pages) {
  const target = path.join(outDir, p.out);
  console.log(`Auditing ${p.url} -> ${p.out}`);
  try {
    execFileSync(chromePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1440,1080',
      '--virtual-time-budget=4000',
      `--screenshot=${target}`,
      p.url,
    ], { stdio: 'ignore', timeout: 30000 });
    console.log(`  ✓ Saved ${p.out} (${fs.statSync(target).size} bytes)`);
  } catch (err) {
    console.error(`  ✗ Error auditing ${p.url}:`, err.message);
  }
}

console.log('Auditing screenshot run finished.');

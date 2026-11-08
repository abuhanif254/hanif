import fs from 'fs';

const data = JSON.parse(fs.readFileSync('.audit-screens/mobile-deep-audit.json', 'utf8'));

for (const page of data) {
  console.log(`\n=== ${page.name} (${page.route}) ===`);
  console.log(`  Horizontal Overflow: ${page.metrics.hasHorizontalOverflow} (diff: ${page.metrics.overflowPixels}px)`);
  console.log(`  Small touch targets (<44px): ${page.metrics.touchTargetsCount}`);
  if (page.metrics.sampleSmallTouchTargets?.length > 0) {
    console.log(`    Sample targets:`, page.metrics.sampleSmallTouchTargets.slice(0, 6).map(t => `${t.tag}[${t.width}x${t.height}]: "${t.text}"`));
  }
  console.log(`  Small fonts (<12px): ${page.metrics.smallFontsCount}`);
  if (page.metrics.sampleSmallFonts?.length > 0) {
    console.log(`    Sample fonts:`, page.metrics.sampleSmallFonts.slice(0, 6).map(f => `${f.tag}(${f.fontSize}px): "${f.text}"`));
  }
  console.log(`  Fixed elements:`, page.metrics.fixedElements?.map(f => `${f.tag}${f.id ? '#' + f.id : ''}${f.className ? '.' + f.className : ''} [pos=${f.position}, h=${f.height}px, z=${f.zIndex}]`));
}

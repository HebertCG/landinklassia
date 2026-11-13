import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

// This is an offline design export. The generated JPEG is committed, so builds
// and social crawlers do not need a browser or JavaScript to render the preview.
const output = new URL('../public/brand/klassia-social-hero-v1.jpg', import.meta.url);
const browser = await chromium.launch({
  channel: process.env.UI_AUDIT_BROWSER || 'msedge',
  headless: true
});

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL('./social-preview.html', import.meta.url).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
    if (!document.fonts.check('750 68px Manrope')) throw new Error('Manrope did not load');
  });
  await page.screenshot({ path: fileURLToPath(output), type: 'jpeg', quality: 92 });
  console.log(`Social preview exported: ${fileURLToPath(output)} (1200 × 630)`);
} finally {
  await browser.close();
}

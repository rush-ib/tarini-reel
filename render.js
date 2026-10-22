// Renders HTML slides to PNG with Playwright (headless Chromium).
// Input: jobs/<JOB_ID>/slides.json = JSON array of full HTML pages (committed by n8n or by hand); env MODE = reel | carousel, JOB_ID
// Output: s1.png, s2.png, ... in the current folder
const fs = require('fs');
const { chromium } = require('playwright');

const size = { reel: { width: 1080, height: 1920 }, carousel: { width: 1080, height: 1350 } }[process.env.MODE];
if (!size) throw new Error('MODE must be reel or carousel');
const slides = JSON.parse(fs.readFileSync(`jobs/${process.env.JOB_ID}/slides.json`, 'utf8'));
if (!Array.isArray(slides) || !slides.length) throw new Error('slides.json must be a non-empty JSON array of HTML strings');

(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage({ viewport: size });
  for (let i = 0; i < slides.length; i++) {
    await page.setContent(slides[i], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); // Google Fonts fully loaded
    await page.screenshot({ path: `s${i + 1}.png` });
    console.log(`rendered s${i + 1}.png`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

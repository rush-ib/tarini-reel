// Renders the animated Reel to MP4: opens the page, pauses every animation, steps 1/FPS s at a time,
// and pipes each frame straight into FFmpeg.
// Usage: node render-motion.js reel.json out.mp4 [music.mp3]
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const buildReel = require('./reel-template');

const [dataPath, outPath = 'reel.mp4', music] = process.argv.slice(2);
const FPS = Number(process.env.FPS || 30), SECONDS = 24;
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'logo.png')).toString('base64');

(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(buildReel(data, logo), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));

  const audio = music
    ? ['-i', music, '-filter:a', `atrim=0:${SECONDS},afade=t=in:d=1,afade=t=out:st=${SECONDS - 1.5}:d=1.5`]
    : ['-f', 'lavfi', '-i', `aevalsrc=0.10*sin(2*PI*130.81*t)*(0.8+0.2*sin(2*PI*0.25*t))+0.06*sin(2*PI*196*t):s=44100:d=${SECONDS}`,
       '-filter:a', `afade=t=in:d=1,afade=t=out:st=${SECONDS - 1.5}:d=1.5`];
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', ...audio,
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-movflags', '+faststart', '-t', String(SECONDS), outPath],
    { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = FPS * SECONDS;
  for (let f = 0; f < total; f++) {
    await page.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), (f * 1000) / FPS);
    const frame = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(frame)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (FPS * 4) === 0) console.log(`frame ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
  await browser.close();
  console.log(`wrote ${outPath}`);
})().catch(e => { console.error(e); process.exit(1); });

// Builds the animated Reel page (1080x1920) from reel.json data.
// Every animation is plain CSS with a fixed start time, so render-motion.js can step through it frame by frame.
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = function buildReel(d, logoDataUri) {
  const words = d.hook.split(' ').map((w, i) =>
    `<span class="w" style="animation-delay:${(0.2 + i * 0.22).toFixed(2)}s">${esc(w)}</span>`).join(' ');
  const cards = d.days.map((day, i) => `
    <div class="card" style="animation-delay:${(3.3 + i * 0.12).toFixed(2)}s">
      <div class="flip ${day.good ? 'good' : 'calm'}" style="animation-delay:${(4.7 + i * 0.28).toFixed(2)}s">
        <b>${esc(day.dow)}</b><span>${esc(day.date)}</span><i>${day.good ? '✅' : '·'}</i>
      </div>
    </div>`).join('');
  const typed = esc(d.reason);
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Noto+Sans+Devanagari:wght@500;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;font-family:'Inter','Noto Sans Devanagari',sans-serif;color:#F3EEFF;background:#0B0D2E}
.bg{position:absolute;inset:-200px;background:radial-gradient(circle at 30% 20%,#4A2A9A 0%,#1A1450 40%,#0B0D2E 75%);animation:drift 24s linear both}
@keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(80px,120px) scale(1.12)}}
.dot{position:absolute;width:10px;height:10px;border-radius:50%;background:#F5A62399;filter:blur(1px);animation:float 24s linear both}
@keyframes float{from{transform:translateY(0)}to{transform:translateY(-900px)}}
.demo{position:absolute;top:70px;left:0;right:0;text-align:center;font-size:26px;letter-spacing:4px;color:#ffffff66}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 90px;opacity:0;animation:scene var(--len) linear both;animation-delay:var(--at)}
@keyframes scene{0%{opacity:0}5%{opacity:1}92%{opacity:1}100%{opacity:0}}
.last{animation-name:sceneLast}
@keyframes sceneLast{0%{opacity:0}15%{opacity:1}100%{opacity:1}}
/* 1 hook */
.hook{font-size:104px;font-weight:800;line-height:1.15;text-align:center}
.w{display:inline-block;opacity:0;transform:translateY(40px) scale(.8);animation:pop .35s cubic-bezier(.2,1.4,.4,1) both}
@keyframes pop{to{opacity:1;transform:none}}
.car{font-size:150px;margin-top:80px;opacity:0;animation:slideIn .7s ease-out 1.9s both}
@keyframes slideIn{from{opacity:0;transform:translateX(-500px)}to{opacity:1;transform:none}}
/* 2 week strip */
.h2{font-size:64px;font-weight:700;text-align:center;margin-bottom:80px;opacity:0;animation:pop .5s ease-out 3.15s both}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:16px;width:960px}
.card{perspective:800px;opacity:0;transform:translateY(80px);animation:pop .45s ease-out both}
.flip{height:250px;border-radius:24px;background:#ffffff14;border:2px solid #ffffff30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;animation:.5s ease-in-out both}
.flip b{font-size:34px}.flip span{font-size:28px;color:#D9D0F5}.flip i{font-style:normal;font-size:44px;opacity:0;animation:fadeIn .2s linear both;animation-delay:inherit}
.good{animation-name:flipGood}.calm{animation-name:flipCalm}
@keyframes flipGood{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}51%{background:#F5A62333;border-color:#F5A623}100%{transform:rotateY(0);background:#F5A62333;border-color:#F5A623}}
@keyframes flipCalm{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}51%{opacity:.45}100%{transform:rotateY(0);opacity:.45}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.legend{margin-top:60px;font-size:36px;color:#D9D0F5;opacity:0;animation:fadeIn .5s linear 6.8s both}
/* 3 best day */
.best{width:640px;padding:60px 40px;border-radius:40px;background:#F5A62326;border:4px solid #F5A623;text-align:center;opacity:0;transform:scale(.4);animation:grow .7s cubic-bezier(.2,1.3,.4,1) 8.3s both,glow 2s ease-in-out 9s 3 alternate}
@keyframes grow{to{opacity:1;transform:none}}
@keyframes glow{from{box-shadow:0 0 0 #F5A62300}to{box-shadow:0 0 90px #F5A623aa}}
.best .k{font-size:36px;letter-spacing:6px;color:#F5A623;font-weight:700}
.best .d{font-size:110px;font-weight:800;margin:20px 0 6px}.best .m{font-size:52px;color:#fff}
.reason{margin-top:70px;font-size:46px;line-height:1.4;text-align:center;color:#D9D0F5;max-width:880px;clip-path:inset(0 100% 0 0);animation:type 2.2s steps(40) 9.6s both}
@keyframes type{to{clip-path:inset(0 0 0 0)}}
/* 4 clock arc */
.ring{position:relative;width:620px;height:620px}
.ring svg{transform:rotate(-90deg)}
.arc{stroke-dasharray:1700;stroke-dashoffset:1700;animation:arc 2.4s ease-out 14.6s both}
@keyframes arc{to{stroke-dashoffset:var(--off)}}
.ring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring .lab{font-size:38px;letter-spacing:5px;color:#F5A623;font-weight:700}
.ring .t{font-size:84px;font-weight:800;margin-top:14px;opacity:0;animation:pop .5s ease-out both}
.ring .to{font-size:40px;color:#D9D0F5;opacity:0;animation:fadeIn .4s linear 16.3s both}
/* 5 send */
.send{font-size:80px;font-weight:800;text-align:center;line-height:1.25;opacity:0;animation:pop .5s ease-out 19.3s both}
.share{font-size:160px;margin-top:70px;animation:bounce .6s ease-in-out 20s 3 alternate both}
@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-60px)}}
/* 6 logo */
.logo{width:340px;height:340px;opacity:0;transform:scale(.6);animation:grow 1s ease-out 22.2s both;filter:drop-shadow(0 0 40px #F5A62388)}
.brand{font-size:60px;letter-spacing:14px;font-weight:700;color:#F5A623;margin-top:50px;opacity:0;animation:fadeIn .6s linear 22.7s both}
.cta{margin-top:40px;font-size:44px;color:#D9D0F5;opacity:0;animation:fadeIn .6s linear 23s both}
</style></head><body>
<div class="bg"></div>
${[[120,1900,0],[300,2100,0],[520,1950,0],[760,2200,0],[940,2000,0],[200,2500,0],[640,2600,0],[880,2700,0]].map(([x,y])=>`<div class="dot" style="left:${x}px;top:${y}px"></div>`).join('')}
${d.demo ? '<div class="demo">DEMO DATA · NOT A REAL MUHURAT</div>' : ''}
<div class="scene" style="--at:0s;--len:3.1s"><div class="hook">${words}</div><div class="car">${esc(d.icon)}</div></div>
<div class="scene" style="--at:3s;--len:5.1s"><div class="h2">${esc(d.week_title)}</div><div class="week">${cards}</div><div class="legend">✅ = ${esc(d.activity)} ke liye shubh</div></div>
<div class="scene" style="--at:8s;--len:6.1s"><div class="best"><div class="k">SABSE ACCHA DIN</div><div class="d">${esc(d.best.dow)}</div><div class="m">${esc(d.best.date)}</div></div><div class="reason">${typed}</div></div>
<div class="scene" style="--at:14s;--len:5.1s"><div class="ring"><svg width="620" height="620" viewBox="0 0 620 620"><circle cx="310" cy="310" r="270" fill="none" stroke="#ffffff1f" stroke-width="34"/><circle class="arc" cx="310" cy="310" r="270" fill="none" stroke="#F5A623" stroke-width="34" stroke-linecap="round" style="--off:${(1700 * (1 - d.window_share)).toFixed(0)}"/></svg><div class="in"><div class="lab">SHUBH SAMAY</div><div class="t" style="animation-delay:15.4s">${esc(d.start)}</div><div class="to">se</div><div class="t" style="animation-delay:16.6s">${esc(d.end)}</div></div></div></div>
<div class="scene" style="--at:19s;--len:3.1s"><div class="send">${esc(d.send_line)}</div><div class="share">📲</div></div>
<div class="scene last" style="--at:22s;--len:2s"><img class="logo" src="${logoDataUri}"><div class="brand">TARINI</div><div class="cta">Poora calendar: link bio mein</div></div>
</body></html>`;
};

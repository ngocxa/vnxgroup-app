// Quay video hướng dẫn Chấm công Trạm Y tế bằng CDP screencast
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

const LOGO = fs.readFileSync('/tmp/claude-0/-home-user-vnxgroup-app/6dbe2a83-a78d-56fc-ae11-188f3ade89d5/scratchpad/vnxlogo.txt', 'utf8');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const only = process.argv[2];   // quay riêng 1 cảnh (debug)

const OVERLAY = () => {
  const css = `@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800&display=swap');
  #vtCur{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;transform:translate(-3px,-2px);transition:none}
  #vtRip{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:3px solid #f2a516;background:rgba(242,165,22,.25);z-index:2147483646;pointer-events:none;opacity:0}
  #vtRip.go{animation:vtr .55s ease-out}
  @keyframes vtr{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
  #vtCap{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);max-width:1180px;z-index:2147483645;pointer-events:none;
    font:600 25px/1.45 'Be Vietnam Pro',system-ui,sans-serif;color:#fff;background:rgba(14,24,54,.92);border:1px solid rgba(255,255,255,.18);
    border-radius:16px;padding:14px 26px 14px 20px;box-shadow:0 14px 40px rgba(0,0,0,.35);display:flex;gap:16px;align-items:center;opacity:0;transition:opacity .35s}
  #vtCap.on{opacity:1}
  #vtCap b{flex:none;font:800 15px/1 'Be Vietnam Pro',sans-serif;letter-spacing:1px;color:#1b1300;background:#f2a516;border-radius:999px;padding:8px 12px;white-space:nowrap}
  #vtTag{position:fixed;right:22px;top:auto;bottom:118px;z-index:2147483645;pointer-events:none;display:flex;align-items:center;gap:8px;
    font:700 14px 'Be Vietnam Pro',sans-serif;color:#fff;background:rgba(14,24,54,.75);padding:7px 12px 7px 8px;border-radius:999px}
  #vtTag img{width:26px;height:26px;border-radius:50%;background:#fff}
  .vtHi{outline:4px solid #f2a516 !important;outline-offset:3px;border-radius:10px;transition:outline-color .3s}
  @media print{#vtCur,#vtRip,#vtCap,#vtTag,#vtPrint{display:none!important}}
  #vtPrint{position:fixed;inset:0;z-index:2147483600;background:#525659;display:flex;flex-direction:column;align-items:center;padding-top:22px;opacity:0;transition:opacity .45s}
  #vtPrint.on{opacity:1}
  #vtPrint .bar{font:700 17px 'Be Vietnam Pro',sans-serif;color:#fff;margin-bottom:16px;letter-spacing:.5px}
  #vtPrint img{width:1260px;background:#fff;box-shadow:0 14px 40px rgba(0,0,0,.45);transform:translateY(16px);transition:transform .6s}
  #vtPrint.on img{transform:none}`;
  const mk = () => {
    if (document.getElementById('vtCur')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const c = document.createElement('div'); c.id = 'vtCur';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke="#14234b" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    c.style.left = '-50px'; document.body.appendChild(c);
    const r = document.createElement('div'); r.id = 'vtRip'; document.body.appendChild(r);
    const cap = document.createElement('div'); cap.id = 'vtCap'; document.body.appendChild(cap);
    document.addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px' }, true);
    window.__rip = (x, y) => { r.style.left = x + 'px'; r.style.top = y + 'px'; r.classList.remove('go'); void r.offsetWidth; r.classList.add('go') };
    window.__cap = (t, step) => { if (!t) { cap.classList.remove('on'); return } cap.innerHTML = (step ? '<b>' + step + '</b>' : '') + '<span>' + t + '</span>'; cap.classList.add('on') };
    window.__tag = src => { let t = document.getElementById('vtTag'); if (!t) { t = document.createElement('div'); t.id = 'vtTag'; document.body.appendChild(t) } t.innerHTML = '<img src="' + src + '">VNXGroup Software' };
  };
  if (document.body) mk(); else document.addEventListener('DOMContentLoaded', mk);
};

const CAPS = [];       // {scene, t0, t1, text}
let SCENE = '', capOpen = null;

async function recordScene(page, name, fn) {
  if (only && only !== name) return;
  SCENE = name;
  const dir = path.join(DIR, 'frames', name); fs.rmSync(dir, {recursive: true, force: true}); fs.mkdirSync(dir, {recursive: true});
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async f => {
    frames.push({t: f.metadata.timestamp, d: f.data});
    try { await cdp.send('Page.screencastFrameAck', {sessionId: f.sessionId}) } catch (e) {}
  });
  const vp = page.viewportSize(), dsf = page.__dsf || 1;
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 92, maxWidth: Math.round(vp.width * dsf), maxHeight: Math.round(vp.height * dsf), everyNthFrame: 1});
  // ép 1 khung hình đầu
  await page.evaluate(() => { document.body.style.outline = '0px solid transparent' });
  const tStart = Date.now() / 1000;
  await fn();
  await cap(page, '');
  await sleep(400);
  const tEnd = Date.now() / 1000;
  await cdp.send('Page.stopScreencast'); await sleep(200);
  const list = [];
  frames.sort((a, b) => a.t - b.t);
  frames.forEach((f, i) => {
    const fn_ = path.join(dir, String(i).padStart(5, '0') + '.jpg');
    fs.writeFileSync(fn_, Buffer.from(f.d, 'base64'));
    const next = i + 1 < frames.length ? frames[i + 1].t : tEnd;
    list.push(`file '${fn_}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}`);
  });
  if (frames.length) list.push(`file '${path.join(dir, String(frames.length - 1).padStart(5, '0') + '.jpg')}'`);
  fs.writeFileSync(path.join(dir, 'list.txt'), list.join('\n') + '\n');
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({t0: frames.length ? frames[0].t : tStart, tEnd, n: frames.length}));
  console.log('scene', name, frames.length, 'frames', (tEnd - tStart).toFixed(1) + 's');
}

async function cap(page, text, step, minMs) {
  const now = Date.now() / 1000;
  if (capOpen) { capOpen.t1 = now; CAPS.push(capOpen); capOpen = null }
  await page.evaluate(([t, s]) => window.__cap && window.__cap(t, s), [text, step || '']);
  if (text) {
    capOpen = {scene: SCENE, t0: now, text, step: step || ''};
    await sleep(minMs != null ? minMs : Math.max(2600, text.length * 62));
  }
}

async function moveTo(page, x, y, steps = 28) {
  await page.mouse.move(x, y, {steps});
  await sleep(120);
}
async function box(page, sel) {
  const l = typeof sel === 'string' ? page.locator(sel).first() : sel;
  await l.scrollIntoViewIfNeeded({timeout: 4000}); await sleep(250);
  const b = await l.boundingBox(); return {l, x: b.x + b.width / 2, y: b.y + b.height / 2, b};
}
async function click(page, sel, opt = {}) {
  const {x, y} = await box(page, sel);
  await moveTo(page, x, y, opt.steps || 26);
  await page.evaluate(([x, y]) => window.__rip(x, y), [x, y]);
  await page.mouse.click(x, y); await sleep(opt.after || 650);
}
async function hover(page, sel, ms = 900) { const {x, y} = await box(page, sel); await moveTo(page, x, y); await sleep(ms) }
async function hi(page, sel, on = true) { await page.evaluate(([s, on]) => { const e = document.querySelector(s); if (e) e.classList.toggle('vtHi', on) }, [sel, on]) }
async function typeSlow(page, sel, text, delay = 70) { await click(page, sel, {after: 250}); await page.keyboard.type(text, {delay}) }
async function smoothScroll(page, y, ms = 1200) {
  await page.evaluate(([y, ms]) => new Promise(res => {
    const el = document.scrollingElement, s = el.scrollTop, d = y - s, t0 = performance.now();
    const st = now => { const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; el.scrollTop = s + d * e; k < 1 ? requestAnimationFrame(st) : res() };
    requestAnimationFrame(st) }), [y, ms]);
  await sleep(200);
}
async function printPreview(page, mau, title) {
  await page.selectOption('#selMau', mau); await sleep(300);
  await click(page, '#btnPrint', {after: 400});
  await page.emulateMedia({media: 'print'}); await sleep(400);
  const buf = await page.screenshot({clip: {x: 0, y: 0, width: 1150, height: 650}});
  await page.emulateMedia({media: 'screen'}); await sleep(200);
  await page.evaluate(([src, t]) => { const d = document.createElement('div'); d.id = 'vtPrint';
    d.innerHTML = '<div class="bar">🖨 ' + t + '</div><img src="' + src + '">'; document.body.appendChild(d);
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on'))) }, ['data:image/png;base64,' + buf.toString('base64'), title]);
  await sleep(700);
}
async function closePreview(page) { await page.evaluate(() => { const d = document.getElementById('vtPrint'); if (d) { d.classList.remove('on'); setTimeout(() => d.remove(), 500) } }); await sleep(700) }
async function tab(page, t) { await click(page, `button[data-t=${t}]`, {after: 900}); await smoothScroll(page, 0, 300) }
const cell = (page, row, day) => page.locator('#gridWrap tbody tr').nth(row).locator(`td[data-d="${day}"]`);

async function bootApp(page) {
  await page.evaluate(([seed, logo]) => {
    document.getElementById('olLogin').remove();
    let t = document.getElementById('appMain').textContent;
    t = t.replace(/^const SEED = .*;$/m, 'const SEED = ' + JSON.stringify(seed) + ';');
    const s = document.createElement('script'); s.textContent = t; document.body.appendChild(s);
    S.cfg.logo = logo; save(); applyLogo(); window.print = () => {};
  }, [SEED, LOGO]);
  await page.addStyleTag({content: '#licBar{display:none!important}'});
  await page.evaluate(l => window.__tag(l), LOGO);
  await sleep(600);
}


module.exports={recordScene,cap,moveTo,box,click,hover,hi,typeSlow,smoothScroll,sleep,OVERLAY,LOGO,CAPS:()=>CAPS,flush:()=>{if(capOpen){capOpen.t1=Date.now()/1000;CAPS.push(capOpen);capOpen=null}}};

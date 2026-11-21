// Quay video hướng dẫn Bảng lương viên chức – chú thích canh theo độ dài lời đọc (voice/dur.json)
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const L = require('./lib.js');
const {recordScene, moveTo, box, click, hover, smoothScroll, sleep, OVERLAY, LOGO} = L;
const DIR = __dirname;
const LINES = JSON.parse(fs.readFileSync(path.join(DIR, 'lines.json'), 'utf8'));
const DUR = JSON.parse(fs.readFileSync(path.join(DIR, 'voice', 'dur.json'), 'utf8'));
const only = process.argv[2];
const SEED = JSON.parse(fs.readFileSync('/home/user/vnxgroup-app/demo/build/seed-bang-luong.json', 'utf8'));
SEED.settings.logo = LOGO;
const STEP = {s01: 'TRANG CHỦ', s02: 'BƯỚC 1 · NHẬP EXCEL', s03: 'BẢNG LƯƠNG NGÂN SÁCH', s04: 'HỒ SƠ · PHIẾU LƯƠNG', s05: 'NÂNG LƯƠNG · TRUY LĨNH', s06: 'BẢNG IN', s07: 'CÔNG KHAI · BẢNG KÊ 20', s08: 'TỔNG HỢP THUẾ TNCN', s09: 'KỲ MỚI · SAO LƯU'};
const VO = [];

async function say(page, i) {
  await L.cap(page, LINES[i][1], STEP[LINES[i][0]] || '', 0);
  const t = Date.now() / 1000; VO.push({i, t});
  const end = t + DUR[i] + 0.45;
  return async (extra = 0) => { const w = (end + extra) * 1000 - Date.now(); if (w > 0) await sleep(w) };
}
async function mark(p, fnSrc, arg) {
  const id = 'vt' + Math.random().toString(36).slice(2, 8);
  const ok = await p.evaluate(([src, a, id]) => { const e = (new Function('a', src))(a); if (!e) return false; e.setAttribute('data-vt', id); return true }, [fnSrc, arg, id]);
  if (!ok) { console.log('NF', arg); return null }
  return p.locator(`[data-vt="${id}"]`).first();
}
const byText = (p, t, exact = false) => mark(p, `const els=[...document.querySelectorAll('a,button,span,div,summary,td,th,label,b,li,h2,h3,h4,h5,small,strong,p')].filter(x=>x.offsetParent&&x.children.length<5);
  const n=s=>s.replace(/\\s+/g,' ').trim(); const m=els.filter(x=>a.ex?n(x.textContent)===a.t:n(x.textContent).includes(a.t)); m.sort((x,y)=>x.textContent.length-y.textContent.length); return m[0]`, {t, ex: exact});
const tabEl = (p, t) => mark(p, `return [...document.querySelectorAll('[data-tab="'+a+'"]')].find(x=>x.offsetParent&&x.textContent.trim())`, t);
async function tab(p, t) { const l = await tabEl(p, t); if (l) await click(p, l, {after: 1100}); await smoothScroll(p, 0, 300) }
async function hv(p, t, ms = 800, exact = false) { const l = await byText(p, t, exact); if (l) { try { await hover(p, l, ms) } catch (e) { console.log('skip', t) } } }
async function hiOn(l) { if (l) await l.evaluate(e => e.classList.add('vtHi')) }
async function hiOff(l) { if (l) await l.evaluate(e => e.classList.remove('vtHi')) }
async function scrollTo(p, t, off = 110) { const l = await byText(p, t); if (l) { await p.evaluate(([y]) => 0, [0]); const y = await l.evaluate(e => e.getBoundingClientRect().top + scrollY); await smoothScroll(p, Math.max(0, y - off), 1100) } }

(async () => {
  const b = await chromium.launch();
  for (const [n, li] of [['intro', 0], ['outro', LINES.length - 1]]) {
    if (only && only !== n) continue;
    const ctx = await b.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.2});
    const p = await ctx.newPage(); p.__dsf = 1.2;
    await p.goto('file://' + path.join(DIR, n + '.html')); await p.evaluate(() => document.fonts.ready); await sleep(300);
    await recordScene(p, n, async () => {
      await p.evaluate(() => document.body.classList.add('go'));
      VO.push({i: li, t: Date.now() / 1000 + 0.5});
      await sleep(Math.max(n === 'intro' ? 6200 : 7500, (DUR[li] + 1.4) * 1000));
    });
    await ctx.close();
  }

  const ctx = await b.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.2});
  await ctx.addInitScript(d => { try { if (!sessionStorage.getItem('x')) { localStorage.clear(); localStorage.setItem('bangluong.periods.v1', JSON.stringify({'2026-11': d})); localStorage.setItem('bangluong.cur', '2026-11'); localStorage.setItem('bangluong.tab', 'home'); sessionStorage.setItem('x', '1') } } catch (e) {} window.print = () => {} }, SEED);
  await ctx.addInitScript(OVERLAY);
  const page = await ctx.newPage(); page.__dsf = 1.2;
  page.on('dialog', d => d.dismiss()); page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto('http://localhost:8771/app.html'); await sleep(2500);
  await page.evaluate(l => window.__tag(l), LOGO);
  await tab(page, 'home'); await page.mouse.move(800, 600);

  await recordScene(page, 's01', async () => {
    const w = await say(page, 1);
    await hv(page, 'Tổng chi trả kỳ này', 900); await hv(page, 'Quy trình lập bảng lương tháng', 800);
    await scrollTo(page, 'Các bảng của kỳ', 120); await hv(page, 'Ngân sách', 900); await hv(page, 'Nguồn thu', 900);
    await w(); await smoothScroll(page, 0, 600);
  });

  await recordScene(page, 's02', async () => {
    const w = await say(page, 3 - 1);
    const l = await byText(page, 'Nhập Excel', true); if (l) { await hover(page, l, 300); await hiOn(l) }
    await sleep(3500); await w(); await hiOff(l);
  });

  await recordScene(page, 's03', async () => {
    let w = await say(page, 3);
    await tab(page, 'ns');
    await hv(page, 'Lương thực lãnh · Ngân sách', 800); await hv(page, 'PCUĐ nghề · Ngân sách', 800); await hv(page, 'Trích BHXH, BHYT, BHTN', 800); await hv(page, 'Tổng chi trả tháng', 900);
    await w();
    w = await say(page, 4);
    await scrollTo(page, 'Lương và PCUĐ – Ngân sách', 100);
    await hv(page, 'Khoa Khám bệnh', 700); await hv(page, 'Thai sản', 700); await hv(page, 'Đi học', 700);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's04', async () => {
    const w = await say(page, 5);
    await tab(page, 'hs');
    const it = await mark(page, `return [...document.querySelectorAll('.hs-it')].find(x=>/Võ Minh Đức/.test(x.textContent))`, 'hs-it'); if (it) await click(page, it, {after: 1000});
    await scrollTo(page, 'Hệ số lương và phụ cấp', 120); await hv(page, 'Hệ số lương và phụ cấp', 700);
    await scrollTo(page, 'Số tiền tháng', 160); await hv(page, 'Thực lãnh', 1000);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's05', async () => {
    let w = await say(page, 6);
    const nl = await mark(page, `return [...document.querySelectorAll('button,a')].find(x=>x.offsetParent&&x.textContent.trim()==='Nâng lương')`, 'nl'); if (nl) await click(page, nl, {after: 900});
    await click(page, '#rs-ten', {after: 200}); await page.keyboard.type('Võ Minh Đức', {delay: 70}); await page.keyboard.press('Tab'); await sleep(500);
    await click(page, '#rs-hs', {after: 200}); await page.keyboard.type('4,32', {delay: 120});
    await page.fill('#rs-tu', '2026-08'); await page.fill('#rs-den', '2026-10');
    await click(page, '#rs-qd', {after: 200}); await page.keyboard.type('125/QĐ-TTYT', {delay: 60}); await page.keyboard.press('Tab'); await sleep(600);
    await w();
    w = await say(page, 7);
    await hv(page, 'Số tháng truy lĩnh', 800); await hv(page, 'Truy lĩnh lương', 800); await hv(page, 'Tổng thực nhận truy lĩnh', 1000);
    const ok = await mark(page, `return [...document.querySelectorAll('button')].filter(x=>x.offsetParent&&x.textContent.trim()==='Nâng lương').pop()`, 'ok'); if (ok) await click(page, ok, {after: 1500});
    await w();
  });

  await recordScene(page, 's06', async () => {
    let w = await say(page, 8);
    await tab(page, 'in');
    await hv(page, 'Lương NS', 600, true);
    await scrollTo(page, 'BẢNG THANH TOÁN TIỀN LƯƠNG', 260);
    await sleep(800); await smoothScroll(page, (await page.evaluate(() => scrollY)) + 260, 1400);
    await w();
    w = await say(page, 9);
    await smoothScroll(page, 0, 500);
    const c = await byText(page, 'TL lương - NGÂN SÁCH', true); if (c) await click(page, c, {after: 900});
    await scrollTo(page, 'BẢNG TRUY LÃNH TIỀN LƯƠNG', 260); await hv(page, 'TỔNG CỘNG', 900);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's07', async () => {
    const w = await say(page, 10);
    await tab(page, 'ck');
    await scrollTo(page, 'Bảng kê 20 – tải lên dịch vụ công Kho bạc', 140);
    await hv(page, '20NS · Nguồn ngân sách', 700); await hv(page, '20NT · Nguồn thu', 700);
    const x = await byText(page, 'Xuất 20NS'); if (x) { await hover(page, x, 300); await hiOn(x); await sleep(1300); await hiOff(x) }
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's08', async () => {
    const w = await say(page, 11);
    await tab(page, 'th');
    await hv(page, 'Quý IV', 700);
    await scrollTo(page, 'BẢNG TỔNG HỢP TIỀN LƯƠNG TÍNH THUẾ', 200); await hv(page, 'QUÝ I', 800, true); await hv(page, 'Võ Minh Đức', 900, true);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's09', async () => {
    const w = await say(page, 12);
    const k = await byText(page, 'Tạo kỳ mới', true); if (k) { await hover(page, k, 300); await hiOn(k); await sleep(2200); await hiOff(k) }
    const s = await byText(page, 'Sao lưu', true); if (s) { await hover(page, s, 300); await hiOn(s); await sleep(1800); await hiOff(s) }
    await w();
  });

  L.flush();
  fs.writeFileSync(path.join(DIR, 'vo.json'), JSON.stringify({vo: VO, caps: L.CAPS()}, null, 1));
  await b.close();
})();

// Quay video hướng dẫn CHI TIẾT Bảng lương viên chức – chú thích khớp giọng đọc
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
const STEP = {s01: 'TRANG CHỦ', s02: 'NHẬP EXCEL · CÀI ĐẶT', s03: 'BẢNG LƯƠNG NGÂN SÁCH', s04: 'NGUỒN THU', s05: 'HỒ SƠ · PHIẾU LƯƠNG', s06: 'NÂNG LƯƠNG · TRUY LĨNH', s07: 'HỢP ĐỒNG', s08: 'PHỤ CẤP', s09: 'CHI MỘT LẦN', s10: 'BẢNG IN · XUẤT EXCEL', s11: 'CÔNG KHAI · BẢNG KÊ 20', s12: 'TỔNG HỢP THUẾ TNCN', s13: 'KỲ MỚI · SAO LƯU'};
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
  if (!ok) { console.log('NF', JSON.stringify(arg)); return null }
  return p.locator(`[data-vt="${id}"]`).first();
}
const byText = (p, t, exact = false) => mark(p, `const els=[...document.querySelectorAll('a,button,span,div,summary,td,th,label,b,li,h2,h3,h4,h5,small,strong,p')].filter(x=>x.offsetParent&&x.children.length<5);
  const n=s=>s.replace(/\\s+/g,' ').trim(); const m=els.filter(x=>a.ex?n(x.textContent)===a.t:n(x.textContent).includes(a.t)); m.sort((x,y)=>x.textContent.length-y.textContent.length); return m[0]`, {t, ex: exact});
const tabEl = (p, t) => mark(p, `return [...document.querySelectorAll('[data-tab="'+a+'"]')].find(x=>x.offsetParent&&x.textContent.trim())`, t);
async function tab(p, t) { const l = await tabEl(p, t); if (l) await click(p, l, {after: 1100}); await smoothScroll(p, 0, 300) }
async function hv(p, t, ms = 800, exact = false) { const l = await byText(p, t, exact); if (l) { try { await hover(p, l, ms) } catch (e) { console.log('skip', t) } } }
async function hiOn(l) { if (l) await l.evaluate(e => e.classList.add('vtHi')) }
async function hiOff(l) { if (l) await l.evaluate(e => e.classList.remove('vtHi')) }
async function scrollTo(p, t, off = 110, ms = 1100) { const l = await byText(p, t); if (l) { const y = await l.evaluate(e => e.getBoundingClientRect().top + scrollY); await smoothScroll(p, Math.max(0, y - off), ms) } }
async function pcMenu(p, key) {
  const m = await mark(p, `return [...document.querySelectorAll('.tgrp > button')].find(x=>x.offsetParent)`, 'pcbtn');
  if (m) { await hover(p, m, 500); await m.click().catch(() => {}); await sleep(400) }
  const it = await mark(p, `return [...document.querySelectorAll('[data-tab="'+a+'"]')].find(x=>x.offsetParent)`, 'pc_' + key);
  if (it) { await click(p, it, {after: 1100}) } else { await p.evaluate(k => { S.tab = 'pc_' + k; renderAll() }, key); await sleep(900) }
  await smoothScroll(p, 0, 300);
}
async function closeAny(p) { await p.keyboard.press('Escape'); await sleep(300); const c = await mark(p, `return [...document.querySelectorAll('button')].filter(x=>x.offsetParent&&/^(Đóng|Hủy|×|✕)$/.test(x.textContent.trim())).pop()`, 'close'); if (c) await click(p, c, {after: 500}) }

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
    let w = await say(page, 1);
    await hv(page, 'Quy trình lập bảng lương tháng', 900); await hv(page, 'Tổng chi trả kỳ này', 1200);
    await w();
    w = await say(page, 2);
    await scrollTo(page, 'Các bảng của kỳ', 120);
    await hv(page, 'Ngân sách', 500); await hv(page, 'Lương NĐ 235', 500);
    const c = await byText(page, 'Phụ cấp thường trực 24/24'); if (c) await click(page, c, {after: 1800});
    await w(); await closeAny(page); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's02', async () => {
    let w = await say(page, 3);
    const l = await byText(page, 'Nhập Excel', true); if (l) { await hover(page, l, 300); await hiOn(l) }
    await w(); await hiOff(l);
    w = await say(page, 4);
    await tab(page, 'cd');
    await hv(page, 'Lương cơ sở (đ)', 900); await hv(page, 'BHXH (%)', 600);
    const m = await byText(page, 'Mẫu bảng lương viên chức'); if (m) { await hover(page, m, 300); await hiOn(m); await sleep(1500); await hiOff(m) }
    await scrollTo(page, 'Người ký', 160, 900); await hv(page, 'Người ký', 900);
    await w(); await smoothScroll(page, 0, 400);
  });

  await recordScene(page, 's03', async () => {
    let w = await say(page, 5);
    await tab(page, 'ns');
    await hv(page, 'Lương thực lãnh · Ngân sách', 600); await hv(page, 'PCUĐ nghề · Ngân sách', 600); await hv(page, 'Hợp đồng · NĐ 235', 600); await hv(page, 'Phụ cấp · trực', 600); await hv(page, 'Tổng chi trả tháng', 800);
    await w();
    w = await say(page, 6);
    await scrollTo(page, 'Lương và PCUĐ – Ngân sách', 100);
    await hv(page, 'Khoa Khám bệnh', 700); await hv(page, 'Thai sản', 700); await hv(page, 'Đi học', 700); await hv(page, 'Ngày DS', 700);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's04', async () => {
    const w = await say(page, 7);
    await tab(page, 'nt');
    await scrollTo(page, 'Lương và PCUĐ – Nguồn thu', 100);
    await hv(page, 'Dương Văn Đạt', 600); await hv(page, 'Nguồn', 900, true);
    await w(); await smoothScroll(page, 0, 400);
  });

  await recordScene(page, 's05', async () => {
    const w = await say(page, 8);
    await tab(page, 'hs');
    const it = await mark(page, `return [...document.querySelectorAll('.hs-it')].find(x=>/Võ Minh Đức/.test(x.textContent))`, 'hs-it'); if (it) await click(page, it, {after: 1000});
    await scrollTo(page, 'Hệ số lương và phụ cấp', 120); await hv(page, 'Hệ số lương và phụ cấp', 600);
    await scrollTo(page, 'Số tiền tháng', 160); await hv(page, 'Thực lãnh', 900);
    await scrollTo(page, 'Các khoản khác', 200); await hv(page, 'Thủ thuật', 1000);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's06', async () => {
    let w = await say(page, 9);
    const nl = await mark(page, `return [...document.querySelectorAll('button,a')].find(x=>x.offsetParent&&x.textContent.trim()==='Nâng lương')`, 'nl'); if (nl) await click(page, nl, {after: 900});
    await click(page, '#rs-ten', {after: 200}); await page.keyboard.type('Võ Minh Đức', {delay: 60}); await page.keyboard.press('Tab'); await sleep(400);
    await click(page, '#rs-hs', {after: 200}); await page.keyboard.type('4,32', {delay: 110});
    await page.fill('#rs-tu', '2026-08'); await page.fill('#rs-den', '2026-10');
    await click(page, '#rs-qd', {after: 200}); await page.keyboard.type('125/QĐ-TTYT', {delay: 50}); await page.keyboard.press('Tab'); await sleep(500);
    await w();
    w = await say(page, 10);
    await hv(page, 'Số tháng truy lĩnh', 800); await hv(page, 'Truy lĩnh lương', 800); await hv(page, 'Tổng thực nhận truy lĩnh', 1000);
    const ok = await mark(page, `return [...document.querySelectorAll('button')].filter(x=>x.offsetParent&&x.textContent.trim()==='Nâng lương').pop()`, 'ok'); if (ok) await click(page, ok, {after: 1500});
    await w();
  });

  await recordScene(page, 's07', async () => {
    let w = await say(page, 11);
    await tab(page, 'hd');
    await scrollTo(page, 'Hợp đồng NĐ 235', 120); await hv(page, 'Hợp đồng NĐ 235', 700);
    await scrollTo(page, 'Hợp đồng có trích BHXH', 140, 800); await scrollTo(page, 'Bác sĩ hợp đồng', 420, 1000);
    await w();
    w = await say(page, 12);
    await scrollTo(page, 'Hợp đồng NĐ 235', 120, 900); await hv(page, 'Hà Minh Tâm', 600); await hv(page, 'CÁCH TÍNH LƯƠNG', 700);
    await scrollTo(page, 'Hợp đồng có trích BHXH', 140, 800); await hv(page, 'Lưu Văn Phát', 600); await hv(page, '3.311.500', 900);
    await w(); await smoothScroll(page, 0, 400);
  });

  await recordScene(page, 's08', async () => {
    let w = await say(page, 13);
    const m = await mark(page, `return [...document.querySelectorAll('.tgrp > button')].find(x=>x.offsetParent)`, 'pcbtn');
    if (m) { await hover(page, m, 300); await m.click().catch(() => {}); await sleep(600) }
    await page.screenshot({path: path.join(DIR, 'dbg-menu.png')});
    await sleep(4000);
    await w();
    w = await say(page, 14);
    await pcMenu(page, 'tr24');
    await hv(page, 'Ngày thường', 600); await hv(page, 'Quách Văn Yên', 700); await hv(page, 'Ngày nghỉ', 600);
    await w();
    w = await say(page, 15);
    await pcMenu(page, 'dh'); await hv(page, 'Hệ số', 500, true); await hv(page, 'Số ngày', 500, true);
    await pcMenu(page, 'tt'); await hv(page, 'Ca loại 1', 500); await hv(page, 'Đỗ Văn Sang', 500); await hv(page, 'Nguồn', 700);
    await w();
  });

  await recordScene(page, 's09', async () => {
    const w = await say(page, 16);
    await tab(page, 'k1');
    await scrollTo(page, 'TRUY LÃNH PHỤ CẤP ƯU ĐÃI NGHỀ', 140); await hv(page, 'Quách Văn Yên', 700); await hv(page, '2.340.000', 800);
    await w(); await smoothScroll(page, 0, 400);
  });

  await recordScene(page, 's10', async () => {
    let w = await say(page, 17);
    await tab(page, 'in');
    await hv(page, 'Lương NS', 500, true);
    await scrollTo(page, 'BẢNG THANH TOÁN TIỀN LƯƠNG', 260);
    await sleep(700); await smoothScroll(page, (await page.evaluate(() => scrollY)) + 260, 1300);
    await w();
    w = await say(page, 18);
    await smoothScroll(page, 0, 500);
    const c = await byText(page, 'Trực 24/24', true); if (c) await click(page, c, {after: 900});
    await scrollTo(page, 'THƯỜNG TRỰC 24/24', 260); await hv(page, 'Số tiền bằng chữ', 900);
    await w(); await smoothScroll(page, 0, 500);
    w = await say(page, 19);
    const ib = await byText(page, 'In bảng', true); if (ib) await click(page, ib, {after: 900});
    const all = await byText(page, 'Chọn tất cả', true); if (all) await click(page, all, {after: 1300});
    await closeAny(page);
    const xe = await byText(page, 'Xuất Excel', true); if (xe) { await hover(page, xe, 300); await hiOn(xe); await sleep(1300); await hiOff(xe) }
    await w();
  });

  await recordScene(page, 's11', async () => {
    const w = await say(page, 20);
    await tab(page, 'ck');
    await scrollTo(page, 'Bảng kê 20 – tải lên dịch vụ công Kho bạc', 140);
    await hv(page, '20NS · Nguồn ngân sách', 600); await hv(page, '20NT · Nguồn thu', 600); await hv(page, '20CTP · Công tác phí', 600);
    await hv(page, 'Chưa có số tài khoản', 1300);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's12', async () => {
    const w = await say(page, 21);
    await tab(page, 'th');
    await hv(page, 'Quý IV', 700);
    await scrollTo(page, 'BẢNG TỔNG HỢP TIỀN LƯƠNG TÍNH THUẾ', 200); await hv(page, 'QUÝ I', 800, true); await hv(page, 'Võ Minh Đức', 900, true);
    await w(); await smoothScroll(page, 0, 500);
  });

  await recordScene(page, 's13', async () => {
    const w = await say(page, 22);
    const k = await byText(page, 'Tạo kỳ mới', true); if (k) { await hover(page, k, 300); await hiOn(k); await sleep(2600); await hiOff(k) }
    const s = await byText(page, 'Sao lưu', true); if (s) { await hover(page, s, 300); await hiOn(s); await sleep(2200); await hiOff(s) }
    await w();
  });

  L.flush();
  fs.writeFileSync(path.join(DIR, 'vo.json'), JSON.stringify({vo: VO, caps: L.CAPS()}, null, 1));
  await b.close();
})();

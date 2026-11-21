/* ===== VNXGroup Software – BẢN DÙNG THỬ =====
   Chèn vào đầu <head> của bản demo: watermark, chặn In và chặn xuất file (Word, Excel, PDF).
   Vẫn cho phép sao lưu dữ liệu (.json) để chuyển sang bản đầy đủ. */
(function () {
  'use strict';
  var APP = window.__VNX_DEMO_APP__ || 'Phần mềm';
  var ZALO = 'https://zalo.me/0901404453', BLOG = 'https://vnxgroupsoftware.blogspot.com/';
  var MSG = 'Bản dùng thử không hỗ trợ In và Xuất file (Word, Excel, PDF).';

  /* ---------- Hộp thông báo ---------- */
  var shown = 0;
  function notice(what) {
    if (Date.now() - shown < 600) return; shown = Date.now();
    var old = document.getElementById('vnxDemoDlg'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'vnxDemoDlg';
    d.innerHTML = '<div class="b"><div class="t">🔒 ' + (what || 'Chức năng bị khóa') + '</div>' +
      '<p>' + MSG + '<br>Bạn vẫn dùng đầy đủ các chức năng khác để xem kết quả.</p>' +
      '<p>Để nhận <b>bản đầy đủ</b> (in, xuất Word / Excel, không watermark), liên hệ tác giả <b>Võ Ngọc Xa – VNXGroup Software</b>:</p>' +
      '<div class="r"><a href="' + ZALO + '" target="_blank" rel="noopener">💬 Zalo 0901 404 453</a>' +
      '<a class="o" href="' + BLOG + '" target="_blank" rel="noopener">🌐 vnxgroupsoftware.blogspot.com</a>' +
      '<button type="button">Đóng</button></div></div>';
    d.querySelector('button').onclick = function () { d.remove() };
    d.onclick = function (e) { if (e.target === d) d.remove() };
    (document.body || document.documentElement).appendChild(d);
  }
  window.__vnxDemoNotice = notice;

  /* ---------- Chặn In ---------- */
  function blockPrint() { notice('Chức năng In bị khóa') }
  try { Object.defineProperty(window, 'print', {value: blockPrint, writable: false, configurable: false}) } catch (e) { window.print = blockPrint }
  window.addEventListener('beforeprint', function () { notice('Chức năng In bị khóa') });
  function guardFrame(f) {
    try { var w = f.contentWindow; if (w && w.print !== blockPrint) { Object.defineProperty(w, 'print', {value: blockPrint, writable: false, configurable: false}) } } catch (e) {}
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes && m.addedNodes.forEach(function (n) {
      if (n.tagName === 'IFRAME') { guardFrame(n); n.addEventListener('load', function () { guardFrame(n) }) }
      else if (n.querySelectorAll) n.querySelectorAll('iframe').forEach(function (f) { guardFrame(f); f.addEventListener('load', function () { guardFrame(f) }) });
    }) });
  }).observe(document.documentElement, {childList: true, subtree: true});

  /* Cửa sổ in/xuất mở bằng window.open (không phải đường link web) */
  var origOpen = window.open;
  window.open = function (url) {
    if (url && /^https?:\/\//i.test(String(url))) return origOpen.apply(window, arguments);
    notice('Chức năng In / Xuất bị khóa');
    var doc = {write: function () {}, writeln: function () {}, open: function () { return doc }, close: function () {}, addEventListener: function () {}, body: {innerHTML: ''}, documentElement: {}, querySelector: function () { return null }, getElementById: function () { return null }, createElement: function () { return document.createElement('div') }, title: ''};
    return {document: doc, print: function () {}, close: function () {}, focus: function () {}, addEventListener: function () {}, onload: null, closed: false, location: {href: ''}};
  };

  /* ---------- Chặn tải file xuất (cho phép .json sao lưu) ---------- */
  function allowName(n) { return /\.json$/i.test(n || '') }
  var aClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute('download') && !allowName(this.getAttribute('download'))) { notice('Chức năng Xuất file bị khóa'); return }
    return aClick.apply(this, arguments);
  };
  var dispatch = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function (ev) {
    if (this instanceof HTMLAnchorElement && ev && ev.type === 'click' && this.hasAttribute('download') && !allowName(this.getAttribute('download'))) { notice('Chức năng Xuất file bị khóa'); return false }
    return dispatch.apply(this, arguments);
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if (a && !allowName(a.getAttribute('download'))) { e.preventDefault(); e.stopImmediatePropagation(); notice('Chức năng Xuất file bị khóa') }
  }, true);
  if (window.showSaveFilePicker) {
    var pick = window.showSaveFilePicker;
    window.showSaveFilePicker = function (o) {
      if (o && allowName(o.suggestedName)) return pick.apply(window, arguments);
      notice('Chức năng Xuất file bị khóa'); return Promise.reject(new DOMException('Bản dùng thử', 'AbortError'));
    };
  }
  if (navigator.clipboard) {
    try {
      var cw = navigator.clipboard.write && navigator.clipboard.write.bind(navigator.clipboard);
      var ct = navigator.clipboard.writeText && navigator.clipboard.writeText.bind(navigator.clipboard);
      var never = function () { return new Promise(function () {}) };   /* không báo "đã sao chép" */
      navigator.clipboard.write = function () { notice('Chức năng Sao chép văn bản bị khóa'); return never() };
      navigator.clipboard.writeText = function (t) { if (String(t || '').length > 300) { notice('Chức năng Sao chép văn bản bị khóa'); return never() } return ct ? ct(t) : Promise.resolve() };
    } catch (e) {}
  }
  var exec = document.execCommand;
  document.execCommand = function (c) { if (/^copy$/i.test(c)) { var s = String(window.getSelection() || ''); if (s.length > 300) { notice('Chức năng Sao chép văn bản bị khóa'); return false } } return exec.apply(document, arguments) };

  /* ---------- Watermark + nhãn ---------- */
  var wm = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="460" height="260"><g transform="rotate(-24 230 130)" fill="#b3261e" fill-opacity=".10" font-family="Arial,sans-serif" font-weight="700" text-anchor="middle"><text x="230" y="122" font-size="30">BẢN DÙNG THỬ</text><text x="230" y="156" font-size="15">VNXGroup Software · Zalo 0901 404 453</text></g></svg>');
  var css = '#vnxDemoWM{position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:url("data:image/svg+xml,' + wm + '") repeat}' +
    '#vnxDemoTag{position:fixed;left:12px;bottom:12px;z-index:2147483001;display:flex;align-items:center;gap:8px;background:#b3261e;color:#fff !important;font:700 12px/1.2 Arial,sans-serif;padding:8px 12px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.25);text-decoration:none}' +
    '#vnxDemoTag:hover{background:#8f1d17}' +
    '#vnxDemoDlg{position:fixed;inset:0;z-index:2147483646;background:rgba(10,15,30,.55);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.55 Arial,sans-serif}' +
    '#vnxDemoDlg .b{background:#fff;color:#1b2333;border-radius:16px;max-width:460px;width:100%;padding:22px 24px;box-shadow:0 24px 60px rgba(0,0,0,.35)}' +
    '#vnxDemoDlg .t{font-weight:800;font-size:18px;color:#b3261e;margin-bottom:8px}#vnxDemoDlg p{margin:0 0 10px}' +
    '#vnxDemoDlg .r{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '#vnxDemoDlg .r a,#vnxDemoDlg .r button{font:700 14px Arial,sans-serif;border-radius:10px;padding:9px 14px;text-decoration:none;border:0;cursor:pointer;background:#0068ff;color:#fff}' +
    '#vnxDemoDlg .r a.o{background:#eef2fb;color:#14234b}#vnxDemoDlg .r button{background:#14234b;margin-left:auto}' +
    '@media print{body>*{display:none !important}body::before{content:"BẢN DÙNG THỬ – KHÔNG HỖ TRỢ IN. Liên hệ Zalo 0901 404 453 để nhận bản đầy đủ.";display:block;font:20pt Arial,sans-serif;text-align:center;margin:60mm 15mm;color:#b3261e}}';
  function mount() {
    if (document.getElementById('vnxDemoWM')) return;
    var st = document.createElement('style'); st.id = 'vnxDemoCss'; st.textContent = css; document.head.appendChild(st);
    var w = document.createElement('div'); w.id = 'vnxDemoWM'; document.body.appendChild(w);
    var t = document.createElement('a'); t.id = 'vnxDemoTag'; t.href = ZALO; t.target = '_blank'; t.rel = 'noopener';
    t.textContent = '🔒 BẢN DÙNG THỬ · ' + APP + ' – Nhận bản đầy đủ: Zalo 0901 404 453'; document.body.appendChild(t);
    if (document.title.indexOf('[Dùng thử]') < 0) document.title = '[Dùng thử] ' + document.title;
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  /* giữ watermark nếu bị xóa */
  setInterval(function () { if (document.body && (!document.getElementById('vnxDemoWM') || !document.getElementById('vnxDemoTag'))) { ['vnxDemoWM', 'vnxDemoTag', 'vnxDemoCss'].forEach(function (i) { var e = document.getElementById(i); if (e) e.remove() }); mount() } }, 2000);
})();

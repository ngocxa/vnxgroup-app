/* VNXGroup app – service worker */
const V = 'vnx-v5';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function networkFirst(req, name) {
  const c = await caches.open(name);
  try { const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }
  catch (err) { const hit = await c.match(req); if (hit) return hit; throw err; }
}
async function cacheFirst(req, name) {
  const c = await caches.open(name), hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r;
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
  } else if (u.origin === location.origin) {
    e.respondWith(networkFirst(req, V));
  } else if (u.hostname.endsWith('blogspot.com') && u.pathname.includes('/feeds/')) {
    e.respondWith(networkFirst(req, V + '-feed'));          // bài viết: đọc lại được khi mất mạng
  } else if (u.hostname.includes('googleusercontent.com') || u.hostname.includes('fonts.g')) {
    e.respondWith(cacheFirst(req, V + '-media'));           // ảnh & font
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.openWindow(url));
});

/* Build substitutes the configuration; this file is never served directly. */
const CONFIG = __POCKET_CONFIG__;
const CACHE = CONFIG.prefix + CONFIG.version;
const ASSETS = new Set(CONFIG.assets);
self.addEventListener('install', (event) => {
  // Installation succeeds only when the entire editor is available offline.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CONFIG.assets)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Only remove caches owned by this app, never another app or draft storage.
    for (const key of await caches.keys()) {
      if (key.startsWith(CONFIG.prefix) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isShell = url.pathname === CONFIG.shell || url.pathname === CONFIG.shell + 'index.html';
  const key = isShell ? CONFIG.shell : url.pathname;
  if (!ASSETS.has(key)) return; // Blog pages, APIs and external images are untouched.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(key)) || fetch(event.request);
  })());
});

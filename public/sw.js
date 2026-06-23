// Tezbozor admin service worker (WS3 §3e). Hand-written, no build-time precache
// manifest — it caches at runtime, so it survives Vite's hashed asset filenames
// (no dependency on vite-plugin-pwa). Strategies:
//   • SPA navigations  → network, falling back to the cached app shell offline
//   • same-origin JS/CSS/icons → stale-while-revalidate
//   • field-ops GETs (route, shopping-list) → network-first with a cache fallback,
//     so the operator keeps the last-loaded data offline.

const SHELL_CACHE = 'tz-admin-shell-v1';
const API_CACHE = 'tz-admin-api-v1';
const KEEP = [SHELL_CACHE, API_CACHE];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('offline and uncached');
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // SPA navigations → cached app shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          const cache = await caches.open(SHELL_CACHE);
          cache.put('/index.html', res.clone());
          return res;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Same-origin static assets.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Field-ops API reads: last-loaded data available offline.
  if (/\/admin\/(route|shopping-list)\b/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else falls through to the network (default browser handling).
});

// public/sw.js
const CACHE_NAME = 'nv-port-v2';  // bump version on each deploy (v2, v3, ...)
const PRECACHE = ['/', '/index.html'];

// Install: pre-cache critical assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())  // forces waiting worker to activate
  );
});

// Activate: claim clients immediately and delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())  // take control of all open clients
  );
});

// Fetch: network-first strategy (always fetch fresh when online, fallback to cache if offline)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Skip non-GET requests and API calls
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache the fresh response for offline use
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Offline: fallback to cache
        return caches.match(request);
      })
  );
});

// Listen for skip-waiting messages (optional, but helps activate immediately)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
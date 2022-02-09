const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];
const self = this

// Install SW
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(urlsToCache);
    })());
  });

// Listen for requests
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });

// Activate the SW
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key === CACHE_NAME) return
        return caches.delete(key);
      }))
    }));
  });
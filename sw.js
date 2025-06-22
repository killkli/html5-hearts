const CACHE_NAME = 'hearts-pwa-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './img/heart.png',
  './img/club.png',
  './img/diamond.png',
  './img/spade.png',
  './img/flip.png',
  './js/main.js',
  './js/lib/jquery-2.0.3.min.js',
  './js/lib/require.js',
  // 其他 js 檔案可依需求加入
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
}); 

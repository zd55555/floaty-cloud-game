const CACHE_NAME='floaty-cloud-v2';
const urlsToCache=[
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch',event=>{
  event.respondWith(
    caches.match(event.request).then(resp=>{
      return resp||fetch(event.request);
    })
  );
});

self.addEventListener('activate',event=>{
  const keep=[CACHE_NAME];
  event.waitUntil(
    caches.keys().then(names=>{
      return Promise.all(
        names.map(n=>{if(!keep.includes(n))return caches.delete(n);})
      );
    })
  );
});

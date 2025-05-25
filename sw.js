const CACHE_NAME='floaty-cloud-v3';
const urlsToCache=['/','/index.html','/manifest.json','/sw.js','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(names=>Promise.all(names.map(n=>{if(n!==CACHE_NAME)return caches.delete(n);})));});

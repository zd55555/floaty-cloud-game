const CACHE = "floaty-cloud-v6";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k===CACHE?null:caches.delete(k))
    )).then(()=> self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.mode === "navigate") {
    // network first for HTML
    event.respondWith(
      fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put("/",copy));
        return res;
      }).catch(()=> caches.match("/"))
    );
    return;
  }

  // static assets: cache first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
        return res;
    }))
  );
});

// message from page to skip waiting
self.addEventListener("message", e=>{
  if(e.data && e.data.type==="SKIP_WAITING") self.skipWaiting();
});

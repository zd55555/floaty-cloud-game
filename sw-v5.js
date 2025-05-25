const CACHE='floaty-cloud-v5';
const ASSETS=[
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// install - pre-cache core assets
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS))
  );
});

// activate - claim clients and delete old caches
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

// Fetch - network first for html, cache first for others
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(r=>{
        const respClone=r.clone();
        caches.open(CACHE).then(c=>c.put('/',respClone));
        return r;
      }).catch(()=>caches.match('/'))
    );
  }else{
    event.respondWith(
      caches.match(req).then(res=>res||fetch(req).then(r=>{
        // cache copy
        if(r.ok){
          const rc=r.clone();
          caches.open(CACHE).then(c=>c.put(req,rc));
        }
        return r;
      }).catch(()=>res))
    );
  }
});

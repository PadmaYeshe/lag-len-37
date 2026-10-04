/* Change CACHE (for example to lag-len-ac) whenever index.html is replaced. */
var CACHE="lag-len-ab";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(function(hit){
    if(hit)return hit;
    return fetch(e.request).then(function(res){
      var copy=res.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,copy);}).catch(function(){});
      return res;
    }).catch(function(){return caches.match("index.html");});
  }));
});

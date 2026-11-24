/* Lavoro Chiaro: app installabile, apertura veloce e offline. Nessun dato utente passa da qui. */
var C="lc-v1";
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(["/sito/","/sito/busta-paga/","/sito/le-mie-ore/","/sito/lordo-netto/","/sito/naspi/"]).catch(function(){})}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
 var own=u.origin===location.origin&&u.pathname.indexOf("/sito/")===0,cdn=u.hostname==="cdnjs.cloudflare.com";if(!own&&!cdn)return;
 if(r.mode==="navigate"||own){e.respondWith(fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r,{ignoreSearch:r.mode==="navigate"}).then(function(m){return m||caches.match("/sito/")})}));return}
 e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res})}))});

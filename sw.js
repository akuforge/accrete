// Network first (so updates show up at once), cache fallback (so it plays offline / off the tailnet).
const C='accrete-v4',FILES=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
 const net=new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),2500);fetch(req).then(r=>{clearTimeout(t);res(r);},err=>{clearTimeout(t);rej(err);});});
 e.respondWith(net.then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));}return r;}).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));});

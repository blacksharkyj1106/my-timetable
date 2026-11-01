// 缓存优先：打开时直接用本机缓存，后台再从 GitHub 拉取新版本，下次打开生效
const CACHE='timetable-v1', FILES=['./','index.html','style.css','semester.js','app.js','icon.png','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 const key=req.mode==='navigate'?'./':req;
 e.respondWith(caches.open(CACHE).then(async c=>{
  const hit=await c.match(key,{ignoreSearch:true});
  const net=fetch(req,{cache:'no-cache'}).then(r=>{if(r.ok)c.put(key,r.clone());return r});
  if(hit){e.waitUntil(net.catch(()=>{}));return hit}
  return net;
 }));
});

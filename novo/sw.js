const EMPREGAMAIS_SW_VERSION='2026-09-28-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  await self.clients.claim();
  const clientes=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const cliente of clientes){
    try{
      const u=new URL(cliente.url);
      u.searchParams.set('_emv',EMPREGAMAIS_SW_VERSION);
      if('navigate' in cliente)await cliente.navigate(u.href);
    }catch(_){ }
  }
})()));
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text?.()||''}}e.waitUntil(self.registration.showNotification(d.title||'EmpregaMais',{body:d.body||'Você tem uma nova atualização.',icon:d.icon||'./assets/img/icon-192.png',badge:d.badge||'./assets/img/icon-192.png',tag:d.tag||'empregamais',renotify:true,data:{url:d.url||'./?pagina=painel-candidato'},vibrate:[120,60,120]}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=e.notification.data?.url||'./?pagina=painel-candidato';e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of cs){if('focus'in c){await c.focus();if('navigate'in c)await c.navigate(u);return}}if(self.clients.openWindow)await self.clients.openWindow(u)})())});
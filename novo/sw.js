const EMPREGAMAIS_SW_VERSION='2026-09-28-v3';
const EMPREGAMAIS_DESKTOP_VAGAS_FIX=`
@media (min-width: 901px){
  #pagina-home .home-recentes-layout{
    display:grid!important;
    grid-template-columns:238px minmax(0,1fr)!important;
    gap:18px!important;
    align-items:start!important;
    width:100%!important;
  }
  #pagina-home .home-recentes-lateral{
    display:block!important;
    grid-column:1!important;
    grid-row:1!important;
    width:238px!important;
    min-width:0!important;
  }
  #pagina-home .home-recentes-main{
    display:block!important;
    grid-column:2!important;
    grid-row:1!important;
    width:100%!important;
    min-width:0!important;
    overflow:visible!important;
  }
  #pagina-home .home-recentes-main #listaVagasPortal{
    display:grid!important;
    grid-template-columns:minmax(0,1fr)!important;
    width:100%!important;
    min-width:0!important;
    min-height:1px!important;
    height:auto!important;
    overflow:visible!important;
    visibility:visible!important;
    opacity:1!important;
  }
  #pagina-home #listaVagasPortal .portal-vaga-nova{
    display:grid!important;
    visibility:visible!important;
    opacity:1!important;
  }
}
`;
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
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!u.pathname.endsWith('/assets/css/app.css'))return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request,{cache:'no-store'});
      const css=await r.text();
      const headers=new Headers(r.headers);
      headers.set('content-type','text/css; charset=utf-8');
      headers.set('cache-control','no-store, max-age=0');
      return new Response(css+'\n'+EMPREGAMAIS_DESKTOP_VAGAS_FIX,{status:r.status,statusText:r.statusText,headers});
    }catch(_){
      return fetch(e.request);
    }
  })());
});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text?.()||''}}e.waitUntil(self.registration.showNotification(d.title||'EmpregaMais',{body:d.body||'Você tem uma nova atualização.',icon:d.icon||'./assets/img/icon-192.png',badge:d.badge||'./assets/img/icon-192.png',tag:d.tag||'empregamais',renotify:true,data:{url:d.url||'./?pagina=painel-candidato'},vibrate:[120,60,120]}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=e.notification.data?.url||'./?pagina=painel-candidato';e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of cs){if('focus'in c){await c.focus();if('navigate'in c)await c.navigate(u);return}}if(self.clients.openWindow)await self.clients.openWindow(u)})())});
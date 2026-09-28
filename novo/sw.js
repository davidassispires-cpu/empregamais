const EMPREGAMAIS_SW_VERSION='2026-09-28-v5';
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
const EMPREGAMAIS_DESTAQUES_SYNC_FIX=`
(function(){
  let emDestaquesSyncEmCurso=false;

  function corrigirFaixaDestaquesEM(){
    try{
      if(typeof cardDestaqueMiniEM!=='function'||typeof quantidadeFaixaDestaquesEM!=='function')return;
      renderFaixaDestaquesEM=function(lista){
        const box=document.getElementById('listaDestaquesFaixaEM'),wrap=document.getElementById('destaquesFaixaEM');
        if(!box||!wrap)return;
        const arr=Array.isArray(lista)?lista:[];

        const idsDom=new Set(
          Array.from(document.querySelectorAll('#listaDestaques .portal-vaga-nova'))
            .map(card=>String(card.getAttribute('data-vaga-id')||''))
            .filter(Boolean)
        );

        let idsExcluir=idsDom;
        if(!idsExcluir.size){
          idsExcluir=new Set();
          const qtdPrincipais=typeof quantidadeDestaquesVisiveisEM==='function'?quantidadeDestaquesVisiveisEM():3;
          const indice=typeof indiceDestaquesEM!=='undefined'?indiceDestaquesEM:0;
          for(let i=0;i<Math.min(qtdPrincipais,arr.length);i++){
            const v=arr[(indice+i)%arr.length];
            if(v&&v.id)idsExcluir.add(String(v.id));
          }
        }

        const restantes=arr.filter(v=>!idsExcluir.has(String(v.id)));
        if(!restantes.length){wrap.classList.add('oculto');box.innerHTML='';return}
        wrap.classList.remove('oculto');

        const qtd=quantidadeFaixaDestaquesEM();
        if(typeof indiceFaixaDestaquesEM!=='undefined'&&indiceFaixaDestaquesEM>=restantes.length)indiceFaixaDestaquesEM=0;
        const indiceFaixa=typeof indiceFaixaDestaquesEM!=='undefined'?indiceFaixaDestaquesEM:0;
        const vis=[];
        for(let i=0;i<Math.min(qtd,restantes.length);i++)vis.push(restantes[(indiceFaixa+i)%restantes.length]);
        box.innerHTML=vis.map(cardDestaqueMiniEM).join('');
      };
      window.renderFaixaDestaquesEM=renderFaixaDestaquesEM;
    }catch(e){console.warn('EmpregaMais: correção da faixa de destaques falhou.',e)}
  }

  async function sincronizarDestaquesFixEM(){
    if(emDestaquesSyncEmCurso)return;
    emDestaquesSyncEmCurso=true;
    try{
      corrigirFaixaDestaquesEM();
      if(typeof sbJsonEM==='function'&&typeof EMPREGAMAIS_SUPABASE_URL!=='undefined'){
        const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&order=criado_em.desc',{method:'GET',headers:typeof sbHeadersEM==='function'?sbHeadersEM():{}}).catch(()=>[]);
        if(Array.isArray(rows)&&rows.length){
          const remotas=typeof sbMapVagaEM==='function'?rows.map(sbMapVagaEM):rows;
          const locais=typeof ler==='function'?(ler('empregaMaisVagas')||[]):[];
          const mapa=new Map();
          (Array.isArray(locais)?locais:[]).forEach(v=>{if(v&&v.id)mapa.set(String(v.id),v)});
          remotas.forEach(v=>{if(v&&v.id)mapa.set(String(v.id),v)});
          const consolidadas=[...mapa.values()];
          if(typeof sbVagasCacheEM!=='undefined')sbVagasCacheEM=consolidadas;
          if(typeof gravar==='function')gravar('empregaMaisVagas',consolidadas);
        }
      }
      if(typeof indiceDestaquesEM!=='undefined')indiceDestaquesEM=0;
      if(typeof vagasDestaqueOrdenadasEM==='function'&&typeof renderDestaquesEM==='function'){
        const destaques=vagasDestaqueOrdenadasEM();
        renderDestaquesEM(destaques);
        if(typeof renderFaixaDestaquesEM==='function')renderFaixaDestaquesEM(destaques);
      }
    }catch(e){console.warn('EmpregaMais: sincronização dos destaques falhou.',e)}
    finally{emDestaquesSyncEmCurso=false}
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sincronizarDestaquesFixEM,700));
  window.addEventListener('focus',()=>setTimeout(sincronizarDestaquesFixEM,80));
  window.sincronizarDestaquesFixEM=sincronizarDestaquesFixEM;
})();
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
  if(e.request.method!=='GET')return;
  const isCss=u.pathname.endsWith('/assets/css/app.css');
  const isJs=u.pathname.endsWith('/assets/js/app.js');
  if(!isCss&&!isJs)return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request,{cache:'no-store'});
      const txt=await r.text();
      const headers=new Headers(r.headers);
      headers.set('cache-control','no-store, max-age=0');
      if(isCss){
        headers.set('content-type','text/css; charset=utf-8');
        return new Response(txt+'\n'+EMPREGAMAIS_DESKTOP_VAGAS_FIX,{status:r.status,statusText:r.statusText,headers});
      }
      headers.set('content-type','application/javascript; charset=utf-8');
      return new Response(txt+'\n'+EMPREGAMAIS_DESTAQUES_SYNC_FIX,{status:r.status,statusText:r.statusText,headers});
    }catch(_){
      return fetch(e.request);
    }
  })());
});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text?.()||''}}e.waitUntil(self.registration.showNotification(d.title||'EmpregaMais',{body:d.body||'Você tem uma nova atualização.',icon:d.icon||'./assets/img/icon-192.png',badge:d.badge||'./assets/img/icon-192.png',tag:d.tag||'empregamais',renotify:true,data:{url:d.url||'./?pagina=painel-candidato'},vibrate:[120,60,120]}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=e.notification.data?.url||'./?pagina=painel-candidato';e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of cs){if('focus'in c){await c.focus();if('navigate'in c)await c.navigate(u);return}}if(self.clients.openWindow)await self.clients.openWindow(u)})())});
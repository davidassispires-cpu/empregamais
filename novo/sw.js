const EMPREGAMAIS_SW_VERSION='2026-09-29-v31';

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


const EMPREGAMAIS_RECRUTADOR_FONTE_CONECTA=`
/* RECRUTADOR - TIPOGRAFIA CONECTA */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

#pagina-painel-empresa,
#pagina-painel-empresa *,
#pagina-candidatos-empresa,
#pagina-candidatos-empresa *,
#pagina-minhas-vagas,
#pagina-minhas-vagas *,
#pagina-minha-empresa,
#pagina-minha-empresa *,
#pagina-contratacoes,
#pagina-contratacoes *{
  font-family:'Poppins','Segoe UI',Arial,sans-serif!important;
}

#pagina-painel-empresa h1,
#pagina-painel-empresa h2,
#pagina-painel-empresa h3,
#pagina-painel-empresa strong,
#pagina-candidatos-empresa h1,
#pagina-candidatos-empresa h2,
#pagina-candidatos-empresa h3,
#pagina-minhas-vagas h1,
#pagina-minhas-vagas h2,
#pagina-minhas-vagas h3{
  font-weight:600!important;
  letter-spacing:-.01em!important;
}

#pagina-painel-empresa p,
#pagina-painel-empresa span,
#pagina-painel-empresa small,
#pagina-painel-empresa button,
#pagina-candidatos-empresa p,
#pagina-candidatos-empresa span,
#pagina-candidatos-empresa small,
#pagina-candidatos-empresa button,
#pagina-minhas-vagas p,
#pagina-minhas-vagas span,
#pagina-minhas-vagas small,
#pagina-minhas-vagas button{
  letter-spacing:0!important;
}
`;

const EMPREGAMAIS_DESTAQUES_FINAL_FIX=`
/* EMPREGAMAIS-DESTAQUES-FINAL-V8 */
(function(){
  function listaDestaquesEstavelEM(){
    try{
      return (typeof vagasPublicas==='function'?vagasPublicas():[])
        .filter(v=>typeof destaqueAtivo==='function'?destaqueAtivo(v):!!v?.destaque)
        .sort((a,b)=>new Date(b.criadoEm||b.criado_em||b.dataPublicacao||b.data||0)-new Date(a.criadoEm||a.criado_em||a.dataPublicacao||a.data||0));
    }catch(_){return[]}
  }

  vagasDestaqueOrdenadasEM=function(){
    return listaDestaquesEstavelEM();
  };
  window.vagasDestaqueOrdenadasEM=vagasDestaqueOrdenadasEM;

  renderFaixaDestaquesEM=function(lista){
    const box=document.getElementById('listaDestaquesFaixaEM');
    const wrap=document.getElementById('destaquesFaixaEM');
    if(!box||!wrap)return;

    const arr=Array.isArray(lista)&&lista.length?lista:listaDestaquesEstavelEM();
    const qtdPrincipais=typeof quantidadeDestaquesVisiveisEM==='function'?quantidadeDestaquesVisiveisEM():3;
    const inicio=Math.max(0,Number(typeof indiceDestaquesEM!=='undefined'?indiceDestaquesEM:0)||0);
    const idsPrincipais=new Set();

    for(let i=0;i<Math.min(qtdPrincipais,arr.length);i++){
      const v=arr[(inicio+i)%arr.length];
      if(v?.id!=null)idsPrincipais.add(String(v.id));
    }

    const restantes=arr.filter(v=>!idsPrincipais.has(String(v.id)));
    if(!restantes.length){
      wrap.classList.add('oculto');
      box.innerHTML='';
      return;
    }

    wrap.classList.remove('oculto');
    const qtd=typeof quantidadeFaixaDestaquesEM==='function'?quantidadeFaixaDestaquesEM():(window.innerWidth<=560?1:window.innerWidth<=900?2:4);
    if(typeof indiceFaixaDestaquesEM!=='undefined'&&indiceFaixaDestaquesEM>=restantes.length)indiceFaixaDestaquesEM=0;
    const idx=Math.max(0,Number(typeof indiceFaixaDestaquesEM!=='undefined'?indiceFaixaDestaquesEM:0)||0);
    const vis=[];
    for(let i=0;i<Math.min(qtd,restantes.length);i++)vis.push(restantes[(idx+i)%restantes.length]);
    box.innerHTML=vis.map(cardDestaqueMiniEM).join('');
  };
  window.renderFaixaDestaquesEM=renderFaixaDestaquesEM;

  const moverDestaquesOriginalEM=typeof moverDestaques==='function'?moverDestaques:null;
  moverDestaques=function(dir){
    const ev=window.event;
    if(!ev)return;
    if(moverDestaquesOriginalEM)return moverDestaquesOriginalEM(dir);
  };
  window.moverDestaques=moverDestaques;

  function redesenharDestaquesFinalEM(){
    try{
      if(typeof indiceDestaquesEM!=='undefined')indiceDestaquesEM=0;
      const lista=listaDestaquesEstavelEM();
      if(typeof renderDestaquesEM==='function')renderDestaquesEM(lista);
      if(typeof renderFaixaDestaquesEM==='function')renderFaixaDestaquesEM(lista);
    }catch(e){console.warn('+ Empregos: falha ao estabilizar destaques.',e)}
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(redesenharDestaquesFinalEM,0),{once:true});
  }else{
    setTimeout(redesenharDestaquesFinalEM,0);
  }
  window.addEventListener('focus',()=>setTimeout(redesenharDestaquesFinalEM,50));
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
        return new Response(txt+'\n'+EMPREGAMAIS_DESKTOP_VAGAS_FIX+'\n'+EMPREGAMAIS_RECRUTADOR_FONTE_CONECTA,{status:r.status,statusText:r.statusText,headers});
      }

      headers.set('content-type','application/javascript; charset=utf-8');
      return new Response(txt+'\n'+EMPREGAMAIS_DESTAQUES_FINAL_FIX,{status:r.status,statusText:r.statusText,headers});
    }catch(_){
      return fetch(e.request);
    }
  })());
});

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text?.()||''}}
  e.waitUntil(self.registration.showNotification(d.title||'+ Empregos',{
    body:d.body||'Você tem uma nova atualização.',
    icon:d.icon||'./assets/img/icon-192.png',
    badge:d.badge||'./assets/img/icon-192.png',
    tag:d.tag||'empregamais',
    renotify:true,
    data:{url:d.url||'./?pagina=painel-candidato'},
    vibrate:[120,60,120]
  }))
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const u=e.notification.data?.url||'./?pagina=painel-candidato';
  e.waitUntil((async()=>{
    const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of cs){
      if('focus'in c){
        await c.focus();
        if('navigate'in c)await c.navigate(u);
        return;
      }
    }
    if(self.clients.openWindow)await self.clients.openWindow(u)
  })())
});
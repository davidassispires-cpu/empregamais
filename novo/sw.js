const EMPREGAMAIS_SW_VERSION='2026-09-28-v7';

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

function corrigirAppJsDestaquesEM(js){
  let out=String(js||'');

  /* 1) Não descartar vagas pagas/destacadas antes da renderização. */
  out=out.replace(
    /function vagasDestaqueOrdenadasEM\(\)\{[\s\S]*?\n\}/,
    `function vagasDestaqueOrdenadasEM(){
 return vagasPublicas()
  .filter(destaqueAtivo)
  .sort((a,b)=>new Date(b.criadoEm||b.criado_em||b.dataPublicacao||b.data||0)-new Date(a.criadoEm||a.criado_em||a.dataPublicacao||a.data||0));
}`
  );

  /* 2) A faixa inferior exclui somente os cards principais calculados para aquele momento.
        Não mistura uma segunda lista de IDs, que era o conflito que fazia vagas sumirem. */
  out=out.replace(
    /function renderFaixaDestaquesEM\(lista\)\{[\s\S]*?\n\}\nfunction moverFaixaDestaquesEM\(dir\)\{/,
    `function renderFaixaDestaquesEM(lista){
 const box=document.getElementById('listaDestaquesFaixaEM'),wrap=document.getElementById('destaquesFaixaEM');if(!box||!wrap)return;
 const arr=Array.isArray(lista)?lista:[];
 const principaisAtuais=[];
 for(let i=0;i<Math.min(quantidadeDestaquesVisiveisEM(),arr.length);i++)principaisAtuais.push(arr[(indiceDestaquesEM+i)%arr.length]);
 const idsExcluir=new Set(principaisAtuais.map(v=>String(v.id)));
 const restantes=arr.filter(v=>!idsExcluir.has(String(v.id)));
 if(!restantes.length){wrap.classList.add('oculto');box.innerHTML='';return}
 wrap.classList.remove('oculto');
 const qtd=quantidadeFaixaDestaquesEM();
 if(indiceFaixaDestaquesEM>=restantes.length)indiceFaixaDestaquesEM=0;
 const vis=[];
 for(let i=0;i<Math.min(qtd,restantes.length);i++)vis.push(restantes[(indiceFaixaDestaquesEM+i)%restantes.length]);
 box.innerHTML=vis.map(cardDestaqueMiniEM).join('');
}
function moverFaixaDestaquesEM(dir){`
  );

  /* 3) Remove a rotação automática que redesenhava os Destaques sozinha.
        As setas continuam funcionando; a vaga não desaparece sem ação do usuário. */
  out=out.replace(
    /\(function\(\)\{let timer=null,pausado=false;function iniciar\(\)\{clearInterval\(timer\);timer=setInterval\(function\(\)\{const el=document\.getElementById\('listaDestaques'\);if\(!el\|\|pausado\)return;const total=vagasDestaqueOrdenadasEM\(\)\.length;if\(total>quantidadeDestaquesVisiveisEM\(\)\)moverDestaques\(1\)\},4500\)\}document\.addEventListener\('mouseover',[\s\S]*?iniciar\(\)\}\)\(\);/,
    `/* Destaques estáveis: navegação somente pelas setas; sem rotação automática. */`
  );

  return out;
}

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
      const jsCorrigido=corrigirAppJsDestaquesEM(txt);
      return new Response(jsCorrigido,{status:r.status,statusText:r.statusText,headers});
    }catch(_){
      return fetch(e.request);
    }
  })());
});

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text?.()||''}}
  e.waitUntil(self.registration.showNotification(d.title||'EmpregaMais',{
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
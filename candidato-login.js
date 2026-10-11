function emToggleCandidatePassword(button){
  var field=button.parentElement.querySelector('input');
  if(!field)return;
  var visible=field.type==='password';
  field.type=visible?'text':'password';
  button.setAttribute('aria-label',visible?'Ocultar senha':'Mostrar senha');
  button.setAttribute('aria-pressed',String(visible));
}
(function(){
  function setup(){
    var page=document.getElementById('pagina-login-candidato');
    var registration=document.querySelector('#pagina-cadastro-candidato form');
    var layout=page&&page.querySelector('.login-candidato-layout');
    if(!layout||!registration||page.dataset.dualForm)return;
    page.dataset.dualForm='true';
    var intro=layout.querySelector('.login-candidato-intro');
    if(intro)intro.remove();
    var login=layout.querySelector('.container-menor');
    login.classList.add('candidate-access-card');
    var title=login.querySelector('.login-tipo');
    title.textContent='Acesse sua conta';
    login.querySelector('.login-candidato-card-text').textContent='Acompanhe suas candidaturas e oportunidades.';
    login.querySelector('[type="submit"]').textContent='Entrar';
    var help=login.querySelector('.login-ajuda');if(help)help.remove();
    var card=document.createElement('section');
    card.className='candidate-access-card candidate-register-card';
    card.innerHTML='<h2>Crie sua conta grátis</h2><p class="candidate-card-description">Cadastre-se e encontre sua próxima oportunidade.</p>';
    card.appendChild(registration);
    layout.appendChild(card);
    registration.querySelector('[type="submit"]').textContent='Criar conta grátis';
    var details={cadCandNome:['Seu nome completo','name'],cadCandEmail:['Seu e-mail','email'],cadCandTelefone:['(31) 91234-5678','tel'],cadCandSenha:['Sua senha','new-password']};
    Object.keys(details).forEach(function(id){var field=document.getElementById(id);field.placeholder=details[id][0];field.autocomplete=details[id][1];if(id==='cadCandTelefone'){field.type='tel';field.previousElementSibling.textContent='Celular';}});
    var password=document.getElementById('cadCandSenha');
    var toggle=login.querySelector('.cand-password-toggle').cloneNode(true);
    var wrap=document.createElement('div');wrap.className='cand-password-wrap';
    password.parentNode.insertBefore(wrap,password);wrap.appendChild(password);wrap.appendChild(toggle);
    var confirm=document.createElement('div');confirm.className='grupo';
    confirm.innerHTML='<label for="cadCandSenhaConfirmar">Confirmar senha</label><div class="cand-password-wrap"><input class="campo" id="cadCandSenhaConfirmar" placeholder="Confirme sua senha" autocomplete="new-password" required type="password"></div>';
    confirm.querySelector('.cand-password-wrap').appendChild(toggle.cloneNode(true));
    registration.insertBefore(confirm,registration.querySelector('[type="submit"]'));
    var confirmation=confirm.querySelector('input');
    function validate(){confirmation.setCustomValidity(confirmation.value!==password.value?'As senhas informadas não são iguais.':'');}
    confirmation.addEventListener('input',validate);password.addEventListener('input',validate);
    var sidebar=document.createElement('aside');sidebar.className='candidate-solid-sidebar';
    sidebar.innerHTML='<h1>Área do<br>candidato</h1><svg class="candidate-sidebar-avatar" aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="24" cy="24" r="21"/><circle cx="24" cy="18" r="7"/><path d="M10 39v-3a14 14 0 0 1 28 0v3"/></svg><ul><li><span aria-hidden="true">▤</span>Acompanhe<br>candidaturas</li><li><span aria-hidden="true">✎</span>Atualize seu<br>currículo</li><li><span aria-hidden="true">♡</span>Salve vagas</li></ul>';
    layout.insertBefore(sidebar,login);
    var security=login.querySelector('.cand-login-security');if(security)security.remove();
    registration.classList.add('candidate-registration-grid');
    [].forEach(function(id){document.getElementById(id).closest('.grupo').classList.add('candidate-full-field');});
    var cepHelp=registration.querySelector('.cep-candidato-ajuda-em');if(cepHelp)cepHelp.textContent='Usado para encontrar vagas próximas de você.';
    card.querySelector('.candidate-card-description').textContent='Encontre sua próxima oportunidade.';
    var icons={email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',name:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',tel:'<path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"/>',password:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',cep:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>'};
    ['loginCandEmail','loginCandSenha','cadCandNome','cadCandEmail','cadCandTelefone','cadCandCep','cadCandSenha','cadCandSenhaConfirmar'].forEach(function(id){
      var input=document.getElementById(id),holder=input.parentElement;
      if(!holder.classList.contains('cand-password-wrap')){holder=document.createElement('div');holder.className='candidate-input-wrap';input.before(holder);holder.appendChild(input);}
      holder.classList.add('candidate-with-icon');
      var icon=document.createElement('span');icon.className='candidate-field-icon';icon.setAttribute('aria-hidden','true');
      var kind=input.type==='password'?'password':id==='cadCandNome'?'name':id==='cadCandCep'?'cep':input.type==='tel'?'tel':'email';
      icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+icons[kind]+'</svg>';holder.appendChild(icon);
    });
    var note=document.createElement('p');note.className='candidate-free-note';note.textContent='A candidatura é gratuita.';card.appendChild(note);
    var style=document.createElement('style');style.id='candidate-dual-form-style';
    style.textContent=`
#pagina-login-candidato{background:#eeedf6!important;padding:32px 0 40px!important;min-height:0!important}
#pagina-login-candidato .page-header,#pagina-login-candidato .cand-login-breadcrumb{display:none!important}
#pagina-login-candidato .login-candidato-layout{display:grid!important;grid-template-columns:210px minmax(240px,.85fr) minmax(360px,1.45fr)!important;gap:0!important;align-items:stretch!important;box-sizing:border-box!important;width:calc(100% - 48px)!important;max-width:1180px!important;margin:0 auto!important;padding:0!important;background:#fff!important;border:1px solid #e3ddef!important;border-radius:12px!important;box-shadow:0 8px 24px #36234e08!important;overflow:hidden!important}
#pagina-login-candidato .candidate-solid-sidebar{box-sizing:border-box;background:#38145c;color:#fff;padding:30px 26px;min-width:0}
#pagina-login-candidato .candidate-solid-sidebar h1{color:#fff!important;font-size:25px!important;line-height:1.25!important;margin:0 0 22px!important;font-weight:700!important}
#pagina-login-candidato .candidate-sidebar-avatar{width:54px;height:54px;margin:0 0 28px}
#pagina-login-candidato .candidate-solid-sidebar ul{list-style:none;padding:0;margin:0;display:grid;gap:25px}
#pagina-login-candidato .candidate-solid-sidebar li{display:flex;align-items:center;gap:14px;font-size:13px;line-height:1.6;color:#f1e7fb}
#pagina-login-candidato .candidate-solid-sidebar li>span{font-size:24px;line-height:1;width:25px;text-align:center;flex-shrink:0}
#pagina-login-candidato .candidate-access-card{box-sizing:border-box!important;min-width:0!important;max-width:none!important;width:100%!important;margin:0!important;padding:30px 28px!important;background:#fff!important;border:0!important;border-radius:0!important;box-shadow:none!important}
#pagina-login-candidato .candidate-access-card .form-card{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;display:flex!important;flex-direction:column!important;height:auto!important;border-radius:0!important}
#pagina-login-candidato .candidate-register-card{position:relative!important}
#pagina-login-candidato .candidate-register-card:before{content:'';position:absolute;left:0;top:30px;bottom:30px;width:1px;background:#e9e2ef}
#pagina-login-candidato .login-tipo,#pagina-login-candidato .candidate-register-card h2{display:block!important;margin:0 0 20px!important;padding:0!important;background:none!important;color:#35144f!important;font-size:23px!important;line-height:1.25!important;font-weight:700!important}
#pagina-login-candidato .login-candidato-card-text,#pagina-login-candidato .candidate-card-description{display:none!important}
#pagina-login-candidato .grupo{margin:0 0 17px!important;min-width:0!important}
#pagina-login-candidato .grupo label{display:block!important;margin:0 0 6px!important;color:#362344!important;font-weight:600!important;font-size:12px!important;line-height:1.5!important}
#pagina-login-candidato .campo{box-sizing:border-box!important;width:100%!important;height:44px!important;min-height:44px!important;margin:0!important;border:1px solid #ded7e6!important;border-radius:7px!important;background:#fff!important;color:#35214e!important;font-size:13px!important;padding:10px 12px!important}
#pagina-login-candidato .campo:focus{outline:2px solid #c4a5e6!important;outline-offset:2px!important}
#pagina-login-candidato .candidate-input-wrap,#pagina-login-candidato .cand-password-wrap{position:relative!important}
#pagina-login-candidato .candidate-field-icon{display:none!important}
#pagina-login-candidato .cand-password-wrap .campo{padding-right:40px!important}
#pagina-login-candidato .cand-password-toggle{position:absolute!important;right:5px!important;top:50%!important;transform:translateY(-50%)!important;border:0!important;background:transparent!important;width:30px!important;height:30px!important;color:#80768f!important;cursor:pointer;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:4px!important}
#pagina-login-candidato .cand-password-toggle svg{width:20px!important;height:20px!important}
#pagina-login-candidato .btn[type=submit]{margin-top:6px!important;width:100%!important;min-height:44px!important;height:44px!important;padding:10px!important;border:0!important;border-radius:7px!important;background:#7540ae!important;color:#fff!important;box-shadow:none!important;font-size:14px!important;font-weight:700!important}
#pagina-login-candidato .btn[type=submit]:hover{background:#643294!important}
#pagina-login-candidato .login-senha-link{color:#7540ae!important;display:block!important;margin:0 0 26px!important;font-size:12px!important;text-align:left!important}
#pagina-login-candidato .candidate-registration-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:16px!important}
#pagina-login-candidato .candidate-registration-grid .grupo{margin:0!important}
#pagina-login-candidato .candidate-registration-grid>[type=submit]{grid-column:1/-1!important;margin-top:6px!important}
#pagina-login-candidato .cep-candidato-ajuda-em{display:none!important}
#pagina-login-candidato .candidate-free-note{text-align:center!important;margin:14px 0 0!important;color:#84758f!important;font-size:12px!important;line-height:1.5!important}
@media(max-width:1050px){#pagina-login-candidato .login-candidato-layout{grid-template-columns:170px minmax(210px,.85fr) minmax(300px,1.4fr)!important;width:calc(100% - 32px)!important}#pagina-login-candidato .candidate-access-card{padding:26px 20px!important}#pagina-login-candidato .candidate-solid-sidebar{padding:26px 20px}#pagina-login-candidato .candidate-solid-sidebar h1{font-size:23px!important}}
@media(max-width:800px){#pagina-login-candidato .login-candidato-layout{grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)!important}#pagina-login-candidato .candidate-solid-sidebar{grid-column:1/-1;padding:18px 24px;display:flex;align-items:center;gap:24px}#pagina-login-candidato .candidate-solid-sidebar h1{margin:0!important;font-size:21px!important}#pagina-login-candidato .candidate-sidebar-avatar{width:40px;height:40px;margin:0;order:-1}#pagina-login-candidato .candidate-solid-sidebar ul{display:flex;gap:18px;margin-left:auto}#pagina-login-candidato .candidate-solid-sidebar li{font-size:11px;gap:6px}#pagina-login-candidato .candidate-solid-sidebar li>span{display:none}}
@media(max-width:600px){#pagina-login-candidato{padding:18px 0 28px!important}#pagina-login-candidato .login-candidato-layout{grid-template-columns:1fr!important;width:calc(100% - 28px)!important}#pagina-login-candidato .candidate-solid-sidebar ul{display:none}#pagina-login-candidato .candidate-solid-sidebar h1 br{display:none}#pagina-login-candidato .candidate-solid-sidebar h1{font-size:22px!important}#pagina-login-candidato .candidate-access-card{padding:24px!important}#pagina-login-candidato .candidate-register-card:before{left:24px;right:24px;top:0;bottom:auto;width:auto;height:1px}#pagina-login-candidato .login-senha-link{margin-bottom:16px!important}#pagina-login-candidato .login-tipo,#pagina-login-candidato .candidate-register-card h2{font-size:22px!important}}
@media(max-width:380px){#pagina-login-candidato .candidate-registration-grid{grid-template-columns:1fr!important}}
body.candidate-solid-active .topo{background:#54298a!important;border-color:#54298a!important;box-shadow:none!important}
body.candidate-solid-active .topo .marca-nome,body.candidate-solid-active .topo .marca-nome span,body.candidate-solid-active .topo .menu-principal>.menu-link{color:#fff!important}
body.candidate-solid-active .topo .marca-icone{background:#fff!important;color:#54298a!important}
body.candidate-solid-active .topo .btn-candidato-v19{background:transparent!important;color:#fff!important;border:1px solid #d1b9ea!important}
body.candidate-solid-active .topo .menu-empresa-btn-v19{background:#c8e6ff!important;color:#173c68!important}
`;
    style.textContent=style.textContent.replace(/#pagina-login-candidato/g,'#pagina-login-candidato#pagina-login-candidato#pagina-login-candidato');
    document.head.appendChild(style);
    function syncHeader(){document.body.classList.toggle('candidate-solid-active',page.classList.contains('ativa'));}
    new MutationObserver(syncHeader).observe(page,{attributes:true,attributeFilter:['class']});syncHeader();
    var original=window.mostrarPagina;
    if(typeof original==='function')window.mostrarPagina=function(name){if(name==='cadastro-candidato'||name==='cadastro-curriculo-v101')name='login-candidato';return original.apply(this,[name].concat(Array.prototype.slice.call(arguments,1)));};
    // Cover registration routes already opened while the document was loading.
    ['pagina-cadastro-candidato','pagina-cadastro-curriculo-v101'].forEach(function(id){var node=document.getElementById(id);if(node&&node.classList.contains('ativa')&&typeof window.mostrarPagina==='function')window.mostrarPagina('login-candidato');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

(function(){
 function setupAreas(){
  const section=document.getElementById('areasDestaqueHome'),track=document.getElementById('areasTrackRefV1');if(!section||!track)return;
  const header=section.querySelector('.home-areas-ref-head-v1'),title=header.querySelector('h2'),description=header.querySelector('p'),arrows=header.querySelector('.home-areas-ref-arrows-v1'),kicker=header.querySelector('.home-areas-ref-kicker-v1');
  title.textContent='Vagas por área';description.textContent='Explore oportunidades na sua área de atuação.';if(kicker)kicker.remove();if(arrows)arrows.remove();
  const more=document.createElement('button');more.type='button';more.className='areas-professional-more';more.textContent='Ver todas as áreas →';more.setAttribute('aria-expanded','false');more.setAttribute('aria-controls','areasTrackRefV1');header.append(more);
  let expanded=false;
  more.addEventListener('click',()=>{expanded=!expanded;section.classList.toggle('areas-professional-expanded',expanded);more.setAttribute('aria-expanded',String(expanded));more.textContent=expanded?'Mostrar menos ↑':'Ver todas as áreas →';});
  const stableOrder=new WeakMap();let serial=0;
  function update(){
   observer.disconnect();
   const cards=Array.from(track.querySelectorAll('.home-area-ref-card-v1'));
   cards.forEach(card=>{
    if(!stableOrder.has(card))stableOrder.set(card,serial++);
    const small=card.querySelector('small');if(!small)return;
    const raw=small.textContent.trim(),match=raw.match(/^(\d+)\s+vaga/i),empty=/sem vagas|nenhuma vaga/i.test(raw);
    const count=match?Number(match[1]):empty?0:null;
    card.dataset.areaAvailableCount=count===null?'':String(count);
    card.classList.toggle('areas-professional-empty',count===0);
    const text=count===null?raw:count===0?'Nenhuma vaga aberta':count+' vaga'+(count===1?' disponível':'s disponíveis');
    if(small.textContent!==text)small.textContent=text;
   });
   const sorted=cards.slice().sort((a,b)=>Number(b.dataset.areaAvailableCount||0)-Number(a.dataset.areaAvailableCount||0)||stableOrder.get(a)-stableOrder.get(b));
   if(sorted.some((card,i)=>card!==cards[i]))sorted.forEach(card=>track.appendChild(card));
   more.hidden=cards.length<=4;
   observer.observe(track,{childList:true,subtree:true,characterData:true});
  }
  const observer=new MutationObserver(update);update();
  const style=document.createElement('style');style.textContent=`
#areasDestaqueHome{background:#fff!important;border-top:1px solid #eef1f5!important;padding:30px 24px 34px!important;margin:0!important}
#areasDestaqueHome .home-areas-ref-inner-v1{max-width:1180px!important;margin:0 auto!important}
#areasDestaqueHome .home-areas-ref-head-v1{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;margin-bottom:20px!important}
#areasDestaqueHome h2{margin:0 0 6px!important;font-size:25px!important;font-weight:700!important;line-height:1.25!important;color:#15334f!important}
#areasDestaqueHome .home-areas-ref-head-v1 p{margin:0!important;font-size:13px!important;line-height:1.5!important;color:#738395!important}
#areasDestaqueHome .areas-professional-more{padding:8px 0!important;border:0!important;background:transparent!important;color:#1768b4!important;white-space:nowrap;font-size:13px!important;font-weight:600!important;cursor:pointer}
#areasDestaqueHome .home-areas-ref-track-v1{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important;overflow:visible!important;padding:0!important}
#areasDestaqueHome:not(.areas-professional-expanded) .home-area-ref-card-v1:nth-child(n+5){display:none!important}
#areasDestaqueHome .home-area-ref-card-v1{box-sizing:border-box!important;display:grid!important;grid-template-columns:42px minmax(0,1fr) 16px!important;gap:12px!important;min-width:0!important;width:100%!important;min-height:88px!important;margin:0!important;padding:16px!important;border:1px solid #e0e7ee!important;border-radius:10px!important;background:#fff!important;box-shadow:0 2px 6px #20344d05!important;transform:none!important;text-align:left!important;align-items:center!important}
#areasDestaqueHome .home-area-ref-card-v1 i{width:42px!important;height:42px!important;border-radius:9px!important;background:#edf5ff!important;color:#1768b4!important;display:flex!important;align-items:center!important;justify-content:center!important}
#areasDestaqueHome .home-area-ref-card-v1 i svg{width:22px!important;height:22px!important}
#areasDestaqueHome .home-area-ref-card-v1 strong{font-size:14px!important;line-height:1.35!important;font-weight:600!important;margin:0 0 4px!important;color:#18354f!important}
#areasDestaqueHome .home-area-ref-card-v1 small{font-size:11px!important;line-height:1.45!important;color:#718294!important}
#areasDestaqueHome .home-area-ref-card-v1 b{font-size:18px!important;color:#1768b4!important}
#areasDestaqueHome .home-area-ref-card-v1:hover{border-color:#a9cae9!important;box-shadow:0 3px 9px #1768b40a!important}
#areasDestaqueHome .areas-professional-empty i{background:#f3f5f7!important;color:#98a1ac!important}
#areasDestaqueHome .areas-professional-empty strong,#areasDestaqueHome .areas-professional-empty b{color:#84909c!important}
#areasDestaqueHome .areas-professional-empty small{color:#939eaa!important}
#areasDestaqueHome .areas-professional-more[hidden]{display:none!important}
@media(max-width:1000px){#areasDestaqueHome .home-areas-ref-track-v1{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:600px){#areasDestaqueHome{padding:24px 16px!important}#areasDestaqueHome h2{font-size:22px!important}#areasDestaqueHome .home-areas-ref-head-v1{align-items:flex-start!important;flex-direction:column!important;gap:8px!important;margin-bottom:16px!important}#areasDestaqueHome .home-areas-ref-track-v1{gap:10px!important}#areasDestaqueHome .home-area-ref-card-v1{padding:12px!important;grid-template-columns:34px minmax(0,1fr)!important;gap:9px!important;min-height:82px!important}#areasDestaqueHome .home-area-ref-card-v1 i{width:34px!important;height:34px!important}#areasDestaqueHome .home-area-ref-card-v1 b{display:none!important}#areasDestaqueHome .home-area-ref-card-v1 strong{font-size:12px!important}#areasDestaqueHome .home-area-ref-card-v1 small{font-size:10px!important}}
`;style.textContent=style.textContent.replace(/#areasDestaqueHome/g,'#areasDestaqueHome#areasDestaqueHome#areasDestaqueHome');document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupAreas);else setupAreas();
})();

(function(){
 const HISTORY_KEY='emViewedJobsV1',VISIT_KEY='emLastVisitV1',SESSION_KEY='emVisitBaselineV1';
 function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v===null?fallback:v;}catch(e){return fallback;}}
 function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}}
 function publicationTime(v){const raw=v.dataPublicacao||v.criadoEm||v.dataCriacao||'';const n=new Date(raw).getTime();return Number.isFinite(n)?n:0;}
 function upsertHistory(list,id,time){return [{id:String(id),viewedAt:time}].concat(list.filter(x=>x&&String(x.id)!==String(id))).slice(0,12);}
 let baseline=0;
 try{const stored=sessionStorage.getItem(SESSION_KEY);baseline=stored===null?Number(read(VISIT_KEY,0)):Number(stored);if(!Number.isFinite(baseline)||baseline<0)baseline=0;sessionStorage.setItem(SESSION_KEY,String(baseline));}catch(e){baseline=Number(read(VISIT_KEY,0))||0;}
 save(VISIT_KEY,Date.now());
 window.addEventListener('pagehide',()=>save(VISIT_KEY,Date.now()));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save(VISIT_KEY,Date.now());});
 let refreshUI=function(){};
 function publicJobs(){try{return typeof window.todasAsVagasPublicas==='function'?(window.todasAsVagasPublicas()||[]):[];}catch(e){return [];}}
 function remember(id){if(id===undefined||id===null||id==='')return;const job=publicJobs().find(v=>String(v.id)===String(id));if(!job)return;const list=read(HISTORY_KEY,[]);const safe=Array.isArray(list)?list:[];save(HISTORY_KEY,upsertHistory(safe,id,Date.now()));refreshUI();}
 function setup(){
  const list=document.getElementById('listaVagas');if(!list||document.getElementById('emVisitorTools'))return;
  const root=document.createElement('section');root.id='emVisitorTools';root.setAttribute('aria-label','Sua busca por vagas');
  const recent=document.createElement('section');recent.className='em-visitor-recent';recent.hidden=true;
  const recentHead=document.createElement('div');recentHead.className='em-visitor-head';const recentTitle=document.createElement('h3');recentTitle.textContent='Vagas vistas recentemente';
  const clear=document.createElement('button');clear.type='button';clear.className='em-visitor-link';clear.textContent='Limpar histórico';recentHead.append(recentTitle,clear);
  const recentGrid=document.createElement('div');recentGrid.className='em-visitor-grid';recent.append(recentHead,recentGrid);
  const news=document.createElement('section');news.className='em-visitor-news';news.hidden=true;
  const newsHead=document.createElement('div');newsHead.className='em-visitor-head';const newsText=document.createElement('p');
  const toggle=document.createElement('button');toggle.type='button';toggle.className='em-visitor-link';toggle.textContent='Ver novas vagas';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','emNewVisitJobs');
  newsHead.append(newsText,toggle);const newsGrid=document.createElement('div');newsGrid.id='emNewVisitJobs';newsGrid.className='em-visitor-grid em-visitor-news-grid';newsGrid.hidden=true;news.append(newsHead,newsGrid);root.append(news,recent);list.before(root);
  let expanded=false;
  function link(job){
   const a=document.createElement('a');a.className='em-visitor-job';a.href='?pagina=vaga&id='+encodeURIComponent(job.id);
   const title=document.createElement('strong');title.textContent=job.cargo||job.titulo||'Ver oportunidade';
   const meta=document.createElement('span');let confidential=false;try{confidential=typeof window.vagaEhConfidencialEM==='function'&&window.vagaEhConfidencialEM(job);}catch(e){}
   meta.textContent=[confidential?'Empresa confidencial':(job.empresa||job.nomeEmpresa||''),job.cidade||job.localizacao||''].filter(Boolean).join(' · ');
   a.append(title,meta);a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;if(typeof window.irPara==='function'){e.preventDefault();remember(job.id);window.irPara('vaga',job.id);}});return a;
  }
  let signature='';
  function render(force){
   const jobs=publicJobs(),byId=new Map(jobs.map(v=>[String(v.id),v]));
   const history=read(HISTORY_KEY,[]),viewed=(Array.isArray(history)?history:[]).map(x=>byId.get(String(x.id))).filter(Boolean).slice(0,2);
   const now=Date.now(),fresh=baseline>0?jobs.filter(v=>publicationTime(v)>baseline&&publicationTime(v)<=now).sort((a,b)=>publicationTime(b)-publicationTime(a)):[];
   const sig=JSON.stringify([viewed.map(v=>[v.id,v.cargo,v.titulo,v.empresa,v.cidade]),fresh.map(v=>[v.id,v.cargo,v.titulo]),expanded]);
   if(!force&&sig===signature)return;signature=sig;
   recent.hidden=viewed.length===0;recentGrid.replaceChildren(...viewed.map(link));
   news.hidden=fresh.length===0;newsText.textContent=fresh.length===1?'1 nova vaga desde sua última visita':fresh.length+' novas vagas desde sua última visita';
   toggle.textContent=expanded?'Ocultar novas vagas':'Ver novas vagas';toggle.setAttribute('aria-expanded',String(expanded));newsGrid.hidden=!expanded;newsGrid.replaceChildren(...(expanded?fresh.map(link):[]));
   root.hidden=news.hidden&&(!root.contains(recent)||recent.hidden);
  }
  refreshUI=()=>render(false);clear.addEventListener('click',()=>{save(HISTORY_KEY,[]);render(true);});toggle.addEventListener('click',()=>{expanded=!expanded;render(true);});
  const original=window.abrirVaga;if(typeof original==='function')window.abrirVaga=function(id){const result=original.apply(this,arguments);remember(id);return result;};
  function trackRoute(){const p=new URLSearchParams(location.search);if(p.get('pagina')==='vaga'&&p.get('id')){const history=read(HISTORY_KEY,[]);if(!Array.isArray(history)||!history[0]||String(history[0].id)!==p.get('id'))remember(p.get('id'));}render(false);}
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;trackRoute();},80);}).observe(list,{childList:true,subtree:true});
  window.addEventListener('popstate',trackRoute);window.addEventListener('load',trackRoute);window.addEventListener('storage',()=>render(true));trackRoute();
  const style=document.createElement('style');style.textContent=`
#emVisitorTools{margin:0 0 18px!important;display:grid;gap:14px;min-width:0}
#emVisitorTools .em-visitor-recent{border:1px solid #e1e8f1;border-radius:10px;background:#fff;padding:16px}
#emVisitorTools .em-visitor-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px}
#emVisitorTools h3{margin:0;font-size:14px;color:#183b5f;line-height:1.4;font-weight:700}
#emVisitorTools .em-visitor-link{border:0;background:transparent;padding:3px 0;color:#1768b4;font-size:11px;cursor:pointer;white-space:nowrap}
#emVisitorTools .em-visitor-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
#emVisitorTools .em-visitor-job{display:block;text-decoration:none;border:1px solid #e3ebf4;border-radius:8px;padding:12px;background:#fff;min-width:0}
#emVisitorTools .em-visitor-job:hover{border-color:#9fc3e6;background:#f8fbff}
#emVisitorTools .em-visitor-job strong{display:block;font-size:12px;font-weight:600;line-height:1.4;color:#23445f;margin:0 0 5px;overflow-wrap:anywhere}
#emVisitorTools .em-visitor-job span{display:block;font-size:10px;line-height:1.5;color:#7b8c9c;overflow-wrap:anywhere}
#emVisitorTools .em-visitor-news{background:#edf6ff;border:1px solid #d6e8fb;border-radius:9px;padding:12px 16px}
#emVisitorTools .em-visitor-news .em-visitor-head{margin-bottom:0}
#emVisitorTools .em-visitor-news p{margin:0;font-size:12px;line-height:1.5;color:#245b90;font-weight:600}
#emVisitorTools .em-visitor-news-grid{margin-top:12px}
#emVisitorTools[hidden],#emVisitorTools [hidden]{display:none!important}
@media(max-width:700px){#emVisitorTools .em-visitor-grid{grid-template-columns:1fr}#emVisitorTools .em-visitor-head{align-items:flex-start}#emVisitorTools .em-visitor-recent{padding:14px}#emVisitorTools .em-visitor-news .em-visitor-head{flex-wrap:wrap}}
`;document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

(function(){
 function alignRecentHeader(){
  const style=document.createElement('style');style.id='em-recent-header-left';
  style.textContent=`
#pagina-home #vagas#vagas#vagas .em-recentes-blue-band{padding-left:16px!important;padding-right:16px!important;text-align:left!important}
#pagina-home #vagas#vagas#vagas .em-recentes-centered{display:block!important;position:static!important;transform:none!important;text-align:left!important;align-items:flex-start!important;justify-content:flex-start!important;width:100%!important;max-width:none!important;margin:0 0 16px!important;padding:0!important}
#pagina-home #vagas#vagas#vagas .em-recentes-centered h2,#pagina-home #vagas#vagas#vagas .em-recentes-centered p,#pagina-home #vagas#vagas#vagas .em-recentes-kicker{text-align:left!important;margin-left:0!important;margin-right:0!important}
#pagina-home #vagas#vagas#vagas .em-recentes-blue-band .filtros-chips-home{display:flex!important;justify-content:flex-start!important;align-items:center!important;text-align:left!important;margin-left:0!important;margin-right:0!important;padding-left:0!important;padding-right:0!important}
@media(max-width:600px){#pagina-home #vagas#vagas#vagas .em-recentes-blue-band{padding-left:14px!important;padding-right:14px!important}}
`;document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alignRecentHeader);else alignRecentHeader();
})();

(function(){
 function arrangeHeader(){
  const band=document.querySelector('#vagas .em-recentes-blue-band'),history=document.querySelector('#emVisitorTools .em-visitor-recent');if(!band||!history)return;
  const title=band.querySelector('.em-recentes-centered'),filters=band.querySelector('.filtros-chips-home');if(!title||!filters)return;
  const left=document.createElement('div');left.className='em-recent-header-main';band.insertBefore(left,band.firstChild);left.append(title,filters);
  history.id='emRecentHeaderHistory';band.appendChild(history);band.classList.add('em-recent-split-header');
  function sync(){band.classList.toggle('em-header-has-history',!history.hidden);const root=document.getElementById('emVisitorTools');if(root){const news=root.querySelector('.em-visitor-news');root.hidden=!news||news.hidden;}}
  new MutationObserver(sync).observe(history,{attributes:true,attributeFilter:['hidden']});sync();
  const style=document.createElement('style');style.textContent=`
#pagina-home #vagas#vagas#vagas .em-recent-split-header{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:24px!important;align-items:start!important;padding:20px 16px!important}
#pagina-home #vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1fr) 300px!important}
#pagina-home #vagas#vagas#vagas .em-recent-header-main{min-width:0!important;text-align:left!important}
#pagina-home #vagas#vagas#vagas .em-recent-header-main .em-recentes-centered{display:block!important;text-align:left!important;margin:0 0 18px!important;padding:0!important;max-width:none!important}
#pagina-home #vagas#vagas#vagas .em-recent-header-main .em-recentes-centered h2{font-size:26px!important;line-height:1.25!important}
#pagina-home #vagas#vagas#vagas .em-recent-header-main .filtros-chips-home{justify-content:flex-start!important;flex-wrap:wrap!important;gap:8px!important}
#emRecentHeaderHistory{box-sizing:border-box;width:100%;min-width:0;border:1px solid #dbe7f2;border-radius:10px;background:#fff;padding:12px}
#emRecentHeaderHistory .em-visitor-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 10px}
#emRecentHeaderHistory h3{font-size:12px;line-height:1.4;font-weight:700;color:#173b60;margin:0}
#emRecentHeaderHistory .em-visitor-link{border:0;background:transparent;color:#1768b4;font-size:10px;padding:0;cursor:pointer;white-space:nowrap}
#emRecentHeaderHistory .em-visitor-grid{display:grid;grid-template-columns:1fr;gap:6px}
#emRecentHeaderHistory .em-visitor-job{display:block;min-width:0;border:1px solid #e5edf5;border-radius:6px;padding:7px 9px;background:#fff;text-decoration:none}
#emRecentHeaderHistory .em-visitor-job strong{display:block;font-size:11px;line-height:1.4;font-weight:600;color:#234663;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0 0 2px}
#emRecentHeaderHistory .em-visitor-job span{display:block;font-size:9px;line-height:1.4;color:#8293a3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#emRecentHeaderHistory .em-visitor-job:hover{border-color:#accce9;background:#f7fbff}
#emRecentHeaderHistory[hidden]{display:none!important}
@media(max-width:900px){#pagina-home #vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1fr) 260px!important;gap:16px!important}}
@media(max-width:700px){#pagina-home #vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:1fr!important}#pagina-home #vagas#vagas#vagas .em-recent-split-header{gap:16px!important;padding:18px 14px!important}#emRecentHeaderHistory .em-visitor-grid{grid-template-columns:1fr!important}}
`;document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangeHeader);else arrangeHeader();
})();

(function(){
 function polishRecentPanel(){
  const band=document.querySelector('#vagas .em-recentes-blue-band'),title=band&&band.querySelector('.em-recentes-centered'),history=document.getElementById('emRecentHeaderHistory');if(!band||!title)return;
  const left=band.querySelector('.em-recent-header-main');
  [left,title].concat(Array.from(title.querySelectorAll('h2,p,span'))).filter(Boolean).forEach(node=>{node.style.setProperty('text-align','left','important');node.style.setProperty('margin-left','0','important');node.style.setProperty('margin-right','0','important');});
  title.style.setProperty('display','block','important');title.style.setProperty('align-items','flex-start','important');
  const h2=title.querySelector('h2');if(h2){h2.style.setProperty('width','100%','important');h2.style.setProperty('font-size','27px','important');}
  if(history){const heading=history.querySelector('h3');if(heading&&!heading.querySelector('svg')){const clock=document.createElementNS('http://www.w3.org/2000/svg','svg');clock.setAttribute('viewBox','0 0 24 24');clock.setAttribute('aria-hidden','true');clock.innerHTML='<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';heading.prepend(clock);}const clear=history.querySelector('.em-visitor-link');if(clear){clear.textContent='Limpar histórico';clear.setAttribute('aria-label','Limpar histórico de vagas vistas');}}
  const style=document.createElement('style');style.textContent=`
#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header{background:#f5f9fe!important;background-image:none!important;border:1px solid #e4ecf5!important;border-radius:12px!important;padding:24px!important;gap:24px!important;align-items:center!important;overflow:hidden!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header:before,#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header:after{display:none!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1fr) 360px!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recentes-kicker{font-size:10px!important;font-weight:600!important;letter-spacing:1.1px!important;color:#1768b4!important;display:block!important;margin:0 0 9px!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recentes-centered h2{color:#15334f!important;line-height:1.25!important;font-weight:700!important;margin:0 0 10px!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recentes-centered p{font-size:13px!important;line-height:1.6!important;color:#728397!important;margin:0!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recent-header-main .em-recentes-centered{margin-bottom:22px!important;border:0!important}
#pagina-home #vagas#vagas#vagas#vagas .em-recent-header-main .filtros-chips-home{border:0!important;padding:0!important;margin:0!important;gap:8px!important}
#pagina-home #vagas#vagas#vagas#vagas .filtro-chip-home{min-height:36px!important;padding:8px 13px!important;border-radius:8px!important;background:#fff!important;border:1px solid #d7e2ef!important;color:#264764!important;font-size:11px!important;font-weight:500!important;box-shadow:none!important}
#pagina-home #vagas#vagas#vagas#vagas .filtro-chip-home.ativo{background:#1768b4!important;border-color:#1768b4!important;color:#fff!important;font-weight:600!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory{padding:16px!important;border:1px solid #e0e8f2!important;border-radius:10px!important;background:#fff!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-head{margin:0 0 12px!important;align-items:center!important;gap:12px!important}
#emRecentHeaderHistory#emRecentHeaderHistory h3{display:flex!important;align-items:center!important;gap:8px!important;font-size:12px!important;line-height:1.4!important;color:#173b60!important;font-weight:600!important;margin:0!important}
#emRecentHeaderHistory#emRecentHeaderHistory h3 svg{width:21px;height:21px;flex-shrink:0}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-link{font-size:11px!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-grid{gap:0!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job{position:relative!important;border:0!important;border-bottom:1px solid #edf1f6!important;border-radius:0!important;background:#fff!important;padding:10px 20px 10px 0!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:last-child{border-bottom:0!important;padding-bottom:0!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:after{content:'›';position:absolute;right:0;top:50%;transform:translateY(-50%);font-size:22px;color:#5a7896}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job strong{font-size:12px!important;line-height:1.4!important;font-weight:600!important;margin:0 0 4px!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job span{font-size:10px!important;line-height:1.4!important;color:#8493a3!important}
#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:hover strong{color:#1768b4!important}
@media(max-width:1000px){#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1fr) 310px!important;gap:18px!important}}
@media(max-width:700px){#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:1fr!important}#pagina-home #vagas#vagas#vagas#vagas .em-recent-split-header{padding:18px 16px!important}#pagina-home #vagas#vagas#vagas#vagas .em-recentes-centered h2{font-size:24px!important}}
`;document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polishRecentPanel);else polishRecentPanel();
})();

(function(){
 function finalizeRecentDesign(){
  const band=document.querySelector('#vagas .em-recentes-blue-band'),left=band&&band.querySelector('.em-recent-header-main');if(!left)return;
  const old=left.querySelector('.em-recentes-centered');
  const title=document.createElement('header');title.className='em-recent-title-final';
  title.innerHTML='<h2>Vagas recentes</h2><p>Confira as últimas oportunidades publicadas</p>';
  const filters=left.querySelector('.filtros-chips-home');
  if(filters){const buttons=Array.from(filters.querySelectorAll('button'));['Todas','Presencial','Híbrido','Remoto','Mais filtros'].forEach(label=>{const button=buttons.find(b=>b.textContent.trim()===label);if(button)filters.appendChild(button);});buttons.filter(b=>['CLT','Estágio'].includes(b.textContent.trim())).forEach(b=>b.remove());const more=filters.querySelector('.filtro-chip-mais');if(more)more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></svg><span>Mais filtros</span>';}title.querySelector('h2').style.setProperty('text-align','left','important');
  if(old)old.replaceWith(title);else left.prepend(title);
  const history=document.getElementById('emRecentHeaderHistory');
  if(history){const heading=history.querySelector('h3');if(heading){Array.from(heading.childNodes).filter(n=>n.nodeType===3).forEach(n=>n.textContent='Vistas recentemente');}}
  const style=document.createElement('style');style.id='em-recent-reference-final';style.textContent=`
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-split-header{background:#f5f9fe!important;background-image:none!important;display:grid!important;align-items:center!important;padding:18px 22px!important;gap:20px!important;min-height:0!important;border:1px solid #e0e8f2!important;border-radius:12px!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1.8fr) minmax(340px,1fr)!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-header-main{display:block!important;min-width:0!important;text-align:left!important;padding:0 24px 0 0!important;border-right:1px solid #e0e8f2!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final{display:block!important;position:static!important;width:100%!important;margin:0 0 16px!important;padding:0!important;background:none!important;text-align:left!important;border:0!important;transform:none!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final>span{display:block!important;text-align:left!important;color:#1768b4!important;font:600 11px/1.5 Inter,Arial,sans-serif!important;letter-spacing:.5px!important;margin:0 0 6px!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final>h2{display:block!important;text-align:left!important;color:#122e4d!important;font:700 30px/1.2 Inter,Arial,sans-serif!important;letter-spacing:-.6px!important;margin:0 0 7px!important;padding:0!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final>p{display:block!important;text-align:left!important;color:#71839a!important;font:400 14px/1.45 Inter,Arial,sans-serif!important;margin:0!important;padding:0!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .filtros-chips-home{display:flex!important;justify-content:flex-start!important;gap:8px!important;flex-wrap:wrap!important;background:none!important;border:0!important;margin:0!important;padding:0!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas .filtro-chip-home{height:36px!important;min-height:36px!important;padding:0 13px!important;border-radius:8px!important;font:500 12px/1 Inter,Arial,sans-serif!important;border:1px solid #d3e0ee!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory{padding:12px 16px!important;min-height:0!important;background:#fff!important;border-radius:11px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-head{margin:0 0 8px!important;gap:10px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory h3{font:600 14px/1.4 Inter,Arial,sans-serif!important;gap:10px!important;white-space:nowrap!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory h3 svg{width:24px!important;height:24px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-link{font-size:12px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job{padding:9px 22px 9px 0!important;border:0!important;border-bottom:1px solid #e8edf3!important;box-shadow:none!important;outline:0!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:last-child{border-bottom:0!important;padding-bottom:3px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:focus-visible{outline:2px solid #1768b4!important;outline-offset:2px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job strong{font:600 14px/1.4 Inter,Arial,sans-serif!important;margin-bottom:3px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job span{font:400 11px/1.5 Inter,Arial,sans-serif!important}
@media(max-width:1100px){#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1.6fr) minmax(300px,1fr)!important}#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory h3{font-size:12px!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final>h2{font-size:30px!important}}
@media(max-width:800px){#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:1fr!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-header-main{border-right:0!important;padding-right:0!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-split-header{padding:20px!important;min-height:0!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final{margin-bottom:20px!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final>h2{font-size:28px!important}}
`;document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',finalizeRecentDesign);else finalizeRecentDesign();
})();

(function(){
 function alignTitles(){
  document.querySelectorAll('#emDestV14 .copy,#emDestV14 h2,#emDestV14 p,#emDestV14 .eyebrow,#vagas .em-recent-title-final,#vagas .em-recent-title-final h2').forEach(function(el){el.style.setProperty('text-align','left','important');el.style.setProperty('justify-content','flex-start','important');});
  var style=document.createElement('style');style.textContent='#pagina-home #emDestV14#emDestV14 .copy,#pagina-home #emDestV14#emDestV14 h2,#pagina-home #emDestV14#emDestV14 p{text-align:left!important;margin-left:0!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final{margin-bottom:16px!important}#pagina-home #vagas#vagas#vagas#vagas#vagas .em-recent-title-final h2{text-align:left!important;margin:0!important}';document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alignTitles,{once:true});else alignTitles();
 window.addEventListener('load',alignTitles,{once:true});
})();

(function(){
 function compactHistory(){
  var style=document.createElement('style');style.id='em-history-two-compact';style.textContent=`
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory{padding:10px 14px!important;min-height:0!important;height:auto!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-head{margin-bottom:6px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job{padding:7px 20px 7px 0!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job:last-child{padding-bottom:0!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job strong{margin-bottom:2px!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-split-header{min-height:0!important;padding-top:14px!important;padding-bottom:14px!important}

#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-split-header{background:#fff!important;border-color:#e1e7ef!important;box-shadow:0 3px 16px #17324e06!important;padding:22px 24px!important;gap:26px!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:minmax(0,1.55fr) minmax(340px,1fr)!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-title-final{margin-bottom:20px!important;background:transparent!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-title-final h2{font-size:27px!important;margin:0 0 7px!important;background:transparent!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-title-final p{font-size:13px!important;color:#71839a!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .filtro-chip-home{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;height:38px!important;padding:0 16px!important;background:#fff!important;color:#25435f!important;border-color:#dce5ef!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .filtro-chip-home.ativo{background:#0875ee!important;border-color:#0875ee!important;color:white!important}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .filtro-chip-mais svg{width:17px;height:17px;fill:white;stroke:currentColor;stroke-width:1.7}
#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .filtro-chip-home:focus-visible{outline:2px solid #0875ee!important;outline-offset:3px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory{padding:0!important;border:0!important;background:transparent!important;border-radius:0!important;box-shadow:none!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-head{margin-bottom:8px!important;flex-wrap:wrap!important;gap:8px!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory h3{font-size:13px!important;white-space:normal!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-link{font-size:11px!important;white-space:nowrap!important}
#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory .em-visitor-job strong{font-size:13px!important}
@media(max-width:900px){#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-split-header.em-header-has-history{grid-template-columns:1fr!important}#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-header-main{border-right:0!important;padding-right:0!important}#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory#emRecentHeaderHistory{border-top:1px solid #e4ebf3!important;padding-top:18px!important}}
@media(max-width:560px){#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-split-header{padding:18px 16px!important;gap:18px!important}#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .em-recent-title-final h2{font-size:24px!important}#pagina-home #vagas#vagas#vagas#vagas#vagas#vagas .filtro-chip-home{padding:0 12px!important}}
`;document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',compactHistory,{once:true});else compactHistory();
})();

(function(){
 function setupProfessionalFilters(){
  var panel=document.getElementById('filtrosLateral');if(!panel||panel.dataset.professionalForm)return;panel.dataset.professionalForm='true';
  var ids=['filtroPalavra','filtroCidade','filtroSalario','filtroArea','filtroContrato','filtroPcd','filtroModalidade'],fields={};
  ids.forEach(function(id){var old=document.getElementById(id);if(old){var field=old.cloneNode(true);field.removeAttribute('oninput');field.removeAttribute('onchange');field.value=old.value;field.removeAttribute('style');fields[id]=field;}});
  if(ids.some(function(id){return !fields[id];}))return;
  panel.replaceChildren();
  var head=document.createElement('div');head.className='em-filter-heading';head.innerHTML='<h3>Filtrar vagas</h3><button class="limpar-link" type="button">Limpar</button>';panel.appendChild(head);
  var form=document.createElement('form');form.id='emProfessionalFiltersForm';form.dataset.semLoading='1';panel.appendChild(form);
  function group(label,field){var box=document.createElement('div');box.className='em-filter-group';var l=document.createElement('label');l.htmlFor=field.id;l.textContent=label;box.append(l,field);form.appendChild(box);return box;}
  fields.filtroPalavra.placeholder='Ex.: Assistente administrativo';group('Cargo ou empresa',fields.filtroPalavra);
  fields.filtroCidade.placeholder='Cidade';group('Localização',fields.filtroCidade);
  var cep=document.createElement('input');cep.id='emFilterCep';cep.className='campo';cep.placeholder='CEP para buscar por distância';cep.inputMode='numeric';cep.maxLength=9;group('CEP',cep);cep.oninput=function(){this.value=window.mascaraCepEM?window.mascaraCepEM(this.value):this.value;};
  var radius=document.createElement('select');radius.id='emFilterDistance';radius.className='campo';radius.innerHTML='<option value="5">Até 5 km</option><option value="10" selected>Até 10 km</option><option value="25">Até 25 km</option><option value="50">Até 50 km</option><option value="0">Qualquer distância</option>';group('Distância',radius);
  group('Salário mínimo',fields.filtroSalario);
  var areaBox=group('Área profissional',fields.filtroArea),areaSearch=document.createElement('input');areaSearch.type='search';areaSearch.placeholder='Buscar área';areaSearch.setAttribute('aria-label','Buscar área profissional');areaSearch.className='campo';areaBox.insertBefore(areaSearch,fields.filtroArea);
  var areaOptions=Array.from(fields.filtroArea.options).map(function(o){return {value:o.value,text:o.textContent};});
  areaSearch.oninput=function(){var current=fields.filtroArea.value,q=this.value.toLocaleLowerCase('pt-BR');fields.filtroArea.replaceChildren();areaOptions.filter(function(o){return !o.value||o.value===current||o.text.toLocaleLowerCase('pt-BR').includes(q);}).forEach(function(o){var option=new Option(o.text,o.value);fields.filtroArea.add(option);});fields.filtroArea.value=current;};
  var mode=group('Modalidade',fields.filtroModalidade);fields.filtroModalidade.hidden=true;var chips=document.createElement('div');chips.className='em-filter-modes';['Presencial','Híbrido','Remoto'].forEach(function(value){var button=document.createElement('button');button.type='button';button.textContent=value;button.setAttribute('aria-pressed',String(fields.filtroModalidade.value===value));button.onclick=function(){fields.filtroModalidade.value=fields.filtroModalidade.value===value?'':value;syncModes();};chips.appendChild(button);});mode.appendChild(chips);
  function syncModes(){chips.querySelectorAll('button').forEach(function(btn){btn.setAttribute('aria-pressed',String(btn.textContent===fields.filtroModalidade.value));});}
  group('Tipo de contrato',fields.filtroContrato);
  group('Vagas para PcD',fields.filtroPcd);
  var salaryOnly=document.createElement('label');salaryOnly.className='em-filter-checkbox';salaryOnly.innerHTML='<input type="checkbox" id="emFilterSalaryKnown"><span>Somente vagas com salário informado</span>';form.appendChild(salaryOnly);
  var submit=document.createElement('button');submit.type='submit';submit.className='em-filter-apply';submit.textContent='Aplicar filtros';submit.dataset.semLoading='1';form.appendChild(submit);
  var feedback=document.createElement('p');feedback.className='em-filter-feedback';feedback.setAttribute('role','status');feedback.textContent='Escolha os filtros e clique em aplicar.';form.appendChild(feedback);
  var original=window.filtrarVagas;
  if(typeof original==='function')window.filtrarVagas=function(){
   var result=original.apply(this,arguments);syncModes();
   if(document.getElementById('emFilterSalaryKnown').checked)document.querySelectorAll('#listaVagas .vaga-card').forEach(function(card){if(!(Number(card.getAttribute('data-salario'))>0))card.style.display='none';});
   return result;
  };
  form.onsubmit=function(event){event.preventDefault();window.filtrarVagas();var value=cep.value.replace(/\D/g,'');
   if(value){if(value.length!==8){feedback.textContent='Digite um CEP com 8 números.';return;}document.getElementById('emPertoCep').value=cep.value;document.getElementById('emPertoRaio').value=radius.value;document.getElementById('emPertoForm').requestSubmit();feedback.textContent='Filtros aplicados. Consulte o resultado da distância acima das vagas.';}
   else feedback.textContent='Filtros aplicados.';
  };
  head.querySelector('button').onclick=function(){ids.forEach(function(id){fields[id].value='';});areaSearch.value='';areaSearch.oninput();cep.value='';radius.value='10';document.getElementById('emFilterSalaryKnown').checked=false;var clear=document.getElementById('emPertoLimpar');if(clear)clear.click();syncModes();window.filtrarVagas();feedback.textContent='Filtros removidos.';};
  var style=document.createElement('style');style.textContent=`
html body #pagina-home#pagina-home #filtrosLateral#filtrosLateral{padding:20px!important;background:#fff!important;border:1px solid #dce5ef!important;border-radius:12px!important;overflow:visible!important;max-height:none!important}
#filtrosLateral#filtrosLateral .em-filter-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:20px}
#filtrosLateral#filtrosLateral .em-filter-heading h3{margin:0;font-size:20px;color:#173553}
#filtrosLateral#filtrosLateral .limpar-link{font-size:12px;border:0;background:none;color:#0875ee;cursor:pointer}
#filtrosLateral#filtrosLateral .em-filter-group{margin:0 0 16px!important;padding:0!important}
#filtrosLateral#filtrosLateral .em-filter-group>label{display:block!important;font-size:12px!important;font-weight:600!important;color:#193653!important;margin:0 0 7px!important}
#filtrosLateral#filtrosLateral .campo{box-sizing:border-box!important;display:block!important;position:static!important;opacity:1!important;width:100%!important;height:40px!important;min-height:40px!important;max-height:none!important;margin:0!important;padding:0 10px!important;background:#fff!important;border:1px solid #d4dfeb!important;border-radius:7px!important;font-size:12px!important;color:#304c69!important;appearance:auto!important}
#filtrosLateral#filtrosLateral .campo[hidden]{display:none!important}
#filtrosLateral#filtrosLateral input[type=search]{margin-bottom:7px!important}
#filtrosLateral#filtrosLateral .em-filter-modes{display:flex;gap:5px}
#filtrosLateral#filtrosLateral .em-filter-modes button{flex:1;padding:10px 4px;border:1px solid #d4dfeb;border-radius:6px;background:#fff;color:#304c69;font-size:11px;cursor:pointer}
#filtrosLateral#filtrosLateral .em-filter-modes button[aria-pressed=true]{border-color:#0875ee;background:#edf6ff;color:#0875ee}
#filtrosLateral#filtrosLateral .em-filter-checkbox{display:flex;align-items:flex-start;gap:8px;font-size:11px;color:#304c69;margin:18px 0}
#filtrosLateral#filtrosLateral .em-filter-checkbox input{appearance:auto!important;position:static!important;opacity:1!important;width:16px!important;height:16px!important;min-height:0!important;margin:0!important;accent-color:#0875ee}
#filtrosLateral#filtrosLateral .em-filter-apply{display:block;width:100%;min-height:42px;border:0;border-radius:7px;background:#0875ee;color:#fff;font-size:13px;font-weight:600;cursor:pointer}
#filtrosLateral#filtrosLateral .em-filter-feedback{font-size:10px;line-height:1.5;color:#728398;margin:10px 0 0}
#filtrosLateral#filtrosLateral :is(input,select,button):focus-visible{outline:2px solid #0875ee;outline-offset:2px}
`;document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupProfessionalFilters,{once:true});else setupProfessionalFilters();
})();

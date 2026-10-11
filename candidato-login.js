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

(function(){
'use strict';
function init(){
 const form=document.getElementById('formCadastroEmpresaInicial');
 if(!form||form.dataset.etapas)return;
 form.dataset.etapas='true';form.noValidate=true;
 const sections=Array.from(form.querySelectorAll('.reg-section'));
 const submit=form.querySelector('[type="submit"]'),notice=form.querySelector('.reg-next');
 let current=0;
 const progress=document.createElement('ol');progress.className='reg-progress';progress.setAttribute('aria-label','Etapas do cadastro');
 ['Empresa','Endereço','Responsável'].forEach((title,i)=>{const li=document.createElement('li');li.innerHTML='<span>'+(i+1)+'</span><strong>'+title+'</strong>';progress.appendChild(li);});
 form.prepend(progress);
 const status=document.createElement('p');status.className='reg-step-status';status.setAttribute('aria-live','polite');progress.after(status);
 const actions=document.createElement('div');actions.className='reg-step-actions';
 const back=document.createElement('button');back.type='button';back.className='btn reg-step-back';back.textContent='Voltar';
 const next=document.createElement('button');next.type='button';next.className='btn btn-empresa';next.textContent='Continuar →';
 form.appendChild(actions);actions.append(back,next,submit);
 function show(step,focus){current=step;sections.forEach((s,i)=>{s.hidden=i!==step;});Array.from(progress.children).forEach((li,i)=>{li.classList.toggle('active',i===step);li.classList.toggle('complete',i<step);if(i===step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});back.hidden=step===0;next.hidden=step===2;submit.hidden=step!==2;if(notice)notice.hidden=step!==2;status.textContent='Etapa '+(step+1)+' de 3';if(focus){const heading=sections[step].querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}}
 function validate(step){const inputs=Array.from(sections[step].querySelectorAll('input,select,textarea'));const cnpj=document.getElementById('cadEmpresaCnpj');cnpj.setCustomValidity(cnpj.value.replace(/\D/g,'').length===14?'':'Informe um CNPJ com 14 números.');const confirm=document.getElementById('cadEmpresaConfirmar');confirm.setCustomValidity(confirm.value===document.getElementById('cadEmpresaSenha').value?'':'As senhas precisam ser iguais.');for(const input of inputs){if(!input.checkValidity()){show(step,false);input.reportValidity();return false;}}return true;}
 back.addEventListener('click',()=>show(Math.max(0,current-1),true));
 next.addEventListener('click',()=>{if(validate(current))show(current+1,true);});
 form.addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');if(e.target.id==='cadEmpresaSenha')document.getElementById('cadEmpresaConfirmar').setCustomValidity('');});
 form.addEventListener('submit',e=>{if(current<2){e.preventDefault();e.stopImmediatePropagation();if(validate(current))show(current+1,true);return;}for(let i=0;i<3;i++){if(!validate(i)){e.preventDefault();e.stopImmediatePropagation();return;}}},true);
 show(0,false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
(function(){
 function setupBlue(){
  const page=document.getElementById('pagina-login-empresa'),layout=page&&page.querySelector('.portal-empresa-grid-em'),form=document.getElementById('formCadastroEmpresaProfissionalEM');
  if(!layout||!form||page.dataset.bluePanel)return;page.dataset.bluePanel='1';
  const login=layout.querySelector('.portal-login-card-em'),card=layout.querySelector('.portal-cadastro-card-em');
  const sidebar=document.createElement('aside');sidebar.className='company-solid-sidebar';sidebar.innerHTML='<h1>Área da<br>empresa</h1><svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 44V5h24v39M32 19h8v25M4 44h40M15 13h10M15 22h10M15 31h10"/></svg><ul><li>Publique suas vagas</li><li>Gerencie candidaturas</li><li>Atualize o perfil da empresa</li></ul>';layout.prepend(sidebar);
  login.querySelector('h2').textContent='Acesse sua conta';
  card.replaceChildren();const heading=document.createElement('h2');heading.textContent='Cadastre sua empresa';card.append(heading,form);
  const grid=form.querySelector('.cadastro-modal-grid-em'),sections=[];
  const groups=[['cadEmpresaNomeEM','cadEmpresaCnpjEM','cadEmpresaSetorEM','cadEmpresaFuncionariosEM','cadEmpresaSobreEM'],['cadEmpresaTelefoneEM','cadEmpresaTelefoneFixoEM','cadEmpresaCepEM','cadEmpresaCidadeEM','cadEmpresaUfEM'],['cadEmpresaResponsavelEM','cadEmpresaCpfEM','cadEmpresaCargoEM','cadEmpresaEmailEM','cadEmpresaSenhaEM','cadEmpresaConfirmarSenhaEM']];
  const titles=['Empresa','Contato e endereço','Responsável'];
  const progress=document.createElement('ol');progress.className='company-blue-progress';progress.setAttribute('aria-label','Etapas do cadastro');titles.forEach((t,i)=>{const li=document.createElement('li');li.textContent=(i+1)+'. '+t;progress.append(li);});form.prepend(progress);
  groups.forEach((ids,i)=>{const section=document.createElement('section');section.className='company-blue-fields';section.setAttribute('aria-label',titles[i]);ids.forEach(id=>section.append(document.getElementById(id).closest('.grupo')));grid.append(section);sections.push(section);});
  const terms=form.querySelector('.cadastro-modal-termos-em'),actions=form.querySelector('.cadastro-modal-acoes-em'),submit=actions.querySelector('.portal-btn-principal-em');actions.querySelector('.cadastro-modal-cancelar-em').remove();
  actions.className='company-blue-actions';actions.hidden=false;
  const back=document.createElement('button');back.type='button';back.className='company-blue-back';back.textContent='Voltar';
  const next=document.createElement('button');next.type='button';next.className='portal-btn-principal-em';next.textContent='Continuar →';actions.prepend(back,next);
  let step=0;
  function show(i){step=i;sections.forEach((s,n)=>s.hidden=n!==i);Array.from(progress.children).forEach((li,n)=>{li.classList.toggle('active',n===i);if(n===i)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});back.hidden=i===0;next.hidden=i===2;submit.hidden=i!==2;terms.hidden=i!==2;actions.hidden=false;actions.style.setProperty('display','flex','important');back.style.setProperty('display',i===0?'none':'inline-flex','important');next.style.setProperty('display',i===2?'none':'inline-flex','important');submit.style.setProperty('display',i===2?'inline-flex':'none','important');}
  function valid(i){const fields=Array.from(sections[i].querySelectorAll('input,select,textarea'));if(i===0){const c=document.getElementById('cadEmpresaCnpjEM');c.setCustomValidity(c.value.replace(/\D/g,'').length===14?'':'Informe um CNPJ com 14 números.');}if(i===2){const c=document.getElementById('cadEmpresaCpfEM');c.setCustomValidity(c.value.replace(/\D/g,'').length===11?'':'Informe um CPF com 11 números.');const p=document.getElementById('cadEmpresaConfirmarSenhaEM');p.setCustomValidity(p.value===document.getElementById('cadEmpresaSenhaEM').value?'':'As senhas precisam ser iguais.');fields.push(terms.querySelector('input'));}for(const f of fields){if(!f.checkValidity()){show(i);f.reportValidity();return false;}}return true;}
  next.addEventListener('click',()=>{if(valid(step))show(step+1);});back.addEventListener('click',()=>show(step-1));
  form.addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');});
  submit.addEventListener('click',e=>{for(let i=0;i<3;i++){if(!valid(i)){e.preventDefault();e.stopImmediatePropagation();return;}}},true);
  form.addEventListener('submit',e=>{if(step<2){e.preventDefault();e.stopImmediatePropagation();if(valid(step))show(step+1);return;}for(let i=0;i<3;i++)if(!valid(i)){e.preventDefault();e.stopImmediatePropagation();return;}},true);form.noValidate=true;show(0);
  window.abrirCadastroEmpresaProfissionalEM=function(){if(typeof window.mostrarPagina==='function')window.mostrarPagina('login-empresa');card.scrollIntoView({behavior:'smooth',block:'nearest'});const field=sections[step].querySelector('input');if(field)field.focus({preventScroll:true});};
  const original=window.mostrarPagina;if(typeof original==='function')window.mostrarPagina=function(name){if(name==='cadastro-empresa')name='login-empresa';return original.apply(this,[name].concat(Array.prototype.slice.call(arguments,1)));};
  function sync(){document.body.classList.toggle('company-solid-active',page.classList.contains('ativa'));}new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});sync();
  const registrationPage=document.getElementById('pagina-cadastro-empresa');if(registrationPage&&registrationPage.classList.contains('ativa'))window.mostrarPagina('login-empresa');
  const style=document.createElement('style');style.textContent=`
#pagina-login-empresa{padding:32px 0 40px!important;background:#edf3f9!important}
#pagina-login-empresa>.page-header,#pagina-login-empresa>.login-container{display:none!important}
#pagina-login-empresa .portal-empresa-area-em{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
#pagina-login-empresa .portal-empresa-grid-em{box-sizing:border-box!important;display:grid!important;grid-template-columns:210px minmax(230px,.85fr) minmax(360px,1.45fr)!important;gap:0!important;align-items:stretch!important;width:calc(100% - 48px)!important;max-width:1180px!important;margin:0 auto!important;padding:0!important;background:#fff!important;border:1px solid #dbe5ef!important;border-radius:12px!important;overflow:hidden!important;box-shadow:0 8px 24px #173c6808!important}
#pagina-login-empresa .company-solid-sidebar{box-sizing:border-box;background:#153f6c;color:#fff;padding:30px 26px}
#pagina-login-empresa .company-solid-sidebar h1{margin:0 0 24px!important;color:#fff!important;font-size:25px!important;line-height:1.25!important}
#pagina-login-empresa .company-solid-sidebar svg{width:54px;height:54px;margin-bottom:25px}
#pagina-login-empresa .company-solid-sidebar ul{padding:0;margin:0;list-style:none;display:grid;gap:22px}
#pagina-login-empresa .company-solid-sidebar li{font-size:13px;line-height:1.6;color:#e0efff;padding-left:17px;position:relative}
#pagina-login-empresa .company-solid-sidebar li:before{content:'✓';position:absolute;left:0;color:#9fcef9}
#pagina-login-empresa .portal-empresa-card-em{box-sizing:border-box!important;min-width:0!important;padding:30px 28px!important;background:#fff!important;border:0!important;border-radius:0!important;box-shadow:none!important}
#pagina-login-empresa .portal-cadastro-card-em{position:relative!important;display:block!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important}
#pagina-login-empresa .portal-cadastro-card-em>h2{display:block!important;width:100%!important;max-width:none!important;flex:none!important;text-align:left!important}
#pagina-login-empresa #formCadastroEmpresaProfissionalEM{display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;flex:none!important}
#pagina-login-empresa .portal-cadastro-card-em:before{content:'';position:absolute;left:0;top:30px;bottom:30px;width:1px;background:#e2eaf2}
#pagina-login-empresa .portal-empresa-card-em h2{color:#153f6c!important;font-size:23px!important;line-height:1.3!important;margin:0 0 22px!important}
#pagina-login-empresa .portal-card-icone-em,#pagina-login-empresa .portal-card-kicker-em,#pagina-login-empresa .portal-card-desc-em{display:none!important}
#pagina-login-empresa .grupo{margin:0 0 17px!important;min-width:0!important}
#pagina-login-empresa label{font-size:12px!important;line-height:1.5!important;color:#24435f!important;margin-bottom:6px!important}
#pagina-login-empresa .campo{box-sizing:border-box!important;width:100%!important;min-height:44px!important;height:44px!important;padding:10px 12px!important;border:1px solid #cfdeeb!important;border-radius:7px!important;font-size:13px!important;background:#fff!important;color:#24435f!important}
#pagina-login-empresa textarea.campo{height:64px!important;resize:vertical}
#pagina-login-empresa .campo:focus{outline:2px solid #a5cff4!important;outline-offset:2px}
#pagina-login-empresa .portal-senha-wrap-em{position:relative!important}
#pagina-login-empresa .portal-senha-wrap-em .campo{padding-right:40px!important}
#pagina-login-empresa .portal-olho-em{position:absolute!important;right:6px!important;top:50%!important;transform:translateY(-50%)!important;background:transparent!important;border:0!important;width:30px!important;height:30px!important;color:#577794!important;display:flex!important;align-items:center!important;justify-content:center!important}
#pagina-login-empresa .portal-olho-em svg{width:20px!important;height:20px!important}
#pagina-login-empresa .portal-btn-principal-em{min-height:44px!important;padding:10px 14px!important;background:#1768b4!important;border:0!important;border-radius:7px!important;color:#fff!important;font-size:13px!important;box-shadow:none!important}
#pagina-login-empresa .portal-btn-principal-em:hover{background:#125794!important}
#pagina-login-empresa .portal-seguranca-em{margin-top:20px!important;font-size:11px!important;color:#74899a!important}
#pagina-login-empresa .portal-seguranca-em p{font-size:11px!important;line-height:1.6!important}
#pagina-login-empresa .cadastro-modal-grid-em{display:block!important}
#pagina-login-empresa .company-blue-fields{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:14px!important}
#pagina-login-empresa .company-blue-fields .grupo{margin:0!important}
#pagina-login-empresa .cadastro-modal-full-em{grid-column:1/-1!important}
#pagina-login-empresa .company-blue-progress{list-style:none;display:flex;gap:6px;padding:0;margin:0 0 20px}
#pagina-login-empresa .company-blue-progress li{flex:1;padding:8px 5px;text-align:center;font-size:10px;color:#6b859b;background:#f1f5f9;border-radius:6px}
#pagina-login-empresa .company-blue-progress li.active{background:#ddecfc;color:#1768b4;font-weight:700}
#pagina-login-empresa .company-blue-actions{display:flex!important;visibility:visible!important;opacity:1!important;position:static!important;width:100%!important;align-items:center!important;gap:12px!important;margin:20px 0 0!important;padding:0!important;border:0!important}
#pagina-login-empresa .company-blue-actions .portal-btn-principal-em{flex:1!important}
#pagina-login-empresa .company-blue-back{border:1px solid #cbddea;background:#fff;color:#1768b4;border-radius:7px;padding:10px 14px;font-size:12px;cursor:pointer}
#pagina-login-empresa .cadastro-modal-termos-em{display:flex!important;gap:9px!important;margin-top:16px!important;font-size:11px!important}
#pagina-login-empresa [hidden]{display:none!important}
body.company-solid-active .topo{background:#1761a1!important;border-color:#1761a1!important;box-shadow:none!important}
body.company-solid-active .topo .marca-nome,body.company-solid-active .topo .marca-nome span,body.company-solid-active .topo .menu-principal>.menu-link{color:#fff!important}
body.company-solid-active .topo .marca-icone{background:#fff!important;color:#1761a1!important}
@media(max-width:1000px){#pagina-login-empresa .portal-empresa-grid-em{grid-template-columns:170px minmax(210px,.85fr) minmax(300px,1.4fr)!important;width:calc(100% - 32px)!important}#pagina-login-empresa .portal-empresa-card-em{padding:26px 20px!important}#pagina-login-empresa .company-solid-sidebar{padding:26px 20px}}
@media(max-width:800px){#pagina-login-empresa .portal-empresa-grid-em{grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)!important}#pagina-login-empresa .company-solid-sidebar{grid-column:1/-1;display:flex;align-items:center;gap:20px;padding:18px 24px}#pagina-login-empresa .company-solid-sidebar h1{margin:0!important;font-size:21px!important}#pagina-login-empresa .company-solid-sidebar svg{width:40px;height:40px;margin:0;order:-1}#pagina-login-empresa .company-solid-sidebar ul{display:none}}
@media(max-width:600px){#pagina-login-empresa{padding:18px 0 28px!important}#pagina-login-empresa .portal-empresa-grid-em{grid-template-columns:1fr!important;width:calc(100% - 28px)!important}#pagina-login-empresa .portal-empresa-card-em{padding:24px!important}#pagina-login-empresa .portal-cadastro-card-em:before{left:24px;right:24px;top:0;bottom:auto;width:auto;height:1px}}
@media(max-width:380px){#pagina-login-empresa .company-blue-fields{grid-template-columns:1fr!important}}
`;style.textContent=style.textContent.replace(/#pagina-login-empresa/g,'#pagina-login-empresa#pagina-login-empresa#pagina-login-empresa');document.head.append(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupBlue);else setupBlue();
})();

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

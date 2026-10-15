(function(){
 'use strict';
 var selector='input,select,textarea',states=new WeakMap(),next=0;
 function eligible(f){
  if(!f||!f.matches||!f.matches(selector)||f.disabled||f.readOnly||f.hidden)return false;
  if(f.tagName==='INPUT'&&/^(hidden|checkbox|radio|file|submit|button|reset|search|range|color)$/i.test(f.type))return false;
  var id=f.id||'',form=f.closest('form');
  if(/login|busca|filtro|ordenacao|recupera|admin/i.test(id)||form&&/login|busca|filtro/i.test(form.id))return false;
  return !!(form||/^(cv|perfil|conta|emV58)/i.test(id));
 }
 function digits(value){return String(value||'').replace(/\D/g,'');}
 function extraError(f,lookup){
  var value=String(f.value||'').trim(),id=f.id||f.name||'';
  if(!value)return '';
  if(/cep/i.test(id)&&digits(value).length!==8)return 'Informe um CEP com 8 números.';
  if(/cnpj/i.test(id)&&digits(value).length!==14)return 'Informe um CNPJ com 14 números.';
  if(/cpf/i.test(id)&&digits(value).length!==11)return 'Informe um CPF com 11 números.';
  if((f.type==='tel'||/telefone|celular|cv101Cel/i.test(id))&&!/fixo/i.test(id)&&!/^\+/.test(value)&&![10,11].includes(digits(value).length))return 'Informe o telefone com DDD e 10 ou 11 números.';
  var peers={cadEmpresaConfirmar:'cadEmpresaSenha',cadEmpresaConfirmarSenhaEM:'cadEmpresaSenhaEM',cv101Senha2:'cv101Senha',emNovaSenhaConfirmaV1:'emNovaSenhaV1'};
  if(peers[id]){var peer=lookup(peers[id]);if(peer&&value!==peer.value)return 'As senhas precisam ser iguais.';}
  return '';
 }
 function result(f,lookup){
  var value=String(f.value||'').trim(),v=f.validity||{};
  if(v.valueMissing||(!value&&f.required))return {state:'invalid',message:'Preencha este campo.'};
  if(!value&&!v.badInput)return {state:'neutral',message:''};
  if(v.typeMismatch)return {state:'invalid',message:f.type==='email'?'Informe um e-mail no formato nome@dominio.com.':'Informe um endereço válido.'};
  if(v.tooShort)return {state:'invalid',message:'Use pelo menos '+f.minLength+' caracteres.'};
  if(v.tooLong)return {state:'invalid',message:'Use até '+f.maxLength+' caracteres.'};
  if(v.patternMismatch)return {state:'invalid',message:f.title||'Confira o formato informado.'};
  if(v.rangeUnderflow||v.rangeOverflow||v.stepMismatch||v.badInput)return {state:'invalid',message:'Informe um valor dentro do formato e intervalo permitidos.'};
  if(v.customError)return {state:'invalid',message:f.validationMessage||'Confira esta informação.'};
  var error=extraError(f,lookup);return {state:error?'invalid':'valid',message:error};
 }
 function clear(f){
  var s=states.get(f);if(!s)return;
  f.classList.remove('em-field-valid','em-field-invalid');
  if(s.ariaInvalid===null)f.removeAttribute('aria-invalid');else f.setAttribute('aria-invalid',s.ariaInvalid);
  if(s.message){var ids=(f.getAttribute('aria-describedby')||'').split(/\s+/).filter(function(id){return id&&id!==s.message.id;});if(ids.length)f.setAttribute('aria-describedby',ids.join(' '));else f.removeAttribute('aria-describedby');s.message.remove();s.message=null;}
  if(s.color)f.style.setProperty('color',s.color,s.colorPriority);else f.style.removeProperty('color');
 }
 function paint(f){
  if(!eligible(f)||!f.getClientRects().length)return true;
  if(!states.has(f))states.set(f,{ariaInvalid:f.getAttribute('aria-invalid'),message:null,color:f.style.getPropertyValue('color'),colorPriority:f.style.getPropertyPriority('color')});
  clear(f);var r=result(f,function(id){return document.getElementById(id);}),s=states.get(f);
  if(r.state!=='neutral')f.style.setProperty('color','#374151','important');
  if(r.state==='valid'){f.classList.add('em-field-valid');f.setAttribute('aria-invalid','false');}
  if(r.state==='invalid'){
   f.classList.add('em-field-invalid');f.setAttribute('aria-invalid','true');
   var message=document.createElement('span');message.id='emFieldError'+(++next);message.className='em-field-message';message.textContent=r.message;message.setAttribute('aria-live','polite');
   f.insertAdjacentElement('afterend',message);s.message=message;var described=f.getAttribute('aria-describedby');f.setAttribute('aria-describedby',(described?described+' ':'')+message.id);
  }
  return r.state!=='invalid';
 }
 function start(){
  document.addEventListener('focusout',function(e){paint(e.target);});
  document.addEventListener('change',function(e){paint(e.target);});
  document.addEventListener('input',function(e){if(eligible(e.target))clear(e.target);});
  document.addEventListener('invalid',function(e){paint(e.target);},true);
  document.addEventListener('submit',function(e){var first; e.target.querySelectorAll(selector).forEach(function(f){if(!paint(f)&&!first)first=f;});if(first){e.preventDefault();e.stopImmediatePropagation();first.focus();}},true);
  document.addEventListener('reset',function(e){e.target.querySelectorAll(selector).forEach(clear);},true);
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={result:result,extraError:extraError};
 if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
})();

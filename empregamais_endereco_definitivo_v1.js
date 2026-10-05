/* EmpregaMais - Endereço da vaga - correção definitiva v1 */
(function(){
"use strict";
if(window.__EM_ENDERECO_DEFINITIVO_V1)return;
window.__EM_ENDERECO_DEFINITIVO_V1=true;

var cacheCep={cep:"",dados:null,promise:null};

function txt(v){return String(v==null?"":v).trim();}
function dig(v){return txt(v).replace(/\D/g,"").slice(0,8);}
function campo(id){return document.getElementById(id);}
function valor(id){var e=campo(id);return e?txt(e.value):"";}
function textoSelect(id){
 var e=campo(id); if(!e)return "";
 if(e.tagName==="SELECT"&&e.selectedIndex>=0){
   var o=e.options[e.selectedIndex], t=txt(o&&o.textContent);
   if(t&&!/^selecione/i.test(t))return t;
 }
 return txt(e.value);
}
function modoAtual(){
 var r=document.querySelector("input[name='enderecoVisibilidadeRadioV130']:checked");
 if(r&&/^(completo|bairro|cidade)$/.test(r.value))return r.value;
 var h=campo("enderecoVisibilidadeV130");
 return h&&/^(completo|bairro|cidade)$/.test(h.value)?h.value:"bairro";
}
function dadosTela(){
 return {
   rua:valor("ruaVagaV130")||valor("logradouroVaga")||valor("ruaVaga")||valor("enderecoVaga")||valor("logradouroLocalVaga"),
   bairro:valor("bairroVagaV130")||valor("bairroVaga")||valor("bairroLocalVaga"),
   cidade:textoSelect("cidadeVaga")||valor("cidadeLocalVaga"),
   uf:textoSelect("estadoVaga")||valor("ufVaga")||valor("estadoLocalVaga")
 };
}
function mesclar(a,b){a=a||{};b=b||{};return{rua:txt(a.rua)||txt(b.rua),bairro:txt(a.bairro)||txt(b.bairro),cidade:txt(a.cidade)||txt(b.cidade),uf:txt(a.uf)||txt(b.uf)};}
function render(d){
 var modo=modoAtual(), h=campo("enderecoVisibilidadeV130");
 if(h)h.value=modo;
 d=mesclar(d,dadosTela());
 var partes=modo==="completo"?[d.rua,d.bairro,d.cidade,d.uf]:modo==="cidade"?[d.cidade,d.uf]:[d.bairro,d.cidade,d.uf];
 var exibido=partes.filter(function(x){return txt(x);}).join(" · ");
 var p=campo("enderecoPreviewV150")||document.querySelector(".endereco-preview-v150");
 if(p)p.innerHTML="<strong>O candidato verá:</strong> "+(exibido||"preencha o CEP para visualizar.");
}
async function consultarCep(){
 var c=dig(valor("cepVaga"));
 if(c.length!==8)return null;
 if(cacheCep.cep===c&&cacheCep.dados)return cacheCep.dados;
 if(cacheCep.cep===c&&cacheCep.promise)return cacheCep.promise;
 cacheCep.cep=c;
 cacheCep.promise=fetch("https://viacep.com.br/ws/"+c+"/json/").then(function(r){if(!r.ok)throw new Error("cep");return r.json();}).then(function(d){
   if(!d||d.erro)throw new Error("cep");
   cacheCep.dados={rua:txt(d.logradouro),bairro:txt(d.bairro),cidade:txt(d.localidade),uf:txt(d.uf)};
   return cacheCep.dados;
 }).catch(function(){return null;}).finally(function(){cacheCep.promise=null;});
 return cacheCep.promise;
}
async function atualizar(){
 var d=dadosTela();
 if(dig(valor("cepVaga")).length===8 && (!d.rua||!d.bairro||!d.cidade||!d.uf)){
   d=mesclar(d,await consultarCep());
 }
 render(d);
}
function relevante(t){
 if(!t)return false;
 if(t.matches&&t.matches("input[name='enderecoVisibilidadeRadioV130']"))return true;
 return ["cepVaga","ruaVagaV130","bairroVagaV130","cidadeVaga","estadoVaga"].indexOf(t.id)>=0;
}
document.addEventListener("change",function(e){if(relevante(e.target))setTimeout(atualizar,0);},true);
document.addEventListener("input",function(e){
 if(!relevante(e.target))return;
 if(e.target.id==="cepVaga"){cacheCep={cep:"",dados:null,promise:null};}
 setTimeout(atualizar,0);
},true);
document.addEventListener("click",function(e){
 var l=e.target&&e.target.closest?e.target.closest(".privacidade-opcao-v130 label"):null;
 if(l)setTimeout(atualizar,0);
},true);
var obs=null;
function observarEndereco(){
 if(obs||!window.MutationObserver)return;
 var formulario=document.getElementById("formVaga");
 if(!formulario)return;
 obs=new MutationObserver(function(muts){
  var precisa=false;
  for(var i=0;i<muts.length;i++){
   if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
  }
  if(precisa&&campo("enderecoPreviewV150"))setTimeout(atualizar,40);
 });
 obs.observe(formulario,{childList:true,subtree:true});
}
observarEndereco();
document.addEventListener("DOMContentLoaded",observarEndereco);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(atualizar,250);});
else setTimeout(atualizar,250);
window.addEventListener("load",function(){setTimeout(atualizar,500);});
window.atualizarPreviewEnderecoV150=atualizar;
})();
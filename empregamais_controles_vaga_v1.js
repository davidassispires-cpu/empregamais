/* EmpregaMais - Controles do formulário de vaga - v4
   Módulo único para SELECTs do formVaga.
   Mantém os SELECTs reais como fonte de verdade e cria somente a interface visual.
   Não altera IDs, names, values, validação, envio ou regras de negócio. */
(function(){
"use strict";
if(window.__EM_SELECTS_VAGA_V4)return;
window.__EM_SELECTS_VAGA_V4=true;

var FORM_ID="formVaga";
var IGNORAR=["planoSaudeCusteioV181","planoSaudeDependentesV181"];
var wrappers=new WeakMap();

var css=document.createElement("style");
css.id="em-selects-v4-css";
css.textContent=[
".em-select-real-v4{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;overflow:hidden!important}",
".em-select-v4{position:relative!important;width:100%!important;font-family:inherit!important;z-index:1}",
".em-select-v4.aberto{z-index:2147483600!important}",
".em-select-v4-btn{box-sizing:border-box!important;width:100%!important;height:46px!important;min-height:46px!important;padding:0 40px 0 13px!important;display:flex!important;align-items:center!important;text-align:left!important;border:1px solid #c8dceb!important;border-radius:10px!important;background:#fff!important;color:#173b5d!important;font:inherit!important;font-size:14px!important;cursor:pointer!important;position:relative!important}",
".em-select-v4-btn:after{content:''!important;position:absolute!important;right:15px!important;top:50%!important;width:0!important;height:0!important;border-left:5px solid transparent!important;border-right:5px solid transparent!important;border-top:6px solid #58758e!important;transform:translateY(-25%)!important}",
".em-select-v4-btn:disabled{background:#f4f7fa!important;color:#8a9aaa!important;cursor:not-allowed!important}",
".em-select-v4-lista{display:none!important;box-sizing:border-box!important;position:absolute!important;left:0!important;right:0!important;top:calc(100% + 5px)!important;width:100%!important;max-height:300px!important;overflow-y:auto!important;overflow-x:hidden!important;padding:5px!important;background:#fff!important;border:1px solid #c8dceb!important;border-radius:10px!important;box-shadow:0 14px 32px rgba(20,48,75,.18)!important;z-index:2147483640!important}",
".em-select-v4.aberto .em-select-v4-lista{display:block!important}",
".em-select-v4-opcao{box-sizing:border-box!important;display:block!important;width:100%!important;padding:10px 11px!important;border:0!important;border-radius:7px!important;background:#fff!important;text-align:left!important;color:#173b5d!important;font:inherit!important;font-size:14px!important;cursor:pointer!important}",
".em-select-v4-opcao:hover,.em-select-v4-opcao.selecionada{background:#eef6ff!important}",
".em-select-v4-opcao:disabled{opacity:.5!important;cursor:not-allowed!important}"
].join("");
document.head.appendChild(css);

function form(){return document.getElementById(FORM_ID)}
function ignorado(sel){return IGNORAR.indexOf(sel.id)!==-1 || !!sel.closest("#beneficiosCardsV128")}
function fechar(exceto){
 document.querySelectorAll("#"+FORM_ID+" .em-select-v4.aberto").forEach(function(w){
  if(w!==exceto){w.classList.remove("aberto");var b=w.querySelector(".em-select-v4-btn");if(b)b.setAttribute("aria-expanded","false")}
 });
}
function assinatura(sel){
 return Array.from(sel.options).map(function(o){return [o.value,o.textContent,o.disabled].join("|")}).join("§");
}
function atualizar(sel,w,forcar){
 if(!sel||!w||!w.isConnected)return;
 var btn=w.querySelector(".em-select-v4-btn"), lista=w.querySelector(".em-select-v4-lista");
 var opt=sel.options[sel.selectedIndex];
 if(btn){
  btn.firstChild.nodeValue=opt?String(opt.textContent||opt.value||"").trim():"Selecione";
  btn.disabled=!!sel.disabled;
 }
 var sig=assinatura(sel);
 if(!forcar && lista.dataset.assinatura===sig){
  lista.querySelectorAll(".em-select-v4-opcao").forEach(function(b){b.classList.toggle("selecionada",b.dataset.value===sel.value)});
  return;
 }
 lista.dataset.assinatura=sig;lista.innerHTML="";
 Array.from(sel.options).forEach(function(o){
  var b=document.createElement("button");
  b.type="button";b.className="em-select-v4-opcao";
  b.textContent=String(o.textContent||o.value||"").trim();
  b.dataset.value=o.value;b.disabled=!!o.disabled;
  b.classList.toggle("selecionada",o.value===sel.value);
  b.addEventListener("click",function(ev){
   ev.preventDefault();ev.stopPropagation();
   if(o.disabled)return;
   var anterior=sel.value;
   sel.value=o.value;
   w.classList.remove("aberto");
   btn.setAttribute("aria-expanded","false");
   atualizar(sel,w,false);
   if(sel.value!==anterior){
    sel.dispatchEvent(new Event("input",{bubbles:true}));
    sel.dispatchEvent(new Event("change",{bubbles:true}));
   }
  });
  lista.appendChild(b);
 });
}
function limparAntigo(sel){
 sel.classList.remove("em-select-original-v3","em-benefit-native-v10");
 sel.removeAttribute("data-em-select-v3");
 var p=sel.nextElementSibling;
 while(p && (p.classList.contains("em-select-v3")||p.classList.contains("em-benefit-select-v10"))){
  var remover=p;p=p.nextElementSibling;remover.remove();
 }
}
function montar(sel){
 if(!sel||ignorado(sel))return;
 var existente=wrappers.get(sel);
 if(existente&&existente.isConnected){atualizar(sel,existente,false);return}
 limparAntigo(sel);
 var w=document.createElement("div");w.className="em-select-v4";
 var btn=document.createElement("button");btn.type="button";btn.className="em-select-v4-btn";
 btn.setAttribute("aria-haspopup","listbox");btn.setAttribute("aria-expanded","false");
 btn.appendChild(document.createTextNode(""));
 var lista=document.createElement("div");lista.className="em-select-v4-lista";lista.setAttribute("role","listbox");
 w.appendChild(btn);w.appendChild(lista);sel.insertAdjacentElement("afterend",w);
 sel.classList.add("em-select-real-v4");wrappers.set(sel,w);
 btn.addEventListener("click",function(ev){
  ev.preventDefault();ev.stopPropagation();if(sel.disabled)return;
  var abrir=!w.classList.contains("aberto");fechar(w);w.classList.toggle("aberto",abrir);
  btn.setAttribute("aria-expanded",abrir?"true":"false");atualizar(sel,w,false);
 });
 sel.addEventListener("change",function(){atualizar(sel,w,false)});
 new MutationObserver(function(){atualizar(sel,w,true)}).observe(sel,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled"]});
 atualizar(sel,w,true);
}
function restaurarIgnorados(){
 var f=form();if(!f)return;
 f.querySelectorAll("select").forEach(function(sel){
  if(!ignorado(sel))return;
  sel.classList.remove("em-select-original-v3","em-select-real-v4");
  sel.removeAttribute("data-em-select-v3");
  var p=sel.nextElementSibling;
  while(p&&(p.classList.contains("em-select-v3")||p.classList.contains("em-select-v4"))){var r=p;p=p.nextElementSibling;r.remove()}
 });
}
function instalar(){
 var f=form();if(!f)return;
 restaurarIgnorados();
 f.querySelectorAll("select").forEach(function(sel){if(!ignorado(sel))montar(sel)});
}
document.addEventListener("click",function(e){if(!e.target.closest(".em-select-v4"))fechar()},false);
document.addEventListener("keydown",function(e){if(e.key==="Escape")fechar()},false);
var obs=null;
function iniciar(){
 instalar();var f=form();
 if(f&&!obs){obs=new MutationObserver(function(){instalar()});obs.observe(f,{childList:true,subtree:true})}
 setTimeout(instalar,250);setTimeout(instalar,800);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",iniciar);else iniciar();
window.addEventListener("load",function(){setTimeout(instalar,150)});
})();
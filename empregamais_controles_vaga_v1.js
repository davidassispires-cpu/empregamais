/* EmpregaMais - Seletores do formulário de vaga - v3
   Interface própria sincronizada com os SELECTs originais.
   Não altera IDs, values, envio, validação ou regras de negócio. */
(function(){
"use strict";
if(window.__EM_SELECTS_VAGA_V3)return;
window.__EM_SELECTS_VAGA_V3=true;

function form(){return document.getElementById("formVaga");}
function fecharTodos(exceto){
 document.querySelectorAll(".em-select-v3.aberto").forEach(function(w){
   if(w!==exceto)w.classList.remove("aberto");
 });
}
function textoAtual(sel){
 var o=sel.options[sel.selectedIndex];
 return o?String(o.textContent||o.value||"").trim():"Selecione";
}
function sincronizar(sel,w){
 var btn=w.querySelector(".em-select-v3-btn");
 if(btn){
   btn.textContent=textoAtual(sel)||"Selecione";
   btn.disabled=!!sel.disabled;
   btn.setAttribute("aria-expanded",w.classList.contains("aberto")?"true":"false");
 }
 var lista=w.querySelector(".em-select-v3-lista");
 if(!lista)return;
 var assinatura=Array.from(sel.options).map(function(o){return o.value+"|"+o.textContent}).join("§");
 if(lista.dataset.assinatura===assinatura)return;
 lista.dataset.assinatura=assinatura;
 lista.innerHTML="";
 Array.from(sel.options).forEach(function(o){
   var b=document.createElement("button");
   b.type="button";
   b.className="em-select-v3-opcao";
   b.textContent=String(o.textContent||o.value||"").trim();
   b.dataset.value=o.value;
   if(o.disabled)b.disabled=true;
   if(o.value===sel.value)b.classList.add("selecionada");
   b.addEventListener("click",function(e){
     e.preventDefault();e.stopPropagation();
     sel.value=o.value;
     Array.from(lista.children).forEach(function(x){x.classList.remove("selecionada")});
     b.classList.add("selecionada");
     w.classList.remove("aberto");
     sincronizar(sel,w);
     sel.dispatchEvent(new Event("input",{bubbles:true}));
     sel.dispatchEvent(new Event("change",{bubbles:true}));
   });
   lista.appendChild(b);
 });
}
function montar(sel){
 if(!sel||sel.dataset.emSelectV3==="1")return;
 sel.dataset.emSelectV3="1";
 var w=document.createElement("div");
 w.className="em-select-v3";
 var btn=document.createElement("button");
 btn.type="button";btn.className="em-select-v3-btn";btn.setAttribute("aria-haspopup","listbox");
 var lista=document.createElement("div");
 lista.className="em-select-v3-lista";lista.setAttribute("role","listbox");
 w.appendChild(btn);w.appendChild(lista);
 sel.insertAdjacentElement("afterend",w);
 sel.classList.add("em-select-original-v3");
 btn.addEventListener("click",function(e){
   e.preventDefault();e.stopPropagation();
   if(sel.disabled)return;
   var abrir=!w.classList.contains("aberto");
   fecharTodos(w);
   w.classList.toggle("aberto",abrir);
   sincronizar(sel,w);
 });
 sel.addEventListener("change",function(){sincronizar(sel,w)});
 var mo=new MutationObserver(function(){sincronizar(sel,w)});
 mo.observe(sel,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled"]});
 sincronizar(sel,w);
}
function instalar(){
 var f=form();if(!f)return;
 f.querySelectorAll("select").forEach(montar);
}
document.addEventListener("click",function(e){
 if(!e.target.closest(".em-select-v3"))fecharTodos();
},false);
document.addEventListener("keydown",function(e){
 if(e.key==="Escape")fecharTodos();
},false);
var obs=new MutationObserver(function(){instalar()});
function iniciar(){
 instalar();
 var f=form();if(f)obs.observe(f,{childList:true,subtree:true});
 setTimeout(instalar,300);setTimeout(instalar,900);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",iniciar);
else iniciar();
window.addEventListener("load",function(){setTimeout(instalar,200)});
})();
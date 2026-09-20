/* EmpregaMais - JavaScript externo - lote 3 */

//
(function(){
var urlsV32={logo:"",capa:""};
function empresaKeyV32(){
return String(sessionStorage.getItem("empresaCnpj")||sessionStorage.getItem("empresaEmail")||"empresa")
.replace(/[^a-zA-Z0-9@._-]/g,"");
}
function abrirDbV32(){
return new Promise(function(ok,erro){
var r=indexedDB.open("EmpregaMaisMidiasV31",1);
r.onupgradeneeded=function(){
if(!r.result.objectStoreNames.contains("imagens"))r.result.createObjectStore("imagens");
};
r.onsuccess=function(){ok(r.result);};
r.onerror=function(){erro(r.error);};
});
}
function buscarV32(tipo){
return abrirDbV32().then(function(d){
return new Promise(function(ok){
var r=d.transaction("imagens","readonly").objectStore("imagens").get(empresaKeyV32()+"_"+tipo);
r.onsuccess=function(){var v=r.result;d.close();ok(v||null);};
r.onerror=function(){d.close();ok(null);};
});
}).catch(function(){return null;});
}
function urlEstavelV32(tipo,blob){
if(!blob)return "";
if(urlsV32[tipo])return urlsV32[tipo];
urlsV32[tipo]=URL.createObjectURL(blob);
return urlsV32[tipo];
}
function garantirLogoV32(hero,info){
var logo=hero.querySelector(".empresa-publica-logo-em");
if(!logo || logo.tagName!=="IMG"){
var nova=document.createElement("img");
nova.className="empresa-publica-logo-em";
nova.alt="Logo da empresa";
if(logo && logo.parentNode)logo.parentNode.replaceChild(nova,logo);
else info.insertBefore(nova,info.firstChild);
logo=nova;
} else if(logo.parentNode!==info){
info.insertBefore(logo,info.firstChild);
}
return logo;
}
async function aplicarV32(){
var pagina=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pagina)return;
var hero=pagina.querySelector(".empresa-publica-hero-em");
if(!hero)return;
try{
if(typeof window.normalizarHeroEmpresaV30==="function")window.normalizarHeroEmpresaV30();
}catch(e){}
var info=hero.querySelector(".empresa-publica-info-em");
var capa=hero.querySelector(".empresa-publica-capa-em");
if(!info||!capa)return;
var logo=garantirLogoV32(hero,info);
var dados=await Promise.all([buscarV32("logo"),buscarV32("capa")]);
if(dados[0]){
var lu=urlEstavelV32("logo",dados[0]);
if(logo.getAttribute("src")!==lu)logo.setAttribute("src",lu);
logo.style.display="block";
}
if(dados[1]){
var cu=urlEstavelV32("capa",dados[1]);
var bg='url("'+cu+'")';
if(capa.style.backgroundImage!==bg)capa.style.backgroundImage=bg;
capa.classList.remove("empresa-publica-sem-capa-v28");
}
hero.insertBefore(capa,hero.firstChild);
var stats=hero.querySelector(".perfil-stats-v29");
if(stats)hero.appendChild(stats);
}
window.aplicarPerfilPublicoV32=aplicarV32;
window.addEventListener("load",function(){
setTimeout(aplicarV32,700);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(tx.indexOf("visualizar como candidato")>=0 ||
tx.indexOf("perfil da empresa")>=0){
setTimeout(aplicarV32,220);
}
},true);
})();
//
;
//
(function(){
var logoUrlV34="";
function chaveAtualV34(){
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/[^a-zA-Z0-9@._-]/g,"");
var e=String(sessionStorage.getItem("empresaEmail")||"").replace(/[^a-zA-Z0-9@._-]/g,"");
return c||e||"";
}
function abrirDbV34(){
return new Promise(function(ok,erro){
var r=indexedDB.open("EmpregaMaisMidiasV31",1);
r.onupgradeneeded=function(){
if(!r.result.objectStoreNames.contains("imagens"))r.result.createObjectStore("imagens");
};
r.onsuccess=function(){ok(r.result);};
r.onerror=function(){erro(r.error);};
});
}
function buscarLogoAtualV34(){
var k=chaveAtualV34();
if(!k)return Promise.resolve(null);
return abrirDbV34().then(function(d){
return new Promise(function(ok){
var r=d.transaction("imagens","readonly").objectStore("imagens").get(k+"_logo");
r.onsuccess=function(){var v=r.result;d.close();ok(v||null);};
r.onerror=function(){d.close();ok(null);};
});
}).catch(function(){return null;});
}
async function aplicarLogoV34(){
var pg=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pg)return;
var hero=pg.querySelector(".empresa-publica-hero-em");
var info=pg.querySelector(".empresa-publica-info-em");
if(!hero||!info)return;
var blob=await buscarLogoAtualV34();
if(!blob)return;
var logo=info.querySelector(".empresa-publica-logo-em");
if(!logo || logo.tagName!=="IMG"){
var nova=document.createElement("img");
nova.className="empresa-publica-logo-em";
nova.alt="Logo da empresa";
if(logo&&logo.parentNode)logo.parentNode.replaceChild(nova,logo);
else info.insertBefore(nova,info.firstChild);
logo=nova;
}
if(!logoUrlV34)logoUrlV34=URL.createObjectURL(blob);
logo.src=logoUrlV34;
logo.style.display="block";
logo.style.visibility="visible";
logo.style.opacity="1";
}
window.aplicarLogoV34=aplicarLogoV34;
window.addEventListener("load",function(){setTimeout(aplicarLogoV34,850);});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(tx.indexOf("visualizar como candidato")>=0 ||
tx.indexOf("perfil da empresa")>=0){
setTimeout(aplicarLogoV34,350);
}
},true);
})();
//
;
//
(function(){
var objectUrlV35="";
function logoDoPerfilV35(){
try{
if(typeof perfilSalvoEM==="function"){
var p=perfilSalvoEM()||{};
var v=String(p.logo||p.logoUrl||p.logo_url||"").trim();
if(v && v.indexOf("midia-v31:")!==0 && v.indexOf("indexeddb:")!==0)return v;
}
}catch(e){}
return "";
}
function empresaAtualV35(){
try{
if(typeof empresaLogadaPainelEM==="function")return empresaLogadaPainelEM()||{};
}catch(e){}
return {};
}
function chavesV35(){
var a=[];
function add(v){
v=String(v||"").replace(/[^a-zA-Z0-9@._-]/g,"");
if(v && a.indexOf(v)<0)a.push(v);
}
var e=empresaAtualV35();
add(sessionStorage.getItem("empresaCnpj"));
add(sessionStorage.getItem("empresaEmail"));
add(localStorage.getItem("empresaCnpj"));
add(localStorage.getItem("empresaEmail"));
add(e.cnpj);add(e.empresaCnpj);add(e.email);add(e.empresaEmail);
return a;
}
function abrirDbV35(){
return new Promise(function(ok,erro){
var r=indexedDB.open("EmpregaMaisMidiasV31",1);
r.onupgradeneeded=function(){
if(!r.result.objectStoreNames.contains("imagens"))r.result.createObjectStore("imagens");
};
r.onsuccess=function(){ok(r.result);};
r.onerror=function(){erro(r.error);};
});
}
function buscarBlobLogoV35(){
return abrirDbV35().then(function(d){
return new Promise(function(ok){
var st=d.transaction("imagens","readonly").objectStore("imagens");
var ks=chavesV35(),i=0;
function proxima(){
if(i>=ks.length){d.close();ok(null);return;}
var r=st.get(ks[i++]+"_logo");
r.onsuccess=function(){if(r.result){d.close();ok(r.result);}else proxima();};
r.onerror=proxima;
}
proxima();
});
}).catch(function(){return null;});
}
function elementoLogoV35(){
var pg=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pg)return null;
var info=pg.querySelector(".empresa-publica-info-em");
if(!info)return null;
var l=info.querySelector(".empresa-publica-logo-em");
if(!l || l.tagName!=="IMG"){
var n=document.createElement("img");
n.className="empresa-publica-logo-em";
n.alt="Logo da empresa";
if(l&&l.parentNode)l.parentNode.replaceChild(n,l);
else info.insertBefore(n,info.firstChild);
l=n;
}
return l;
}
async function aplicarV35(){
var l=elementoLogoV35();if(!l)return;
var direta=logoDoPerfilV35();
if(direta){
if(l.getAttribute("src")!==direta)l.setAttribute("src",direta);
l.style.display="block";l.style.visibility="visible";l.style.opacity="1";
return;
}
var blob=await buscarBlobLogoV35();
if(blob){
if(!objectUrlV35)objectUrlV35=URL.createObjectURL(blob);
if(l.getAttribute("src")!==objectUrlV35)l.setAttribute("src",objectUrlV35);
l.style.display="block";l.style.visibility="visible";l.style.opacity="1";
}
}
window.aplicarLogoPublicaV35=aplicarV35;
window.addEventListener("load",function(){
setTimeout(aplicarV35,900);
setTimeout(aplicarV35,1600);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");if(!a)return;
var x=String(a.textContent||"").toLowerCase();
if(x.indexOf("visualizar como candidato")>=0||x.indexOf("perfil da empresa")>=0){
setTimeout(aplicarV35,300);
setTimeout(aplicarV35,750);
}
},true);
})();
//
;
//
(function(){
function empresaAtualV36(){
try{
if(typeof empresaLogadaPainelEM==="function")return empresaLogadaPainelEM()||{};
}catch(e){}
try{
if(typeof empresaAtualPerfilEM==="function")return empresaAtualPerfilEM()||{};
}catch(e){}
return {};
}
function planoPagoV36(e){
var p=String((e&&e.plano)||"").toLowerCase();
return p==="trimestral"||p==="semestral"||p==="anual";
}
function verificadaV36(e){
if(!e)return false;
var st=String(e.verificacaoStatus||e.statusVerificacao||"").toLowerCase();
return e.verificada===true || st==="verificada" || st==="verificado" || st==="aprovada" || st==="aprovado";
}
function podeMostrarSeloV36(){
var e=empresaAtualV36();
return planoPagoV36(e) && verificadaV36(e);
}
var shield="<svg viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 2l8 3v6c0 5.1-3.4 9.8-8 11-4.6-1.2-8-5.9-8-11V5l8-3zm-1.2 13.6l5.7-5.7-1.4-1.4-4.3 4.3-2-2-1.4 1.4 3.4 3.4z'/></svg>";
var doc="<svg viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M6 2h8l4 4v16H6V2zm7 1.5V7h3.5L13 3.5zM8 11h8V9H8v2zm0 4h8v-2H8v2zm0 4h6v-2H8v2z'/></svg>";
function montarSeloV36(){
var pg=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pg)return;
var hero=pg.querySelector(".empresa-publica-hero-em");
if(!hero)return;
var antigo=hero.querySelector(".selo-verificado-v36");
var cardAntigo=hero.querySelector(".card-verificado-v36");
if(!podeMostrarSeloV36()){
if(antigo)antigo.remove();
if(cardAntigo)cardAntigo.remove();
return;
}
if(antigo)return;
var botao=document.createElement("button");
botao.type="button";
botao.className="selo-verificado-v36";
botao.setAttribute("aria-expanded","false");
botao.innerHTML=shield+"<span>Empresa Verificada</span>";
var card=document.createElement("div");
card.className="card-verificado-v36";
card.innerHTML=
"<div class='card-verificado-titulo-v36'>"+shield+"<span>Empresa Verificada pelo EmpregaMais</span></div>"+
"<p>Os dados cadastrais desta empresa foram verificados pela nossa equipe, oferecendo mais transparencia aos candidatos.</p>"+
"<div class='card-verificado-itens-v36'>"+
"<div class='card-verificado-item-v36'>"+doc+"<span>Dados cadastrais validados</span></div>"+
"<div class='card-verificado-item-v36'>"+shield+"<span>Perfil verificado</span></div>"+
"</div>"+
"<div class='card-verificado-rodape-v36'>Este selo indica que a empresa possui cadastro confirmado no EmpregaMais.</div>";
botao.addEventListener("click",function(ev){
ev.stopPropagation();
var aberto=card.classList.toggle("aberto-v36");
botao.setAttribute("aria-expanded",aberto?"true":"false");
});
card.addEventListener("click",function(ev){ev.stopPropagation();});
hero.appendChild(botao);
hero.appendChild(card);
}
function svgStatV36(tipo){
if(tipo==="olho")return "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M12 5c5.5 0 9.5 5.2 10.4 6.5.3.3.3.7 0 1C21.5 13.8 17.5 19 12 19S2.5 13.8 1.6 12.5a.8.8 0 010-1C2.5 10.2 6.5 5 12 5zm0 2c-3.8 0-6.9 3.2-8.3 5 1.4 1.8 4.5 5 8.3 5s6.9-3.2 8.3-5C18.9 10.2 15.8 7 12 7zm0 2.2A2.8 2.8 0 1112 14.8a2.8 2.8 0 010-5.6z'/></svg>";
if(tipo==="vaga")return "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M9 4V2h6v2h5a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5zm2 0h2V3h-2v1zm9 7H4v8h16v-8zm0-5H4v3h16V6z'/></svg>";
if(tipo==="cand")return "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M9 11a4 4 0 100-8 4 4 0 000 8zm6-1a3 3 0 100-6 3 3 0 000 6zM9 13c-4 0-7 2-7 4.5V21h14v-3.5C16 15 13 13 9 13zm7-.5c-.6 0-1.2.1-1.8.2 2.3 1.2 3.8 3 3.8 4.8V21h4v-3c0-3-2.7-5.5-6-5.5z'/></svg>";
return "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 4H6v2h2V7zm10 0h-8v2h8V7zM8 11H6v2h2v-2zm10 0h-8v2h8v-2zM8 15H6v2h2v-2zm10 0h-8v2h8v-2z'/></svg>";
}
function colocarIconesV36(){
var pg=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pg)return;
var stats=pg.querySelectorAll(".perfil-stats-v29 .perfil-stat-v29");
if(!stats.length)return;
var tipos=["olho","vaga","cand","processo"];
for(var i=0;i<stats.length&&i<4;i++){
if(stats[i].querySelector(".icone-stat-v36"))continue;
var ic=document.createElement("div");
ic.className="icone-stat-v36";
ic.innerHTML=svgStatV36(tipos[i]);
stats[i].insertBefore(ic,stats[i].firstChild);
}
}
function atualizarV36(){
montarSeloV36();
colocarIconesV36();
}
document.addEventListener("click",function(e){
if(!e.target.closest(".selo-verificado-v36,.card-verificado-v36")){
var c=document.querySelector(".card-verificado-v36.aberto-v36");
if(c){
c.classList.remove("aberto-v36");
var b=document.querySelector(".selo-verificado-v36");
if(b)b.setAttribute("aria-expanded","false");
}
}
},true);
window.atualizarPerfilPublicoV36=atualizarV36;
window.addEventListener("load",function(){
setTimeout(atualizarV36,900);
setTimeout(atualizarV36,1600);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var x=String(a.textContent||"").toLowerCase();
if(x.indexOf("visualizar como candidato")>=0||x.indexOf("perfil da empresa")>=0){
setTimeout(atualizarV36,350);
setTimeout(atualizarV36,800);
}
},true);
})();
//
;
//
(function(){
var PLANOS_V38={
basico:{nome:"Gratuito",urgentes:0,pagina:false,confidencial:false},
trimestral:{nome:"Trimestral",urgentes:5,pagina:true,confidencial:true},
semestral:{nome:"Semestral",urgentes:7,pagina:true,confidencial:true},
anual:{nome:"Anual",urgentes:10,pagina:true,confidencial:true}
};
function normV38(v){return String(v||"").trim().toLowerCase();}
function cnpjV38(v){return String(v||"").replace(/\D/g,"");}
function emailV38(v){return String(v||"").trim().toLowerCase();}
function listaEmpresasV38(){
try{return JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");}
catch(e){return [];}
}
function empresaAtualV38(){
try{
if(typeof window.empresaLogadaPainelEM==="function"){
var original=window.empresaLogadaPainelEM();
if(original&&Object.keys(original).length)return original;
}
}catch(e){}
var c=cnpjV38(sessionStorage.getItem("empresaCnpj"));
var m=emailV38(sessionStorage.getItem("empresaEmail"));
var l=listaEmpresasV38();
for(var i=0;i<l.length;i++){
if((c&&cnpjV38(l[i].cnpj)===c)||(m&&emailV38(l[i].email)===m))return l[i];
}
return {};
}
function planoAtivoV38(emp){
emp=emp||empresaAtualV38();
var p=normV38(emp.plano||emp.planoId||"basico");
if(!PLANOS_V38[p])p="basico";
if(p!=="basico"&&emp.planoValidoAte){
var fim=new Date(emp.planoValidoAte);
if(!isNaN(fim.getTime())&&fim.getTime()<Date.now())return "basico";
}
return p;
}
function salvarLocalV38(emp){
var l=listaEmpresasV38(),c=cnpjV38(emp.cnpj),m=emailV38(emp.email),achou=false;
for(var i=0;i<l.length;i++){
if((c&&cnpjV38(l[i].cnpj)===c)||(m&&emailV38(l[i].email)===m)){
l[i]=Object.assign({},l[i],emp);achou=true;break;
}
}
if(!achou)l.push(emp);
localStorage.setItem("empresasEmpregaMais",JSON.stringify(l));
}
window.planoAtivoEmpresaV38=function(){return planoAtivoV38(empresaAtualV38());};
window.beneficiosPlanoV38=function(){
var p=planoAtivoV38(empresaAtualV38());
var cfg=PLANOS_V38[p]||PLANOS_V38.basico;
return {
plano:p,
nome:cfg.nome,
pago:p!=="basico",
urgentesMes:cfg.urgentes,
paginaEmpresa:cfg.pagina,
publicacaoConfidencial:cfg.confidencial
};
};
window.aplicarPlanoRemotoV38=function(rem){
if(!rem)return false;
var atual=empresaAtualV38();
var mesclada=Object.assign({},atual,rem);
if(atual.senha&&!mesclada.senha)mesclada.senha=atual.senha;
salvarLocalV38(mesclada);
return true;
};
window.sincronizarPlanoSeguroV38=function(){
try{
var c=cnpjV38(sessionStorage.getItem("empresaCnpj"));
if(!c||typeof window.apiEmpregaMaisGet!=="function")return Promise.resolve(false);
var resposta=window.apiEmpregaMaisGet("empresa&amp;cnpj="+encodeURIComponent(c));
if(!resposta||typeof resposta.then!=="function")return Promise.resolve(false);
return resposta.then(function(r){
var rem=r&&r.empresa?r.empresa:null;
return window.aplicarPlanoRemotoV38(rem);
}).catch(function(e){
console.warn("Sincronizacao de plano ignorada para preservar o painel.",e);
return false;
});
}catch(e){
console.warn("Sincronizacao de plano ignorada.",e);
return Promise.resolve(false);
}
};
window.addEventListener("load",function(){
setTimeout(function(){
try{window.sincronizarPlanoSeguroV38();}catch(e){}
},1200);
});
})();
//
;
//
(function(){
function normV40(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic")v="basico";
return v;
}
function compatibilizarEmpresaV40(emp){
if(!emp||typeof emp!=="object")return emp;
var plano=normV40(
emp.plano ||
emp.planoId ||
emp.plano_id ||
emp.planoNome ||
emp.plano_nome ||
""
);
if(plano&&["basico","trimestral","semestral","anual"].indexOf(plano)>=0){
emp.plano=plano;
emp.planoId=plano;
}
if(!emp.planoValidoAte && emp.plano_valido_ate){
emp.planoValidoAte=emp.plano_valido_ate;
}
if(typeof emp.planoSemCobranca==="undefined" && typeof emp.plano_sem_cobranca!=="undefined"){
emp.planoSemCobranca=emp.plano_sem_cobranca;
}
if(!emp.verificacaoStatus && emp.verificacao_status){
emp.verificacaoStatus=emp.verificacao_status;
}
if(!emp.statusVerificacao && emp.status_verificacao){
emp.statusVerificacao=emp.status_verificacao;
}
return emp;
}
function corrigirListaLocalV40(){
var chaves=["empresasEmpregaMais"];
for(var h=0;h<chaves.length;h++){
try{
var raw=localStorage.getItem(chaves[h]);
if(!raw)continue;
var lista=JSON.parse(raw);
if(!Array.isArray(lista))continue;
var mudou=false;
for(var i=0;i<lista.length;i++){
var antes=JSON.stringify(lista[i]);
compatibilizarEmpresaV40(lista[i]);
if(JSON.stringify(lista[i])!==antes)mudou=true;
}
if(mudou)localStorage.setItem(chaves[h],JSON.stringify(lista));
}catch(e){}
}
}
window.compatibilizarPlanoEmpresaV40=compatibilizarEmpresaV40;
window.corrigirPlanosLocaisV40=corrigirListaLocalV40;
try{corrigirListaLocalV40();}catch(e){}
})();
//
;
//
(function(){
window.addEventListener("popstate",function(){
try{
var pagina=new URL(window.location.href).searchParams.get("pagina")||"";
if(pagina==="painel-empresa"){
window.location.reload();
}
}catch(e){}
});
})();
//
;
//
(function(){
function planoV44(){
var e={};
try{if(typeof empresaLogadaPainelEM==="function")e=empresaLogadaPainelEM()||{};}catch(err){}
var p=String(e.plano||e.planoId||e.plano_id||e.planoNome||e.plano_nome||"").toLowerCase().trim();
if(p==="gratis"||p==="gratuito"||p==="free"||p==="basic")p="basico";
if(["trimestral","semestral","anual"].indexOf(p)<0)return "basico";
var validade=e.planoValidoAte||e.plano_valido_ate||"";
if(validade){
var fim=new Date(validade);
if(!isNaN(fim.getTime())&&fim.getTime()<Date.now())return "basico";
}
return p;
}
function nomeV44(p){
return p==="anual"?"Plano Anual":p==="semestral"?"Plano Semestral":p==="trimestral"?"Plano Trimestral":"Plano Basico";
}
function dataV44(v){
if(!v)return "";
var d=new Date(v);
if(isNaN(d.getTime()))return "";
return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear();
}
function inserirV44(){
var p=planoV44();
document.body.classList.toggle("empresa-premium-v44",p!=="basico");
if(p==="basico")return;
var painel=document.getElementById("pagina-painel-empresa");
if(!painel)return;
var alvo=painel.querySelector(".painel-ref-conteudo-em")||painel.querySelector(".painel-ref-main-em")||painel;
if(!alvo.querySelector(".plano-premium-v44")){
var e={};try{if(typeof empresaLogadaPainelEM==="function")e=empresaLogadaPainelEM()||{};}catch(err){}
var validade=dataV44(e.planoValidoAte||e.plano_valido_ate||"");
var box=document.createElement("div");
box.className="plano-premium-v44";
box.innerHTML="<div class='plano-premium-info-v44'><div class='plano-premium-coroa-v44'>&amp;#9813;</div><div class='plano-premium-texto-v44'><strong>"+nomeV44(p)+" <span class='plano-premium-status-v44'>Ativo</span></strong><p>Todos os recursos do seu plano estao liberados"+(validade?"<br/>Valido ate "+validade:"")+"</p></div></div><button class='plano-premium-btn-v44' type='button'>Gerenciar plano</button>";
alvo.insertBefore(box,alvo.firstChild);
}
if(!alvo.querySelector(".recursos-premium-v44")){
var r=document.createElement("div");
r.className="recursos-premium-v44";
r.innerHTML="<h3>Recursos do seu plano</h3><div class='recursos-grid-v44'><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#8734;</span>Vagas do plano</div><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#9734;</span>Vagas em destaque</div><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#9889;</span>Selo Urgente</div><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#9638;</span>Pagina da empresa</div><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#128274;</span>Vagas confidenciais</div><div class='recurso-v44'><span class='recurso-icone-v44'>&amp;#9641;</span>Recursos avancados</div></div><div class='premium-msg-v44'><span>&amp;#9813;</span><span>Voc\u00EA tem acesso aos recursos incluidos no seu plano ativo.</span></div>";
alvo.appendChild(r);
}
}
window.aplicarVisualPremiumV44=inserirV44;
window.addEventListener("load",function(){setTimeout(inserirV44,900);});
setTimeout(inserirV44,1600);
})();
//
;
//
(function(){
var EMAIL_ADMIN="admin@empregamais.com.br";
function preparar(){
var campo=document.getElementById("adminLogin")||document.getElementById("adminEmail")||document.getElementById("loginAdminEmail");
if(campo){
campo.value=EMAIL_ADMIN;
campo.setAttribute("autocomplete","username");
}
var senha=document.getElementById("adminSenha")||document.getElementById("loginAdminSenha");
if(senha)senha.setAttribute("autocomplete","current-password");
}
document.addEventListener("DOMContentLoaded",preparar);
setTimeout(preparar,300);
})();
//
;
//
(function(){
var KEY="empregaMaisPlanoConfirmadoV48";
function norm(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic")v="basico";
return ["basico","trimestral","semestral","anual"].indexOf(v)>=0?v:"";
}
function pago(p){return ["trimestral","semestral","anual"].indexOf(norm(p))>=0;}
function empresa(){
try{
if(typeof empresaLogadaPainelEM==="function"){
var e=empresaLogadaPainelEM();
if(e)return e;
}
}catch(e){}
return {};
}
function identidade(e){
e=e||{};
return String(e.cnpj||sessionStorage.getItem("empresaCnpj")||e.email||sessionStorage.getItem("empresaEmail")||"")
.replace(/\s/g,"").toLowerCase();
}
function validade(e){
return e.planoValidoAte||e.plano_valido_ate||"";
}
function valido(e,p){
if(!pago(p))return false;
var v=validade(e);
if(!v)return true;
var d=new Date(v);
return isNaN(d.getTime())||d.getTime()>=Date.now();
}
function lerConfirmado(e){
try{
var x=JSON.parse(sessionStorage.getItem(KEY)||"null");
if(!x||x.id!==identidade(e)||!pago(x.plano))return null;
if(x.validoAte){
var d=new Date(x.validoAte);
if(!isNaN(d.getTime())&&d.getTime()<Date.now())return null;
}
return x;
}catch(err){return null;}
}
function confirmar(e,p){
if(!valido(e,p))return;
try{
sessionStorage.setItem(KEY,JSON.stringify({
id:identidade(e),plano:p,validoAte:validade(e)||""
}));
}catch(err){}
}
function planoFinal(){
var e=empresa();
var p=norm(e.plano_id||e.plano||e.planoId||e.plano_nome||e.planoNome||"");
var c=lerConfirmado(e);
if(valido(e,p)){confirmar(e,p);return p;}
if(c)return c.plano;
return p||"basico";
}
window.planoRecrutadorEstavelV48=planoFinal;
function aplicar(){
var p=planoFinal(),isPago=pago(p);
document.body.classList.toggle("empresa-premium-v48",isPago);
document.body.classList.toggle("empresa-premium-v44",isPago);
var nome={basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[p]||"B\u00E1sico";
document.querySelectorAll(".recrutador-plano-em strong").forEach(function(el){el.textContent=nome;});
try{if(isPago&&typeof aplicarVisualPremiumV44==="function")aplicarVisualPremiumV44();}catch(e){}
}
window.aplicarPlanoEstavelV48=aplicar;
var anterior=window.planoAtivoEmpresaV38;
window.planoAtivoEmpresaV38=function(){
var p=planoFinal();
return p||((typeof anterior==="function"&&anterior())||"basico");
};
window.addEventListener("load",function(){
setTimeout(aplicar,450);
setTimeout(aplicar,1200);
setTimeout(aplicar,2400);
});
document.addEventListener("empregamais:empresa-sincronizada",aplicar);
})();
//
;
//
(function(){
function aplicarV49(){
var e={};
try{e=empresaLogadaPainelEM()||{};}catch(x){}
var p=String(e.plano_id||e.plano||e.planoId||"basico").toLowerCase();
var pago=["trimestral","semestral","anual"].indexOf(p)>=0;
if(pago&&(e.plano_valido_ate||e.planoValidoAte)){
var d=new Date(e.plano_valido_ate||e.planoValidoAte);
if(!isNaN(d.getTime())&&d.getTime()<Date.now())pago=false;
}
document.body.classList.toggle("empresa-premium-v49",pago);
document.body.classList.toggle("empresa-premium-v44",pago);
document.body.classList.toggle("empresa-premium-v48",pago);
}
window.aplicarPremiumV49=aplicarV49;
window.addEventListener("load",function(){
setTimeout(aplicarV49,250);
setTimeout(aplicarV49,800);
setTimeout(aplicarV49,1600);
});
document.addEventListener("empregamais:empresa-sincronizada",aplicarV49);
})();
//
;
//
(function(){
var KEY="empregaMaisUrgentesV50";
function emp(){
try{return empresaLogadaPainelEM()||{};}catch(e){return {};}
}
function plano(){
var e=emp();
return String(e.plano_id||e.plano||e.planoId||"basico").toLowerCase();
}
function limite(){
var p=plano();
return p==="anual"?10:p==="semestral"?7:p==="trimestral"?5:0;
}
function mes(){
var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
}
function eid(){
var e=emp();
return String(e.cnpj||e.email||"empresa").replace(/\W/g,"").toLowerCase();
}
function dados(){
try{
var all=JSON.parse(localStorage.getItem(KEY)||"{}");
var k=eid()+"_"+mes();
return {all:all,key:k,ids:Array.isArray(all[k])?all[k]:[]};
}catch(e){return {all:{},key:eid()+"_"+mes(),ids:[]};}
}
function usados(){return dados().ids.length;}
function restantes(){return Math.max(0,limite()-usados());}
function salvarId(id){
var d=dados(),s=String(id||Date.now());
if(d.ids.indexOf(s)<0)d.ids.push(s);
d.all[d.key]=d.ids;
localStorage.setItem(KEY,JSON.stringify(d.all));
}
function removerId(id){
var d=dados(),s=String(id||"");
d.ids=d.ids.filter(function(x){return String(x)!==s;});
d.all[d.key]=d.ids;localStorage.setItem(KEY,JSON.stringify(d.all));
}
function modal(){
var m=document.querySelector(".urgente-aviso-v50");
if(m)return m;
m=document.createElement("div");m.className="urgente-aviso-v50";
m.innerHTML="<div class='urgente-modal-v50'><div class='ico'>&amp;#9889;</div><h3></h3><p></p><div class='acoes'><button type='button' class='cancelar'>Cancelar</button><button type='button' class='ok'>Continuar</button></div></div>";
document.body.appendChild(m);
m.querySelector(".cancelar").onclick=function(){m.classList.remove("aberto");};
return m;
}
function avisar(titulo,texto,continuar){
var m=modal();m.querySelector("h3").textContent=titulo;m.querySelector("p").textContent=texto;
var ok=m.querySelector(".ok");
ok.onclick=function(){m.classList.remove("aberto");if(continuar)continuar();};
m.classList.add("aberto");
}
window.validarUrgentePlanoV50=function(vagaId,continuar){
var l=limite(),r=restantes();
if(!l)return false;
if(r<=0){
avisar("Limite mensal atingido",
"Voc\u00EA j\u00E1 utilizou todos os "+l+" selos de Contrata\u00E7\u00E3o Urgente incluidos no seu plano neste mes. Para liberar outro selo, remova o destaque urgente de uma vaga atual ou aguarde a renovacao mensal.",
null);
return true;
}
if(r===1){
avisar("Este \u00E9 o seu \u00FAltimo selo do m\u00EAs",
"Seu plano ainda possui 1 selo de Contrata\u00E7\u00E3o Urgente disponivel neste mes. Ao utiliza-lo, o limite mensal ser\u00E1 atingido. Para destacar outra vaga depois, ser\u00E1 necess\u00E1rio remover o selo urgente de uma vaga atual ou aguardar a renova\u00E7\u00E3o mensal.",
function(){salvarId(vagaId);if(continuar)continuar();});
return true;
}
salvarId(vagaId);if(continuar)continuar();return true;
};
window.removerUrgentePlanoV50=removerId;
window.creditosUrgentesV50=function(){return {limite:limite(),usados:usados(),restantes:restantes()};};
function limparCobranca(){
if(limite()<=0)return;
document.querySelectorAll("body *").forEach(function(el){
if(el.children.length>5)return;
var tx=String(el.textContent||"").toLowerCase();
if(tx.indexOf("contrata")>=0&&tx.indexOf("urgente")>=0&&
(tx.indexOf("r$ 9,90")>=0||tx.indexOf("r$9,90")>=0)){
el.innerHTML=el.innerHTML.replace(/R\$\s*9[,.]90/gi,"Inclu\u00EDdo no plano");
}
});
}
window.addEventListener("load",function(){setTimeout(limparCobranca,900);setTimeout(limparCobranca,1800);});
})();
//
;
//
(function(){
var REGRAS={
basico:{nome:"Plano Gratuito",vagas:3,destaques:0,urgentes:0,pago:false},
trimestral:{nome:"Plano Trimestral",vagas:50,destaques:10,urgentes:5,pago:true},
semestral:{nome:"Plano Semestral",vagas:100,destaques:20,urgentes:7,pago:true},
anual:{nome:"Plano Anual",vagas:300,destaques:40,urgentes:10,pago:true}
};
function emp(){
try{return empresaLogadaPainelEM()||{};}catch(e){return {};}
}
function norm(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic")v="basico";
return REGRAS[v]?v:"basico";
}
function plano(){
var e=emp(),p="";
try{if(typeof planoRecrutadorEstavelV48==="function")p=planoRecrutadorEstavelV48();}catch(x){}
if(!p)p=e.plano_id||e.plano||e.planoId||"basico";
return norm(p);
}
function regra(){return REGRAS[plano()]||REGRAS.basico;}
function vagas(){
try{return typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){}
try{return typeof carregarVagas==="function"?(carregarVagas()||[]):[];}catch(e){}
return [];
}
function ativa(v){
var s=String(v.status||"").toLowerCase();
return s!=="encerrada"&&s!=="excluida"&&s!=="cancelada";
}
function bool(v){return v===true||String(v).toLowerCase()==="true"||String(v)==="1";}
function urgentesAtivos(){
return vagas().filter(function(v){return ativa(v)&&bool(v.contratacaoUrgente||v.urgente);});
}
function destaquesAtivos(){
return vagas().filter(function(v){return ativa(v)&&bool(v.destaque);});
}
function localizar(id){
var a=vagas();
for(var i=0;i<a.length;i++)if(String(a[i].id)===String(id))return a[i];
return null;
}
function salvar(vaga){
try{
 if(typeof salvarVagaV9==="function"){
  salvarVagaV9(vaga);
 }else if(typeof carregarVagasPortal==="function"&&typeof salvarVagasPortal==="function"){
  var lista=carregarVagasPortal()||[],ok=false;
  for(var i=0;i<lista.length;i++)if(String(lista[i].id)===String(vaga.id)){lista[i]=Object.assign({},lista[i],vaga);ok=true;break;}
  if(ok)salvarVagasPortal(lista);
 }else{
  var keys=["vagasEmpregaMais","vagas"];
  keys.forEach(function(k){
   try{
    var a=JSON.parse(localStorage.getItem(k)||"[]"),achou=false;
    if(!Array.isArray(a))return;
    for(var j=0;j<a.length;j++)if(String(a[j].id)===String(vaga.id)){a[j]=Object.assign({},a[j],vaga);achou=true;break;}
    if(achou)localStorage.setItem(k,JSON.stringify(a));
   }catch(e){}
  });
 }
}catch(e){return false;}
try{if(typeof renderizarVagas==="function")renderizarVagas();}catch(x){}
return true;
}
async function persistirRecursoVagaV53(vaga,acao){
var anterior={destaque:vaga.destaque,destaqueAtivadoEm:vaga.destaqueAtivadoEm,contratacaoUrgente:vaga.contratacaoUrgente,urgente:vaga.urgente,contratacaoUrgentePagamentoStatus:vaga.contratacaoUrgentePagamentoStatus,contratacaoUrgenteValor:vaga.contratacaoUrgenteValor,contratacaoUrgenteAtivadoEm:vaga.contratacaoUrgenteAtivadoEm};
if(typeof apiEmpregaMaisPost==="function"){
 try{
  var r=await apiEmpregaMaisPost({acao:acao,id:vaga.id,destaque:!!vaga.destaque,contratacaoUrgente:!!vaga.contratacaoUrgente,urgente:!!vaga.urgente});
  if(!r||r.sucesso!==true)throw new Error((r&&r.erro)||"O servidor não confirmou a alteração.");
 }catch(e){
  Object.keys(anterior).forEach(function(k){vaga[k]=anterior[k];});
  throw e;
 }
}
if(!salvar(vaga))throw new Error("Não foi possível salvar a alteração da vaga.");
return true;
}
function atualizar(){
try{if(typeof montarPainelReferenciaRecrutadorEM==="function")montarPainelReferenciaRecrutadorEM();}catch(e){}
setTimeout(injetarAcoes,140);
setTimeout(atualizarFormulario,180);
setTimeout(cardPlano,220);
}
window.planoAtualEmpresaV9=function(){return plano();};
window.empresaAssinanteV9=function(){return regra().pago;};
window.podePublicarVagaV9=function(){
var r=regra(),a=vagas().filter(function(v){return String(v.status||"").toLowerCase()!=="excluida";});
return a.length<r.vagas;
};
window.resumoPlanoEmpresaV9=function(){
var r=regra();
return {pago:r.pago,plano:plano(),nome:r.nome,limite:r.vagas,
destaques:r.destaques,urgentes:r.urgentes,usadas:vagas().length};
};
function popup(titulo,texto,sim){
var m=document.querySelector(".urgente-aviso-v50");
if(!m&&typeof validarUrgentePlanoV50==="function"){
try{validarUrgentePlanoV50("__preparar__",function(){});}catch(e){}
m=document.querySelector(".urgente-aviso-v50");
if(m)m.classList.remove("aberto");
}
if(!m){
m=document.createElement("div");m.className="urgente-aviso-v50";
m.innerHTML="<div class='urgente-modal-v50'><div class='ico'>&amp;#9889;</div><h3></h3><p></p><div class='acoes'><button type='button' class='cancelar'>Cancelar</button><button type='button' class='ok'>Continuar</button></div></div>";
document.body.appendChild(m);
}
m.querySelector("h3").textContent=titulo;
m.querySelector("p").textContent=texto;
m.querySelector(".cancelar").onclick=function(){m.classList.remove("aberto");};
m.querySelector(".ok").onclick=function(){m.classList.remove("aberto");if(sim)sim();};
m.classList.add("aberto");
}
function ativarUrgente(id){
var v=localizar(id),r=regra();if(!v)return;
if(bool(v.contratacaoUrgente)){alert("O selo de Contrata\u00E7\u00E3o Urgente ja esta ativo nesta vaga.");return;}
if(!r.pago){
if(typeof abrirContratacaoUrgenteV9==="function")return abrirContratacaoUrgenteV9(id);
return;
}
var usados=urgentesAtivos().length,restam=r.urgentes-usados;
if(restam<=0){
popup("Limite de selos atingido",
"Seu "+r.nome+" permite "+r.urgentes+" vagas com Contrata\u00E7\u00E3o Urgente. Para utilizar o selo em outra vaga, retire o selo de uma vaga atual ou aguarde a renovacao do limite.");
return;
}
function concluir(){
v.contratacaoUrgente=true;
v.urgente=true;
v.contratacaoUrgentePagamentoStatus="incluido_plano";
v.contratacaoUrgenteValor=0;
v.contratacaoUrgenteAtivadoEm=new Date().toISOString();
persistirRecursoVagaV53(v,"atualizar_recursos_vaga").then(atualizar).catch(function(e){alert(e.message||"Não foi possível ativar a urgência.");});
}
if(restam===1){
popup("\u00DAltimo selo dispon\u00EDvel",
"Este \u00E9 o \u00FAltimo selo de Contrata\u00E7\u00E3o Urgente dispon\u00EDvel no seu "+r.nome+". Depois de utiliz\u00E1-lo, para destacar outra vaga com urgencia ser\u00E1 necess\u00E1rio retirar o selo de uma vaga atual ou aguardar a renova\u00E7\u00E3o do limite.",
concluir);
}else concluir();
}
window.ativarUrgentePlanoV53=ativarUrgente;
function alternarDestaque(id){
var v=localizar(id),r=regra();if(!v)return;
if(!r.pago){alert("Vagas em destaque est\u00E3o dispon\u00EDveis nos planos pagos.");return;}
if(bool(v.destaque)){v.destaque=false;v.destaqueAtivadoEm="";persistirRecursoVagaV53(v,"atualizar_recursos_vaga").then(atualizar).catch(function(e){alert(e.message||"Não foi possível remover o destaque.");});return;}
var usados=destaquesAtivos().length;
if(usados>=r.destaques){
popup("Limite de destaques atingido",
"Seu "+r.nome+" permite at\u00E9 "+r.destaques+" vagas em destaque ao mesmo tempo. Remova o destaque de uma vaga atual para destacar outra.");
return;
}
v.destaque=true;v.destaqueAtivadoEm=new Date().toISOString();persistirRecursoVagaV53(v,"atualizar_recursos_vaga").then(atualizar).catch(function(e){alert(e.message||"Não foi possível ativar o destaque.");});
}
window.alternarDestaquePlanoV53=alternarDestaque;
var abrirAntigo=window.abrirContratacaoUrgenteV9;
window.abrirContratacaoUrgenteV9=function(id){
if(regra().pago)return ativarUrgente(id);
return typeof abrirAntigo==="function"?abrirAntigo(id):false;
};
window.botaoUrgenteV9=function(v){
if(!v||!v.id)return "";
if(bool(v.contratacaoUrgente))return "<span class='em-urgente-v9'>&amp;#9889; CONTRATA\u00C7\u00C3O URGENTE</span>";
if(regra().pago){
return "<button class='acao-premium-v53 urgente' type='button' onclick='ativarUrgentePlanoV53(&amp;quot;"+String(v.id).replace(/"/g,"&amp;quot;")+"&amp;quot;)'>&amp;#9889; Urgente <small>incluido</small></button>";
}
return "<button class='em-urgente-btn-v9' type='button' onclick='abrirContratacaoUrgenteV9(&amp;quot;"+String(v.id).replace(/"/g,"&amp;quot;")+"&amp;quot;)'>&amp;#9889; Contrata\u00E7\u00E3o Urgente - R$ 9,90</button>";
};
function injetarAcoes(){
var p=document.getElementById("pagina-painel-empresa");if(!p)return;
var a=vagas(),linhas=p.querySelectorAll("tr");
for(var i=0;i<linhas.length;i++){
var linha=linhas[i],txt=linha.textContent||"",v=null;
for(var j=0;j<a.length;j++){
var tit=String(a[j].cargo||a[j].titulo||a[j].vaga||"");
if(tit&&txt.indexOf(tit)>=0){v=a[j];break;}
}
if(!v)continue;
var cells=linha.querySelectorAll("td");if(!cells.length)continue;
var ac=cells[cells.length-1];
ac.querySelectorAll(".em-urgente-btn-v9,.em-urgente-pendente-v9,.em-urgente-acoes-v10,.acao-premium-v53").forEach(function(x){x.remove();});
if(regra().pago){
var d=document.createElement("button");
d.type="button";d.className="acao-premium-v53 destaque";
d.innerHTML=bool(v.destaque)?"&amp;#9733; Remover destaque":"&amp;#9734; Destacar";
d.onclick=(function(id){return function(){alternarDestaque(id);};})(v.id);
ac.insertBefore(d,ac.firstChild);
var u=document.createElement("span");
u.innerHTML=window.botaoUrgenteV9(v);
if(u.firstChild)ac.insertBefore(u.firstChild,ac.firstChild);
}else{
var u2=document.createElement("span");u2.innerHTML=window.botaoUrgenteV9(v);
if(u2.firstChild)ac.insertBefore(u2.firstChild,ac.firstChild);
}
}
}
function atualizarFormulario(){
var box=document.querySelector(".opcao-urgente-em");
var check=document.getElementById("contratacaoUrgenteEmpregaMais");
if(!box||!check)return;
var r=regra();
if(r.pago){
var usados=urgentesAtivos().length,rest=Math.max(0,r.urgentes-usados);
var sp=box.querySelector("span"),sm=box.querySelector("small");
if(sp)sp.innerHTML="&amp;#9889; Contrata\u00E7\u00E3o Urgente <b>Inclu\u00EDdo no "+r.nome+"</b>";
if(sm)sm.textContent=rest+" de "+r.urgentes+" selos dispon\u00EDveis. O selo n\u00E3o gera cobran\u00E7a adicional.";
check.disabled=rest<=0;
}
}
function cardPlano(){
var p=document.getElementById("pagina-painel-empresa");if(!p)return;
var r=regra();
var old=p.querySelector(".recursos-plano-v53");if(old)old.remove();
if(!r.pago)return;
var e={};
try{e=typeof empresaLogadaPainelEM==="function"?(empresaLogadaPainelEM()||{}):{};}catch(x){}
var fim=e.plano_valido_ate||e.planoValidoAte||"";
var validade="Consulte";
if(fim){
var d=new Date(fim);
if(!isNaN(d.getTime()))validade=String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear();
}
var c=document.createElement("div");c.className="recursos-plano-v53 plano-faixa-v122";
c.innerHTML=
"<div class='plano-info-v122'>"+
"<span class='coroa-v122'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M3 7.2 7.2 10 12 4l4.8 6L21 7.2 19 18H5L3 7.2ZM5.5 20h13v1.5h-13z'/></svg></span>"+
"<div><small>SEU PLANO ATUAL</small><div class='plano-nome-v122'><strong>"+r.nome+"</strong><em>Ativo</em></div>"+
"<p>Mais oportunidades para sua empresa encontrar os melhores profissionais.</p></div>"+
"</div>"+
"<span><b>"+r.vagas+"</b><i>vagas incluídas</i></span>"+
"<span><b>"+destaquesAtivos().length+" / "+r.destaques+"</b><i>vagas em uso</i></span>"+
"<span><b>"+urgentesAtivos().length+" / "+r.urgentes+"</b><i>vagas urgentes</i></span>"+
"<span class='validade-v122'><svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='5' width='18' height='16' rx='2'/><path d='M7 3v4M17 3v4M3 10h18'/></svg><i>Válido até</i><b>"+validade+"</b></span>"+
"<button class='gerenciar-v122' type='button'>Gerenciar plano</button>";
c.querySelector(".gerenciar-v122").onclick=function(){
if(typeof abrirGerenciarPlanoEmpresaV81==="function"){abrirGerenciarPlanoEmpresaV81();return;}
var bt=document.querySelector("#painelReferenciaRecrutadorEM [data-ref-nav='planos']");
if(bt)bt.click();
};
var sec=p.querySelector(".recrutador-boasvindas-ref-em");
var cards=sec&&sec.querySelector(".recrutador-cards-ref-em");
if(sec&&cards)sec.insertBefore(c,cards);
else{
var main=p.querySelector(".recrutador-main-ref-em");
if(main)main.insertBefore(c,main.firstChild);
}
}
window.aplicarRecursosPlanoV53=function(){
document.body.classList.toggle("plano-pago-v53",regra().pago);
atualizarFormulario();injetarAcoes();cardPlano();
};
window.addEventListener("load",function(){
setTimeout(window.aplicarRecursosPlanoV53,500);
setTimeout(window.aplicarRecursosPlanoV53,1300);
setTimeout(window.aplicarRecursosPlanoV53,2500);
});
document.addEventListener("empregamais:empresa-sincronizada",function(){setTimeout(window.aplicarRecursosPlanoV53,120);});
})();
//
;
//
(function(){
function vagasV54(){
var todas=[];
try{todas=carregarVagasPortal()||[];}catch(e){todas=[];}
if(!Array.isArray(todas))todas=[];
/* O menu Gerenciar vaga só pode mapear vagas da empresa conectada.
   Usar todas as vagas do portal fazia títulos iguais apontarem para outra empresa. */
try{
 if(typeof vagaPertenceEmpresaAtual==="function"){
  return todas.filter(function(v){
   try{return vagaPertenceEmpresaAtual(v);}catch(x){return false;}
  });
 }
}catch(e){}
try{
 if(typeof vagasDaEmpresa==="function"){
  var proprias=vagasDaEmpresa()||[];
  if(Array.isArray(proprias))return proprias;
 }
}catch(e){}
return todas;
}
var mapaVagasV58={};
function reconstruirMapaV58(){
var a=vagasV54(),m={};
for(var i=0;i<a.length;i++)m[String(a[i].id)]=a[i];
mapaVagasV58=m;return a;
}
function acharV54(id){
var k=String(id);
if(mapaVagasV58[k])return mapaVagasV58[k];
reconstruirMapaV58();
return mapaVagasV58[k]||null;
}
function boolV54(v){return v===true||String(v).toLowerCase()==="true"||String(v)==="1";}
function escV54(s){
return String(s==null?"":s).replace(/&amp;/g,"&amp;amp;").replace(/</g,"&amp;lt;")
.replace(/>/g,"&amp;gt;").replace(/"/g,"&amp;quot;").replace(/'/g,"&amp;#39;");
}
function persistirV54(v){
var a=[];
try{a=carregarVagasPortal()||[];}catch(e){a=[];}
for(var i=0;i<a.length;i++){
if(String(a[i].id)===String(v.id)){a[i]=Object.assign({},a[i],v);break;}
}
try{salvarVagasPortal(a);}catch(e){}
try{if(typeof renderizarVagas==="function")renderizarVagas();}catch(e){}
}
function redesenharV54(){
try{
if(typeof montarPainelReferenciaRecrutadorEM==="function"){
montarPainelReferenciaRecrutadorEM();
}
}catch(e){}
setTimeout(aplicarBotoesV54,180);
setTimeout(function(){
try{if(typeof aplicarRecursosPlanoV53==="function")aplicarRecursosPlanoV53();}catch(e){}
setTimeout(aplicarBotoesV54,180);
},260);
}
function removerUrgenteV54(v){
v.contratacaoUrgente=false;v.urgente=false;
v.contratacaoUrgentePagamentoStatus="";
v.contratacaoUrgenteAtivadoEm="";
persistirV54(v);
try{if(typeof removerUrgentePlanoV50==="function")removerUrgentePlanoV50(v.id);}catch(e){}
redesenharV54();
setTimeout(function(){try{if(typeof atualizarTagsVagasV55==="function")atualizarTagsVagasV55();}catch(e){}},320);
}
function removerDestaqueV54(v){
v.destaque=false;v.destaqueAtivadoEm="";
persistirV54(v);redesenharV54();
setTimeout(function(){try{if(typeof atualizarTagsVagasV55==="function")atualizarTagsVagasV55();}catch(e){}},320);
}
function excluirV54(v){
if(!v||!v.id)return;
if(!window.confirm("Deseja retirar esta vaga? Ela será encerrada e mantida no histórico da empresa."))return;
/* A API disponível trata retirada de vaga como encerramento. Não removemos mais
   o registro local antes da confirmação do servidor, pois isso fazia a vaga
   desaparecer do painel e reaparecer após uma nova sincronização. */
if(typeof encerrarVagaRefEM==="function"){encerrarVagaRefEM(v.id);return;}
if(typeof encerrarVagaEmpresa==="function"){encerrarVagaEmpresa(v.id);return;}
if(typeof encerrarVaga==="function"){encerrarVaga(v.id);return;}
alert("Não foi possível iniciar o encerramento desta vaga.");
}
function fecharV54(){
var p=document.getElementById("popupAcoesVagaV54");if(p)p.classList.remove("aberto");
}
function itemV54(icone,titulo,sub,classe,fn){
var b=document.createElement("button");b.type="button";b.className="item-acao-v54 "+(classe||"");
b.innerHTML="<span class='ico'>"+icone+"</span><span class='txt'><span>"+escV54(titulo)+"</span>"+
(sub?"<small>"+escV54(sub)+"</small>":"")+"</span>";
b.onclick=function(){fecharV54();fn();};
return b;
}
var icons={
edit:"<svg viewBox='0 0 24 24'><path d='M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4'/></svg>",
cancel:"<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='M8 8l8 8M16 8l-8 8'/></svg>",
trash:"<svg viewBox='0 0 24 24'><path d='M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5'/></svg>",
star:"<svg viewBox='0 0 24 24'><path d='m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z'/></svg>",
bolt:"<svg viewBox='0 0 24 24'><path d='M13 2 5 14h6l-1 8 9-13h-6V2z'/></svg>"
};
function abrirV54(id){
var v=acharV54(id);if(!v)return;
var p=document.getElementById("popupAcoesVagaV54");
if(!p){
p=document.createElement("div");p.id="popupAcoesVagaV54";p.className="popup-acoes-v54";
p.innerHTML="<div class='caixa-acoes-v54'><div class='topo-acoes-v54'><div><small>A\u00C7\u00D5ES DA VAGA</small><strong id='tituloAcoesV54'></strong></div><button class='fechar-acoes-v54' type='button'>&times;</button></div><div class='lista-acoes-v54' id='listaAcoesV54'></div></div>";
document.body.appendChild(p);
p.querySelector(".fechar-acoes-v54").onclick=fecharV54;
p.onclick=function(e){if(e.target===p)fecharV54();};
}
p.querySelector("#tituloAcoesV54").textContent=v.cargo||v.titulo||v.vaga||"Vaga";
var l=p.querySelector("#listaAcoesV54");l.innerHTML="";
l.appendChild(itemV54(icons.edit,"Editar vaga","Alterar informa\u00E7\u00F5es da publica\u00E7\u00E3o","",function(){
if(typeof editarVagaRefEM==="function")editarVagaRefEM(v.id);
else if(typeof editarVagaEmpresa==="function")editarVagaEmpresa(v.id);
}));
var encerrada=String(v.status||"").toLowerCase()==="encerrada"||v.ativa===false;
if(!encerrada){
l.appendChild(itemV54(icons.cancel,"Cancelar vaga","Encerrar a publica\u00E7\u00E3o e manter no hist\u00F3rico","",function(){
if(typeof encerrarVagaRefEM==="function")encerrarVagaRefEM(v.id);
else if(typeof encerrarVagaEmpresa==="function")encerrarVagaEmpresa(v.id);
}));
}
var sep=document.createElement("div");sep.className="separador-acoes-v54";l.appendChild(sep);
if(boolV54(v.destaque)){
l.appendChild(itemV54(icons.star,"Remover destaque","Retirar a vaga da \u00E1rea de destaque","destaque",function(){removerDestaqueV54(v);}));
}else{
l.appendChild(itemV54(icons.star,"Colocar em destaque","Dar maior visibilidade a esta vaga","destaque",function(){
if(typeof alternarDestaquePlanoV53==="function")alternarDestaquePlanoV53(v.id);
}));
}
if(boolV54(v.contratacaoUrgente)||boolV54(v.urgente)){
l.appendChild(itemV54(icons.bolt,"Remover urg\u00EAncia","Retirar o selo Contrata\u00E7\u00E3o Urgente","urgente",function(){removerUrgenteV54(v);}));
}else{
l.appendChild(itemV54(icons.bolt,"Colocar em urg\u00EAncia","Ativar o selo Contrata\u00E7\u00E3o Urgente","urgente",function(){
if(typeof ativarUrgentePlanoV53==="function")ativarUrgentePlanoV53(v.id);
}));
}
var sep2=document.createElement("div");sep2.className="separador-acoes-v54";l.appendChild(sep2);
l.appendChild(itemV54(icons.trash,"Retirar vaga","Encerrar e manter esta vaga no histórico","perigo",function(){excluirV54(v);}));
p.classList.add("aberto");
}
function aplicarBotoesV54(){
var corpo=document.getElementById("corpoTabelaPainelRefEM");if(!corpo)return;
var a=reconstruirMapaV58(),porTitulo={};
for(var j=0;j<a.length;j++){
var tit=String(a[j].cargo||a[j].titulo||a[j].vaga||"").trim();
if(tit){
 if(!porTitulo[tit])porTitulo[tit]=[];
 porTitulo[tit].push(a[j]);
}
}
var linhas=corpo.querySelectorAll("tr");
for(var i=0;i<linhas.length;i++){
var tr=linhas[i],v=null,primeira=tr.querySelector("td");
if(!primeira)continue;
/* Prioriza o ID gravado na própria linha/card. Isso evita abrir a vaga errada
   quando a mesma empresa possui duas oportunidades com o mesmo cargo. */
var idLinha=tr.getAttribute("data-vaga-id")||tr.getAttribute("data-id")||
 (tr.querySelector("[data-vaga-id]")&&tr.querySelector("[data-vaga-id]").getAttribute("data-vaga-id"))||"";
if(idLinha)v=acharV54(idLinha);
if(!v){
 var texto=String(primeira.textContent||"").trim();
 var nomes=Object.keys(porTitulo);
 for(var n=0;n<nomes.length;n++){
  if(texto.indexOf(nomes[n])>=0){
   var candidatas=porTitulo[nomes[n]];
   if(candidatas.length===1)v=candidatas[0];
   break;
  }
 }
}
if(!v)continue;
var td=tr.querySelector("td:last-child");if(!td)continue;
var antigo=td.querySelector(".acao-menu-v54");
if(antigo){
antigo.setAttribute("data-vaga-id",String(v.id));
antigo.onclick=(function(id){return function(e){e.preventDefault();e.stopPropagation();abrirV54(id);};})(v.id);
continue;
}
var b=document.createElement("button");b.type="button";b.className="acao-menu-v54";
b.title="Gerenciar vaga";b.setAttribute("aria-label","Gerenciar vaga");b.setAttribute("data-vaga-id",String(v.id));
b.innerHTML="<span class='dots'>&#8230;</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4'/></svg>";
b.onclick=(function(id){return function(e){e.preventDefault();e.stopPropagation();abrirV54(id);};})(v.id);
td.appendChild(b);
}
}
window.aplicarBotoesV54=aplicarBotoesV54;
window.abrirAcoesVagaV54=abrirV54;
function prepararPopupV58(){
reconstruirMapaV58();
if(document.getElementById("popupAcoesVagaV54"))return;
var p=document.createElement("div");p.id="popupAcoesVagaV54";p.className="popup-acoes-v54";
p.innerHTML="<div class='caixa-acoes-v54'><div class='topo-acoes-v54'><div><small>A\u00C7\u00D5ES DA VAGA</small><strong id='tituloAcoesV54'></strong></div><button class='fechar-acoes-v54' type='button' aria-label='Fechar'>&times;</button></div><div class='lista-acoes-v54' id='listaAcoesV54'></div></div>";
document.body.appendChild(p);
p.querySelector(".fechar-acoes-v54").onclick=fecharV54;
p.onclick=function(e){if(e.target===p)fecharV54();};
}
window.addEventListener("load",function(){
prepararPopupV58();
setTimeout(aplicarBotoesV54,120);
setTimeout(aplicarBotoesV54,700);
});
var alvo=document.getElementById("corpoTabelaPainelRefEM");
if(alvo&&window.MutationObserver){
var timer=0;
new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++){
if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
}
if(!precisa)return;
clearTimeout(timer);timer=setTimeout(aplicarBotoesV54,60);
}).observe(alvo,{childList:true});
}
})();
//
;
//
(function(){
function vagas(){
try{return carregarVagasPortal()||[];}catch(e){}
try{return typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){}
return [];
}
function sim(v){return v===true||String(v).toLowerCase()==="true"||String(v)==="1";}
function acharLinha(v){
var corpo=document.getElementById("corpoTabelaPainelRefEM");if(!corpo)return null;
var linhas=corpo.querySelectorAll("tr"),tit=String(v.cargo||v.titulo||v.vaga||"");
for(var i=0;i<linhas.length;i++){
if(tit&&String(linhas[i].textContent||"").indexOf(tit)>=0)return linhas[i];
}
return null;
}
function svgStar(){return "<svg viewBox='0 0 24 24'><path d='m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z'/></svg>";}
function svgBolt(){return "<svg viewBox='0 0 24 24'><path d='M13 2 5 14h6l-1 8 9-13h-6V2z'/></svg>";}
function tags(){
var a=vagas();
for(var i=0;i<a.length;i++){
var v=a[i],tr=acharLinha(v);if(!tr)continue;
var td=tr.querySelector("td");if(!td)continue;
var old=td.querySelector(".tags-vaga-v55");if(old)old.remove();
if(!sim(v.destaque)&&!sim(v.contratacaoUrgente)&&!sim(v.urgente))continue;
var box=document.createElement("div");box.className="tags-vaga-v55";
if(sim(v.destaque)){
var d=document.createElement("span");d.className="tag-vaga-v55 destaque";
d.innerHTML=svgStar()+" Destaque";box.appendChild(d);
}
if(sim(v.contratacaoUrgente)||sim(v.urgente)){
var u=document.createElement("span");u.className="tag-vaga-v55 urgente";
u.innerHTML=svgBolt()+" Contrata\u00E7\u00E3o Urgente";box.appendChild(u);
}
td.appendChild(box);
}
}
window.atualizarTagsVagasV55=tags;
function refresh(){
setTimeout(tags,80);
setTimeout(function(){
try{if(typeof aplicarBotoesV54==="function")aplicarBotoesV54();}catch(e){}
tags();
},260);
}
window.addEventListener("load",function(){setTimeout(tags,650);setTimeout(tags,1500);setTimeout(tags,2700);});
document.addEventListener("empregamais:empresa-sincronizada",refresh);
var corpo=document.getElementById("corpoTabelaPainelRefEM");
if(corpo&&window.MutationObserver){
var tm=0;
new MutationObserver(function(){
clearTimeout(tm);tm=setTimeout(tags,100);
}).observe(corpo,{childList:true,subtree:true});
}
var ad=window.alternarDestaquePlanoV53;
if(typeof ad==="function"){
window.alternarDestaquePlanoV53=function(id){
var r=ad.apply(this,arguments);setTimeout(refresh,220);return r;
};
}
var au=window.ativarUrgentePlanoV53;
if(typeof au==="function"){
window.ativarUrgentePlanoV53=function(id){
var r=au.apply(this,arguments);setTimeout(refresh,220);return r;
};
}
})();
//
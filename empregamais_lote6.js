/* EmpregaMais - JavaScript externo - lote 6 */

//
(function(){
var etapaAtualV132=0, etapasV132=[];
function encontrarSecoes(){
var form=document.getElementById("formVaga");
if(!form)return [];
var titulos=Array.from(form.querySelectorAll(".publicar-secao-titulo-em"));
if(titulos.length<2)return [];
var grupos=[];
titulos.forEach(function(titulo,idx){
var itens=[titulo], el=titulo.nextElementSibling;
var proximo=titulos[idx+1]||null;
while(el && el!==proximo){
if(!el.classList.contains("navegacao-v132"))itens.push(el);
el=el.nextElementSibling;
}
grupos.push(itens);
});
return grupos;
}
function atualizarPassos(){
var barra=document.querySelector("#pagina-publicar .publicar-etapas-em");
if(!barra)return;
var spans=Array.from(barra.querySelectorAll("span"));
spans.forEach(function(sp,i){
sp.classList.add("passo-v132");
sp.classList.toggle("ativo-v132",i===etapaAtualV132);
sp.classList.toggle("concluido-v132",i<etapaAtualV132);
sp.onclick=function(){
if(i<=etapaAtualV132)mostrarEtapa(i,false);
};
});
}
function validarEtapa(idx){
if(!etapasV132[idx])return true;
var campos=[];
etapasV132[idx].forEach(function(el){
campos=campos.concat(Array.from(el.querySelectorAll ? el.querySelectorAll("input,select,textarea") : []));
if(el.matches&&el.matches("input,select,textarea"))campos.push(el);
});
for(var i=0;i<campos.length;i++){
var c=campos[i];
if(c.disabled || c.type==="hidden" || c.offsetParent===null)continue;
if(c.required && !String(c.value||"").trim()){
if(typeof c.reportValidity==="function")c.reportValidity();
c.focus();
return false;
}
}
return true;
}
function mostrarEtapa(idx,validar){
if(!etapasV132.length)return;
if(validar && idx>etapaAtualV132 && !validarEtapa(etapaAtualV132))return;
idx=Math.max(0,Math.min(idx,etapasV132.length-1));
etapaAtualV132=idx;
etapasV132.forEach(function(grupo,i){
grupo.forEach(function(el){
el.classList.toggle("etapa-v132-ativa",i===idx);
el.classList.toggle("etapa-v132-oculta",i!==idx);
});
});
atualizarPassos();
atualizarNavegacao();
var card=document.querySelector("#pagina-publicar .form-card");
if(card){
var y=card.getBoundingClientRect().top+window.scrollY-82;
window.scrollTo({top:Math.max(0,y),behavior:"smooth"});
}
}
function atualizarNavegacao(){
var nav=document.getElementById("navegacaoV132");
if(!nav)return;
var ant=nav.querySelector("[data-ant]");
var prox=nav.querySelector("[data-prox]");
var info=nav.querySelector(".nav-esquerda-v132");
if(ant)ant.disabled=etapaAtualV132===0;
if(info)info.textContent="Etapa "+(etapaAtualV132+1)+" de "+etapasV132.length;
if(prox){
if(etapaAtualV132===etapasV132.length-1){
prox.textContent="Revisar e publicar";
prox.onclick=function(){
var submit=document.querySelector("#pagina-publicar #formVaga button[type='submit'],#pagina-publicar #formVaga input[type='submit']");
if(submit)submit.click();
};
}else{
prox.textContent="Continuar";
prox.onclick=function(){mostrarEtapa(etapaAtualV132+1,true)};
}
}
}
function montar(){
var form=document.getElementById("formVaga");
if(!form || form.dataset.etapasV132==="1")return;
etapasV132=encontrarSecoes();
if(etapasV132.length<2)return;
form.dataset.etapasV132="1";
var nav=document.createElement("div");
nav.id="navegacaoV132";
nav.className="navegacao-v132";
nav.innerHTML='<div class="nav-esquerda-v132"></div><div class="nav-botoes-v132"><button class="btn-etapa-v132" data-ant="1" type="button">Voltar</button><button class="btn-etapa-v132 primario" data-prox="1" type="button">Continuar</button></div>';
form.appendChild(nav);
nav.querySelector("[data-ant]").onclick=function(){mostrarEtapa(etapaAtualV132-1,false)};
var submit=form.querySelector("button[type='submit'],input[type='submit']");
if(submit && !submit.closest(".navegacao-v132")){
var wrap=submit.parentElement;
if(wrap)wrap.classList.add("submit-original-v132");
}
mostrarEtapa(0,false);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",montar);
else montar();
window.addEventListener("load",function(){setTimeout(montar,180)});
window.EmpregaMaisPublicacaoEtapasV132={mostrar:mostrarEtapa};
})();
//
;
//
(function(){
if(window.EmpregaMaisLoadingV134)return;
var timerOverlay=null;
var botaoAtual=null;
function criarOverlay(){
var ov=document.getElementById("emLoadingGlobalV134");
if(ov)return ov;
ov=document.createElement("div");
ov.id="emLoadingGlobalV134";
ov.setAttribute("aria-live","polite");
ov.setAttribute("aria-busy","true");
ov.innerHTML='<div class="loading-box-v134"><span class="spinner-v134"></span><span><strong id="emLoadingTituloV134">Aguarde...</strong><small id="emLoadingSubV134">Estamos processando sua solicitação.</small></span></div>';
document.body.appendChild(ov);
return ov;
}
function textoAcao(el){
var txt=String((el&&((el.getAttribute("aria-label")||"")+" "+(el.textContent||"")+" "+(el.value||"")))||"").toLowerCase();
if(/entrar|login|acessar/.test(txt))return ["Entrando...","Validando seus dados."];
if(/publicar.*vaga|enviar.*vaga|cadastrar.*vaga/.test(txt))return ["Publicando vaga...","Aguarde enquanto enviamos as informações."];
if(/candidatar|enviar.*candidat|enviar.*curr[ií]culo/.test(txt))return ["Enviando candidatura...","Aguarde enquanto processamos sua candidatura."];
if(/criar.*conta|cadastrar|registrar/.test(txt))return ["Criando sua conta...","Estamos preparando seu acesso."];
if(/salvar|atualizar|alterar/.test(txt))return ["Salvando...","Aguarde enquanto registramos as alterações."];
if(/aprovar/.test(txt))return ["Aprovando...","Estamos processando esta ação."];
if(/rejeitar|reprovar/.test(txt))return ["Processando...","Estamos atualizando o status."];
if(/excluir|remover/.test(txt))return ["Removendo...","Aguarde enquanto concluímos a operação."];
if(/verificar/.test(txt))return ["Verificando...","Aguarde um instante."];
return ["Aguarde...","Estamos processando sua solicitação."];
}
function textoBotao(titulo){
return titulo.replace(/\.\.\.$/,"");
}
function iniciar(el,forcarOverlay){
if(!el || el.classList.contains("em-processando-v134"))return;
var mensagens=textoAcao(el);
el.dataset.emHtmlOriginalV134=el.innerHTML;
el.dataset.emDisabledOriginalV134=el.disabled?"1":"0";
el.classList.add("em-processando-v134");
el.disabled=true;
el.innerHTML='<span class="em-spinner-btn-v134"></span>'+textoBotao(mensagens[0]);
botaoAtual=el;
clearTimeout(timerOverlay);
timerOverlay=setTimeout(function(){
var ov=criarOverlay();
var t=document.getElementById("emLoadingTituloV134");
var st=document.getElementById("emLoadingSubV134");
if(t)t.textContent=mensagens[0];
if(st)st.textContent=mensagens[1];
ov.classList.add("ativo");
document.body.classList.add("em-bloqueado-v134");
},forcarOverlay===false?650:320);
}
function finalizar(el){
clearTimeout(timerOverlay);
var ov=document.getElementById("emLoadingGlobalV134");
if(ov)ov.classList.remove("ativo");
document.body.classList.remove("em-bloqueado-v134");
el=el||botaoAtual;
if(el && el.dataset.emHtmlOriginalV134!==undefined){
el.innerHTML=el.dataset.emHtmlOriginalV134;
el.disabled=el.dataset.emDisabledOriginalV134==="1";
delete el.dataset.emHtmlOriginalV134;
delete el.dataset.emDisabledOriginalV134;
el.classList.remove("em-processando-v134");
}
if(el===botaoAtual)botaoAtual=null;
}
function ehAcaoProcessavel(el){
return false;
}
document.addEventListener("click",function(ev){
var el=ev.target&&ev.target.closest?ev.target.closest("button,input[type='submit'],a"):null;
if(!ehAcaoProcessavel(el))return;
var form=el.form||el.closest&&el.closest("form");
if(form && typeof form.checkValidity==="function" && !form.checkValidity())return;
iniciar(el,true);
setTimeout(function(){
if(document.visibilityState==="visible" && el.classList.contains("em-processando-v134")){
finalizar(el);
}
},15000);
},true);
document.addEventListener("submit",function(ev){
var form=ev.target;
if(!form || (typeof form.checkValidity==="function" && !form.checkValidity()))return;
/* O formulário de vagas possui fluxo próprio (V221). Não abrir o loader global aqui. */
if(form.id==="formVaga")return;
var el=form.querySelector("button[type='submit'],input[type='submit']");
if(el && !el.classList.contains("em-processando-v134"))iniciar(el,true);
},true);
window.addEventListener("pageshow",function(){finalizar()});
window.addEventListener("beforeunload",function(){
clearTimeout(timerOverlay);
});
window.EmpregaMaisLoadingV134={
iniciar:iniciar,
finalizar:finalizar,
mostrar:function(titulo,subtitulo){
clearTimeout(timerOverlay);
var ov=criarOverlay();
var t=document.getElementById("emLoadingTituloV134");
var st=document.getElementById("emLoadingSubV134");
if(t)t.textContent=titulo||"Aguarde...";
if(st)st.textContent=subtitulo||"Estamos processando sua solicitação.";
ov.classList.add("ativo");
document.body.classList.add("em-bloqueado-v134");
},
ocultar:function(){finalizar()}
};
})();
//
;
//
(function(){
if(!window.EmpregaMaisLoadingV134)return;
var api=window.EmpregaMaisLoadingV134;
var emAndamento=0;
function mensagemPorFormulario(form,submit){
var id=((form&&form.id)||"").toLowerCase();
var txt=String((submit&&((submit.textContent||"")+" "+(submit.value||"")))||"").toLowerCase();
if(/login|entrar|acesso/.test(id+" "+txt))
return ["Entrando...","Validando seus dados."];
if(/vaga|publicar/.test(id+" "+txt))
return ["Publicando vaga...","Enviando as informações da oportunidade."];
if(/candidat|curriculo|currículo/.test(id+" "+txt))
return ["Enviando candidatura...","Processando sua candidatura."];
if(/cadastro|registr|conta/.test(id+" "+txt))
return ["Criando sua conta...","Preparando seu acesso."];
if(/perfil|salvar|editar|atualizar/.test(id+" "+txt))
return ["Salvando...","Registrando suas alterações."];
return ["Processando...","Aguarde enquanto concluímos esta ação."];
}
function iniciarReal(titulo,subtitulo){
emAndamento++;
api.mostrar(titulo||"Processando...",subtitulo||"Aguarde enquanto concluímos esta ação.");
}
function finalizarReal(){
emAndamento=Math.max(0,emAndamento-1);
if(emAndamento===0)api.ocultar();
}
document.addEventListener("click",function(ev){
var el=ev.target&&ev.target.closest?ev.target.closest("a,button,input[type='submit']"):null;
if(!el)return;
if(el.tagName==="A" || String(el.type||"").toLowerCase()==="button"){
el.setAttribute("data-sem-loading","1");
}
},true);
document.addEventListener("submit",function(ev){
var form=ev.target;
if(!form || (typeof form.checkValidity==="function" && !form.checkValidity()))return;
var submit=(ev.submitter)||form.querySelector("button[type='submit'],input[type='submit']");
if(submit)submit.setAttribute("data-sem-loading","1");
var m=mensagemPorFormulario(form,submit);
setTimeout(function(){
if(!ev.defaultPrevented || form.dataset.loadingRealV136==="1"){
iniciarReal(m[0],m[1]);
}
},0);
},true);
window.EmpregaMaisProcessamentoV136={
iniciar:iniciarReal,
finalizar:finalizarReal,
login:function(){iniciarReal("Entrando...","Validando seus dados.");},
publicarVaga:function(){iniciarReal("Publicando vaga...","Enviando as informações da oportunidade.");},
candidatura:function(){iniciarReal("Enviando candidatura...","Processando sua candidatura.");},
salvar:function(){iniciarReal("Salvando...","Registrando suas alterações.");},
cadastro:function(){iniciarReal("Criando sua conta...","Preparando seu acesso.");}
};
window.addEventListener("pageshow",function(){
emAndamento=0;
api.ocultar();
});
})();
//
;
//
(function(){
if(window.__menuEmpresaOriginalV140)return;
window.__menuEmpresaOriginalV140=true;
function atualizarIdentidadeEmpresaV140(){
var topo=document.getElementById("nomeEmpresaTopo");
var menu=document.getElementById("nomeEmpresaMenuV140");
var avatar=document.querySelector("#menuContaEmpresa .menu-empresa-avatar-v140");
if(!menu)return;
var nome=(topo&&topo.textContent||"").replace(/\s+/g," ").trim();
if(!nome || nome==="Empresa"){
nome=sessionStorage.getItem("empresaNome")||localStorage.getItem("empresaNome")||"Empresa";
}
menu.textContent=nome;
if(avatar)avatar.textContent=(nome.charAt(0)||"E").toUpperCase();
}
document.addEventListener("click",function(ev){
var topo=document.getElementById("contaEmpresaTopo");
var menu=document.getElementById("menuContaEmpresa");
if(!topo||!menu)return;
if(menu.classList.contains("ativo") && !topo.contains(ev.target)){
menu.classList.remove("ativo");
}
});
atualizarIdentidadeEmpresaV140();
setTimeout(atualizarIdentidadeEmpresaV140,500);
setTimeout(atualizarIdentidadeEmpresaV140,1500);
})();
//
;
//
(function(){
if(window.__EmpregaMaisV145)return;
window.__EmpregaMaisV145=true;
var SUPA="https://mkezlcewyengejdmtppl.supabase.co";
var KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
function tokenEmpresa(){
try{
return sessionStorage.getItem("empregaMaisSupabaseAccessToken")||
localStorage.getItem("empregaMaisSupabaseAccessToken")||
sessionStorage.getItem("empregaMaisSupabaseEmpresaAccessToken")||
localStorage.getItem("empregaMaisSupabaseEmpresaAccessToken")||"";
}catch(e){return "";}
}
async function sincronizarPlanoPublicacaoV145(){
var t=tokenEmpresa();
if(!t)return false;
try{
var r=await fetch(SUPA+"/rest/v1/empresas?select=id,plano_id,plano_nome,plano_valido_ate,plano_inicio,plano_sem_cobranca&amp;limit=1",{
headers:{"apikey":KEY,"Authorization":"Bearer "+t}
});
if(!r.ok)return false;
var d=await r.json(),emp=Array.isArray(d)?d[0]:null;
if(!emp)return false;
var p=String(emp.plano_id||"basico").toLowerCase().trim();
try{
localStorage.setItem("planoEmpresaEmpregaMais",p);
sessionStorage.setItem("planoEscolhidoEmpregaMais",p);
}catch(e){}
try{
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
if(Array.isArray(lista)){
var cnpj=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var email=String(sessionStorage.getItem("empresaEmail")||"").toLowerCase();
lista.forEach(function(x){
var xc=String(x.cnpj||"").replace(/\D/g,"");
var xe=String(x.email||"").toLowerCase();
if((cnpj&&xc===cnpj)||(email&&xe===email)){
x.plano=p;x.planoId=p;x.plano_id=p;
x.planoNome=emp.plano_nome||p;x.plano_nome=emp.plano_nome||p;
x.planoValidoAte=emp.plano_valido_ate||x.planoValidoAte;
x.plano_valido_ate=emp.plano_valido_ate||x.plano_valido_ate;
}
});
localStorage.setItem("empresasEmpregaMais",JSON.stringify(lista));
}
}catch(e){}
if(typeof atualizarCampoConfidencialEM==="function")atualizarCampoConfidencialEM();
if(typeof atualizarTipoContatoVaga==="function")atualizarTipoContatoVaga();
return true;
}catch(e){return false;}
}
window.sincronizarPlanoPublicacaoV145=sincronizarPlanoPublicacaoV145;
var irAntes=window.irPara;
if(typeof irAntes==="function"){
window.irPara=function(pagina){
var r=irAntes.apply(this,arguments);
if(pagina==="publicar"){
setTimeout(sincronizarPlanoPublicacaoV145,80);
setTimeout(sincronizarPlanoPublicacaoV145,700);
}
return r;
};
}
var DRAFT="empregaMaisRascunhoVagaV145";
function formVaga(){
return document.getElementById("formVaga")||
document.getElementById("formPublicarVaga")||
document.getElementById("form-publicar-vaga");
}
function salvarRascunho(){
var f=formVaga();if(!f)return;
var d={_salvoEm:Date.now()};
[].slice.call(f.elements||[]).forEach(function(el){
if(!el.name&&!el.id)return;
if(/password|file/i.test(el.type||""))return;
var k=el.name||el.id;
if(el.type==="checkbox"||el.type==="radio")d[k]=!!el.checked;
else d[k]=el.value;
});
try{localStorage.setItem(DRAFT,JSON.stringify(d));}catch(e){}
}
function restaurarRascunho(){
var f=formVaga();if(!f)return;
var d=null;
try{d=JSON.parse(localStorage.getItem(DRAFT)||"null");}catch(e){}
if(!d||!d._salvoEm)return;
if(Date.now()-Number(d._salvoEm)>2592000000){
try{localStorage.removeItem(DRAFT);}catch(e){}
return;
}
[].slice.call(f.elements||[]).forEach(function(el){
var k=el.name||el.id;if(!k||typeof d[k]==="undefined")return;
if(el.type==="checkbox"||el.type==="radio")el.checked=!!d[k];
else if(!el.value)el.value=d[k];
try{el.dispatchEvent(new Event("change",{bubbles:true}));}catch(e){}
});
}
document.addEventListener("input",function(e){
var f=formVaga();if(f&&f.contains(e.target))salvarRascunho();
},true);
document.addEventListener("change",function(e){
var f=formVaga();if(f&&f.contains(e.target))salvarRascunho();
},true);
window.restaurarRascunhoVagaV145=restaurarRascunho;
window.limparRascunhoVagaV145=function(){
try{localStorage.removeItem(DRAFT);}catch(e){}
};
window.addEventListener("load",function(){
setTimeout(function(){
restaurarRascunho();
sincronizarPlanoPublicacaoV145();
},650);
});
var renderFilaOriginal=window.renderizarFilaPendentesAdmin;
var sincronizandoFila=false;
function statusFila(msg,ativo){
var lista=document.getElementById("adminListaPendentes");
if(!lista)return;
var el=document.getElementById("adminStatusPendentesV145");
if(!el){
el=document.createElement("div");
el.id="adminStatusPendentesV145";
lista.parentNode.insertBefore(el,lista);
}
el.textContent=msg||"";
el.classList.toggle("ativo",!!ativo);
}
window.renderizarFilaPendentesAdmin=function(){
if(sincronizandoFila){
if(typeof renderFilaOriginal==="function")return renderFilaOriginal();
return;
}
if(typeof sincronizarVagasGoogleSheets!=="function"){
if(typeof renderFilaOriginal==="function")return renderFilaOriginal();
return;
}
sincronizandoFila=true;
statusFila("Atualizando vagas pendentes...",true);
return sincronizarVagasGoogleSheets()
.catch(function(e){
console.warn("EmpregaMais V145 - fila admin:",e);
})
.then(function(){
sincronizandoFila=false;
statusFila("",false);
if(typeof renderFilaOriginal==="function")return renderFilaOriginal();
});
};
var rotaAntes=window.lerRotaUrl;
if(typeof rotaAntes==="function"){
window.lerRotaUrl=function(){
var r=rotaAntes.apply(this,arguments);
setTimeout(function(){
var p=document.getElementById("pagina-painel-admin");
if(p && (p.classList.contains("ativa") || p.style.display!=="none")){
window.renderizarFilaPendentesAdmin();
}
},250);
return r;
};
}
window.atualizarFilaAdminV145=function(){
return window.renderizarFilaPendentesAdmin();
};
})();
//
;
//
(function(){
if(window.__EmpregaMaisV146)return;
window.__EmpregaMaisV146=true;
var SUPA="https://mkezlcewyengejdmtppl.supabase.co";
var KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
function tokenEmpresaV146(){
try{
return sessionStorage.getItem("empregaMaisSupabaseAccessToken")||
localStorage.getItem("empregaMaisSupabaseAccessToken")||
sessionStorage.getItem("empregaMaisSupabaseEmpresaAccessToken")||
localStorage.getItem("empregaMaisSupabaseEmpresaAccessToken")||"";
}catch(e){return "";}
}
function normPlanoV146(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic"||v==="essencial")return "basico";
if(v==="profissional")return "trimestral";
if(v==="premium")return "anual";
return ["basico","trimestral","semestral","anual"].indexOf(v)>=0?v:"basico";
}
async function sincronizarPlanoV146(){
var t=tokenEmpresaV146();
if(!t)return false;
try{
var r=await fetch(
SUPA+"/rest/v1/empresas?select=id,cnpj,email,email_corporativo,nome,nome_fantasia,razao_social,plano_id,plano_nome,plano_valido_ate,plano_inicio,plano_sem_cobranca,verificada,verificacao_status&amp;limit=1",
{headers:{"apikey":KEY,"Authorization":"Bearer "+t}}
);
if(!r.ok)return false;
var d=await r.json();
var emp=Array.isArray(d)?d[0]:null;
if(!emp)return false;
var p=normPlanoV146(emp.plano_id||emp.plano_nome);
emp.plano=p;
emp.planoId=p;
emp.plano_id=p;
emp.planoNome=emp.plano_nome||p;
emp.planoValidoAte=emp.plano_valido_ate||"";
emp.verificacaoStatus=emp.verificacao_status||"";
try{
sessionStorage.setItem("empregaMaisEmpresaRemotaV49",JSON.stringify(emp));
localStorage.setItem("planoEmpresaEmpregaMais",p);
sessionStorage.setItem("planoEscolhidoEmpregaMais",p);
}catch(e){}
try{
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
if(Array.isArray(lista)){
var cnpj=String(emp.cnpj||sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var email=String(emp.email||emp.email_corporativo||sessionStorage.getItem("empresaEmail")||"").toLowerCase();
var achou=false;
lista.forEach(function(x){
var xc=String(x.cnpj||"").replace(/\D/g,"");
var xe=String(x.email||x.email_corporativo||"").toLowerCase();
if((cnpj&&xc===cnpj)||(email&&xe===email)){
achou=true;
x.plano=p;x.planoId=p;x.plano_id=p;
x.planoNome=emp.plano_nome||p;x.plano_nome=emp.plano_nome||p;
x.planoValidoAte=emp.plano_valido_ate||"";
x.plano_valido_ate=emp.plano_valido_ate||"";
x.planoSemCobranca=!!emp.plano_sem_cobranca;
x.plano_sem_cobranca=!!emp.plano_sem_cobranca;
x.verificada=emp.verificada===true;
x.verificacaoStatus=emp.verificacao_status||x.verificacaoStatus;
}
});
if(achou)localStorage.setItem("empresasEmpregaMais",JSON.stringify(lista));
}
}catch(e){}
try{
if(typeof window.aplicarRecursosPlanoPublicacaoEmpregaMais==="function")
window.aplicarRecursosPlanoPublicacaoEmpregaMais();
}catch(e){}
try{
if(typeof window.prepararContatoPublicacao==="function")
window.prepararContatoPublicacao();
}catch(e){}
try{
if(typeof window.atualizarCampoConfidencialEM==="function")
window.atualizarCampoConfidencialEM();
}catch(e){}
try{
if(typeof window.atualizarTipoContatoVaga==="function")
window.atualizarTipoContatoVaga();
}catch(e){}
try{
if(typeof window.montarCentralRecrutadorEM==="function"){
var pag=document.getElementById("pagina-painel-empresa");
if(pag&&pag.classList.contains("ativa"))window.montarCentralRecrutadorEM();
}
}catch(e){}
return true;
}catch(e){
console.warn("EmpregaMais V146 - plano:",e);
return false;
}
}
window.sincronizarPlanoPublicacaoV146=sincronizarPlanoV146;
var irV146=window.irPara;
if(typeof irV146==="function"){
window.irPara=function(pagina){
var r=irV146.apply(this,arguments);
if(pagina==="publicar"){
setTimeout(sincronizarPlanoV146,40);
setTimeout(sincronizarPlanoV146,450);
}
if(pagina==="painel-admin"){
setTimeout(atualizarAdminV146,80);
}
return r;
};
}
var DRAFT="empregaMaisRascunhoVagaV146";
function formV146(){
return document.getElementById("formVaga")||
document.getElementById("formPublicarVaga")||
document.getElementById("form-publicar-vaga");
}
function salvarDraftV146(){
var f=formV146();if(!f)return;
var d={_salvoEm:Date.now()};
[].slice.call(f.elements||[]).forEach(function(el){
var k=el.name||el.id;
if(!k||/password|file/i.test(el.type||""))return;
if(el.type==="checkbox"||el.type==="radio")d[k]=!!el.checked;
else d[k]=el.value;
});
try{localStorage.setItem(DRAFT,JSON.stringify(d));}catch(e){}
}
function restaurarDraftV146(){
var f=formV146();if(!f)return;
var d=null;
try{d=JSON.parse(localStorage.getItem(DRAFT)||"null");}catch(e){}
if(!d||!d._salvoEm)return;
if(Date.now()-Number(d._salvoEm)>2592000000){
try{localStorage.removeItem(DRAFT);}catch(e){}
return;
}
[].slice.call(f.elements||[]).forEach(function(el){
var k=el.name||el.id;
if(!k||typeof d[k]==="undefined")return;
if(el.type==="checkbox"||el.type==="radio")el.checked=!!d[k];
else if(!el.value)el.value=d[k];
try{el.dispatchEvent(new Event("change",{bubbles:true}));}catch(e){}
});
}
document.addEventListener("input",function(e){
var f=formV146();if(f&&f.contains(e.target))salvarDraftV146();
},true);
document.addEventListener("change",function(e){
var f=formV146();if(f&&f.contains(e.target))salvarDraftV146();
},true);
window.restaurarRascunhoVagaV146=restaurarDraftV146;
window.limparRascunhoVagaV146=function(){
try{localStorage.removeItem(DRAFT);}catch(e){}
try{localStorage.removeItem("empregaMaisRascunhoVagaV145");}catch(e){}
};
function normTxt(v){
return String(v==null?"":v).trim().toLowerCase();
}
function aprovacaoV146(v){
var a=normTxt(
v.aprovacao||
v.statusAprovacao||
v.status_aprovacao||
v.approvalStatus||
""
);
if(a==="aprovado")a="aprovada";
if(a==="reprovada"||a==="reprovado")a="rejeitada";
if(a==="aguardando aprovacao"||a==="aguardando aprovação"||a==="em analise"||a==="em análise")a="pendente";
if(!a){
var st=normTxt(v.status);
if(st==="pendente"||st==="aprovada"||st==="aprovado"||st==="rejeitada"||st==="reprovada"){
a=st;
if(a==="aprovado")a="aprovada";
if(a==="reprovada")a="rejeitada";
}
}
if(!a && (v.empresaCnpj||v.cnpj||v.empresaEmail||v.email))a="pendente";
return a||"aprovada";
}
function normalizarListaV146(){
var vagas=[];
try{vagas=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){}
if(!Array.isArray(vagas))vagas=[];
vagas.forEach(function(v){
if(!v||typeof v!=="object")return;
v.aprovacao=aprovacaoV146(v);
if(!v.empresa && v.empresaNome)v.empresa=v.empresaNome;
if(!v.empresaNome && v.empresa)v.empresaNome=v.empresa;
if(!v.empresaCnpj && v.cnpj)v.empresaCnpj=v.cnpj;
if(!v.cnpj && v.empresaCnpj)v.cnpj=v.empresaCnpj;
if(!v.dataPublicacao)v.dataPublicacao=v.data||v.criado_em||v.created_at||"";
});
return vagas;
}
function statusAdminV146(msg,ativo){
var lista=document.getElementById("adminListaPendentes");
if(!lista)return;
var el=document.getElementById("adminStatusPendentesV146");
if(!el){
el=document.createElement("div");
el.id="adminStatusPendentesV146";
lista.parentNode.insertBefore(el,lista);
}
el.textContent=msg||"";
el.classList.toggle("ativo",!!ativo);
}
function renderFilaV146(){
var bloco=document.getElementById("adminListaPendentes");
var contador=document.getElementById("adminFilaPendentesNumero");
if(!bloco)return;
var vagas=normalizarListaV146();
var pendentes=vagas.filter(function(v){
return normTxt(v.status)!=="encerrada" && aprovacaoV146(v)==="pendente";
});
if(contador)contador.textContent=pendentes.length;
bloco.innerHTML="";
if(!pendentes.length){
bloco.innerHTML="<div class='vazio'>Nenhuma vaga aguardando aprovação.</div>";
return;
}
pendentes.forEach(function(v){
var card=document.createElement("article");
card.className="admin-pendente-card";
var empresa=v.empresa||v.empresaNome||"Empresa";
var local=[v.cidade,v.uf].filter(Boolean).join(" / ");
card.innerHTML=
"<div class='admin-pendente-info'>"+
"<h3>"+(typeof escaparTexto==="function"?escaparTexto(v.cargo||"Vaga"):String(v.cargo||"Vaga"))+"</h3>"+
"<p><strong>"+(typeof escaparTexto==="function"?escaparTexto(empresa):empresa)+"</strong>"+
(local?" • "+(typeof escaparTexto==="function"?escaparTexto(local):local):"")+
(v.modalidade?" • "+(typeof escaparTexto==="function"?escaparTexto(v.modalidade):v.modalidade):"")+
"<br/>Aguardando análise administrativa</p>"+
"</div>";
var ac=document.createElement("div");
ac.className="admin-pendente-acoes";
function botao(txt,cls,fn){
var b=document.createElement("button");
b.type="button";b.className="btn "+cls;b.textContent=txt;b.onclick=fn;return b;
}
ac.appendChild(botao("Ver vaga","btn-claro",function(){
if(typeof verVagaAdminEmpregaMais==="function")verVagaAdminEmpregaMais(v.id);
else if(typeof abrirVaga==="function")abrirVaga(v.id);
}));
ac.appendChild(botao("Aprovar","btn-verde",function(){
if(typeof atualizarAprovacaoVaga==="function")atualizarAprovacaoVaga(v.id,"aprovada");
}));
ac.appendChild(botao("Reprovar","btn-perigo",function(){
if(typeof atualizarAprovacaoVaga==="function")atualizarAprovacaoVaga(v.id,"rejeitada");
}));
card.appendChild(ac);
bloco.appendChild(card);
});
}
window.renderizarFilaPendentesAdmin=renderFilaV146;
var adminAtualizando=false;
function atualizarAdminV146(){
if(adminAtualizando)return;
adminAtualizando=true;
statusAdminV146("Atualizando vagas do painel...",true);
var p=Promise.resolve();
if(typeof sincronizarVagasGoogleSheets==="function"){
try{p=Promise.resolve(sincronizarVagasGoogleSheets());}catch(e){p=Promise.resolve();}
}
p.catch(function(e){
console.warn("EmpregaMais V146 - sincronização admin:",e);
}).then(function(){
normalizarListaV146();
renderFilaV146();
try{
if(typeof renderizarPainelAdmin==="function")renderizarPainelAdmin();
}catch(e){}
try{
if(typeof atualizarCentralAdminEM==="function")atualizarCentralAdminEM();
}catch(e){}
}).finally(function(){
adminAtualizando=false;
statusAdminV146("",false);
});
}
window.atualizarAdminV146=atualizarAdminV146;
window.addEventListener("load",function(){
setTimeout(function(){
restaurarDraftV146();
sincronizarPlanoV146();
var pa=document.getElementById("pagina-painel-admin");
if(pa&&(pa.classList.contains("ativa")||pa.style.display!=="none")){
atualizarAdminV146();
}
},700);
});
window.addEventListener("pageshow",function(){
try{
if(window.EmpregaMaisLoadingV134)window.EmpregaMaisLoadingV134.ocultar();
}catch(e){}
setTimeout(restaurarDraftV146,250);
});
})();
//
;
//
(function(){
if(window.__EmpregaMaisV148Salvamento)return;
window.__EmpregaMaisV148Salvamento=true;
var FORM_IDS=["formVaga","formPublicarVaga","form-publicar-vaga"];
var TIMER_MAX=null;
function formVagaV148(){
for(var i=0;i<FORM_IDS.length;i++){
var f=document.getElementById(FORM_IDS[i]);
if(f)return f;
}
return null;
}
function fecharLoadingV148(){
try{
if(window.EmpregaMaisProcessamentoV136 &&
typeof window.EmpregaMaisProcessamentoV136.finalizar==="function"){
window.EmpregaMaisProcessamentoV136.finalizar();
}
}catch(e){}
try{
if(window.EmpregaMaisLoadingV134 &&
typeof window.EmpregaMaisLoadingV134.ocultar==="function"){
window.EmpregaMaisLoadingV134.ocultar();
}
}catch(e){}
var ov=document.getElementById("emLoadingGlobalV134");
if(ov)ov.classList.remove("ativo");
document.body.classList.remove("em-bloqueado-v134");
}
function snapshotFormularioV148(form){
var d={_salvoEm:Date.now()};
try{
[].slice.call(form.elements||[]).forEach(function(el){
var k=el.name||el.id;
if(!k || /password|file/i.test(el.type||""))return;
if(el.type==="checkbox"||el.type==="radio")d[k]=!!el.checked;
else d[k]=el.value;
});
localStorage.setItem("empregaMaisBackupEdicaoV148",JSON.stringify(d));
}catch(e){}
}
function vagaExisteV148(id){
if(!id)return false;
try{
var vagas=typeof carregarVagasPortal==="function"
? carregarVagasPortal()
: [];
return Array.isArray(vagas) && vagas.some(function(v){
return String(v&&v.id||"")===String(id);
});
}catch(e){
return false;
}
}
document.addEventListener("submit",function(ev){
var form=ev.target;
if(!form || form!==formVagaV148())return;
snapshotFormularioV148(form);
var idEdicao="";
try{
idEdicao=String(
(typeof vagaEdicaoId!=="undefined" && vagaEdicaoId) ||
((document.getElementById("vagaEditandoId")||{}).value) ||
""
);
}catch(e){}
clearTimeout(TIMER_MAX);
setTimeout(function(){
if(idEdicao && vagaExisteV148(idEdicao)){
fecharLoadingV148();
}
},450);
TIMER_MAX=setTimeout(function(){
fecharLoadingV148();
var pagina=document.getElementById("pagina-publicar");
if(pagina && (pagina.classList.contains("ativa") || pagina.style.display!=="none")){
try{
if(typeof mostrarModalSite==="function"){
mostrarModalSite(
"Não foi possível concluir a sincronização",
"O carregamento foi encerrado para não deixar a tela presa. Os dados preenchidos foram preservados. Você pode tentar salvar novamente.",
"erro",
"Continuar editando"
);
}
}catch(e){}
}
},12000);
},false);
window.addEventListener("popstate",fecharLoadingV148);
window.addEventListener("pageshow",fecharLoadingV148);
window.fecharLoadingSalvamentoV148=fecharLoadingV148;
})();
//
;
//
(function(){
if(window.__EmpregaMaisV149Localizacao)return;
window.__EmpregaMaisV149Localizacao=true;
function escV149(v){
return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});
}
function campoV149(ids){
for(var i=0;i<ids.length;i++){
var e=document.getElementById(ids[i]);
if(e)return e;
}
return null;
}
function cidadeAtualV149(){
var e=campoV149(["cidadeVaga","cidade","localVaga"]);
return e ? String(e.value||"").trim() : "";
}
function ufAtualV149(){
var e=campoV149(["estadoVaga","ufVaga","estado","uf"]);
return e ? String(e.value||"").trim() : "";
}
function enderecoAtualV149(){
var e=campoV149(["enderecoVaga","enderecoEmpresaVaga","endereco","localizacaoVaga"]);
return e ? String(e.value||"").trim() : "";
}
function escolhaV149(){
var e=document.querySelector('input[name="exibicaoLocalizacaoV149"]:checked');
return e ? e.value : "cidade";
}
function atualizarVisualV149(){
var box=document.getElementById("localizacaoPrivacidadeV149");
if(!box)return;
var val=escolhaV149();
box.querySelectorAll(".localizacao-opcao-v149").forEach(function(l){
var r=l.querySelector("input");
l.classList.toggle("selecionada",!!r && r.checked);
});
var cidade=cidadeAtualV149(), uf=ufAtualV149(), end=enderecoAtualV149();
var vis="";
if(val==="oculto"){
vis="A localização não será exibida aos candidatos.";
}else if(val==="cidade"){
vis="O candidato verá: <strong>"+escV149(cidade+(cidade&&uf?" - ":"")+uf || "somente a cidade informada")+"</strong>.";
}else{
vis="O candidato verá a localização cadastrada"+(end?": <strong>"+escV149(end)+"</strong>":".");
}
var p=document.getElementById("localizacaoPreviewV149");
if(p)p.innerHTML=vis;
}
function criarControleV149(){
return;
if(document.getElementById("localizacaoPrivacidadeV149"))return;
var referencia=campoV149(["enderecoVaga","enderecoEmpresaVaga","cidadeVaga","localVaga"]);
if(!referencia)return;
var grupo=referencia.closest(".grupo")||referencia.parentElement;
if(!grupo)return;
var box=document.createElement("div");
box.id="localizacaoPrivacidadeV149";
box.className="localizacao-privacidade-v149";
box.innerHTML=
"<strong>O que deseja mostrar aos candidatos?</strong>"+
"<p>Escolha o nível de privacidade da localização desta vaga. A opção selecionada ficará destacada.</p>"+
"<div class='localizacao-opcoes-v149'>"+
"<label class='localizacao-opcao-v149'>"+
"<input type='radio' name='exibicaoLocalizacaoV149' value='completo'/>"+
"<b>Endereço completo</b><span>Exibe a localização cadastrada para a vaga.</span>"+
"</label>"+
"<label class='localizacao-opcao-v149 selecionada'>"+
"<input type='radio' name='exibicaoLocalizacaoV149' value='cidade' checked='checked'/>"+
"<b>Somente cidade</b><span>Oculta rua, número e demais detalhes do endereço.</span>"+
"</label>"+
"<label class='localizacao-opcao-v149'>"+
"<input type='radio' name='exibicaoLocalizacaoV149' value='oculto'/>"+
"<b>Não exibir localização</b><span>Nenhuma informação de endereço será mostrada publicamente.</span>"+
"</label>"+
"</div>"+
"<div class='localizacao-preview-v149' id='localizacaoPreviewV149'></div>";
grupo.insertAdjacentElement("afterend",box);
box.addEventListener("change",atualizarVisualV149);
["cidadeVaga","cidade","localVaga","estadoVaga","ufVaga","estado","uf",
"enderecoVaga","enderecoEmpresaVaga","endereco","localizacaoVaga"].forEach(function(id){
var e=document.getElementById(id);
if(e)e.addEventListener("input",atualizarVisualV149);
});
atualizarVisualV149();
}
function modoDaVagaV149(vaga){
if(!vaga)return "cidade";
var v=String(
vaga.exibicaoLocalizacao ||
vaga.privacidadeLocalizacao ||
vaga.mostrarEndereco ||
""
).toLowerCase().trim();
if(v==="completo"||v==="endereco"||v==="endereço"||v==="sim"||v==="true")return "completo";
if(v==="oculto"||v==="nao"||v==="não"||v==="false"||v==="nenhum")return "oculto";
if(v==="cidade")return "cidade";
return "cidade";
}
function preencherEdicaoV149(vaga){
criarControleV149();
var modo=modoDaVagaV149(vaga);
var r=document.querySelector('input[name="exibicaoLocalizacaoV149"][value="'+modo+'"]');
if(r)r.checked=true;
atualizarVisualV149();
}
function salvarPreferenciaV149(vaga){
if(!vaga)return vaga;
var modo=escolhaV149();
vaga.exibicaoLocalizacao=modo;
vaga.privacidadeLocalizacao=modo;
vaga.mostrarEndereco=(modo==="completo");
return vaga;
}
function cidadePublicaV149(vaga){
if(!vaga)return "";
var cidade=String(vaga.cidade||vaga.local||vaga.localidade||"").trim();
var uf=String(vaga.uf||vaga.estado||"").trim();
if(vaga.cidade)cidade=String(vaga.cidade).trim();
return cidade+(cidade&&uf?" - ":"")+uf;
}
window.aplicarPrivacidadeLocalizacaoV149=function(vaga,raiz){
if(!vaga)return;
var modo=modoDaVagaV149(vaga);
raiz=raiz||document;
var seletores=[
"#detalheLocal",".vaga-local",".vaga-localizacao",".local-vaga",
"[data-campo='localizacao']","[data-campo='endereco']"
];
raiz.querySelectorAll(seletores.join(",")).forEach(function(el){
if(modo==="oculto"){
el.textContent="";
el.style.display="none";
}else if(modo==="cidade"){
var c=cidadePublicaV149(vaga);
if(c)el.textContent=c;
el.style.display="";
}else{
el.style.display="";
}
});
};
window.preencherPrivacidadeLocalizacaoV149=preencherEdicaoV149;
window.salvarPreferenciaLocalizacaoV149=salvarPreferenciaV149;
document.addEventListener("DOMContentLoaded",function(){
setTimeout(criarControleV149,250);
});
window.addEventListener("load",function(){
setTimeout(criarControleV149,400);
});
document.addEventListener("submit",function(ev){
var f=ev.target;
if(!f)return;
if(!document.getElementById("localizacaoPrivacidadeV149"))return;
try{
localStorage.setItem("empregaMaisExibicaoLocalizacaoRascunho",escolhaV149());
}catch(e){}
},true);
})();
//
;
//
(function(){
function obterVagaAtualV149(){
try{
if(typeof vagaAtual!=="undefined" && vagaAtual)return vagaAtual;
}catch(e){}
return null;
}
window.addEventListener("load",function(){
setTimeout(function(){
try{
var v=obterVagaAtualV149();
if(v && typeof preencherPrivacidadeLocalizacaoV149==="function"){
preencherPrivacidadeLocalizacaoV149(v);
}
if(v && typeof aplicarPrivacidadeLocalizacaoV149==="function"){
aplicarPrivacidadeLocalizacaoV149(v,document);
}
}catch(e){}
},650);
});
window.completarDadosLocalizacaoV149=function(dados){
if(typeof salvarPreferenciaLocalizacaoV149==="function"){
return salvarPreferenciaLocalizacaoV149(dados);
}
return dados;
};
})();
//
;
//
(function(){
if(window.__EmpregaMaisV151CepPrimeiro)return;
window.__EmpregaMaisV151CepPrimeiro=true;
function grupoDo(el){
if(!el)return null;
return el.closest(".grupo") ||
el.closest(".campo-grupo") ||
el.closest(".form-grupo") ||
el.parentElement;
}
function reorganizarV151(){
var cep=document.getElementById("cepVaga");
var cidade=document.getElementById("cidadeVaga");
var estado=document.getElementById("estadoVaga");
if(!cep || !cidade || !estado)return;
var gCep=grupoDo(cep);
var gCidade=grupoDo(cidade);
if(!gCep || !gCidade)return;
if(gCidade.parentNode && gCep!==gCidade){
gCidade.parentNode.insertBefore(gCep,gCidade);
}
gCidade.classList.add("cep-auto-v151");
estado.setAttribute("data-preenchido-pelo-cep","1");
cidade.setAttribute("data-preenchido-pelo-cep","1");
var aviso=document.getElementById("avisoCepAutoV151");
if(!aviso){
aviso=document.createElement("div");
aviso.id="avisoCepAutoV151";
aviso.style.cssText="margin:6px 0 10px;color:#70869b;font-size:9.5px;line-height:1.4";
aviso.textContent="Estado e cidade serão preenchidos automaticamente após a consulta do CEP.";
gCep.insertAdjacentElement("afterend",aviso);
}
}
function selecionarPorTextoV151(select, texto){
if(!select || !texto)return false;
var alvo=String(texto).trim().toLowerCase();
var opts=Array.from(select.options||[]);
var op=opts.find(function(o){
var tx=String(o.textContent||"").trim().toLowerCase();
var vl=String(o.value||"").trim().toLowerCase();
return tx===alvo || vl===alvo ||
tx.indexOf(alvo)>=0 || alvo.indexOf(tx)>=0;
});
if(op){
select.value=op.value;
select.dispatchEvent(new Event("change",{bubbles:true}));
return true;
}
return false;
}
window.preencherEstadoCidadePeloCepV151=function(ufOuEstado,cidadeNome){
var estado=document.getElementById("estadoVaga");
var cidade=document.getElementById("cidadeVaga");
if(!estado || !cidade)return;
selecionarPorTextoV151(estado,ufOuEstado);
var tentativas=0;
var timer=setInterval(function(){
tentativas++;
if(selecionarPorTextoV151(cidade,cidadeNome) || tentativas>=20){
clearInterval(timer);
if(typeof window.atualizarPreviewEnderecoV150==="function"){
window.atualizarPreviewEnderecoV150();
}
}
},100);
};
function sincronizarPreviewV151(){
if(typeof window.atualizarPreviewEnderecoV150==="function"){
window.atualizarPreviewEnderecoV150();
}
}
document.addEventListener("DOMContentLoaded",function(){
setTimeout(reorganizarV151,150);
setTimeout(sincronizarPreviewV151,500);
});
window.addEventListener("load",function(){
setTimeout(reorganizarV151,250);
});
document.addEventListener("change",function(e){
if(e.target && (e.target.id==="cidadeVaga" || e.target.id==="estadoVaga")){
sincronizarPreviewV151();
}
});
})();
//
;
//
(function(){
if(window.__EmpregaMaisV153EnderecoUnificado)return;
window.__EmpregaMaisV153EnderecoUnificado=true;
function grupoCampoV153(el){
if(!el)return null;
return el.closest(".grupo") ||
el.closest(".campo-grupo") ||
el.closest(".form-grupo") ||
el.parentElement;
}
function criarCelulaV153(classe,titulo,el){
var cel=document.createElement("div");
cel.className="campo-endereco-v153 "+classe;
var lab=document.createElement("label");
lab.textContent=titulo;
lab.setAttribute("for",el.id);
cel.appendChild(lab);
cel.appendChild(el);
return cel;
}
function unificarEnderecoV153(){
var cep=document.getElementById("cepVaga");
var rua=document.getElementById("ruaVagaV130");
var bairro=document.getElementById("bairroVagaV130");
var cidade=document.getElementById("cidadeVaga");
var estado=document.getElementById("estadoVaga");
var priv=document.getElementById("privacidadeEnderecoV130") ||
document.querySelector(".privacidade-endereco-v130");
if(!cep || !rua || !bairro || !cidade || !estado)return;
var caixaRua=rua.closest(".endereco-box-v130") ||
rua.closest(".endereco-campos-v130") ||
rua.closest(".bloco-endereco-v130") ||
rua.parentElement.parentElement;
if(!caixaRua)return;
if(document.getElementById("enderecoGridV153"))return;
var grupoCidade=grupoCampoV153(cidade);
var grupoEstado=grupoCampoV153(estado);
var grid=document.createElement("div");
grid.id="enderecoGridV153";
grid.className="endereco-grid-v153";
var paiRua=rua.parentElement;
var paiBairro=bairro.parentElement;
grid.appendChild(criarCelulaV153("rua-v153","Rua / Logradouro",rua));
grid.appendChild(criarCelulaV153("bairro-v153","Bairro",bairro));
grid.appendChild(criarCelulaV153("cidade-v153","Cidade",cidade));
grid.appendChild(criarCelulaV153("estado-v153","Estado",estado));
var aviso=document.createElement("div");
aviso.className="endereco-auto-aviso-v153";
aviso.innerHTML="&amp;#9679;&amp;nbsp; Rua, bairro, cidade e estado são preenchidos automaticamente pelo CEP. O número do imóvel não é solicitado.";
grid.appendChild(aviso);
var alvo=priv || caixaRua.firstChild;
if(priv && priv.parentNode===caixaRua){
caixaRua.insertBefore(grid,priv);
}else{
caixaRua.insertBefore(grid,caixaRua.firstChild);
}
[paiRua,paiBairro,grupoCidade,grupoEstado].forEach(function(g){
if(!g || g===caixaRua || g===grid)return;
var temCampo=g.querySelector && g.querySelector("input,select,textarea");
if(!temCampo){
g.style.display="none";
g.setAttribute("aria-hidden","true");
}
});
var aviso151=document.getElementById("avisoCepAutoV151");
if(aviso151)aviso151.style.display="none";
if(typeof window.atualizarPreviewEnderecoV150==="function"){
setTimeout(window.atualizarPreviewEnderecoV150,50);
}
}
document.addEventListener("DOMContentLoaded",function(){
setTimeout(unificarEnderecoV153,180);
});
window.addEventListener("load",function(){
setTimeout(unificarEnderecoV153,300);
setTimeout(unificarEnderecoV153,700);
});
document.addEventListener("click",function(){
setTimeout(unificarEnderecoV153,180);
},true);
window.unificarEnderecoV153=unificarEnderecoV153;
})();
//
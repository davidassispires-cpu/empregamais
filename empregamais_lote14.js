/* EmpregaMais - JavaScript externo - lote 14 */

//
(function(){
var PLANOS_V127={
basico:{
id:"basico",nome:"Básico",pago:false,
logo:false,whatsapp:false,link:false,
vagas:3,destaques:0,urgentes:0,dias:15
},
trimestral:{
id:"trimestral",nome:"Trimestral",pago:true,
logo:true,whatsapp:true,link:true,
vagas:50,destaques:10,urgentes:5,dias:90
},
semestral:{
id:"semestral",nome:"Semestral",pago:true,
logo:true,whatsapp:true,link:true,
vagas:100,destaques:20,urgentes:7,dias:180
},
anual:{
id:"anual",nome:"Anual",pago:true,
logo:true,whatsapp:true,link:true,
vagas:300,destaques:40,urgentes:10,dias:365
}
};
function norm(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic"||v==="essencial")return "basico";
if(v==="profissional")return "trimestral";
if(v==="premium")return "anual";
return v;
}
function empresaAtual(){
var e=null;
try{
if(typeof window.empresaLogadaPainelEM==="function"){
e=window.empresaLogadaPainelEM();
if(e&&Object.keys(e).length)return e;
}
}catch(x){}
try{
if(typeof window.obterEmpresaAtual==="function"){
e=window.obterEmpresaAtual();
if(e&&Object.keys(e).length)return e;
}
}catch(x){}
try{
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var m=String(sessionStorage.getItem("empresaEmail")||"").trim().toLowerCase();
for(var i=0;i<lista.length;i++){
var ec=String(lista[i].cnpj||"").replace(/\D/g,"");
var em=String(lista[i].email||"").trim().toLowerCase();
if((c&&ec===c)||(m&&em===m))return lista[i];
}
}catch(x){}
return {};
}
function chavePlano(){
var e=empresaAtual();
var p=norm(e.plano_id||e.planoId||e.plano||e.plano_nome||e.planoNome||"");
if(PLANOS_V127[p])return p;
try{
if(typeof window.planoAtivoEmpresaV38==="function"){
p=norm(window.planoAtivoEmpresaV38());
if(PLANOS_V127[p])return p;
}
}catch(x){}
return "basico";
}
function cfg(){
return PLANOS_V127[chavePlano()]||PLANOS_V127.basico;
}
window.configuracaoPlanoEmpresa=function(plano){
var p=norm(plano),c=PLANOS_V127[p]||PLANOS_V127.basico;
return {
id:c.id,nome:c.nome,preco:0,
vagasMes:c.vagas,destaquesMes:c.destaques,
urgentesMes:c.urgentes,diasVaga:c.dias,
logo:c.logo,
candidatura:c.pago?["email","whatsapp","link"]:["email"]
};
};
window.planoEmpresaAtual=function(){
return window.configuracaoPlanoEmpresa(chavePlano());
};
window.planoPermiteContatoAvancado=function(){
return cfg().pago===true;
};
function limparAvisosAntigos(){
document.querySelectorAll(".aviso-plano-logo-em").forEach(function(x){x.remove()});
var aviso=document.getElementById("contatoUpgradeAviso");
if(aviso){
aviso.classList.toggle("ativo",!cfg().pago);
if(cfg().pago)aviso.style.display="none";
else aviso.style.display="";
}
}
window.aplicarRecursosPlanoPublicacaoEmpregaMais=function(){
var pagina=document.getElementById("pagina-publicar");
if(!pagina)return;
var c=cfg();
var logo=document.getElementById("logoVaga");
if(logo)logo.disabled=!c.logo;
var w=document.getElementById("tipoContatoWhatsapp");
var l=document.getElementById("tipoContatoLink");
var ow=document.getElementById("opcaoContatoWhatsapp");
var ol=document.getElementById("opcaoContatoLink");
if(w)w.disabled=!c.whatsapp;
if(l)l.disabled=!c.link;
if(ow)ow.classList.toggle("bloqueada",!c.whatsapp);
if(ol)ol.classList.toggle("bloqueada",!c.link);
var selo=document.getElementById("contatoPlanoSelo");
if(selo)selo.textContent="Plano "+c.nome;
limparAvisosAntigos();
if(!c.pago){
var re=document.getElementById("tipoContatoEmail");
if(re)re.checked=true;
}
if(typeof window.atualizarTipoContatoVaga==="function"){
window.atualizarTipoContatoVaga();
}
};
window.prepararContatoPublicacao=function(){
var c=cfg(),e=empresaAtual();
var selo=document.getElementById("contatoPlanoSelo");
if(selo)selo.textContent="Plano "+c.nome;
var email=document.getElementById("emailCandidaturaVaga");
if(email&&!email.value&&e)email.value=e.email_corporativo||e.email||"";
var w=document.getElementById("tipoContatoWhatsapp");
var l=document.getElementById("tipoContatoLink");
var ow=document.getElementById("opcaoContatoWhatsapp");
var ol=document.getElementById("opcaoContatoLink");
if(w)w.disabled=!c.whatsapp;
if(l)l.disabled=!c.link;
if(ow)ow.classList.toggle("bloqueada",!c.whatsapp);
if(ol)ol.classList.toggle("bloqueada",!c.link);
limparAvisosAntigos();
if(!c.pago){
var re=document.getElementById("tipoContatoEmail");
if(re)re.checked=true;
}
if(typeof window.atualizarTipoContatoVaga==="function")window.atualizarTipoContatoVaga();
};
function aplicar(){
if(!document.getElementById("pagina-publicar"))return;
window.aplicarRecursosPlanoPublicacaoEmpregaMais();
}
document.addEventListener("DOMContentLoaded",aplicar);
window.addEventListener("load",function(){setTimeout(aplicar,250)});
document.addEventListener("empregamais:empresa-sincronizada",function(){setTimeout(aplicar,80)});
window.EmpregaMaisPlanoEmpresaV127={
atual:chavePlano,
configuracao:cfg
};
})();
//

/* EmpregaMais v229 - separacao Minhas Vagas x Processos Seletivos */
(function(){
"use strict";
if(window.__EM_MINHAS_VAGAS_V229)return;
window.__EM_MINHAS_VAGAS_V229=true;

function esc(v){
return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function listaVagas(){
try{return typeof window.vagasDaEmpresa==="function"?(window.vagasDaEmpresa()||[]):[];}catch(e){return[];}
}
function listaCandidaturas(){
try{return typeof window.carregarCandidaturas==="function"?(window.carregarCandidaturas()||[]):[];}catch(e){return[];}
}
function dataBR(v){
var d=v?new Date(v):null;
if(!d||isNaN(d.getTime()))return "Data não informada";
return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear();
}
function tituloVaga(v){return v.cargo||v.titulo||v.vaga||"Vaga sem título";}
function statusVaga(v){
var s=String(v.status||"").toLowerCase();
var a=String(v.aprovacao||"").toLowerCase();
if(s==="encerrada")return {texto:"Encerrada",classe:"encerrada"};
if(a==="pendente")return {texto:"Em análise",classe:"pendente"};
return {texto:"Ativa",classe:"ativa"};
}
function qtdCandidatos(id){
var total=0;
listaCandidaturas().forEach(function(c){
if(String(c.vagaId||c.vaga_id||c.idVaga||"")===String(id))total++;
});
return total;
}
function icone(nome){
var p={
vagas:"<rect x='3' y='7' width='18' height='13' rx='2'/><path d='M8 7V5h8v2M3 12h18'/>",
processo:"<circle cx='9' cy='8' r='3'/><path d='M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 6.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20'/>",
editar:"<path d='M4 20h4L19 9l-4-4L4 16v4Z'/><path d='m13.5 6.5 4 4'/>",
ver:"<path d='M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z'/><circle cx='12' cy='12' r='2.5'/>",
gerenciar:"<circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14v-4a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10v4a1.7 1.7 0 0 0-1.6 1Z'/>"
};
return "<svg viewBox='0 0 24 24' aria-hidden='true'>"+(p[nome]||p.vagas)+"</svg>";
}
function criarEstilo(){
if(document.getElementById("em-minhas-vagas-v229-css"))return;
var s=document.createElement("style");
s.id="em-minhas-vagas-v229-css";
s.textContent=".em-pagina-vagas-v229{display:none;padding:0 0 28px}.em-pagina-vagas-v229.ativa{display:block}.em-vagas-head-v229{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}.em-vagas-head-v229 h1{margin:0;color:#003b55;font-size:28px}.em-vagas-head-v229 p{margin:6px 0 0;color:#6a8391;font-size:14px}.em-vagas-grid-v229{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.em-vaga-card-v229{background:#fff;border:1px solid #d9e6ec;border-radius:16px;padding:20px;box-shadow:0 7px 20px rgba(0,58,76,.05);min-width:0}.em-vaga-top-v229{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.em-vaga-top-v229 h3{margin:0;color:#073f56;font-size:18px;line-height:1.3}.em-status-v229{flex:0 0 auto;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:800}.em-status-v229.ativa{background:#eaf8f1;color:#16794e}.em-status-v229.pendente{background:#fff7df;color:#956900}.em-status-v229.encerrada{background:#f3f4f6;color:#68717a}.em-vaga-meta-v229{display:flex;flex-wrap:wrap;gap:7px 14px;margin-top:12px;color:#6b8390;font-size:13px}.em-vaga-flags-v229{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.em-vaga-flag-v229{font-size:11px;font-weight:800;padding:5px 8px;border-radius:7px;background:#eef7fa;color:#0d6270}.em-vaga-acoes-v229{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:17px;padding-top:16px;border-top:1px solid #edf2f4}.em-vaga-btn-v229{min-width:0;border:1px solid #cbdde5;border-radius:9px;background:#fff;color:#164c60;padding:10px 8px;font-weight:750;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}.em-vaga-btn-v229:hover{background:#f4fafc;border-color:#9fc2cf}.em-vaga-btn-v229.principal{background:#086b78;border-color:#086b78;color:#fff}.em-vaga-btn-v229 svg,.em-nav-v229 svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}.em-vagas-vazio-v229{grid-column:1/-1;background:#fff;border:1px dashed #cbdde5;border-radius:14px;padding:34px;text-align:center;color:#718692}.em-nav-v229{display:flex!important;align-items:center;gap:10px}.em-processos-modo-v229>.recrutador-boasvindas-ref-em,.em-processos-modo-v229>.recrutador-analytics-v227{display:none!important}.em-processos-modo-v229>.recrutador-processos-head-v225,.em-processos-modo-v229>.recrutador-vagas-box-ref-em{display:flex!important}.em-processos-modo-v229>.recrutador-vagas-box-ref-em{display:block!important}.em-minhas-modo-v229>*:not(.em-pagina-vagas-v229){display:none!important}.em-minhas-modo-v229>.em-pagina-vagas-v229{display:block!important}@media(max-width:760px){.em-vagas-grid-v229{grid-template-columns:1fr}.em-vagas-head-v229{align-items:flex-start;flex-direction:column}.em-vaga-acoes-v229{grid-template-columns:1fr}.em-vaga-btn-v229{justify-content:flex-start;padding:11px 12px}}";
document.head.appendChild(s);
}
function abrirEditar(id){
if(typeof window.editarVagaEmpresa==="function"){window.editarVagaEmpresa(id);return;}
if(typeof window.editarVaga==="function"){window.editarVaga(id);return;}
}
function abrirPublicacao(id){
if(typeof window.abrirVaga==="function"){window.abrirVaga(id);return;}
if(typeof window.abrirDetalheVaga==="function"){window.abrirDetalheVaga(id);return;}
}
function abrirGerenciar(id){
try{sessionStorage.setItem("vagaCandidatosSelecionada",String(id));}catch(e){}
if(typeof window.abrirCandidatosDaVaga==="function"){window.abrirCandidatosDaVaga(id);return;}
if(typeof window.irPara==="function")window.irPara("candidatos-empresa");
}
function flags(v){
var a=[];
if(v.destaque===true||v.destacada===true)a.push("Destaque");
if(v.contratacaoUrgente===true||v.urgente===true)a.push("Urgente");
if(v.empresaConfidencial===true||v.confidencial===true)a.push("Empresa confidencial");
return a;
}
function montarCards(pagina){
var vagas=listaVagas();
var grid=pagina.querySelector(".em-vagas-grid-v229");
if(!grid)return;
if(!vagas.length){grid.innerHTML="<div class='em-vagas-vazio-v229'><strong>Nenhuma vaga cadastrada.</strong><br>As vagas publicadas pela empresa aparecerão aqui.</div>";return;}
grid.innerHTML=vagas.map(function(v){
var st=statusVaga(v),fs=flags(v),id=esc(v.id);
var data=v.publicadaEm||v.criadoEm||v.dataCriacao||v.data||"";
return "<article class='em-vaga-card-v229'>"+
"<div class='em-vaga-top-v229'><h3>"+esc(tituloVaga(v))+"</h3><span class='em-status-v229 "+st.classe+"'>"+st.texto+"</span></div>"+
"<div class='em-vaga-meta-v229'><span>"+(st.classe==="encerrada"?"Processo encerrado":"Processo aberto")+"</span><span>Publicada em "+esc(dataBR(data))+"</span><span>"+qtdCandidatos(v.id)+" candidato"+(qtdCandidatos(v.id)===1?"":"s")+"</span></div>"+
(fs.length?"<div class='em-vaga-flags-v229'>"+fs.map(function(f){return "<span class='em-vaga-flag-v229'>"+esc(f)+"</span>";}).join("")+"</div>":"")+
"<div class='em-vaga-acoes-v229'>"+
"<button type='button' class='em-vaga-btn-v229' data-em-vaga-editar='"+id+"'>"+icone("editar")+"Editar vaga</button>"+
"<button type='button' class='em-vaga-btn-v229' data-em-vaga-ver='"+id+"'>"+icone("ver")+"Ver publicação</button>"+
"<button type='button' class='em-vaga-btn-v229 principal' data-em-vaga-gerenciar='"+id+"'>"+icone("gerenciar")+"Gerenciar vaga</button>"+
"</div></article>";
}).join("");
}
function garantirPagina(main){
var p=main.querySelector("#emPaginaMinhasVagasV229");
if(!p){
p=document.createElement("section");
p.id="emPaginaMinhasVagasV229";
p.className="em-pagina-vagas-v229";
p.innerHTML="<div class='em-vagas-head-v229'><div><h1>Minhas Vagas</h1><p>Edite, visualize e gerencie todas as vagas publicadas pela sua empresa.</p></div></div><div class='em-vagas-grid-v229'></div>";
main.appendChild(p);
p.addEventListener("click",function(e){
var b=e.target.closest("[data-em-vaga-editar],[data-em-vaga-ver],[data-em-vaga-gerenciar]");if(!b)return;
var id=b.getAttribute("data-em-vaga-editar")||b.getAttribute("data-em-vaga-ver")||b.getAttribute("data-em-vaga-gerenciar");
if(b.hasAttribute("data-em-vaga-editar"))abrirEditar(id);
else if(b.hasAttribute("data-em-vaga-ver"))abrirPublicacao(id);
else abrirGerenciar(id);
});
}
montarCards(p);
return p;
}
function marcarNav(sidebar,alvo){
sidebar.querySelectorAll("button[data-ref-nav],button[data-em-nav-v229]").forEach(function(b){b.classList.remove("ativo");});
if(alvo)alvo.classList.add("ativo");
}
function mostrarTudo(main){
main.classList.remove("em-minhas-modo-v229","em-processos-modo-v229");
var p=main.querySelector("#emPaginaMinhasVagasV229");if(p)p.classList.remove("ativa");
Array.from(main.children).forEach(function(x){x.style.removeProperty("display");});
}
function mostrarMinhas(main,sidebar,botao){
mostrarTudo(main);garantirPagina(main);montarCards(main.querySelector("#emPaginaMinhasVagasV229"));
main.classList.add("em-minhas-modo-v229");
main.querySelector("#emPaginaMinhasVagasV229").classList.add("ativa");
marcarNav(sidebar,botao);window.scrollTo(0,0);
}
function mostrarProcessos(main,sidebar,botao){
mostrarTudo(main);main.classList.add("em-processos-modo-v229");
marcarNav(sidebar,botao);
var h=main.querySelector(".recrutador-processos-head-v225");if(h)h.scrollIntoView({block:"start"});
}
function instalar(){
criarEstilo();
var shell=document.getElementById("painelReferenciaRecrutadorEM");if(!shell)return;
var sidebar=shell.querySelector(".recrutador-sidebar-ref-em"),main=shell.querySelector(".recrutador-main-ref-em");if(!sidebar||!main)return;
var processos=sidebar.querySelector("[data-ref-nav='aprovadas']");if(!processos)return;
processos.innerHTML="<span class='icone-ref-em'>"+icone("processo")+"</span>Processos Seletivos";
var minhas=sidebar.querySelector("[data-em-nav-v229='minhas-vagas']");
if(!minhas){
minhas=document.createElement("button");minhas.type="button";minhas.setAttribute("data-em-nav-v229","minhas-vagas");minhas.className="em-nav-v229";
minhas.innerHTML="<span class='icone-ref-em'>"+icone("vagas")+"</span>Minhas Vagas";
sidebar.insertBefore(minhas,processos);
}
garantirPagina(main);
minhas.onclick=function(e){e.preventDefault();mostrarMinhas(main,sidebar,minhas);};
processos.onclick=function(e){e.preventDefault();mostrarProcessos(main,sidebar,processos);};
var visao=sidebar.querySelector("[data-ref-nav='painel']");if(visao){
visao.onclick=function(){mostrarTudo(main);marcarNav(sidebar,visao);window.scrollTo(0,0);};
}
}
function reforcar(){setTimeout(instalar,50);setTimeout(instalar,400);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",reforcar);else reforcar();
window.addEventListener("load",function(){setTimeout(instalar,1300);setTimeout(instalar,3000);});
var obs=new MutationObserver(function(){if(document.getElementById("painelReferenciaRecrutadorEM"))setTimeout(instalar,80);});
obs.observe(document.documentElement,{childList:true,subtree:true});
})();

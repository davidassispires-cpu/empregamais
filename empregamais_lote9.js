/* EmpregaMais - JavaScript externo - lote 9 */

//
(function(){
window.textoBotaoContatoVaga=function(vaga){
return "Candidatar-se";
};
window.abrirContatoExternoVaga=function(vaga){
var v=vaga||window.vagaAtual;
if(window.EmpregaMaisCandidaturaV94 && typeof window.EmpregaMaisCandidaturaV94.abrir==="function"){
window.EmpregaMaisCandidaturaV94.abrir(v);
return;
}
alert("Não foi possível abrir a área de candidatura. Atualize a página e tente novamente.");
};
function corrigirBotoesV95(){
var p=document.getElementById("pagina-vaga"); if(!p)return;
p.querySelectorAll("a,button").forEach(function(b){
var t=String(b.textContent||"").trim().toLowerCase();
var h=String(b.getAttribute("href")||"").toLowerCase();
if(t.indexOf("candidatar-se por e-mail")>=0 ||
t.indexOf("candidatar-se pelo whatsapp")>=0 ||
t.indexOf("candidatar-se no site da empresa")>=0 ||
h.indexOf("mailto:")===0){
b.textContent="Candidatar-se";
if(b.tagName==="A")b.setAttribute("href","#");
b.setAttribute("data-candidatar-v94","1");
}
});
}
window.addEventListener("load",function(){setTimeout(corrigirBotoesV95,600)});
document.addEventListener("click",function(){setTimeout(corrigirBotoesV95,80)},false);
new MutationObserver(corrigirBotoesV95).observe(document.documentElement,{childList:true,subtree:true});
window.corrigirBotoesV95=corrigirBotoesV95;
})();
//
;
//
(function(){
function abrirRapidoV96(v){
v=v||window.vagaAtual;
if(!v)return;
var email=String(
sessionStorage.getItem("candidatoEmail") ||
localStorage.getItem("candidatoEmail") || ""
).trim().toLowerCase();
if(!email){
if(typeof irPara==="function")irPara("login-candidato");
else alert("Entre na sua conta de candidato para se candidatar.");
return;
}
var modal=document.getElementById("modalCandidaturaV94");
if(!modal)return;
var titulo=document.getElementById("cand94Vaga");
if(titulo)titulo.textContent=(v.cargo||v.titulo||"Vaga")+" • "+(v.empresa||"");
var status=document.getElementById("cand94OnlineStatus");
var curriculo=null;
try{
if(typeof carregarCurriculoOnlineEM==="function")curriculo=carregarCurriculoOnlineEM();
if(!curriculo){
var ks=[
"curriculoOnlineEmpregaMais_"+email,
"curriculoOnlineEmpregaMais",
"curriculoEmpregaMais_"+email,
"curriculoEmpregaMais"
];
for(var i=0;i<ks.length;i++){
var raw=localStorage.getItem(ks[i]);
if(raw){try{curriculo=JSON.parse(raw);break}catch(e){}}
}
}
}catch(e){}
if(status)status.textContent=curriculo
?"Seu currículo online está pronto para ser utilizado."
:"Você ainda não possui um currículo online salvo. Você pode criar um ou enviar um arquivo.";
var online=document.getElementById("cand94Online");
var arquivo=document.getElementById("cand94Arquivo");
var areaOnline=document.getElementById("cand94AreaOnline");
var areaArquivo=document.getElementById("cand94AreaArquivo");
if(curriculo){
if(online)online.classList.add("ativa");
if(arquivo)arquivo.classList.remove("ativa");
if(areaOnline)areaOnline.style.display="block";
if(areaArquivo)areaArquivo.style.display="none";
}else{
if(online)online.classList.remove("ativa");
if(arquivo)arquivo.classList.add("ativa");
if(areaOnline)areaOnline.style.display="none";
if(areaArquivo)areaArquivo.style.display="block";
}
modal.classList.add("aberto");
modal.setAttribute("aria-hidden","false");
if(window.EmpregaMaisCandidaturaV94 &&
typeof window.EmpregaMaisCandidaturaV94.verificar==="function"){
window.EmpregaMaisCandidaturaV94.verificar(v).then(function(ja){
if(!ja)return;
modal.classList.remove("aberto");
modal.setAttribute("aria-hidden","true");
if(typeof window.EmpregaMaisCandidaturaV94.travar==="function"){
window.EmpregaMaisCandidaturaV94.travar();
}
alert("Você já se candidatou a esta oportunidade.");
}).catch(function(){});
}
}
window.abrirContatoExternoVaga=abrirRapidoV96;
function instalar(){
if(window.EmpregaMaisCandidaturaV94){
window.EmpregaMaisCandidaturaV94.abrir=abrirRapidoV96;
window.EmpregaMaisCandidaturaV94.abrirRapido=abrirRapidoV96;
}
}
instalar();
window.addEventListener("load",instalar);
setTimeout(instalar,50);
setTimeout(instalar,500);
})();
//
;
//
(function(){
function go(p){if(typeof window.irPara==="function")window.irPara(p);else location.href="/?pagina="+encodeURIComponent(p)}
function findButton(words){
var all=document.querySelectorAll("header a,header button");
for(var i=0;i<all.length;i++){
var t=String(all[i].textContent||"").trim().toLowerCase();
for(var j=0;j<words.length;j++)if(t===words[j]||t.indexOf(words[j])>=0)return all[i];
}
return null;
}
function menu(btn,type){
if(!btn||btn.closest(".header-v98-area"))return;
var wrap=document.createElement("span");wrap.className="header-v98-area";wrap.dataset.publico=type;
btn.parentNode.insertBefore(wrap,btn);wrap.appendChild(btn);
var m=document.createElement("div");m.className="header-v98-menu";
m.classList.add("em-account-menu");m.classList.add(type==="cand"?"em-candidate-menu":"em-company-menu");
var icons={user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>',plus:'<path d="M12 5v14M5 12h14"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12a24 24 0 0 0 18 0M12 11v4"/>',users:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6M22 21v-3a7 7 0 0 0-4-6"/>',card:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/>'};
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>'}
var title=document.createElement("div");title.className="em-account-heading";title.textContent=type==="cand"?"ÁREA DO CANDIDATO":"ÁREA DA EMPRESA";m.appendChild(title);
var itens=type==="cand"?
[["login-candidato","Entrar na minha conta","Acesse seu perfil e suas candidaturas","user"],["curriculo","Cadastrar currículo","Crie ou atualize seu currículo","file"],["candidaturas","Minhas candidaturas","Acompanhe seus processos seletivos","file"],["vagas-salvas","Vagas salvas","Veja suas oportunidades favoritas","heart"],["contato","Ajuda para candidatos","Dúvidas e suporte","help"]]:
[["login-empresa","Entrar na minha conta","Acesse seu painel de recrutamento","building"],["cadastro-empresa","Cadastrar empresa","Crie o perfil da sua empresa","building"],["publicar","Publicar vaga","Encontre os profissionais certos","plus"],["painel-empresa","Minhas vagas","Acompanhe e gerencie suas vagas","briefcase"],["candidatos-empresa","Candidaturas","Organize seus processos seletivos","users"],["planos","Planos e pagamentos","Conheça os recursos para sua empresa","card"],["contato","Ajuda para empresas","Dúvidas e suporte","help"]];
if(type==="cand")itens=itens.slice(0,2);
itens.forEach(function(x,k){if(k===2||k===itens.length-1){var sp=document.createElement("div");sp.className="header-v98-sep";m.appendChild(sp)}var b=document.createElement("button");b.type="button";if(k===0)b.className="em-account-primary";b.innerHTML='<span class="em-account-icon">'+icon(x[3])+'</span><span class="em-account-copy"><strong>'+x[1]+'</strong><small>'+x[2]+'</small></span><svg class="em-account-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';b.onclick=function(e){e.stopPropagation();wrap.classList.remove("open");btn.setAttribute("aria-expanded","false");go(x[0])};m.appendChild(b)});
btn.removeAttribute("onclick");btn.setAttribute("aria-haspopup","true");btn.setAttribute("aria-expanded","false");btn.innerHTML='<span>'+(type==="cand"?"Para candidatos":"Para empresas")+'</span><svg class="em-trigger-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
wrap.addEventListener("keydown",function(e){if(e.key==="Escape"){wrap.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.focus()}});
wrap.addEventListener("focusout",function(e){if(!wrap.contains(e.relatedTarget)){wrap.classList.remove("open");btn.setAttribute("aria-expanded","false")}});
wrap.appendChild(m);
function ajustarSessaoEmpresa(){
 if(type!=="emp")return;
 var logged=false;
 try{logged=!!(sessionStorage.getItem("empresaCnpj")||sessionStorage.getItem("empresaEmail"));}catch(err){}
 m.querySelectorAll(":scope > button").forEach(function(b,k){b.style.setProperty("display",!logged&&k>1?"none":"flex","important")});
 m.querySelectorAll(".header-v98-sep").forEach(function(e){e.style.setProperty("display",logged?"block":"none","important")});
}
ajustarSessaoEmpresa();
wrap.addEventListener("mouseenter",ajustarSessaoEmpresa);
wrap.addEventListener("focusin",ajustarSessaoEmpresa);
btn.addEventListener("click",ajustarSessaoEmpresa,true);
btn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();document.querySelectorAll(".header-v98-area").forEach(function(w){if(w!==wrap)w.classList.remove("open")});wrap.classList.toggle("open");btn.setAttribute("aria-expanded",String(wrap.classList.contains("open")));document.querySelectorAll(".header-v98-area").forEach(function(w){var trigger=w.querySelector(":scope > button");if(trigger)trigger.setAttribute("aria-expanded",String(w.classList.contains("open")))})});
}
function instalar(){
var cand=findButton(["candidato"]);
var emp=findButton(["empresa"]);
if(cand){menu(cand,"cand")}
if(emp){menu(emp,"emp")}
}
document.addEventListener("click",function(){document.querySelectorAll(".header-v98-area").forEach(function(w){w.classList.remove("open");var trigger=w.querySelector(":scope > button");if(trigger)trigger.setAttribute("aria-expanded","false")})});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",instalar);else instalar();
window.addEventListener("load",function(){setTimeout(instalar,300)});
})();
//
;
//
(function(){
function norm(t){
return String(t||"").replace(/\s+/g," ").trim().toLowerCase();
}
function limparV99(){
var headers=document.querySelectorAll("header");
headers.forEach(function(header){
var itens=header.querySelectorAll("a,button");
itens.forEach(function(el){
if(el.closest(".header-v98-menu"))return;
var t=norm(el.textContent);
if(t==="planos"){
el.classList.add("v99-removido");
return;
}
if(t==="empresa"){
el.classList.add("v99-removido");
}
});
});
}
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",limparV99);
}else{
limparV99();
}
window.addEventListener("load",function(){setTimeout(limparV99,250)});
new MutationObserver(limparV99).observe(document.documentElement,{childList:true,subtree:true});
})();
//
;
//

//
;
//
(function(){
var PAGE="cadastro-curriculo";
function logado(){
return !!String(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").trim();
}
function abrir(){
if(logado()){
if(typeof window.irPara==="function")window.irPara("curriculo");
return;
}
if(typeof window.mostrarPagina==="function"){
window.mostrarPagina("cadastro-curriculo-v101");
}else{
document.querySelectorAll(".pagina").forEach(function(x){x.classList.remove("ativa")});
var p=document.getElementById("pagina-cadastro-curriculo-v101");
if(p)p.classList.add("ativa");
}
try{
history.pushState({pagina:PAGE},"",window.location.pathname+"?pagina="+PAGE);
}catch(e){}
window.scrollTo(0,0);
}
function msg(t,tipo){
var x=document.getElementById("cv101Msg");x.textContent=t;x.className="cv101-msg on "+(tipo||"erro");
}
function cadastroLocal(d){
var a=[];try{a=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]")}catch(e){}
if(a.some(function(c){return String(c.email||"").toLowerCase()===d.email.toLowerCase()}))return {ok:false,erro:"Já existe um cadastro com este e-mail."};
d.id="cand_"+Date.now();d.criadoEm=new Date().toISOString();d.status="ativo";a.push(d);
localStorage.setItem("candidatosEmpregaMais",JSON.stringify(a));
sessionStorage.setItem("candidatoEmail",d.email);sessionStorage.setItem("candidatoNome",d.nome);
localStorage.setItem("candidatoEmail",d.email);localStorage.setItem("candidatoNome",d.nome);
return {ok:true};
}
document.addEventListener("click",function(e){
var b=e.target.closest("a,button");if(!b)return;
var t=String(b.textContent||"").replace(/\s+/g," ").trim().toLowerCase();
var page=String(b.getAttribute("data-v97-page")||b.getAttribute("data-page")||"").toLowerCase();
if(t==="cadastrar currículo"||page==="cadastro-curriculo"){
e.preventDefault();e.stopImmediatePropagation();abrir();
}
},true);
var f=document.getElementById("formCadastroCandidatoV101");
f.addEventListener("submit",function(e){
e.preventDefault();
var senha=document.getElementById("cv101Senha").value,senha2=document.getElementById("cv101Senha2").value;
if(senha!==senha2){msg("As senhas informadas não são iguais.");return}
var d={
nome:document.getElementById("cv101Nome").value.trim(),
email:document.getElementById("cv101Email").value.trim().toLowerCase(),
telefone:document.getElementById("cv101Cel").value.trim(),
nascimento:document.getElementById("cv101Nasc").value,
cidade:document.getElementById("cv101Cidade").value.trim(),
uf:document.getElementById("cv101Uf").value,
senha:senha
};
var r=cadastroLocal(d);
if(!r.ok){msg(r.erro);return}
msg("Conta criada. Vamos montar seu currículo profissional.","ok");
setTimeout(function(){if(typeof window.irPara==="function")window.irPara("curriculo");else location.href="/?pagina=curriculo"},650);
});
function rota(){
var q=new URLSearchParams(location.search);
if(q.get("pagina")===PAGE&&!logado())setTimeout(abrir,80);
}
window.addEventListener("load",rota);
})();
//
;
//
(function(){
var pagina=document.getElementById("pagina-cadastro-curriculo-v101");
if(!pagina)return;
function corrigirRodape(){
var footer=document.querySelector("footer");
if(!footer)return;
if(pagina.nextElementSibling!==footer){
pagina.parentNode.insertBefore(footer,pagina.nextSibling);
}
}
var cidadeAntiga=document.getElementById("cv101Cidade");
var uf=document.getElementById("cv101Uf");
if(cidadeAntiga && cidadeAntiga.tagName!=="SELECT"){
var sel=document.createElement("select");
sel.id="cv101Cidade";
sel.required=true;
sel.disabled=true;
sel.innerHTML="<option value=''>Selecione primeiro o estado</option>";
cidadeAntiga.parentNode.replaceChild(sel,cidadeAntiga);
var info=document.createElement("div");
info.className="cv101-city-loading";
info.id="cv101CidadeInfo";
sel.parentNode.appendChild(info);
}
function carregarCidades(){
var cidade=document.getElementById("cv101Cidade");
var info=document.getElementById("cv101CidadeInfo");
var sigla=String(uf&&uf.value||"").trim();
if(!cidade)return;
cidade.disabled=true;
if(!sigla){
cidade.innerHTML="<option value=''>Selecione primeiro o estado</option>";
if(info)info.textContent="";
return;
}
cidade.innerHTML="<option value=''>Carregando cidades...</option>";
if(info)info.textContent="Buscando municípios oficiais do estado selecionado...";
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+encodeURIComponent(sigla)+"/municipios?orderBy=nome")
.then(function(r){
if(!r.ok)throw new Error("IBGE");
return r.json();
})
.then(function(lista){
cidade.innerHTML="<option value=''>Selecione sua cidade</option>";
(lista||[]).forEach(function(m){
var op=document.createElement("option");
op.value=m.nome;
op.textContent=m.nome;
cidade.appendChild(op);
});
cidade.disabled=false;
if(info)info.textContent="";
})
.catch(function(){
cidade.innerHTML="<option value=''>Não foi possível carregar as cidades</option>";
cidade.disabled=true;
if(info)info.textContent="Tente selecionar o estado novamente.";
});
}
if(uf){
uf.addEventListener("change",carregarCidades);
}
function preparar(){
if(uf && uf.value)carregarCidades();
}
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",preparar);
}else{
preparar();
}
window.addEventListener("load",function(){setTimeout(corrigirRodape,150)});
new MutationObserver(function(){
if(pagina.classList.contains("ativa"))corrigirRodape();
}).observe(document.body,{childList:true,subtree:false});
})();
//
;
//
(function(){
var p=document.getElementById("pagina-cadastro-curriculo-v101");
if(!p)return;
function footerReal(){
return document.querySelector("footer");
}
function posicionar(){
var f=footerReal();
if(f && p.nextElementSibling!==f){
f.parentNode.insertBefore(p,f);
}
}
function abrirPaginaCadastroV103(){
var email=String(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").trim();
if(email){
if(typeof window.irPara==="function")window.irPara("curriculo");
return;
}
if(typeof window.esconderPaginas==="function"){
window.esconderPaginas();
}else{
document.querySelectorAll(".pagina").forEach(function(x){x.classList.remove("ativa")});
}
var home=document.getElementById("pagina-home");
if(home){home.classList.remove("ativa");home.style.display="none"}
p.classList.add("ativa");
p.style.display="flex";
if(typeof window.fecharMenusConta==="function")window.fecharMenusConta();
if(typeof window.atualizarTopo==="function")window.atualizarTopo();
try{
history.pushState({pagina:"cadastro-curriculo"},"",
window.location.pathname+"?pagina=cadastro-curriculo");
}catch(e){}
window.scrollTo(0,0);
}
document.addEventListener("click",function(e){
var b=e.target.closest("a,button");
if(!b)return;
var t=String(b.textContent||"").replace(/\s+/g," ").trim().toLowerCase();
if(false && t==="cadastrar currículo"){
e.preventDefault();
e.stopImmediatePropagation();
abrirPaginaCadastroV103();
}
},true);
function pelaURL(){
try{
var q=new URLSearchParams(location.search);
if(q.get("pagina")==="cadastro-curriculo"){
abrirPaginaCadastroV103();
}
}catch(e){}
}
var irOriginal=window.irPara;
if(typeof irOriginal==="function"){
window.irPara=function(pagina,id){
if(pagina!=="cadastro-curriculo"){
p.classList.remove("ativa");
p.style.display="none";
var home=document.getElementById("pagina-home");
if(home)home.style.display="";
}
return irOriginal.apply(this,arguments);
};
}
window.addEventListener("load",function(){setTimeout(pelaURL,80)});
window.addEventListener("popstate",function(){
var q=new URLSearchParams(location.search);
if(q.get("pagina")==="cadastro-curriculo")abrirPaginaCadastroV103();
else{
p.classList.remove("ativa");p.style.display="none";
var home=document.getElementById("pagina-home");if(home)home.style.display="";
}
});
window.abrirPaginaCadastroCandidatoV103=abrirPaginaCadastroV103;
})();
//
;
//
(function(){
function montar(){
var pg=document.getElementById("pagina-como-funciona");if(!pg||document.getElementById("comoFuncionaV106"))return;
var x=document.createElement("div");x.id="comoFuncionaV106";
x.dataset.publico="candidato";
x.innerHTML=`<header class="cf106-hero"><div class="cf120-hero-grid"><div><span class="cf106-kicker">CONHEÇA O EMPREGAMAIS</span><h1 id="cf120HeroTitle">Seu próximo passo profissional começa aqui.</h1><p id="cf120HeroText">Encontre oportunidades, organize seu currículo e acompanhe suas candidaturas em uma experiência simples, do seu jeito.</p><div class="cf120-hero-actions"><button class="cf106-btn primary" id="cf120HeroPrimary" type="button">Cadastrar currículo</button><button class="cf106-btn secondary" id="cf120HeroSecondary" type="button">Explorar vagas</button></div></div><aside class="cf120-overview"><span>DA BUSCA AO PRÓXIMO PASSO</span><h2 id="cf120OverviewTitle">Sua carreira, mais organizada.</h2><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewOne">Currículo e perfil profissional</span></div><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewTwo">Busca com filtros e localização</span></div><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewThree">Candidaturas em um só lugar</span></div></aside></div></header>
<div class="cf106-tabs-wrap"><div class="cf106-tabs" role="tablist" aria-label="Como funciona para cada público"><button type="button" role="tab" aria-selected="true" aria-controls="cf120Candidato" id="cf120TabCandidato" class="cf106-tab cand ativo" data-cf106="candidato">Para candidatos</button><button type="button" role="tab" aria-selected="false" aria-controls="cf120Empresa" id="cf120TabEmpresa" class="cf106-tab emp" data-cf106="empresa" tabindex="-1">Para empresas</button></div></div>
<div class="cf106-content">
<section class="cf106-panel candidato ativo" role="tabpanel" id="cf120Candidato" aria-labelledby="cf120TabCandidato">
<div class="cf106-intro"><small>SEU CAMINHO NO PORTAL</small><h2>Da descoberta da vaga à candidatura.</h2><p>Conheça cada etapa e aproveite os recursos da sua área de candidato.</p></div><div class="cf106-journey"><article class="cf106-card"><div class="cf106-num">01</div><h3>Crie sua conta</h3><p>Cadastre seus dados para acessar o currículo e sua área de candidato.</p></article><article class="cf106-card"><div class="cf106-num">02</div><h3>Organize seu currículo</h3><p>Preencha experiências, formação, cursos, habilidades e preferências profissionais.</p></article><article class="cf106-card"><div class="cf106-num">03</div><h3>Encontre a vaga certa</h3><p>Busque por cargo, cidade e palavra-chave. Refine os resultados nos filtros.</p></article><article class="cf106-card"><div class="cf106-num">04</div><h3>Conheça a oportunidade</h3><p>Leia descrição, requisitos e benefícios e confira local, contrato, modalidade e salário informado.</p></article><article class="cf106-card"><div class="cf106-num">05</div><h3>Envie sua candidatura</h3><p>Use o botão da vaga e siga a forma de recebimento escolhida pela empresa.</p></article><article class="cf106-card"><div class="cf106-num">06</div><h3>Acompanhe sua jornada</h3><p>Consulte suas candidaturas, mantenha o currículo atualizado e acompanhe as etapas informadas.</p></article></div>
<section class="cf120-resources"><div class="cf106-intro"><small>RECURSOS PARA SUA CARREIRA</small><h2>Mais clareza para encontrar novas oportunidades.</h2></div><div class="cf120-feature-grid"><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Busca com sugestões</h3><p>Encontre cargos publicados no portal e combine função, cidade e palavra-chave.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Filtros de oportunidades</h3><p>Refine por salário, área, contrato, modalidade e opções de vagas para PcD.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Vagas perto de você</h3><p>Informe um CEP ou use sua localização para consultar distâncias aproximadas.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Currículo online</h3><p>Reúna sua trajetória profissional e atualize as informações na sua área.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Vagas favoritas</h3><p>Salve oportunidades para consultar novamente quando quiser.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Minhas candidaturas</h3><p>Veja as candidaturas realizadas no portal e as movimentações disponíveis.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Conheça a empresa</h3><p>Consulte os dados empresariais e a identificação de verificação quando disponível.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Detalhes antes de candidatar</h3><p>Confira os requisitos e a forma de contato para decidir quais vagas combinam com você.</p></article></div></section>
<div class="cf120-guide"><div><small>UM PERFIL QUE CONTA SUA HISTÓRIA</small><h2>Prepare seu currículo para o próximo passo.</h2><p>Inclua experiências recentes, descreva suas atividades e confira os contatos. Uma apresentação clara ajuda a empresa a entender sua trajetória.</p></div><ul><li>Mantenha e-mail e telefone atualizados.</li><li>Informe formação, cursos e habilidades relevantes.</li><li>Leia os requisitos e adapte seu objetivo profissional.</li><li>Acompanhe o processo na sua área de candidato.</li></ul></div>
<div class="cf106-free"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><b>Pesquisar vagas, criar currículo e enviar candidaturas pelo portal é gratuito para candidatos.</b></div>
<div class="cf106-cta"><div><h3>Encontre uma oportunidade que combine com você.</h3><p>Comece pelo currículo ou explore as vagas disponíveis.</p></div><div class="cf106-actions"><button type="button" class="cf106-btn primary" onclick="irPara('curriculo')">Cadastrar currículo</button><button type="button" class="cf106-btn secondary" onclick="irPara('home');setTimeout(rolarVagas,150)">Buscar vagas</button></div></div></section>
<section class="cf106-panel empresa" role="tabpanel" id="cf120Empresa" aria-labelledby="cf120TabEmpresa" hidden>
<div class="cf106-intro"><small>DO CADASTRO À SELEÇÃO</small><h2>Um processo de recrutamento mais organizado.</h2><p>Apresente sua empresa, divulgue oportunidades e acompanhe os candidatos.</p></div><div class="cf106-journey"><article class="cf106-card"><div class="cf106-num">01</div><h3>Cadastre a empresa</h3><p>Preencha os dados da empresa, endereço e responsável e crie sua senha de acesso.</p></article><article class="cf106-card"><div class="cf106-num">02</div><h3>Apresente sua organização</h3><p>Complete o perfil com informações institucionais, segmento, descrição e identidade visual.</p></article><article class="cf106-card"><div class="cf106-num">03</div><h3>Publique a oportunidade</h3><p>Informe cargo, local, modalidade, contrato, salário, requisitos e benefícios.</p></article><article class="cf106-card"><div class="cf106-num">04</div><h3>Escolha como receber</h3><p>Configure o recebimento pelo portal, e-mail, WhatsApp ou link externo, conforme as opções da vaga.</p></article><article class="cf106-card"><div class="cf106-num">05</div><h3>Analise os currículos</h3><p>Consulte as candidaturas recebidas pelo portal e os dados profissionais dos candidatos.</p></article><article class="cf106-card"><div class="cf106-num">06</div><h3>Organize o processo</h3><p>Atualize as etapas das candidaturas e gerencie suas vagas pelo painel empresarial.</p></article></div>
<section class="cf120-resources"><div class="cf106-intro"><small>FERRAMENTAS PARA SUA EMPRESA</small><h2>Gerencie oportunidades e candidatos em um só lugar.</h2></div><div class="cf120-feature-grid"><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Painel empresarial</h3><p>Reúna suas vagas e candidaturas em um ambiente de gestão.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Publicação em etapas</h3><p>Preencha as informações da oportunidade de forma organizada.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Gestão de vagas</h3><p>Acompanhe as oportunidades publicadas e atualize suas informações e status.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Análise de candidatos</h3><p>Consulte currículos e informações disponíveis para apoiar a seleção.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Etapas do processo</h3><p>Sinalize o andamento das candidaturas e mantenha sua equipe organizada.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Perfil da empresa</h3><p>Apresente sua marca, segmento e descrição institucional aos profissionais.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Verificação empresarial</h3><p>Envie dados e documentos para solicitar análise. O selo depende de aprovação.</p></article><article class="cf120-feature"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg></i><h3>Planos e visibilidade</h3><p>Consulte na área de planos os recursos e limites disponíveis para sua conta.</p></article></div></section>
<div class="cf120-guide"><div><small>UMA VAGA BEM APRESENTADA</small><h2>Ajude os profissionais a conhecer sua oportunidade.</h2><p>Informações completas tornam a publicação mais clara e ajudam os candidatos a avaliar os requisitos antes de participar.</p></div><ul><li>Use um título objetivo para o cargo.</li><li>Informe localização, modalidade e tipo de contrato.</li><li>Descreva responsabilidades, requisitos e benefícios.</li><li>Revise a forma de recebimento e atualize as etapas.</li></ul></div>
<div class="cf106-cta"><div><h3>Seu próximo talento pode estar no EmpregaMais.</h3><p>Crie sua conta empresarial e conheça os recursos do portal.</p></div><div class="cf106-actions"><button type="button" class="cf106-btn primary" onclick="irPara('cadastro-empresa')">Cadastrar empresa</button><button type="button" class="cf106-btn secondary" onclick="abrirPublicacao()">Publicar vaga</button></div></div></section>
<section class="cf106-faq"><div class="cf106-faq-head"><h2>Perguntas frequentes</h2><p>Entenda os recursos e os próximos passos para o seu perfil.</p></div><div class="cf106-faq-list" id="cf106Faq"></div></section></div>`;
pg.replaceChildren(x);
var faqs={
candidato:[
["Preciso pagar para me candidatar?","Não. Criar currículo, pesquisar oportunidades e enviar candidaturas pelo EmpregaMais é gratuito para candidatos."],
["Posso atualizar meu currículo?","Sim. Você pode manter suas informações profissionais atualizadas pela sua área de candidato."],
["Como acompanho minhas candidaturas?","As candidaturas realizadas pelo portal podem ser consultadas na área do candidato, conforme as informações disponibilizadas no processo."],
["Posso me candidatar mais de uma vez à mesma vaga?","Não. Cada candidato pode registrar apenas uma candidatura para a mesma oportunidade."]
],
empresa:[
["Como publico uma vaga?","Após acessar a área empresarial, utilize a opção de publicar vaga e preencha as informações da oportunidade."],
["Como recebo os currículos?","Na publicação, escolha a forma de recebimento disponível para a vaga: portal, e-mail, WhatsApp ou link externo. As candidaturas enviadas pelo portal ficam disponíveis na área empresarial; canais externos seguem o fluxo escolhido pela empresa."],
["Onde gerencio minhas vagas?","As vagas e candidaturas ficam organizadas na área da empresa para acompanhamento e gestão."],
["Como funciona a verificação da empresa?","Quando disponível para a conta, a empresa pode enviar as informações solicitadas para análise de verificação pelo EmpregaMais."]
]
};
function faq(tipo){
var el=document.getElementById("cf106Faq");el.innerHTML="";
faqs[tipo].forEach(function(a){
var d=document.createElement("div");d.className="cf106-faq-item";
d.innerHTML='<button class="cf106-faq-q" type="button">'+a[0]+'<span>＋</span></button><div class="cf106-faq-a">'+a[1]+'</div>';
d.querySelector("button").setAttribute("aria-expanded","false");d.querySelector("button").onclick=function(){d.classList.toggle("open");this.setAttribute("aria-expanded",String(d.classList.contains("open")));this.querySelector("span").textContent=d.classList.contains("open")?"−":"＋";};el.appendChild(d);
});
}
x.querySelectorAll("[data-cf106]").forEach(function(b){b.onclick=function(){
var tipo=b.getAttribute("data-cf106");
x.querySelectorAll(".cf106-tab").forEach(function(z){z.classList.remove("ativo")});
x.querySelectorAll(".cf106-panel").forEach(function(z){z.classList.remove("ativo")});
b.classList.add("ativo");x.dataset.publico=tipo;
x.querySelectorAll(".cf106-panel").forEach(function(panel){panel.hidden=!panel.classList.contains(tipo);});
x.querySelector(".cf106-panel."+tipo).classList.add("ativo");
x.querySelectorAll(".cf106-tab").forEach(function(tab){var selected=tab===b;tab.setAttribute("aria-selected",String(selected));tab.tabIndex=selected?0:-1;});
var empresa=tipo==="empresa";
document.getElementById("cf120HeroTitle").textContent=empresa?"Encontre talentos. Organize seu recrutamento.":"Seu próximo passo profissional começa aqui.";
document.getElementById("cf120HeroText").textContent=empresa?"Publique oportunidades, apresente sua empresa e acompanhe o processo seletivo com ferramentas reunidas no painel empresarial.":"Encontre oportunidades, organize seu currículo e acompanhe suas candidaturas em uma experiência simples, do seu jeito.";
document.getElementById("cf120OverviewTitle").textContent=empresa?"Sua seleção, mais organizada.":"Sua carreira, mais organizada.";
document.getElementById("cf120OverviewOne").textContent=empresa?"Publicação e gestão de oportunidades":"Currículo e perfil profissional";
document.getElementById("cf120OverviewTwo").textContent=empresa?"Currículos e etapas de seleção":"Busca com filtros e localização";
document.getElementById("cf120OverviewThree").textContent=empresa?"Perfil e painel empresarial":"Candidaturas em um só lugar";
document.getElementById("cf120HeroPrimary").textContent=empresa?"Cadastrar empresa":"Cadastrar currículo";
document.getElementById("cf120HeroSecondary").textContent=empresa?"Acessar painel":"Explorar vagas";
faq(tipo);
}});
x.querySelector(".cf106-tabs").addEventListener("keydown",function(e){if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();var tabs=Array.from(x.querySelectorAll(".cf106-tab"));var i=tabs.indexOf(document.activeElement);var target=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;tabs[target].click();tabs[target].focus();});
document.getElementById("cf120HeroPrimary").onclick=function(){irPara(x.dataset.publico==="empresa"?"cadastro-empresa":"curriculo");};
document.getElementById("cf120HeroSecondary").onclick=function(){if(x.dataset.publico==="empresa")irPara("login-empresa");else{irPara("home");setTimeout(rolarVagas,150);}};
faq("candidato");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",montar);else montar();
})();
//
;
//
(function(){
function restaurarHomeV109(){
var q=new URLSearchParams(location.search);
var pagina=q.get("pagina");
if(pagina)return;
var home=document.getElementById("pagina-home");
if(!home)return;
home.style.removeProperty("display");
if(typeof window.mostrarPagina==="function"){
window.mostrarPagina("home");
}else{
document.querySelectorAll(".pagina").forEach(function(x){x.classList.remove("ativa")});
home.classList.add("ativa");
}
if(typeof window.renderizarVagas==="function"){
try{window.renderizarVagas()}catch(e){}
}
}
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",function(){setTimeout(restaurarHomeV109,60)});
}else{
setTimeout(restaurarHomeV109,60);
}
window.addEventListener("load",function(){setTimeout(restaurarHomeV109,180)});
window.addEventListener("popstate",function(){
setTimeout(restaurarHomeV109,30);
});
})();
//
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
window.abrirContatoExternoVaga=function(v){
if(window.EmpregaMaisCandidaturaV94)window.EmpregaMaisCandidaturaV94.abrir(v||window.vagaAtual);
};
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
return typeof window.candidatoEstaLogado==="function" && window.candidatoEstaLogado();
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
try{
localStorage.setItem("candidatosEmpregaMais",JSON.stringify(a));
if(typeof window.entrarComoCandidato!=="function")throw new Error("Sessão indisponível");
window.entrarComoCandidato(d);
}catch(e){return {ok:false,erro:"Não foi possível concluir o cadastro neste navegador. Permita o armazenamento do site e tente novamente."};}
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
if(typeof window.candidatoEstaLogado==="function" && window.candidatoEstaLogado()){
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
x.innerHTML=`<header class="cf106-hero"><div class="cf120-hero-grid"><div><span class="cf106-kicker">CONHEÇA O EMPREGAMAIS</span><h1 id="cf120HeroTitle">Como enviar seu currículo para as vagas</h1><p id="cf120HeroText">Encontre oportunidades no Mais Empregos e saiba como se candidatar pelo canal indicado em cada anúncio.</p><div class="cf120-hero-actions"><button class="cf106-btn primary" id="cf120HeroPrimary" type="button">Cadastrar currículo</button><button class="cf106-btn secondary" id="cf120HeroSecondary" type="button">Explorar vagas</button></div></div><aside class="cf120-overview"><span>DA BUSCA AO PRÓXIMO PASSO</span><h2 id="cf120OverviewTitle">Sua carreira, mais organizada.</h2><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewOne">Currículo e perfil profissional</span></div><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewTwo">Busca com filtros e localização</span></div><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 12 3 3 7-7"/></svg><span id="cf120OverviewThree">Candidaturas em um só lugar</span></div></aside></div></header>
<div class="cf106-tabs-wrap"><div class="cf106-tabs" role="tablist" aria-label="Como funciona para cada público"><button type="button" role="tab" aria-selected="true" aria-controls="cf120Candidato" id="cf120TabCandidato" class="cf106-tab cand ativo" data-cf106="candidato">Para candidatos</button><button type="button" role="tab" aria-selected="false" aria-controls="cf120Empresa" id="cf120TabEmpresa" class="cf106-tab emp" data-cf106="empresa" tabindex="-1">Para empresas</button></div></div>
<div class="cf106-content">
<section class="cf106-panel candidato ativo" role="tabpanel" id="cf120Candidato" aria-labelledby="cf120TabCandidato">
<div class="cf-candidate-trust"><article><b>Candidatura gratuita</b><span>Sem taxas para participar</span></article><article><b>Orientações em cada vaga</b><span>Siga o canal indicado pela empresa</span></article><article><b>Currículo organizado</b><span>Mantenha seus dados atualizados</span></article></div>
<div class="cf106-intro"><small>DA BUSCA À CANDIDATURA</small><h2>Candidate-se em quatro etapas</h2><p>Veja como encontrar uma oportunidade e enviar seu currículo.</p></div>
<div class="cf106-journey"><article class="cf106-card"><div class="cf106-num">01</div><h3>Encontre uma vaga</h3><p>Busque pelo cargo, cidade ou palavra-chave e use os filtros para encontrar oportunidades.</p></article><article class="cf106-card"><div class="cf106-num">02</div><h3>Leia o anúncio</h3><p>Confira atividades, requisitos, benefícios e localização antes de se candidatar.</p></article><article class="cf106-card"><div class="cf106-num">03</div><h3>Confira as instruções</h3><p>Identifique a forma de candidatura escolhida pela empresa no anúncio da vaga.</p></article><article class="cf106-card"><div class="cf106-num">04</div><h3>Envie sua candidatura</h3><p>Use o botão da vaga e siga as orientações para enviar seu currículo pelo canal indicado.</p></article></div>
<section class="cf-candidate-section"><div class="cf106-intro"><small>FORMAS DE CANDIDATURA</small><h2>Como a empresa pode receber seu currículo</h2><p>O canal de envio varia conforme a oportunidade. Confira sempre o anúncio.</p></div><div class="cf-candidate-channels"><article class="cf106-card"><div class="cf106-num">✉</div><h3>Por e-mail</h3><p>Envie o currículo para o endereço informado. Identifique a vaga no assunto e escreva uma apresentação breve.</p></article><article class="cf106-card"><div class="cf106-num">↗</div><h3>Por um link externo</h3><p>Acesse o endereço indicado pela empresa e siga as instruções da página de candidatura.</p></article><article class="cf106-card"><div class="cf106-num">☏</div><h3>Pelo WhatsApp</h3><p>Use o contato informado no anúncio. Apresente-se, mencione a vaga e envie o currículo conforme solicitado.</p></article><article class="cf106-card"><div class="cf106-num">✓</div><h3>Pelo Mais Empregos</h3><p>Quando a vaga receber candidaturas pelo portal, acesse sua conta, confira seu currículo e conclua o envio.</p></article></div></section>
<section class="cf-candidate-section"><div class="cf106-intro"><small>ANTES DE ENVIAR</small><h2>Prepare uma candidatura clara e profissional</h2><p>Informações atualizadas e uma mensagem objetiva ajudam na apresentação.</p></div><div class="cf-candidate-prep"><article class="cf106-card"><h3>Checklist do seu currículo</h3><ul><li>Nome, telefone e e-mail atualizados.</li><li>Objetivo profissional alinhado à vaga.</li><li>Experiências e principais atividades.</li><li>Formação, cursos e habilidades relevantes.</li><li>Arquivo legível, com nome fácil de identificar.</li><li>Revise a escrita antes de enviar.</li></ul></article><article class="cf106-card"><h3>Exemplo de mensagem de apresentação</h3><p>Personalize o texto com seus dados e a oportunidade escolhida.</p><blockquote>Olá! Meu nome é [seu nome] e tenho interesse na vaga de [cargo], anunciada no Mais Empregos.<br><br>Tenho experiência em [área ou atividade] e encaminho meu currículo para avaliação.<br><br>Agradeço pela atenção e fico à disposição para conversar.</blockquote></article></div></section>
<aside class="cf-candidate-safety"><span aria-hidden="true">!</span><div><h3>Não realize pagamentos para participar de processos seletivos</h3><p>As candidaturas são gratuitas. Se houver cobrança, desconfie e confira as informações da empresa antes de continuar.</p></div></aside>
<div class="cf106-cta"><div><h3>Pronto para dar o próximo passo?</h3><p>Prepare seu currículo e encontre oportunidades que combinem com você.</p></div><div class="cf106-actions"><button type="button" class="cf106-btn primary" onclick="irPara('home');setTimeout(rolarVagas,150)">Ver vagas disponíveis</button><button type="button" class="cf106-btn secondary" onclick="irPara('curriculo')">Cadastrar currículo</button></div></div></section>
<section class="cf106-panel empresa" role="tabpanel" id="cf120Empresa" aria-labelledby="cf120TabEmpresa" hidden>
<div class="cf-company-trust"><article><b>Publicação gratuita</b><span>Dentro das condições do plano</span></article><article><b>Painel empresarial</b><span>Vagas e candidaturas organizadas</span></article><article><b>Perfil da empresa</b><span>Sua marca no portal</span></article></div><div class="cf106-intro"><small>PARA EMPRESAS E RECRUTADORES</small><h2>Como anunciar no Mais Empregos</h2><p>Apresente sua oportunidade e gerencie a seleção pelo painel empresarial.</p></div>
<div class="cf106-journey"><article class="cf106-card"><div class="cf106-num">01</div><h3>Crie seu acesso</h3><p>Cadastre a empresa e o responsável para acessar sua conta.</p></article><article class="cf106-card"><div class="cf106-num">02</div><h3>Descreva a oportunidade</h3><p>Informe função, requisitos, localização e forma de candidatura.</p></article><article class="cf106-card"><div class="cf106-num">03</div><h3>Confira a modalidade</h3><p>Consulte os limites gratuitos e as opções de destaque disponíveis.</p></article><article class="cf106-card"><div class="cf106-num">04</div><h3>Acompanhe a seleção</h3><p>Gerencie vagas, currículos e etapas na área da empresa.</p></article></div>
<section class="cf120-resources"><div class="cf106-intro"><small>MODALIDADES DE DIVULGAÇÃO</small><h2>Escolha como apresentar sua vaga.</h2></div><div class="cf-company-options">
<article class="cf106-card"><small>DIVULGAÇÃO SEM CUSTO</small><h3>Plano gratuito*</h3><p>Comece a divulgar sua oportunidade no portal.</p><ul class="cf-plan-benefits"><li>Publicação sem custo, dentro dos limites do plano.</li><li>Informações completas sobre a oportunidade.</li><li>Gestão de vagas no painel empresarial.</li><li>Perfil institucional para apresentar sua empresa.</li></ul><button class="cf106-btn primary" type="button" onclick="abrirPublicacao()">Publicar gratuitamente</button><p class="cf-plan-note">*A publicação gratuita segue os limites e condições do plano.</p></article>
<article class="cf106-card"><small>MAIS ALCANCE PARA SUA VAGA</small><h3>Planos Premium</h3><p>Conheça opções para valorizar sua divulgação.</p><ul class="cf-plan-benefits"><li>Compare os recursos de cada modalidade.</li><li>Consulte opções de destaque para sua vaga.</li><li>Confira limites e condições antes de escolher.</li><li>Acesse os detalhes na página de planos.</li></ul><button class="cf106-btn secondary" type="button" onclick="irPara('planos')">Ver opções Premium</button><p class="cf-plan-note">Os recursos e benefícios variam conforme a modalidade escolhida.</p></article>
</div></section>
<section class="cf-company-prep"><div class="cf106-intro"><small>ANTES DE PUBLICAR</small><h2>Tenha estas informações em mãos.</h2><p>Prepare os detalhes para apresentar a vaga com clareza.</p></div><div class="cf-prep-grid"><ul class="cf-prep-list"><li>Cargo e atividades</li><li>Requisitos e experiência</li><li>Cidade e modalidade</li><li>Tipo de contrato</li><li>Horário ou escala</li><li>Salário e benefícios</li><li>Forma de candidatura</li><li>Logo da empresa</li></ul><aside class="cf-prep-tip"><span aria-hidden="true">✓</span><h3>Uma dica importante</h3><p>Descreva o dia a dia da função e os requisitos essenciais. Um anúncio objetivo ajuda o profissional a entender se a vaga combina com seu perfil.</p></aside></div></section>
<section class="cf120-resources"><div class="cf106-intro"><small>SEU PAINEL EMPRESARIAL</small><h2>Organização para cada etapa.</h2></div><div class="cf120-feature-grid"><article class="cf120-feature"><h3>Perfil institucional</h3><p>Apresente sua marca, segmento e informações da empresa.</p></article><article class="cf120-feature"><h3>Gestão de candidatos</h3><p>Consulte os currículos recebidos pelo portal e acompanhe as etapas do processo.</p></article><article class="cf120-feature"><h3>Verificação cadastral</h3><p>Solicite a análise dos dados e documentos. O selo depende de aprovação.</p></article></div></section>
<div class="cf106-cta"><div><h3>Pronto para divulgar sua oportunidade?</h3><p>Comece pelo cadastro ou entre na sua área empresarial.</p></div><div class="cf106-actions"><button type="button" class="cf106-btn primary" onclick="irPara('cadastro-empresa')">Cadastrar empresa</button><button type="button" class="cf106-btn secondary" onclick="irPara('login-empresa')">Acessar meu painel</button></div></div></section>
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
["Posso publicar gratuitamente?","O portal oferece um plano gratuito. Consulte na página de planos os limites e condições atuais para sua empresa."],
["Como escolho uma opção de destaque?","Acesse a página de planos e compare os recursos disponíveis antes de escolher. Os benefícios e condições são apresentados pelo Mais Empregos."],
["Preciso cadastrar minha empresa?","Sim. O cadastro permite acessar o painel empresarial, apresentar sua organização e gerenciar as oportunidades."],
["Como recebo as candidaturas?","Escolha na publicação entre os canais disponíveis: portal, e-mail, WhatsApp ou link externo. As candidaturas feitas pelo portal ficam na área empresarial."],
["Onde acompanho minhas vagas?","Acesse sua conta empresarial para consultar as publicações e acompanhar os candidatos recebidos pelo portal."],
["O selo de empresa verificada é automático?","Não. A verificação depende da análise e aprovação das informações e documentos enviados pela empresa."]
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
document.getElementById("cf120HeroTitle").textContent=empresa?"Publique sua vaga e encontre novos talentos.":"Como enviar seu currículo para as vagas";
document.getElementById("cf120HeroText").textContent=empresa?"Anuncie no Mais Empregos, escolha os recursos disponíveis para sua conta e acompanhe as candidaturas pelo painel da empresa.":"Encontre oportunidades no Mais Empregos e saiba como se candidatar pelo canal indicado em cada anúncio.";
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
/* WhatsApp sharing and blue metadata */
(function(){
function botaoCompartilharWhatsAppEM(vaga){
 var a=document.createElement("a");a.className="em-whatsapp-share";
 var url=new URL(window.location.pathname,window.location.origin);url.searchParams.set("pagina","vaga");url.searchParams.set("id",String(vaga.id));
 var cidade=String(vaga.cidade||vaga.localizacao||"").trim(),uf=String(vaga.uf||vaga.estado||"").trim();
 var local=cidade+(uf&&cidade.toLowerCase().indexOf(uf.toLowerCase())<0?" - "+uf:"");
 var home=new URL(window.location.pathname,window.location.origin);
 var mensagem="Olá! Confira esta vaga no *Mais Empregos* 👋\n\n💼 *"+String(vaga.cargo||vaga.titulo||"Vaga de emprego")+"*"+(local?"\n📍 *Local: "+local+"*":"")+"\n\nConfira os detalhes e candidate-se 👇\n"+url.href+"\n\nPara mais vagas, acesse 👇\n"+home.href+"\n\nSucesso na sua busca! 🍀";
 a.href="https://wa.me/?text="+encodeURIComponent(mensagem);
 a.target="_blank";a.rel="noopener noreferrer";a.title="Compartilhar vaga no WhatsApp";a.setAttribute("aria-label","Compartilhar vaga no WhatsApp");
 a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M8.1 7.8c.4-.4.8-.2 1 .2l.9 1.8c.2.3.1.5-.2.8l-.6.6c.7 1.5 1.8 2.6 3.4 3.3l.7-.8c.2-.3.5-.3.8-.2l1.8.9c.4.2.5.6.2 1-.5.9-1.4 1.3-2.4 1-3.5-1-6-3.5-6.6-6.3-.2-.9.2-1.8 1-2.3Z"/></svg>';
 a.addEventListener("click",function(e){e.stopPropagation();});return a;
}

function install(){
var style=document.createElement("style");style.id="em-whatsapp-blue-chips";style.textContent="html body #pagina-home .em-apply-share{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important}\nhtml body #pagina-home #listaVagas#listaVagas .em-apply-share-recent{grid-column:4!important;grid-row:1!important;justify-self:end!important}\nhtml body #pagina-home #listaVagas#listaVagas .em-apply-share-recent .em-lista-ver{position:static!important;margin:0!important;min-width:0!important;width:auto!important;padding:9px 12px!important}\nhtml body #pagina-home #listaDestaques#listaDestaques .em-apply-share-featured{margin-top:auto!important;width:100%!important}\nhtml body #pagina-home #listaDestaques#listaDestaques .em-apply-share-featured .dz-botao{flex:1!important;min-width:0!important;width:auto!important;margin:0!important}\nhtml body #pagina-home :is(#listaVagas#listaVagas,#listaDestaques#listaDestaques) .em-whatsapp-share{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 34px!important;width:34px!important;height:34px!important;border:1px solid #079b64!important;border-radius:50%!important;background:#08a96c!important;color:white!important;text-decoration:none!important;padding:0!important;box-shadow:none!important}\nhtml body #pagina-home .em-whatsapp-share svg{width:20px!important;height:20px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.6!important;stroke-linecap:round!important;stroke-linejoin:round!important}\nhtml body #pagina-home .em-whatsapp-share:hover{background:#078453!important}\nhtml body #pagina-home .em-whatsapp-share:focus-visible{outline:3px solid #86dcbc!important;outline-offset:3px!important}\n\n\n\n\n@media(max-width:760px){html body #pagina-home #listaVagas#listaVagas .em-apply-share-recent{grid-column:2!important;grid-row:2!important}}\n@media(min-width:761px) and (max-width:1100px){html body #pagina-home #listaVagas#listaVagas article.em-lista-final .em-lista-footer{grid-template-columns:auto minmax(0,1fr) auto!important}html body #pagina-home #listaVagas#listaVagas .em-lista-data{grid-column:1/3!important;grid-row:2!important}html body #pagina-home #listaVagas#listaVagas .em-apply-share-recent{grid-column:3!important;grid-row:2!important}}";document.head.appendChild(style);
var original=window.criarCardVaga;if(typeof original!=="function")return;
window.criarCardVaga=function(vaga,destaque){
 var card=original.apply(this,arguments),button=card.querySelector(".em-lista-ver,.dz-botao");if(destaque||!button)return card;
 var wrap=document.createElement("div");wrap.className="em-apply-share "+(destaque?"em-apply-share-featured":"em-apply-share-recent");
 button.replaceWith(wrap);wrap.append(botaoCompartilharWhatsAppEM(vaga),button);return card;
};
if(typeof renderizarVagas==="function")renderizarVagas();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();

/* Job detail presentation */
(function(){
function enhance(){
 var page=document.getElementById("pagina-vaga");if(!page)return;
 var title=page.querySelector("#detalheCargoCab");if(!title)return;
 var apply=page.querySelector(".aplicar-bloco-principal h3");if(apply)apply.textContent="Candidate-se à vaga";
 var box=page.querySelector(".conteudo-vaga-box");
 if(box&&!box.querySelector(".em-detail-tabs")){
  var blocks=Array.from(box.querySelectorAll(":scope>.bloco-detalhe")),nav=document.createElement("div");nav.className="em-detail-tabs";nav.setAttribute("role","navigation");nav.setAttribute("aria-label","Informações da vaga");
  blocks.forEach(function(block,i){
   var btn=document.createElement("button");btn.type="button";btn.textContent=["Descrição","Requisitos","Benefícios","Informações da vaga"][i]||"Informações";btn.id="em-detail-tab-"+i;block.id="em-detail-panel-"+i;block.setAttribute("role","region");block.setAttribute("aria-labelledby",btn.id);btn.setAttribute("role","button");btn.setAttribute("aria-controls",block.id);
   function select(){blocks.forEach(function(b,k){b.classList.remove("em-detail-tab-hidden");var t=nav.children[k];if(k===i)t.setAttribute("aria-current","location");else t.removeAttribute("aria-current");t.tabIndex=0;});block.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
   btn.onclick=select;btn.onkeydown=function(e){var k=e.key;if(k!=="ArrowRight"&&k!=="ArrowLeft")return;e.preventDefault();var n=(i+(k==="ArrowRight"?1:-1)+blocks.length)%blocks.length;nav.children[n].click();nav.children[n].focus();};
   nav.appendChild(btn);
  });box.prepend(nav);if(nav.firstElementChild)nav.firstElementChild.setAttribute("aria-current","location");
 }
 var date=page.querySelector(".em-detail-date");if(!date){date=document.createElement("div");date.className="em-detail-date";page.querySelector(".em-vaga-ref-main-v1").appendChild(date);}
 var published=page.querySelector("#detalhePublicacao");date.textContent=published&&published.textContent.trim()!=="-"?"Publicada em "+published.textContent.trim():"";
 var shares=page.querySelector(".compartilhar-vaga-botoes-em");
 if(shares&&!shares.querySelector(".em-detail-share")){
  var wa=document.createElement("button");wa.type="button";wa.className="em-detail-share em-whatsapp-share";wa.title="Compartilhar vaga no WhatsApp";wa.setAttribute("aria-label",wa.title);wa.innerHTML='<svg viewBox="0 0 24 24"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="m8 8 2 3-1 1c1 2 2 3 4 4l1-1 3 1c-1 3-4 2-6 0-3-2-5-6-3-8Z"/></svg>';
  wa.onclick=function(){var u=new URL(location.href),v=typeof vagaPorIdEM==="function"?vagaPorIdEM(u.searchParams.get("id")):null;var cargo=v&&(v.cargo||v.titulo)||title.textContent;var local=page.querySelector("#detalheCidade").textContent;var home=new URL(location.pathname,location.origin);var text="Olá! Confira esta vaga no *Mais Empregos* 👋\n\n💼 *"+cargo+"*\n📍 *Local: "+local+"*\n\nConfira os detalhes e candidate-se 👇\n"+u.href+"\n\nPara mais vagas, acesse 👇\n"+home.href+"\n\nSucesso na sua busca! 🍀";window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");};
  var copy=document.createElement("button");copy.type="button";copy.className="em-detail-share";copy.title="Copiar link da vaga";copy.setAttribute("aria-label",copy.title);copy.innerHTML='<svg viewBox="0 0 24 24"><path d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(2 0) scale(.85)"/></svg>';copy.onclick=function(){navigator.clipboard.writeText(location.href).then(function(){if(typeof mostrarToast==="function")mostrarToast("Link da vaga copiado.");}).catch(function(){if(typeof mostrarToast==="function")mostrarToast("Copie o endereço da vaga na barra do navegador.");});};
  shares.append(wa,copy);
 }
 var icons=[
  '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3"/>',
  '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/>'
 ];
 ["local","contrato","modalidade","salario"].forEach(function(kind,i){var icon=page.querySelector(".em-info-"+kind+"-v1 .em-info-icon-v1");if(icon&&!icon.querySelector("svg"))icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[i]+'</svg>';});
 if(shares){
  shares.querySelectorAll(".em-detail-share").forEach(function(btn,i){if(!btn.querySelector(".em-share-label")){var label=document.createElement("span");label.className="em-share-label";label.textContent=i===0?"WhatsApp":"Copiar link";btn.appendChild(label);}});
  if(!shares.querySelector(".em-email-share")){var email=document.createElement("button");email.type="button";email.className="em-detail-share em-email-share";email.title="Compartilhar por e-mail";email.setAttribute("aria-label",email.title);email.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg><span class="em-share-label">E-mail</span>';email.onclick=function(){location.href="mailto:?subject="+encodeURIComponent("Vaga: "+title.textContent)+"&body="+encodeURIComponent("Confira esta oportunidade: "+title.textContent+"\n"+location.href);};shares.appendChild(email);}
 }
 var sidebar=page.querySelector(".aplicar-lateral");
 if(sidebar){var company=sidebar.querySelector(".em-detail-company-name");if(!company){company=document.createElement("section");company.className="em-detail-company-name";var label=document.createElement("span");label.textContent="Empresa";var name=document.createElement("strong");company.append(label,name);sidebar.appendChild(company);}
 var header=page.querySelector("#detalheEmpresaCab");var nameText=header?Array.from(header.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join(" ").trim():"";
 company.querySelector("strong").textContent=nameText||"Empresa confidencial";
 }
 // Prefer the identity of the registered employer over a stale imported logo.
 var u=new URL(location.href),v=typeof vagaPorIdEM==="function"?vagaPorIdEM(u.searchParams.get("id")):null;
 var e=v&&typeof empresaDaVagaEM==="function"?empresaDaVagaEM(v):null;
 var logo=page.querySelector("#logoDetalhe");
 if(e&&logo&&!(typeof vagaEhConfidencialEM==="function"&&vagaEhConfidencialEM(v))){
  if(e.logo){logo.src=e.logo;logo.alt="Logo de "+(e.nomeFantasia||e.nome||"empresa");}
  else{logo.removeAttribute("src");logo.style.setProperty("display","none","important");}
 }
}
function schedule(){enhance();setTimeout(enhance,200);setTimeout(enhance,700);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule);else schedule();
window.addEventListener("load",schedule);window.addEventListener("popstate",schedule);
var previous=window.irPara;if(typeof previous==="function")window.irPara=function(){var r=previous.apply(this,arguments);if(arguments[0]==="vaga")schedule();return r;};
})();

/* Circular navigation without duplicating job cards or their actions. */
(function(){
function init(){
 var list=document.getElementById('listaDestaques');if(!list||list.dataset.circularFeatured)return;list.dataset.circularFeatured='true';
 var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function move(dir){var max=list.scrollWidth-list.clientWidth;if(max<=3)return;var step=window.innerWidth<=760?(list.firstElementChild.getBoundingClientRect().width+12):list.clientWidth+16;var target=dir>0?(list.scrollLeft>=max-3?0:Math.min(max,list.scrollLeft+step)):(list.scrollLeft<=3?max:Math.max(0,list.scrollLeft-step));list.scrollTo({left:target,behavior:reduced.matches?'auto':'smooth'});}
 window.moverDestaquesEmpregaMais=move;
 window.atualizarSetasDestaquesEmpregaMais=function(){var has=list.scrollWidth>list.clientWidth+3;['destaquesAnteriorEmpregaMais','destaquesProximoEmpregaMais'].forEach(function(id){var btn=document.getElementById(id);if(btn){btn.disabled=false;btn.style.display=has?'flex':'none';btn.textContent=id.indexOf('Anterior')>=0?'‹':'›';}});};
 var x=0,start=0;
 list.addEventListener('touchstart',function(e){if(e.touches.length===1){x=e.touches[0].clientX;start=list.scrollLeft;}},{passive:true});
 list.addEventListener('touchend',function(e){if(!e.changedTouches.length)return;var delta=e.changedTouches[0].clientX-x,max=list.scrollWidth-list.clientWidth;if(max>3&&Math.abs(delta)>45){if(start>=max-3&&delta<0)list.scrollTo({left:0,behavior:reduced.matches?'auto':'smooth'});else if(start<=3&&delta>0)list.scrollTo({left:max,behavior:reduced.matches?'auto':'smooth'});}},{passive:true});
 new MutationObserver(window.atualizarSetasDestaquesEmpregaMais).observe(list,{childList:true});window.atualizarSetasDestaquesEmpregaMais();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Featured cards follow the approved visual reference. */
(function(){
function install(){
 var previous=window.criarCardVaga;if(typeof previous!=='function')return;
 function enhance(card,v){
  var cab=card.querySelector('.dz-cab');if(!cab||card.querySelector('.em-featured-badges'))return card;
  var title=card.querySelector('.dz-titulo');if(title)cab.appendChild(title);
  var badges=document.createElement('div');badges.className='em-featured-badges';
  function badge(type,label,path){var el=document.createElement('span');el.className='em-featured-badge '+type;el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';var text=document.createElement('strong');text.textContent=label;el.appendChild(text);badges.appendChild(el);}
  badge('featured','EM DESTAQUE','<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>');
  if(v&&(v.urgente===true||v.urgente===1||v.urgente==='true'||v.contratacaoUrgente===true))badge('urgent','CONTRATAÇÃO URGENTE','<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>');
  card.prepend(badges);return card;
 }
 window.criarCardVaga=function(v,d){var card=previous.apply(this,arguments);return d?enhance(card,v):card;};
 if(typeof window.renderizarVagas==='function')window.renderizarVagas();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();

;
/* Corrige CTA Candidatar-se nos cards da lista V203 */
(function(){
if(window.__EmpregaMaisCardCandidatarV203)return;window.__EmpregaMaisCardCandidatarV203=true;
function vagaIdDoCard(card){
 var own=card.getAttribute('data-vaga-id')||card.getAttribute('data-id-vaga')||card.getAttribute('data-id');if(own)return own;
 var el=card.querySelector('[data-vaga-id],[data-id-vaga],[data-id]');
 var id=el&&(el.getAttribute('data-vaga-id')||el.getAttribute('data-id-vaga')||el.getAttribute('data-id'));
 if(id)return id;
 var href=Array.from(card.querySelectorAll('a[href]')).map(function(a){return a.getAttribute('href')||''}).find(function(h){return /pagina=vaga/i.test(h)&&/[?&]id=/.test(h)});
 if(href){try{return new URL(href,location.href).searchParams.get('id')}catch(e){}}
 var onclick=Array.from(card.querySelectorAll('[onclick]')).map(function(x){return x.getAttribute('onclick')||''}).find(function(s){return /abrirVaga/.test(s)});
 var m=onclick&&onclick.match(/abrirVaga\s*\(\s*['"]([^'"]+)/);return m?m[1]:'';
}
function abrir(id){
 if(!id)return false;
 if(typeof window.abrirVaga==='function'){window.abrirVaga(id);return true}
 if(typeof window.irPara==='function'){try{window.irPara('vaga',id);return true}catch(e){}}
 location.href='?pagina=vaga&id='+encodeURIComponent(id);return true;
}
document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('button,a');if(!b)return;
 var t=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 if(t.indexOf('candidatar-se')!==0)return;
 if(b.closest('#pagina-vaga'))return;
 var card=b.closest('[class*="vaga"],article,.card');if(!card)return;
 var id=vagaIdDoCard(card);if(!id)return;
 e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 abrir(id);
},true);
})();

;
/* Rodapé profissional dos cards de vaga V204 */
(function(){
if(window.__EmpregaMaisCardFooterV204)return;window.__EmpregaMaisCardFooterV204=true;
var ico={bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 5 14h6l-1 8 9-13h-6V2Z"/></svg>',pulse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>',cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>'};
function aplicar(){
 var page=document.getElementById('pagina-vagas')||document.getElementById('pagina-inicial');if(!page)return;
 page.querySelectorAll('.vaga-card,.card-vaga,[class*="vaga-card"]').forEach(function(card){
   var cand=Array.from(card.querySelectorAll('button,a')).find(function(x){return /^candidatar-se/i.test(String(x.textContent||'').trim())});if(!cand)return;
   var footer=cand.parentElement;if(!footer||footer.classList.contains('em-footer-vaga-v204'))return;
   var txt=String(footer.textContent||'');
   if(!/Candidatura rápida|Recrutamento ativo|Publicada em/i.test(txt))return;
   footer.classList.add('em-footer-vaga-v204');
   Array.from(footer.querySelectorAll('*')).forEach(function(el){
     var t=String(el.textContent||'').trim();
     if(t==='Candidatura rápida'&&!el.querySelector('svg')){el.classList.add('em-pill-v204','rapida');el.insertAdjacentHTML('afterbegin',ico.bolt);}
     if(t==='Recrutamento ativo'&&!el.querySelector('svg')){el.classList.add('em-pill-v204','ativo');el.insertAdjacentHTML('afterbegin',ico.pulse);}
     if(/^Publicada em/i.test(t)&&!el.querySelector('svg')){el.classList.add('em-data-v204');el.insertAdjacentHTML('afterbegin',ico.cal);}
   });
   cand.classList.add('em-candidatar-v204');if(!cand.querySelector('.em-doc-v204'))cand.insertAdjacentHTML('afterbegin','<span class="em-doc-v204">'+ico.doc+'</span>');
 });
}
document.addEventListener('DOMContentLoaded',function(){setTimeout(aplicar,500)});window.addEventListener('load',function(){setTimeout(aplicar,700);setTimeout(aplicar,1600)});new MutationObserver(function(){setTimeout(aplicar,80)}).observe(document.documentElement,{childList:true,subtree:true});
})();

;/* Mobile: garante abertura da vaga pelo CTA Candidatar-se V205 */
(function(){
if(window.__EmpregaMaisMobileCandidatarV205)return;window.__EmpregaMaisMobileCandidatarV205=true;
function idCard(card){
 if(!card)return '';
 var own=card.getAttribute('data-vaga-id')||card.getAttribute('data-id-vaga')||card.getAttribute('data-id');if(own)return own;
 var el=card.querySelector('[data-vaga-id],[data-id-vaga],[data-id]');
 var id=el&&(el.getAttribute('data-vaga-id')||el.getAttribute('data-id-vaga')||el.getAttribute('data-id'));
 if(id)return id;
 var nodes=Array.from(card.querySelectorAll('a[href*="pagina=vaga"]'));
 for(var i=0;i<nodes.length;i++){try{var x=new URL(nodes[i].getAttribute('href'),location.href).searchParams.get('id');if(x)return x;}catch(e){}}
 var oc=Array.from(card.querySelectorAll('[onclick]')).map(function(n){return n.getAttribute('onclick')||'';}).find(function(s){return /abrirVaga/.test(s);});
 var m=oc&&oc.match(/abrirVaga\s*\(\s*['"]([^'"]+)/);return m?m[1]:'';
}
function go(e){
 var b=e.target&&e.target.closest?e.target.closest('button,a'):null;if(!b)return;
 if(!/^candidatar-se/i.test(String(b.textContent||'').replace(/\s+/g,' ').trim()))return;
 if(b.closest('#pagina-vaga'))return;
 var card=b.closest('.vaga-card,.card-vaga,[class*="vaga-card"],article,.card');
 var id=idCard(card);if(!id)return;
 e.preventDefault();e.stopPropagation();
 location.assign(location.pathname+'?pagina=vaga&id='+encodeURIComponent(id));
}
document.addEventListener('pointerup',go,true);
})();

(function(){
 function initFeaturedLinks(){
  var original=window.criarCardVaga;
  if(typeof original==='function'&&!original.emJobIdLinked){
   var linked=function(vaga){var card=original.apply(this,arguments);if(card&&vaga&&vaga.id!=null)card.setAttribute('data-vaga-id',String(vaga.id));return card;};
   linked.emJobIdLinked=true;window.criarCardVaga=linked;
  }
  window.addEventListener('click',function(event){
   var button=event.target.closest&&event.target.closest('.dz-botao');if(!button)return;
   var card=button.closest('.destaque-zero-m6,.em-featured-reference');if(!card)return;
   var id=card.getAttribute('data-vaga-id')||card.getAttribute('data-id');
   if(!id&&typeof window.todasAsVagasPublicas==='function'){
    var matches=window.todasAsVagasPublicas().filter(function(v){return String(v.cargo||'')===card.getAttribute('data-titulo')&&String(v.empresa||'')===card.getAttribute('data-empresa')&&String(v.cidade||'')===card.getAttribute('data-cidade');});
    if(matches.length===1)id=matches[0].id;
   }
   if(id==null||id==='')return;
   event.preventDefault();event.stopImmediatePropagation();
   location.assign(location.pathname+'?pagina=vaga&id='+encodeURIComponent(id));
  },true);
  var home=document.getElementById('pagina-home');
  if(home&&home.classList.contains('ativa')&&typeof window.renderizarVagas==='function')window.renderizarVagas();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initFeaturedLinks,{once:true});else initFeaturedLinks();
})();

(function(){
 var pending=false;
 var paths={new:'<path d="m13 2-9 12h7l-1 8 10-12h-7l0-8Z"/>',active:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',low:'<path d="M5 5v14h14M8 9l4 4 4-5M16 8v4"/>',quick:'<path d="m13 2-9 12h7l-1 8 10-12h-7l0-8Z"/>'};
 function badge(kind,label,hint){return '<span class="em-status-badge em-status-'+kind+'" title="'+hint+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg><span>'+label+'</span></span>';}
 function paint(){
  var jobs=typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[];
  document.querySelectorAll('#listaVagas .vaga-card').forEach(function(card){
   var id=card.getAttribute('data-vaga-id')||card.getAttribute('data-id'),v=jobs.find(function(x){return String(x.id)===String(id);});if(!v)return;
   var target=card.querySelector('.em-lista-status');if(!target){var quick=Array.from(card.querySelectorAll('span')).find(function(x){return x.textContent.trim()==='Candidatura rápida';});if(quick)target=quick.parentNode.parentNode;}
   if(!target||target===card)return;
   var date=new Date(v.dataPublicacao||v.publicadaEm||v.created_at||''),age=(Date.now()-date.getTime())/3600000,html='';
   if(age>=0&&age<=48)html+=badge('new','Nova vaga','Publicada nas últimas 48 horas');
   var activity=v.recrutadorAtivo||v.recrutador_ativo;
   if(activity===true)html+=badge('active','Recrutador ativo','Atividade de recrutamento confirmada');
   var total=v.totalCandidaturas!=null?v.totalCandidaturas:v.candidaturas_count;
   if(age>24&&total!=null&&Number.isFinite(Number(total))&&Number(total)>=0&&Number(total)<15)html+=badge('low','Baixa concorrência','Menos de 15 candidaturas recebidas; publicada há mais de 24 horas');
   if(!html)html=badge('quick','Candidatura rápida','Candidate-se pelo portal');
   if(target.dataset.emBadgeMarkup!==html){target.classList.add('em-status-badges');target.innerHTML=html;target.dataset.emBadgeMarkup=html;}
  });
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;paint();});}
 function start(){
  var style=document.createElement('style');style.id='em-job-status-badges';
  style.textContent=`
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-badges{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:6px!important;margin:0!important;padding:0!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-badge{display:inline-flex!important;align-items:center!important;gap:5px!important;border:1px solid transparent!important;border-radius:6px!important;padding:4px 8px!important;font:600 10px/1.4 Montserrat,Arial,sans-serif!important;white-space:nowrap!important;box-shadow:none!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-badge svg{display:block!important;width:13px!important;height:13px!important;flex:0 0 13px!important;fill:none!important;stroke:currentColor!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-badge>span{font:inherit!important;color:inherit!important;padding:0!important;background:none!important;border:0!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-new{color:#1768b4!important;background:#eef6ff!important;border-color:#d2e6fb!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-active{color:#16804a!important;background:#effaf3!important;border-color:#d1eddc!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-low{color:#ac6810!important;background:#fff8ec!important;border-color:#f4e1ba!important}
html body #pagina-home #listaVagas#listaVagas#listaVagas .em-status-quick{color:#1768b4!important;background:#eef6ff!important;border-color:#d2e6fb!important}
`;document.head.appendChild(style);paint();var list=document.getElementById('listaVagas');if(list)new MutationObserver(schedule).observe(list,{childList:true,subtree:true});window.addEventListener('storage',schedule);window.addEventListener('load',schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

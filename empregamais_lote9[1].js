/* EmpregaMais - JavaScript externo - lote 9 */

//
(function(){
window.textoBotaoContatoVaga=function(vaga){
return "Candidatar-se";
};
window.abrirContatoExternoVaga=function(vaga){
var v=vaga||window.vagaAtual;
if(window.EmpregaMaisCandidaturaV94 &amp;&amp; typeof window.EmpregaMaisCandidaturaV94.abrir==="function"){
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
if(t.indexOf("candidatar-se por e-mail")&gt;=0 ||
t.indexOf("candidatar-se pelo whatsapp")&gt;=0 ||
t.indexOf("candidatar-se no site da empresa")&gt;=0 ||
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
for(var i=0;i&lt;ks.length;i++){
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
if(window.EmpregaMaisCandidaturaV94 &amp;&amp;
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
for(var i=0;i&lt;all.length;i++){
var t=String(all[i].textContent||"").trim().toLowerCase();
for(var j=0;j&lt;words.length;j++)if(t===words[j]||t.indexOf(words[j])&gt;=0)return all[i];
}
return null;
}
function menu(btn,type){
if(!btn||btn.closest(".header-v98-area"))return;
var wrap=document.createElement("span");wrap.className="header-v98-area";
btn.parentNode.insertBefore(wrap,btn);wrap.appendChild(btn);
var m=document.createElement("div");m.className="header-v98-menu";
var itens=type==="cand"?
[["login-candidato","↪ Entrar na minha conta"],["curriculo","▤ Cadastrar currículo"],["candidaturas","☷ Minhas candidaturas"],["vagas-salvas","♡ Vagas salvas"],["como-funciona","? Como funciona"]]:
[["login-empresa","↪ Entrar na minha conta"],["cadastro-empresa","▦ Cadastrar empresa"],["publicar-vaga","＋ Publicar vaga"],["painel-recrutador","☷ Minhas vagas"],["planos","◇ Planos"],["como-funciona","? Como funciona"]];
itens.forEach(function(x,k){if(k===itens.length-1){var sp=document.createElement("div");sp.className="header-v98-sep";m.appendChild(sp)}var b=document.createElement("button");b.type="button";b.textContent=x[1];b.onclick=function(e){e.stopPropagation();wrap.classList.remove("open");go(x[0])};m.appendChild(b)});
wrap.appendChild(m);
btn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();document.querySelectorAll(".header-v98-area").forEach(function(w){if(w!==wrap)w.classList.remove("open")});wrap.classList.toggle("open")});
}
function instalar(){
var cand=findButton(["candidato"]);
var emp=findButton(["empresa"]);
if(cand){cand.textContent="👤 Área do candidato ▾";menu(cand,"cand")}
if(emp){emp.textContent="▦ Área da empresa ▾";menu(emp,"emp")}
}
document.addEventListener("click",function(){document.querySelectorAll(".header-v98-area").forEach(function(w){w.classList.remove("open")})});
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
(function(){
function neutralizarV100(){
document.querySelectorAll(".header-v98-area").forEach(function(area){
var gatilho=area.querySelector(":scope &gt; a, :scope &gt; button");
if(!gatilho||gatilho.getAttribute("data-v100-pronto")==="1")return;
gatilho.setAttribute("data-v100-pronto","1");
if(gatilho.tagName==="A"){
gatilho.removeAttribute("href");
gatilho.setAttribute("role","button");
}
gatilho.addEventListener("click",function(e){
e.preventDefault();
e.stopImmediatePropagation();
area.classList.toggle("open");
return false;
},true);
area.addEventListener("mouseenter",function(){
document.querySelectorAll(".header-v98-area").forEach(function(x){
if(x!==area)x.classList.remove("open");
});
area.classList.add("open");
});
area.addEventListener("mouseleave",function(){
area.classList.remove("open");
});
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",neutralizarV100);
else neutralizarV100();
window.addEventListener("load",function(){setTimeout(neutralizarV100,200)});
new MutationObserver(neutralizarV100).observe(document.documentElement,{childList:true,subtree:true});
})();
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
if(q.get("pagina")===PAGE&amp;&amp;!logado())setTimeout(abrir,80);
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
if(cidadeAntiga &amp;&amp; cidadeAntiga.tagName!=="SELECT"){
var sel=document.createElement("select");
sel.id="cv101Cidade";
sel.required=true;
sel.disabled=true;
sel.innerHTML="&lt;option value=''&gt;Selecione primeiro o estado&lt;/option&gt;";
cidadeAntiga.parentNode.replaceChild(sel,cidadeAntiga);
var info=document.createElement("div");
info.className="cv101-city-loading";
info.id="cv101CidadeInfo";
sel.parentNode.appendChild(info);
}
function carregarCidades(){
var cidade=document.getElementById("cv101Cidade");
var info=document.getElementById("cv101CidadeInfo");
var sigla=String(uf&amp;&amp;uf.value||"").trim();
if(!cidade)return;
cidade.disabled=true;
if(!sigla){
cidade.innerHTML="&lt;option value=''&gt;Selecione primeiro o estado&lt;/option&gt;";
if(info)info.textContent="";
return;
}
cidade.innerHTML="&lt;option value=''&gt;Carregando cidades...&lt;/option&gt;";
if(info)info.textContent="Buscando municípios oficiais do estado selecionado...";
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+encodeURIComponent(sigla)+"/municipios?orderBy=nome")
.then(function(r){
if(!r.ok)throw new Error("IBGE");
return r.json();
})
.then(function(lista){
cidade.innerHTML="&lt;option value=''&gt;Selecione sua cidade&lt;/option&gt;";
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
cidade.innerHTML="&lt;option value=''&gt;Não foi possível carregar as cidades&lt;/option&gt;";
cidade.disabled=true;
if(info)info.textContent="Tente selecionar o estado novamente.";
});
}
if(uf){
uf.addEventListener("change",carregarCidades);
}
function preparar(){
if(uf &amp;&amp; uf.value)carregarCidades();
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
if(f &amp;&amp; p.nextElementSibling!==f){
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
if(false &amp;&amp; t==="cadastrar currículo"){
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
x.innerHTML=`
&lt;div class="cf106-hero"&gt;&lt;span class="cf106-kicker"&gt;COMO FUNCIONA&lt;/span&gt;&lt;h1&gt;Um portal. Duas jornadas.&lt;/h1&gt;&lt;p&gt;O EmpregaMais conecta profissionais e empresas em uma experiência simples, organizada e pensada para cada lado do processo seletivo.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-tabs-wrap"&gt;&lt;div class="cf106-tabs"&gt;&lt;button class="cf106-tab cand ativo" data-cf106="candidato"&gt;👤 Para candidatos&lt;/button&gt;&lt;button class="cf106-tab emp" data-cf106="empresa"&gt;▦ Para empresas&lt;/button&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="cf106-content"&gt;
&lt;div class="cf106-panel candidato ativo"&gt;
&lt;div class="cf106-intro"&gt;&lt;small&gt;PARA CANDIDATOS&lt;/small&gt;&lt;h2&gt;Da criação do currículo à candidatura&lt;/h2&gt;&lt;p&gt;Organize seu perfil profissional, encontre oportunidades e acompanhe sua jornada dentro do EmpregaMais.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-journey"&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;01&lt;/div&gt;&lt;h3&gt;Crie sua conta gratuitamente&lt;/h3&gt;&lt;p&gt;Cadastre seus dados básicos e tenha acesso à sua área exclusiva de candidato.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;02&lt;/div&gt;&lt;h3&gt;Construa seu currículo profissional&lt;/h3&gt;&lt;p&gt;Monte seu currículo online e mantenha suas informações profissionais organizadas e atualizadas.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;03&lt;/div&gt;&lt;h3&gt;Encontre oportunidades&lt;/h3&gt;&lt;p&gt;Pesquise vagas publicadas no portal e encontre oportunidades de acordo com seus interesses.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;04&lt;/div&gt;&lt;h3&gt;Candidate-se pelo EmpregaMais&lt;/h3&gt;&lt;p&gt;Envie sua candidatura pela própria oportunidade utilizando as opções disponibilizadas no portal.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;05&lt;/div&gt;&lt;h3&gt;Acompanhe suas candidaturas&lt;/h3&gt;&lt;p&gt;Consulte as oportunidades às quais você se candidatou e acompanhe as movimentações disponíveis.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;06&lt;/div&gt;&lt;h3&gt;Mantenha seu perfil atualizado&lt;/h3&gt;&lt;p&gt;Atualize suas experiências, formação e demais informações para manter seu currículo sempre atual.&lt;/p&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="cf106-free"&gt;✓ &lt;b&gt;Criar currículo, pesquisar vagas e enviar candidaturas é gratuito para candidatos.&lt;/b&gt;&lt;/div&gt;
&lt;div class="cf106-cta"&gt;&lt;div&gt;&lt;h3&gt;Seu próximo passo profissional pode começar aqui.&lt;/h3&gt;&lt;p&gt;Crie seu currículo e comece a explorar as oportunidades disponíveis.&lt;/p&gt;&lt;/div&gt;&lt;div class="cf106-actions"&gt;&lt;button class="cf106-btn primary" onclick="irPara('cadastro-curriculo')"&gt;Criar meu currículo&lt;/button&gt;&lt;button class="cf106-btn secondary" onclick="irPara('home')"&gt;Buscar vagas&lt;/button&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="cf106-panel empresa"&gt;
&lt;div class="cf106-intro"&gt;&lt;small&gt;PARA EMPRESAS&lt;/small&gt;&lt;h2&gt;Da publicação à gestão de candidatos&lt;/h2&gt;&lt;p&gt;Centralize suas oportunidades e organize o recebimento de candidaturas em uma área empresarial própria.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-journey"&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;01&lt;/div&gt;&lt;h3&gt;Cadastre sua empresa&lt;/h3&gt;&lt;p&gt;Crie a conta empresarial e informe os dados necessários para começar a utilizar o portal.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;02&lt;/div&gt;&lt;h3&gt;Complete o perfil da empresa&lt;/h3&gt;&lt;p&gt;Adicione informações institucionais e mantenha os dados da organização atualizados.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;03&lt;/div&gt;&lt;h3&gt;Publique uma oportunidade&lt;/h3&gt;&lt;p&gt;Informe cargo, local, modalidade, requisitos, benefícios e os demais detalhes da vaga.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;04&lt;/div&gt;&lt;h3&gt;Receba candidaturas&lt;/h3&gt;&lt;p&gt;Os profissionais interessados enviam suas candidaturas diretamente pela oportunidade.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;05&lt;/div&gt;&lt;h3&gt;Analise os candidatos&lt;/h3&gt;&lt;p&gt;Consulte os currículos recebidos e utilize as informações disponíveis para organizar sua análise.&lt;/p&gt;&lt;/div&gt;
&lt;div class="cf106-card"&gt;&lt;div class="cf106-num"&gt;06&lt;/div&gt;&lt;h3&gt;Gerencie o processo seletivo&lt;/h3&gt;&lt;p&gt;Acompanhe suas vagas e candidaturas pela área empresarial e mantenha o processo organizado.&lt;/p&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="cf106-cta"&gt;&lt;div&gt;&lt;h3&gt;Sua empresa está contratando?&lt;/h3&gt;&lt;p&gt;Cadastre sua empresa, publique oportunidades e centralize o recebimento de candidatos.&lt;/p&gt;&lt;/div&gt;&lt;div class="cf106-actions"&gt;&lt;button class="cf106-btn primary" onclick="irPara('cadastro-empresa')"&gt;Cadastrar empresa&lt;/button&gt;&lt;button class="cf106-btn secondary" onclick="irPara('publicar-vaga')"&gt;+ Publicar vaga&lt;/button&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="cf106-faq"&gt;&lt;div class="cf106-faq-head"&gt;&lt;h2&gt;Perguntas frequentes&lt;/h2&gt;&lt;p&gt;As respostas mudam automaticamente conforme a jornada selecionada.&lt;/p&gt;&lt;/div&gt;&lt;div class="cf106-faq-list" id="cf106Faq"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/div&gt;`;
pg.appendChild(x);
var faqs={
candidato:[
["Preciso pagar para me candidatar?","Não. Criar currículo, pesquisar oportunidades e enviar candidaturas pelo EmpregaMais é gratuito para candidatos."],
["Posso atualizar meu currículo?","Sim. Você pode manter suas informações profissionais atualizadas pela sua área de candidato."],
["Como acompanho minhas candidaturas?","As candidaturas realizadas pelo portal podem ser consultadas na área do candidato, conforme as informações disponibilizadas no processo."],
["Posso me candidatar mais de uma vez à mesma vaga?","Não. Cada candidato pode registrar apenas uma candidatura para a mesma oportunidade."]
],
empresa:[
["Como publico uma vaga?","Após acessar a área empresarial, utilize a opção de publicar vaga e preencha as informações da oportunidade."],
["Como recebo os currículos?","As candidaturas realizadas pelo EmpregaMais ficam vinculadas à oportunidade para consulta na área empresarial."],
["Onde gerencio minhas vagas?","As vagas e candidaturas ficam organizadas na área da empresa para acompanhamento e gestão."],
["Como funciona a verificação da empresa?","Quando disponível para a conta, a empresa pode enviar as informações solicitadas para análise de verificação pelo EmpregaMais."]
]
};
function faq(tipo){
var el=document.getElementById("cf106Faq");el.innerHTML="";
faqs[tipo].forEach(function(a){
var d=document.createElement("div");d.className="cf106-faq-item";
d.innerHTML='&lt;button class="cf106-faq-q" type="button"&gt;'+a[0]+'&lt;span&gt;＋&lt;/span&gt;&lt;/button&gt;&lt;div class="cf106-faq-a"&gt;'+a[1]+'&lt;/div&gt;';
d.querySelector("button").onclick=function(){d.classList.toggle("open")};el.appendChild(d);
});
}
x.querySelectorAll("[data-cf106]").forEach(function(b){b.onclick=function(){
var tipo=b.getAttribute("data-cf106");
x.querySelectorAll(".cf106-tab").forEach(function(z){z.classList.remove("ativo")});
x.querySelectorAll(".cf106-panel").forEach(function(z){z.classList.remove("ativo")});
b.classList.add("ativo");x.querySelector(".cf106-panel."+tipo).classList.add("ativo");faq(tipo);
}});
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
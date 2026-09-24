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
function vagaAtivaV95(){
var p=document.getElementById("pagina-vaga");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(vagaAtivaV95())setTimeout(corrigirBotoesV95,220)});
document.addEventListener("click",function(e){
var p=document.getElementById("pagina-vaga");
if(p&amp;&amp;p.contains(e.target))setTimeout(corrigirBotoesV95,80);
},false);
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="vaga"||p==="detalhe-vaga")setTimeout(corrigirBotoesV95,140);
});
/* Observa somente a página da vaga. Evita varrer o documento inteiro a cada
   alteração de DOM, o que podia gerar lentidão e interferir nos cliques. */
var paginaV95=document.getElementById("pagina-vaga");
if(paginaV95 && window.MutationObserver){
var timerV95=null;
new MutationObserver(function(){
clearTimeout(timerV95);
timerV95=setTimeout(corrigirBotoesV95,80);
}).observe(paginaV95,{childList:true,subtree:true});
}
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
var headerV99=document.querySelector("header");
if(headerV99 && window.MutationObserver){
var timerV99=null;
new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++){
if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
}
if(!precisa)return;
clearTimeout(timerV99);
timerV99=setTimeout(limparV99,60);
}).observe(headerV99,{childList:true,subtree:true});
}
})();
//
;
//
(function(){
function neutralizarV100(){
document.querySelectorAll(".header-v98-area").forEach(function(area){
var gatilho=area.querySelector(":scope > a, :scope > button");
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
var headerV100=document.querySelector("header");
if(headerV100 && window.MutationObserver){
var timerV100=null;
new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++){
if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
}
if(!precisa)return;
clearTimeout(timerV100);
timerV100=setTimeout(neutralizarV100,60);
}).observe(headerV100,{childList:true,subtree:true});
}
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
if(typeof window.abrirPaginaCadastroCandidatoV103==="function"){
window.abrirPaginaCadastroCandidatoV103();
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
if(!f)return;
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
if(q.get("pagina")!==PAGE)return;
if(logado()){
 if(typeof window.irPara==="function")window.irPara("curriculo");
 return;
}
if(typeof window.abrirPaginaCadastroCandidatoV103==="function")window.abrirPaginaCadastroCandidatoV103();
else abrir();
}
/* Uma única restauração de rota evita duas implementações diferentes
   disputarem a página após o F5. */
window.addEventListener("load",function(){setTimeout(rota,80);});
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
if(window.MutationObserver){
var timerRodapeV101=0;
new MutationObserver(function(muts){
if(!pagina.classList.contains("ativa"))return;
var relevante=false;
for(var i=0;i<muts.length;i++)if(muts[i].addedNodes&&muts[i].addedNodes.length){relevante=true;break;}
if(!relevante)return;
clearTimeout(timerRodapeV101);
timerRodapeV101=setTimeout(corrigirRodape,80);
}).observe(document.body,{childList:true,subtree:false});
}
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
/* Fallback restrito: não altera páginas fora do contêiner principal. */
var main=document.querySelector("main");
if(main)main.querySelectorAll(".pagina").forEach(function(x){x.classList.remove("ativa")});
}
var home=document.getElementById("pagina-home");
if(home)home.classList.remove("ativa");
p.classList.add("ativa");
/* A visibilidade fica a cargo das classes/CSS da página; display inline
   fazia o layout sobreviver à navegação seguinte e causava troca visual. */
p.style.removeProperty("display");
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
/* Não substitui mais window.irPara. A navegação global já possui uma cadeia
   de proteções de autenticação/sincronização; sobrescrevê-la aqui criava mais
   uma camada que alterava display da Home antes da rota terminar. */
document.addEventListener("empregamais:navegacao",function(ev){
var pagina=ev&&ev.detail&&ev.detail.pagina;
if(pagina&&pagina!=="cadastro-curriculo"){
 p.classList.remove("ativa");
 p.style.removeProperty("display");
}
});
window.addEventListener("load",function(){setTimeout(pelaURL,100)});
window.addEventListener("popstate",function(){
var q=new URLSearchParams(location.search);
if(q.get("pagina")==="cadastro-curriculo")abrirPaginaCadastroV103();
else{
p.classList.remove("ativa");p.style.removeProperty("display");
var home=document.getElementById("pagina-home");if(home)home.style.removeProperty("display");
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
<div class="cf106-hero"><span class="cf106-kicker">COMO FUNCIONA</span><h1>Um portal. Duas jornadas.</h1><p>O EmpregaMais conecta profissionais e empresas em uma experiência simples, organizada e pensada para cada lado do processo seletivo.</p></div>
<div class="cf106-tabs-wrap"><div class="cf106-tabs"><button class="cf106-tab cand ativo" data-cf106="candidato">👤 Para candidatos</button><button class="cf106-tab emp" data-cf106="empresa">▦ Para empresas</button></div></div>
<div class="cf106-content">
<div class="cf106-panel candidato ativo">
<div class="cf106-intro"><small>PARA CANDIDATOS</small><h2>Da criação do currículo à candidatura</h2><p>Organize seu perfil profissional, encontre oportunidades e acompanhe sua jornada dentro do EmpregaMais.</p></div>
<div class="cf106-journey">
<div class="cf106-card"><div class="cf106-num">01</div><h3>Crie sua conta gratuitamente</h3><p>Cadastre seus dados básicos e tenha acesso à sua área exclusiva de candidato.</p></div>
<div class="cf106-card"><div class="cf106-num">02</div><h3>Construa seu currículo profissional</h3><p>Monte seu currículo online e mantenha suas informações profissionais organizadas e atualizadas.</p></div>
<div class="cf106-card"><div class="cf106-num">03</div><h3>Encontre oportunidades</h3><p>Pesquise vagas publicadas no portal e encontre oportunidades de acordo com seus interesses.</p></div>
<div class="cf106-card"><div class="cf106-num">04</div><h3>Candidate-se pelo EmpregaMais</h3><p>Envie sua candidatura pela própria oportunidade utilizando as opções disponibilizadas no portal.</p></div>
<div class="cf106-card"><div class="cf106-num">05</div><h3>Acompanhe suas candidaturas</h3><p>Consulte as oportunidades às quais você se candidatou e acompanhe as movimentações disponíveis.</p></div>
<div class="cf106-card"><div class="cf106-num">06</div><h3>Mantenha seu perfil atualizado</h3><p>Atualize suas experiências, formação e demais informações para manter seu currículo sempre atual.</p></div>
</div>
<div class="cf106-free">✓ <b>Criar currículo, pesquisar vagas e enviar candidaturas é gratuito para candidatos.</b></div>
<div class="cf106-cta"><div><h3>Seu próximo passo profissional pode começar aqui.</h3><p>Crie seu currículo e comece a explorar as oportunidades disponíveis.</p></div><div class="cf106-actions"><button class="cf106-btn primary" onclick="irPara('cadastro-curriculo')">Criar meu currículo</button><button class="cf106-btn secondary" onclick="irPara('home')">Buscar vagas</button></div></div>
</div>
<div class="cf106-panel empresa">
<div class="cf106-intro"><small>PARA EMPRESAS</small><h2>Da publicação à gestão de candidatos</h2><p>Centralize suas oportunidades e organize o recebimento de candidaturas em uma área empresarial própria.</p></div>
<div class="cf106-journey">
<div class="cf106-card"><div class="cf106-num">01</div><h3>Cadastre sua empresa</h3><p>Crie a conta empresarial e informe os dados necessários para começar a utilizar o portal.</p></div>
<div class="cf106-card"><div class="cf106-num">02</div><h3>Complete o perfil da empresa</h3><p>Adicione informações institucionais e mantenha os dados da organização atualizados.</p></div>
<div class="cf106-card"><div class="cf106-num">03</div><h3>Publique uma oportunidade</h3><p>Informe cargo, local, modalidade, requisitos, benefícios e os demais detalhes da vaga.</p></div>
<div class="cf106-card"><div class="cf106-num">04</div><h3>Receba candidaturas</h3><p>Os profissionais interessados enviam suas candidaturas diretamente pela oportunidade.</p></div>
<div class="cf106-card"><div class="cf106-num">05</div><h3>Analise os candidatos</h3><p>Consulte os currículos recebidos e utilize as informações disponíveis para organizar sua análise.</p></div>
<div class="cf106-card"><div class="cf106-num">06</div><h3>Gerencie o processo seletivo</h3><p>Acompanhe suas vagas e candidaturas pela área empresarial e mantenha o processo organizado.</p></div>
</div>
<div class="cf106-cta"><div><h3>Sua empresa está contratando?</h3><p>Cadastre sua empresa, publique oportunidades e centralize o recebimento de candidatos.</p></div><div class="cf106-actions"><button class="cf106-btn primary" onclick="irPara('cadastro-empresa')">Cadastrar empresa</button><button class="cf106-btn secondary" onclick="irPara('publicar-vaga')">+ Publicar vaga</button></div></div>
</div>
<div class="cf106-faq"><div class="cf106-faq-head"><h2>Perguntas frequentes</h2><p>As respostas mudam automaticamente conforme a jornada selecionada.</p></div><div class="cf106-faq-list" id="cf106Faq"></div></div>
</div>`;
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
d.innerHTML='<button class="cf106-faq-q" type="button">'+a[0]+'<span>＋</span></button><div class="cf106-faq-a">'+a[1]+'</div>';
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
/* Só restaura a Home quando nenhuma outra página já está ativa.
   Evita o timer de inicialização trocar uma tela válida após o F5. */
var ativa=document.querySelector(".pagina.ativa");
if(ativa && ativa!==home)return;
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
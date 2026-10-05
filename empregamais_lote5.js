/* EmpregaMais - JavaScript externo - lote 5 */

//
var DET_PLANOS_V16={
basico:{nome:"Plano Gratuito",periodo:"Uso gratuito",preco:"Gratis",texto:"Para empresas que querem comecar a divulgar oportunidades e organizar candidaturas sem mensalidade.",vagas:"3 vagas por mes",vagasObs:"Cada vaga gratuita permanece ativa por ate 15 dias.",destaques:"0 incluidos",urgentes:"0 incluidos",conf:"R$ 9,90 por vaga",confObs:"Exige verificacao cadastral.",beneficios:["Painel do recrutador","3 publicacoes por mes","Vagas ativas por ate 15 dias","Recebimento de candidaturas","Gestao basica de candidatos","Estatisticas basicas","Contrata\u00E7\u00E3o Urgente por R$ 9,90 por vaga","Publicacao Confidencial por R$ 9,90 por vaga"],resumo:[["Mensalidade","R$ 0,00"],["Destaques","Nao incluidos"],["Urgente","R$ 9,90 por vaga"],["Confidencial","R$ 9,90 por vaga"],["Pagina da Empresa","Nao incluida"]]},
trimestral:{nome:"Plano Trimestral",periodo:"3 meses",preco:"R$ 79,90",texto:"Recursos profissionais para ampliar a divulgacao e administrar processos seletivos pelo EmpregaMais.",vagas:"50 vagas",vagasObs:"Quantidade disponivel durante a vigencia de 3 meses.",destaques:"Ate 10",urgentes:"5 por mes",conf:"Incluida",confObs:"Disponivel para empresa validada.",beneficios:["Painel completo do recrutador","50 vagas durante a vigencia","Ate 10 vagas em destaque simultaneamente","5 selos Contrata\u00E7\u00E3o Urgente por mes","Publicacao Confidencial incluida","Empresa Verificada apos validacao","Pagina Exclusiva da Empresa","Perfil institucional, cultura e beneficios","Gestao completa de candidatos","Estatisticas completas"],resumo:[["Vigencia","3 meses"],["Publicacoes","50 vagas"],["Destaques","Ate 10 simultaneos"],["Urgentes","5 por mes"],["Confidencial","Incluida"],["Pagina da Empresa","Incluida"]]},
semestral:{nome:"Plano Semestral",periodo:"6 meses",preco:"R$ 139,90",texto:"Mais capacidade para empresas com maior volume de oportunidades e processos seletivos recorrentes.",vagas:"100 vagas",vagasObs:"Quantidade disponivel durante a vigencia de 6 meses.",destaques:"Ate 20",urgentes:"7 por mes",conf:"Incluida",confObs:"Disponivel para empresa validada.",beneficios:["Painel completo do recrutador","100 vagas durante a vigencia","Ate 20 vagas em destaque simultaneamente","7 selos Contrata\u00E7\u00E3o Urgente por mes","Publicacao Confidencial incluida","Empresa Verificada apos validacao","Pagina Exclusiva da Empresa","Perfil institucional, cultura e beneficios","Gestao completa de candidatos","Estatisticas completas","Suporte prioritario"],resumo:[["Vigencia","6 meses"],["Publicacoes","100 vagas"],["Destaques","Ate 20 simultaneos"],["Urgentes","7 por mes"],["Confidencial","Incluida"],["Suporte","Prioritario"]]},
anual:{nome:"Plano Anual",periodo:"12 meses",preco:"R$ 239,90",texto:"Maior capacidade de publicacao para empresas que recrutam durante todo o ano.",vagas:"300 vagas",vagasObs:"Quantidade disponivel durante a vigencia de 12 meses.",destaques:"Ate 40",urgentes:"10 por mes",conf:"Incluida",confObs:"Disponivel para empresa validada.",beneficios:["Painel completo do recrutador","300 vagas durante a vigencia","Ate 40 vagas em destaque simultaneamente","10 selos Contrata\u00E7\u00E3o Urgente por mes","Publicacao Confidencial incluida","Empresa Verificada apos validacao","Pagina Exclusiva da Empresa","Perfil institucional, cultura e beneficios","Gestao completa de candidatos","Estatisticas completas","Suporte prioritario"],resumo:[["Vigencia","12 meses"],["Publicacoes","300 vagas"],["Destaques","Ate 40 simultaneos"],["Urgentes","10 por mes"],["Confidencial","Incluida"],["Suporte","Prioritario"]]}
};
var detPlanoAtualV16="basico";
function abrirDetalhesPlanoV16(chave){
var d=DET_PLANOS_V16[chave]||DET_PLANOS_V16.basico;detPlanoAtualV16=DET_PLANOS_V16[chave]?chave:"basico";
var pg=document.getElementById("pagina-detalhes-plano-v16");
if(typeof window.mostrarPagina==="function")window.mostrarPagina("detalhes-plano-v16");
else{
 document.querySelectorAll(".pagina").forEach(function(x){x.classList.remove("ativa");});
 if(pg)pg.classList.add("ativa");
}
document.getElementById("detNomeV16").textContent=d.nome;document.getElementById("detTextoV16").textContent=d.texto;document.getElementById("detPeriodoV16").textContent=d.periodo;document.getElementById("detPrecoV16").textContent=d.preco;
document.getElementById("detVagasV16").textContent=d.vagas;document.getElementById("detVagasObsV16").textContent=d.vagasObs;document.getElementById("detDestaquesV16").textContent=d.destaques;document.getElementById("detUrgentesV16").textContent=d.urgentes;document.getElementById("detConfV16").textContent=d.conf;document.getElementById("detConfObsV16").textContent=d.confObs;
var b=document.getElementById("detBeneficiosV16");b.innerHTML="";d.beneficios.forEach(function(x){var e=document.createElement("div");e.className="det-beneficio-v16";e.innerHTML="<b>&amp;#10003;</b>"+x;b.appendChild(e);});
var r=document.getElementById("detResumoV16");r.innerHTML="";d.resumo.forEach(function(x){var e=document.createElement("div");e.className="det-resumo-item-v16";e.innerHTML="<strong>"+x[0]+"</strong>"+x[1];r.appendChild(e);});
document.getElementById("detEscolherV16").onclick=function(){escolherDetalhePlanoV16();};document.getElementById("detEscolher2V16").onclick=function(){escolherDetalhePlanoV16();};window.scrollTo(0,0);
}
function voltarPlanosV16(){
if(typeof window.irPara==="function")window.irPara("planos");
else if(typeof window.mostrarPagina==="function")window.mostrarPagina("planos");
else{
 var p=document.getElementById("pagina-detalhes-plano-v16");if(p)p.classList.remove("ativa");
 var x=document.getElementById("pagina-planos");if(x)x.classList.add("ativa");
}
window.scrollTo(0,0);
}
function escolherDetalhePlanoV16(){var chave=detPlanoAtualV16;voltarPlanosV16();setTimeout(function(){var b=document.querySelector('[data-plano-em="'+chave+'"]');if(b)b.click();},80);}
document.addEventListener("click",function(e){var b=e.target.closest("[data-info-plano-v16]");if(b){e.preventDefault();abrirDetalhesPlanoV16(b.getAttribute("data-info-plano-v16"));}});
document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("detVoltarV16");if(b)b.onclick=voltarPlanosV16;});
window.addEventListener("load",function(){var b=document.getElementById("detVoltarV16");if(b)b.onclick=voltarPlanosV16;});
//
;
//
(function(){
function encerrarVagaCorrigidaV18(id){
var vagas=[];
try{vagas=carregarVagasPortal()||[];}catch(e){vagas=[];}
var indice=-1;
for(var i=0;i<vagas.length;i++){
if(String(vagas[i].id||"")===String(id||"")){
indice=i;
break;
}
}
if(indice<0){
alert("N\u00E3o foi poss\u00EDvel localizar esta vaga.");
return;
}
var vaga=vagas[indice];
try{
if(typeof vagaPertenceEmpresaAtual==="function" && !vagaPertenceEmpresaAtual(vaga)){
alert("Esta vaga nao pertence a empresa conectada.");
return;
}
}catch(e){}
if(String(vaga.status||"").toLowerCase()==="encerrada" || vaga.ativa===false){
alert("Esta vaga ja esta encerrada.");
return;
}
if(!window.confirm("Deseja realmente encerrar esta vaga? Ela deixara de aparecer para os candidatos e permanecera no historico da empresa.")){
return;
}
var agora=new Date().toISOString();
vaga.status="encerrada";
vaga.ativa=false;
vaga.encerrada=true;
vaga.dataEncerramento=agora;
vaga.encerradaEm=agora;
/* Primeiro confirma o encerramento no servidor. O painel só é alterado
   definitivamente depois da confirmação, evitando a vaga sumir apenas localmente. */
function aplicarEncerramentoLocalV18(){
try{salvarVagasPortal(vagas);}catch(e){
alert("N\u00E3o foi poss\u00EDvel salvar o encerramento da vaga.");
return false;
}
try{if(typeof mostrarToast==="function")mostrarToast("Vaga encerrada com sucesso.");}catch(e){}
try{
if(typeof montarPainelReferenciaRecrutadorEM==="function"){
var ref=document.getElementById("painelReferenciaRecrutadorEM");
if(ref && ref.parentNode)ref.parentNode.removeChild(ref);
montarPainelReferenciaRecrutadorEM();
}
}catch(e){}
try{if(typeof renderizarVagasAprovadasEmpresa==="function")renderizarVagasAprovadasEmpresa();}catch(e){}
try{if(typeof renderizarPainelEmpresa==="function")renderizarPainelEmpresa();}catch(e){}
try{if(typeof renderizarHome==="function")renderizarHome();}catch(e){}
return true;
}
if(typeof apiEmpregaMaisPost==="function"){
try{
var botaoAcao=document.activeElement;
if(botaoAcao&&botaoAcao.tagName==="BUTTON")botaoAcao.disabled=true;
apiEmpregaMaisPost({acao:"encerrar",id:id})
.then(function(resultado){
if(botaoAcao)botaoAcao.disabled=false;
if(!resultado || resultado.sucesso!==true){
alert((resultado&&resultado.erro)||"N\u00E3o foi poss\u00EDvel confirmar o encerramento da vaga.");
return;
}
if(!aplicarEncerramentoLocalV18())return;
try{if(typeof sincronizarVagasGoogleSheets==="function")sincronizarVagasGoogleSheets();}catch(e){}
})
.catch(function(){
if(botaoAcao)botaoAcao.disabled=false;
alert("N\u00E3o foi poss\u00EDvel confirmar o encerramento da vaga. Tente novamente.");
});
return;
}catch(e){}
}
if(!aplicarEncerramentoLocalV18())return;
}
window.encerrarVagaEmpresa=encerrarVagaCorrigidaV18;
window.encerrarVaga=encerrarVagaCorrigidaV18;
window.encerrarVagaRefEM=encerrarVagaCorrigidaV18;
})();
//
;
//
(function(){
function normalizarV19(s){
return String(s||"").toLowerCase()
.replace(/\u00e1|\u00e0|\u00e2|\u00e3/g,"a")
.replace(/\u00e9|\u00ea/g,"e")
.replace(/\u00ed/g,"i")
.replace(/\u00f3|\u00f4|\u00f5/g,"o")
.replace(/\u00fa/g,"u")
.replace(/\u00e7/g,"c");
}
function prepararMetricasV19(){
var painel=document.getElementById("pagina-painel-empresa");
if(!painel)return;
var candidatos=painel.querySelectorAll("div,article,button");
for(var i=0;i<candidatos.length;i++){
var el=candidatos[i];
if(el.hasAttribute("data-metrica-link-v19"))continue;
var tx=normalizarV19(el.textContent).trim();
var tipo="";
if(tx.indexOf("vagas ativas")>=0 && tx.length<80)tipo="ativas";
else if(tx.indexOf("em aprovacao")>=0 && tx.length<80)tipo="aprovacao";
else if(tx.indexOf("candidaturas")>=0 && tx.length<80)tipo="candidaturas";
else if(tx.indexOf("em processo")>=0 && tx.length<80)tipo="processo";
else if(tx.indexOf("contratados")>=0 && tx.length<80)tipo="contratados";
if(tipo){
el.setAttribute("data-metrica-link-v19",tipo);
el.setAttribute("role","button");
el.setAttribute("tabindex","0");
}
}
}
function abrirMetricaV19(tipo){
if(tipo==="ativas"){
try{
if(typeof ativarAbaVagasRefEM==="function"){ativarAbaVagasRefEM("aprovadas");return;}
}catch(e){}
var tab=document.querySelector('[data-ref-tab="aprovadas"],[data-tab-vaga="aprovadas"],[data-vaga-tab="aprovadas"]');
if(tab){tab.click();return;}
try{
if(typeof abrirMinhasVagasDashboardEM==="function"){abrirMinhasVagasDashboardEM();return;}
}catch(e){}
var lista=document.querySelector("#pagina-painel-empresa .recrutador-vagas-ref-em,#pagina-painel-empresa .vagas-aprovadas-empresa");
if(lista){lista.scrollIntoView({behavior:"smooth",block:"start"});return;}
}
if(tipo==="aprovacao"){
var tab2=document.querySelector('[data-ref-tab="pendentes"],[data-ref-tab="aprovacao"],[data-tab-vaga="pendentes"],[data-vaga-tab="pendentes"]');
if(tab2){tab2.click();return;}
try{
if(typeof ativarAbaVagasRefEM==="function"){ativarAbaVagasRefEM("pendentes");return;}
}catch(e){}
var botoes=document.querySelectorAll("#pagina-painel-empresa button");
for(var j=0;j<botoes.length;j++){
var bt=normalizarV19(botoes[j].textContent);
if(bt.indexOf("aprovacao")>=0){botoes[j].click();return;}
}
}
if(tipo==="candidaturas"){
try{if(typeof irPara==="function"){irPara("candidatos-empresa");return;}}catch(e){}
}
if(tipo==="processo"){
try{
sessionStorage.setItem("filtroCandidatosEmpregaMais","processo");
if(typeof irPara==="function"){irPara("candidatos-empresa");setTimeout(aplicarFiltroProcessoV19,180);return;}
}catch(e){}
}
if(tipo==="contratados"){
try{
sessionStorage.setItem("filtroCandidatosEmpregaMais","Contratado");
if(typeof irPara==="function"){irPara("candidatos-empresa");setTimeout(aplicarFiltroContratadosV19,180);return;}
}catch(e){}
}
}
function aplicarFiltroProcessoV19(){
var sels=document.querySelectorAll("select");
for(var i=0;i<sels.length;i++){
var opts=sels[i].options||[];
for(var j=0;j<opts.length;j++){
var x=normalizarV19(opts[j].text);
if(x.indexOf("processo")>=0 || x.indexOf("entrevista")>=0){
sels[i].selectedIndex=j;
sels[i].dispatchEvent(new Event("change",{bubbles:true}));
return;
}
}
}
}
function aplicarFiltroContratadosV19(){
var sels=document.querySelectorAll("select");
for(var i=0;i<sels.length;i++){
var opts=sels[i].options||[];
for(var j=0;j<opts.length;j++){
if(normalizarV19(opts[j].text).indexOf("contratado")>=0){
sels[i].selectedIndex=j;
sels[i].dispatchEvent(new Event("change",{bubbles:true}));
return;
}
}
}
}
document.addEventListener("click",function(e){
var el=e.target.closest("[data-metrica-link-v19]");
if(!el)return;
e.preventDefault();
abrirMetricaV19(el.getAttribute("data-metrica-link-v19"));
});
document.addEventListener("keydown",function(e){
if(e.key!=="Enter" && e.key!==" ")return;
var el=e.target.closest("[data-metrica-link-v19]");
if(!el)return;
e.preventDefault();
abrirMetricaV19(el.getAttribute("data-metrica-link-v19"));
});
function metricasPainelAtivoV19(){
var p=document.getElementById("pagina-painel-empresa");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){
if(metricasPainelAtivoV19())setTimeout(prepararMetricasV19,300);
});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="painel-empresa")setTimeout(prepararMetricasV19,120);
});
})();
//
;
//
(function(){
var paginaIdV20="pagina-perfil-empresa-em";
function paginaPerfilV20(){
return document.getElementById(paginaIdV20);
}
function moverPerfilAntesRodapeV20(){
var pg=paginaPerfilV20();
if(!pg)return;
var rodape=document.querySelector("footer,#footer,.footer,.site-footer,.rodape-em,#rodape");
if(rodape && rodape.parentNode && pg.parentNode===rodape.parentNode && pg.nextElementSibling!==rodape){
rodape.parentNode.insertBefore(pg,rodape);
return;
}
if(rodape && rodape.parentNode){
try{
var pos=rodape.compareDocumentPosition(pg);
if(pos &amp; Node.DOCUMENT_POSITION_FOLLOWING){
rodape.parentNode.insertBefore(pg,rodape);
}
}catch(e){}
}
}
function voltarPainelV20(){
window.location.href=window.location.pathname+"?pagina=painel-empresa";
}
function prepararVoltarV20(){
var pg=paginaPerfilV20();
if(!pg)return;
var els=pg.querySelectorAll("a,button");
for(var i=0;i<els.length;i++){
var txt=String(els[i].textContent||"").toLowerCase();
if(txt.indexOf("voltar ao meu painel")>=0 || txt.indexOf("voltar ao painel")>=0){
els[i].removeAttribute("href");
els[i].setAttribute("type","button");
els[i].onclick=function(e){
if(e)e.preventDefault();
voltarPainelV20();
return false;
};
}
}
var existe=false;
var todos=pg.querySelectorAll("a,button");
for(var j=0;j<todos.length;j++){
if(String(todos[j].textContent||"").toLowerCase().indexOf("voltar ao meu painel")>=0){
existe=true;break;
}
}
if(!existe){
var b=document.createElement("button");
b.type="button";
b.className="perfil-voltar-v20";
b.innerHTML="&amp;#8592; Voltar ao Meu Painel";
b.style.cssText="border:0;background:transparent;color:#0966d7;font-weight:700;cursor:pointer;margin:0 0 16px;padding:6px 0;";
b.onclick=voltarPainelV20;
pg.insertBefore(b,pg.firstChild);
}
}
function corrigirPerfilV20(){
moverPerfilAntesRodapeV20();
prepararVoltarV20();
}
window.voltarPainelDadosEmpresaV20=voltarPainelV20;
function perfilEmpresaAtivoV20(){
var p=document.getElementById(paginaIdV20);
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){
if(perfilEmpresaAtivoV20())setTimeout(corrigirPerfilV20,150);
});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(corrigirPerfilV20,100);
});
document.addEventListener("click",function(e){
var alvo=e.target.closest("button,a");
if(!alvo)return;
var tx=String(alvo.textContent||"").toLowerCase();
if(tx.indexOf("dados da empresa")>=0){
try{
var atual=new URL(window.location.href);
if(atual.searchParams.get("pagina")!=="perfil-empresa"){
history.pushState({pagina:"perfil-empresa"},"",window.location.pathname+"?pagina=perfil-empresa");
}
}catch(err){}
setTimeout(corrigirPerfilV20,100);
setTimeout(function(){window.scrollTo(0,0);},140);
}
});
})();
//
;
//
(function(){
function localizarEstruturaV22(){
var pg=document.getElementById("pagina-perfil-empresa-em");
if(!pg)return null;
var tabs=pg.querySelector(".empresa-perfil-tabs-em");
if(!tabs)return null;
var botoes=tabs.querySelectorAll("button");
if(botoes.length<2)return null;
var publico=botoes[0];
var privado=botoes[1];
publico.textContent="Dados exibidos aos candidatos";
privado.textContent="Dados confidenciais da empresa";
publico.setAttribute("data-aba-dados-v22","publico");
privado.setAttribute("data-aba-dados-v22","privado");
publico.type="button";
privado.type="button";
var campoPublico=document.getElementById("perfilNomeEM");
var campoPrivado=document.getElementById("contaRazaoEM");
var painelPublico=campoPublico?campoPublico.closest(".empresa-perfil-card-em"):null;
var painelPrivado=campoPrivado?campoPrivado.closest(".empresa-perfil-card-em"):null;
if(!painelPublico && campoPublico) painelPublico=campoPublico.parentElement;
if(!painelPrivado && campoPrivado) painelPrivado=campoPrivado.parentElement;
if(painelPublico)painelPublico.setAttribute("data-painel-dados-v22","publico");
if(painelPrivado)painelPrivado.setAttribute("data-painel-dados-v22","privado");
return {publico:publico,privado:privado,painelPublico:painelPublico,painelPrivado:painelPrivado};
}
function abrirAbaDadosV22(tipo){
var x=localizarEstruturaV22();
if(!x)return;
var pub=tipo==="publico";
if(x.painelPublico){
x.painelPublico.style.display=pub?"block":"none";
x.painelPublico.hidden=!pub;
}
if(x.painelPrivado){
x.painelPrivado.style.display=pub?"none":"block";
x.painelPrivado.hidden=pub;
}
x.publico.classList.toggle("ativo",pub);
x.privado.classList.toggle("ativo",!pub);
x.publico.setAttribute("aria-selected",pub?"true":"false");
x.privado.setAttribute("aria-selected",pub?"false":"true");
try{sessionStorage.setItem("abaDadosEmpresaV22",tipo);}catch(e){}
}
function iniciarV22(){
var x=localizarEstruturaV22();
if(!x)return;
var aba="publico";
try{aba=sessionStorage.getItem("abaDadosEmpresaV22")||"publico";}catch(e){}
abrirAbaDadosV22(aba==="privado"?"privado":"publico");
}
document.addEventListener("click",function(e){
var b=e.target.closest("[data-aba-dados-v22]");
if(!b)return;
e.preventDefault();
e.stopPropagation();
abrirAbaDadosV22(b.getAttribute("data-aba-dados-v22"));
},true);
document.addEventListener("keydown",function(e){
var b=e.target.closest("[data-aba-dados-v22]");
if(!b || (e.key!=="Enter" && e.key!==" "))return;
e.preventDefault();
abrirAbaDadosV22(b.getAttribute("data-aba-dados-v22"));
});
window.abrirAbaDadosEmpresaV22=abrirAbaDadosV22;
function dadosEmpresaAtivoV22(){
var p=document.getElementById("pagina-perfil-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){
if(dadosEmpresaAtivoV22())setTimeout(iniciarV22,150);
});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(iniciarV22,120);
});
document.addEventListener("click",function(e){
var a=e.target.closest("a,button");
if(!a)return;
if(String(a.textContent||"").toLowerCase().indexOf("dados da empresa")>=0){
setTimeout(iniciarV22,120);
}
});
})();
//
;
//
(function(){
var beneficiosV23=[
"Vale-refeicao","Vale-alimentacao","Vale-transporte","Plano de saude",
"Plano odontologico","Seguro de vida","Wellhub / Gympass","Auxilio home office",
"Participacao nos resultados","Bonus / premiacao","Horario flexivel",
"Auxilio educacao","Day off de aniversario","Convenio com farmacias"
];
function campoV23(id){return document.getElementById(id);}
function valorV23(id){
var x=campoV23(id);return x?String(x.value||"").trim():"";
}
function criarBeneficiosV23(container){
if(!container || container.querySelector(".beneficios-check-v23"))return;
var box=document.createElement("section");
box.className="perfil-secao-v23 beneficios-check-v23";
box.innerHTML="<div class='perfil-secao-titulo-v23'><div><span>04</span><h3>Beneficios oferecidos</h3><p>Selecione os beneficios que fazem parte da experiencia dos colaboradores.</p></div></div><div class='beneficios-grid-v23' id='beneficiosGridV23'></div><div class='perfil-campo-v23 full'><label>Outros beneficios</label><textarea id='perfilOutrosBeneficiosV23' placeholder='Informe outros beneficios ou diferenciais oferecidos pela empresa.' maxlength='700'></textarea><small><span id='contadorOutrosBeneficiosV23'>0</span>/700 caracteres</small></div>";
container.appendChild(box);
var grid=box.querySelector("#beneficiosGridV23");
beneficiosV23.forEach(function(nome,i){
var label=document.createElement("label");
label.className="beneficio-item-v23";
label.innerHTML="<input type='checkbox' value='"+nome+"' data-beneficio-v23='1'/><span>"+nome+"</span>";
grid.appendChild(label);
});
}
window.montarFormularioV23=function(){
var pg=document.getElementById("pagina-perfil-empresa-em");
if(!pg)return;
var nome=campoV23("perfilNomeEM");
if(!nome)return;
var card=nome.closest(".empresa-perfil-card-em");
if(!card || card.getAttribute("data-form-v23")==="1")return;
card.setAttribute("data-form-v23","1");
var campos={};
[
"perfilNomeEM","perfilSegmentoEM","perfilCidadeEM","perfilUfEM","perfilPorteEM",
"perfilFundacaoEM","perfilSloganEM","perfilSobreEM","perfilMissaoEM","perfilVisaoEM",
"perfilValoresEM","perfilCulturaEM","perfilBeneficiosEM","perfilCarreiraEM",
"perfilAmbienteEM","perfilModalidadesEM","perfilAreasEM","perfilSiteEM",
"perfilLinkedinEM","perfilInstagramEM","perfilFacebookEM","perfilVideoEM",
"perfilEmailPublicoEM","perfilLogoEM","perfilCapaEM"
].forEach(function(id){
var x=campoV23(id);
if(x){
var w=x.closest(".empresa-perfil-campo-em")||x.parentElement;
campos[id]=w;
}
});
var aviso=document.createElement("div");
aviso.className="perfil-publico-aviso-v23";
aviso.innerHTML="<div class='perfil-aviso-icone-v23'>&amp;#128065;</div><div><strong>Estas informacoes serao publicas</strong><p>Os dados preenchidos nesta aba poderao aparecer para candidatos no perfil publico da empresa. Dados administrativos permanecem separados e confidenciais.</p></div>";
card.insertBefore(aviso,card.firstChild);
var intro=document.createElement("div");
intro.className="perfil-form-intro-v23";
intro.innerHTML="<div><span>PERFIL DA EMPRESA</span><h2>Construa a pagina da sua empresa</h2><p>Apresente sua marca, cultura e proposta de valor para que os candidatos conhecam melhor a organizacao antes de se candidatar.</p></div><button type='button' id='visualizarComoCandidatoV23'>&amp;#128065; Visualizar como candidato</button>";
card.insertBefore(intro,aviso.nextSibling);
function secao(num,titulo,sub,ids){
var s=document.createElement("section");
s.className="perfil-secao-v23";
s.innerHTML="<div class='perfil-secao-titulo-v23'><div><span>"+num+"</span><h3>"+titulo+"</h3><p>"+sub+"</p></div></div><div class='perfil-secao-grid-v23'></div>";
var g=s.querySelector(".perfil-secao-grid-v23");
ids.forEach(function(id){if(campos[id])g.appendChild(campos[id]);});
card.appendChild(s);
}
secao("01","Identidade da empresa","Informacoes principais que identificam a empresa para os candidatos.",
["perfilNomeEM","perfilSloganEM","perfilSegmentoEM","perfilPorteEM","perfilFundacaoEM","perfilCidadeEM","perfilUfEM","perfilLogoEM","perfilCapaEM"]);
secao("02","Sobre a empresa","Conte a historia, o proposito e os principios que orientam a organizacao.",
["perfilSobreEM","perfilMissaoEM","perfilVisaoEM","perfilValoresEM"]);
secao("03","Cultura e experiencia","Mostre como e trabalhar na empresa e quais oportunidades de desenvolvimento existem.",
["perfilCulturaEM","perfilAmbienteEM","perfilCarreiraEM","perfilModalidadesEM","perfilAreasEM"]);
criarBeneficiosV23(card);
if(campos.perfilBeneficiosEM)campos.perfilBeneficiosEM.style.display="none";
secao("05","Presenca digital e contato","Adicione canais oficiais que ajudam o candidato a conhecer melhor a empresa.",
["perfilSiteEM","perfilLinkedinEM","perfilInstagramEM","perfilFacebookEM","perfilVideoEM","perfilEmailPublicoEM"]);
var rodape=document.createElement("div");
rodape.className="perfil-acoes-v23";
rodape.innerHTML="<div><strong>Revise antes de salvar</strong><span>Confira se as informacoes representam corretamente a empresa.</span></div><button type='button' id='salvarPerfilPublicoV23'>Salvar informacoes publicas</button>";
card.appendChild(rodape);
prepararContadoresV23(card);
carregarBeneficiosV23();
var prev=campoV23("visualizarComoCandidatoV23");
if(prev)prev.onclick=function(){
sincronizarBeneficiosV23();
try{
if(typeof visualizarPerfilPublicoEmpresaEM==="function"){visualizarPerfilPublicoEmpresaEM();return;}
}catch(e){}
alert("Salve as informacoes para visualizar o perfil publico da empresa.");
};
var salvar=campoV23("salvarPerfilPublicoV23");
if(salvar)salvar.onclick=function(){
sincronizarBeneficiosV23();
try{
if(typeof salvarPerfilPublicoEmpresaEM==="function"){salvarPerfilPublicoEmpresaEM();return;}
}catch(e){}
};
};
function sincronizarBeneficiosV23(){
var escolhidos=[];
document.querySelectorAll("[data-beneficio-v23]:checked").forEach(function(x){escolhidos.push(x.value);});
var outros=valorV23("perfilOutrosBeneficiosV23");
if(outros)escolhidos.push(outros);
var antigo=campoV23("perfilBeneficiosEM");
if(antigo)antigo.value=escolhidos.join(", ");
}
function carregarBeneficiosV23(){
var antigo=valorV23("perfilBeneficiosEM");
if(!antigo)return;
var partes=antigo.split(",").map(function(x){return x.trim();}).filter(Boolean);
var reconhecidos=[];
document.querySelectorAll("[data-beneficio-v23]").forEach(function(cb){
for(var i=0;i<partes.length;i++){
if(partes[i].toLowerCase()===cb.value.toLowerCase()){
cb.checked=true;reconhecidos.push(partes[i].toLowerCase());break;
}
}
});
var extras=partes.filter(function(x){return reconhecidos.indexOf(x.toLowerCase())<0;});
var o=campoV23("perfilOutrosBeneficiosV23");
if(o)o.value=extras.join(", ");
}
function prepararContadoresV23(card){
var textos=card.querySelectorAll("textarea");
textos.forEach(function(x){
if(x.id==="perfilBeneficiosEM")return;
if(!x.getAttribute("maxlength"))x.setAttribute("maxlength","1200");
var wrap=x.closest(".empresa-perfil-campo-em")||x.closest(".perfil-campo-v23")||x.parentElement;
if(!wrap || wrap.querySelector(".contador-v23"))return;
var c=document.createElement("small");c.className="contador-v23";
c.textContent=(x.value||"").length+"/"+x.getAttribute("maxlength")+" caracteres";
wrap.appendChild(c);
x.addEventListener("input",function(){c.textContent=(x.value||"").length+"/"+x.getAttribute("maxlength")+" caracteres";});
});
var outros=campoV23("perfilOutrosBeneficiosV23");
if(outros){
var co=campoV23("contadorOutrosBeneficiosV23");
var atual=function(){if(co)co.textContent=(outros.value||"").length;};
outros.addEventListener("input",atual);atual();
}
}
function iniciarV23(){
window.montarFormularioV23();
}
function formularioPerfilAtivoV23(){
var p=document.getElementById("pagina-perfil-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(formularioPerfilAtivoV23())setTimeout(iniciarV23,180);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(iniciarV23,140);
});
document.addEventListener("click",function(e){
var a=e.target.closest("[data-aba-dados-v22],a,button");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(a.getAttribute("data-aba-dados-v22")==="publico" || tx.indexOf("dados da empresa")>=0){
setTimeout(iniciarV23,120);
}
});
})();
//
;
//
(function(){
function podePublicarV24(){
try{return typeof assinantePerfilPublicoEM==="function" ? !!assinantePerfilPublicoEM() : true;}catch(e){return true;}
}
function avisoV24(){
var card=document.getElementById("formPerfilPublicoEM");
if(!card)return;
var old=document.getElementById("avisoRascunhoPerfilV24");
if(podePublicarV24()){if(old)old.remove();return;}
if(old)return;
var a=document.createElement("div");
a.id="avisoRascunhoPerfilV24";
a.className="aviso-rascunho-v24";
a.innerHTML="<strong>Perfil em preparacao</strong><p>Voc\u00EA pode preencher, salvar e visualizar a previa agora. A exibicao publica para candidatos sera liberada conforme os recursos do plano contratado.</p>";
card.insertBefore(a,card.firstChild);
}
function garantirV24(){
var card=document.getElementById("formPerfilPublicoEM");
var nome=document.getElementById("perfilNomeEM");
if(!card||!nome)return;
card.hidden=false;
card.style.display="block";
try{if(typeof window.montarFormularioV23==="function")window.montarFormularioV23();}catch(e){}
avisoV24();
}
function perfilPublicoAtivoV24(){
var p=document.getElementById("pagina-perfil-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(perfilPublicoAtivoV24())setTimeout(garantirV24,220);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(garantirV24,160);
});
document.addEventListener("click",function(e){
var b=e.target.closest("[data-aba-dados-v22]");
if(b&&b.getAttribute("data-aba-dados-v22")==="publico")setTimeout(garantirV24,60);
});
})();
//
;
//
(function(){
function rodapeV25(){
return document.querySelector("footer.rodape")||
document.querySelector(".rodape")||
document.querySelector("footer");
}
function organizarPaginasAntesRodapeV25(){
var footer=rodapeV25();
if(!footer||!footer.parentNode)return;
var ids=[
"pagina-perfil-empresa-em",
"pagina-perfil-publico-empresa-em"
];
for(var i=0;i<ids.length;i++){
var pagina=document.getElementById(ids[i]);
if(pagina && pagina.parentNode===footer.parentNode){
footer.parentNode.insertBefore(pagina,footer);
}
}
}
function garantirRodapeDepoisConteudoV25(){
organizarPaginasAntesRodapeV25();
}
window.addEventListener("load",function(){
setTimeout(garantirRodapeDepoisConteudoV25,120);
});
document.addEventListener("click",function(e){
var alvo=e.target.closest("button,a");
if(!alvo)return;
var texto=String(alvo.textContent||"").toLowerCase();
if(
texto.indexOf("visualizar como candidato")>=0 ||
texto.indexOf("visualizar perfil publico")>=0 ||
texto.indexOf("dados da empresa")>=0 ||
alvo.hasAttribute("data-vaga-publica-em")
){
setTimeout(garantirRodapeDepoisConteudoV25,30);
}
},true);
var antigaAbrirEditor=window.abrirEditorPerfilEmpresaEM;
if(typeof antigaAbrirEditor==="function"&&!window.editorPerfilRodapePatchV25){
window.editorPerfilRodapePatchV25=true;
window.abrirEditorPerfilEmpresaEM=function(){
organizarPaginasAntesRodapeV25();
return antigaAbrirEditor.apply(this,arguments);
};
}
})();
//
;
//
(function(){
var opcoesV26={
perfilSegmentoEM:[
"Administracao e Servicos Corporativos","Agronegocio","Alimentacao e Restaurantes",
"Atacado e Distribuicao","Automotivo","Bancos e Servicos Financeiros","Comercio e Varejo",
"Construcao Civil e Engenharia","Consultoria","Contabilidade e Auditoria","Educacao",
"Energia e Utilidades","Industria","Logistica e Transportes","Marketing e Comunicacao",
"Saude","Seguranca","Tecnologia da Informacao","Telecomunicacoes","Turismo e Hotelaria","Outros"
],
perfilPorteEM:[
"Microempresa - ate 9 colaboradores",
"Pequena empresa - 10 a 49 colaboradores",
"Media empresa - 50 a 249 colaboradores",
"Grande empresa - 250 ou mais colaboradores"
],
perfilUfEM:[
"AC - Acre","AL - Alagoas","AP - Amapa","AM - Amazonas","BA - Bahia","CE - Ceara",
"DF - Distrito Federal","ES - Espirito Santo","GO - Goias","MA - Maranhao",
"MT - Mato Grosso","MS - Mato Grosso do Sul","MG - Minas Gerais","PA - Para",
"PB - Paraiba","PR - Parana","PE - Pernambuco","PI - Piaui","RJ - Rio de Janeiro",
"RN - Rio Grande do Norte","RS - Rio Grande do Sul","RO - Rondonia","RR - Roraima",
"SC - Santa Catarina","SP - Sao Paulo","SE - Sergipe","TO - Tocantins"
]
};
function trocarPorSelectV26(id,placeholder){
var antigo=document.getElementById(id);
if(!antigo || antigo.tagName==="SELECT")return antigo;
var select=document.createElement("select");
for(var i=0;i<antigo.attributes.length;i++){
var a=antigo.attributes[i];
if(a.name!=="type"&&a.name!=="value"&&a.name!=="placeholder")select.setAttribute(a.name,a.value);
}
select.id=id;
select.name=antigo.name||id;
var vazio=document.createElement("option");
vazio.value="";vazio.textContent=placeholder;
select.appendChild(vazio);
var lista=opcoesV26[id]||[];
lista.forEach(function(rotulo){
var o=document.createElement("option");
if(id==="perfilUfEM")o.value=rotulo.substring(0,2);
else o.value=rotulo;
o.textContent=rotulo;
select.appendChild(o);
});
var atual=String(antigo.value||"").trim();
if(atual){
for(var j=0;j<select.options.length;j++){
if(select.options[j].value.toLowerCase()===atual.toLowerCase() ||
select.options[j].text.toLowerCase()===atual.toLowerCase()){
select.selectedIndex=j;break;
}
}
}
antigo.parentNode.replaceChild(select,antigo);
return select;
}
function criarCidadeV26(){
var antigo=document.getElementById("perfilCidadeEM");
if(!antigo)return;
antigo.setAttribute("list","listaCidadesPadraoV26");
antigo.setAttribute("autocomplete","address-level2");
antigo.setAttribute("placeholder","Digite e selecione a cidade");
if(document.getElementById("listaCidadesPadraoV26"))return;
var dl=document.createElement("datalist");
dl.id="listaCidadesPadraoV26";
[
"Belo Horizonte","Betim","Contagem","Uberlandia","Uberaba","Juiz de Fora",
"Montes Claros","Governador Valadares","Ipatinga","Sete Lagoas","Divinopolis",
"Sao Paulo","Campinas","Guarulhos","Osasco","Santos","Ribeirao Preto",
"Rio de Janeiro","Niteroi","Curitiba","Porto Alegre","Florianopolis","Brasilia",
"Goiania","Salvador","Recife","Fortaleza","Vitoria","Manaus","Belem"
].forEach(function(c){var o=document.createElement("option");o.value=c;dl.appendChild(o);});
antigo.parentNode.appendChild(dl);
}
function padronizarV26(){
var seg=trocarPorSelectV26("perfilSegmentoEM","Selecione o segmento");
var porte=trocarPorSelectV26("perfilPorteEM","Selecione o porte da empresa");
var uf=trocarPorSelectV26("perfilUfEM","Selecione o estado");
criarCidadeV26();
if(seg)seg.setAttribute("aria-label","Segmento de atuacao");
if(porte)porte.setAttribute("aria-label","Porte ou numero aproximado de colaboradores");
if(uf)uf.setAttribute("aria-label","Estado");
}
window.padronizarPerfilEmpresaV26=padronizarV26;
function perfilPadronizavelAtivoV26(){
var p=document.getElementById("pagina-perfil-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(perfilPadronizavelAtivoV26())setTimeout(padronizarV26,220);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(padronizarV26,160);
});
document.addEventListener("click",function(e){
var b=e.target.closest("[data-aba-dados-v22]");
if(b&&b.getAttribute("data-aba-dados-v22")==="publico")setTimeout(padronizarV26,120);
});
})();
//
;
//
(function(){
function lerImagemV27(input,tipo){
var arquivo=input && input.files ? input.files[0] : null;
if(!arquivo)return;
if(!/^image\/(jpeg|png|webp)$/i.test(arquivo.type)){
alert("Envie uma imagem JPG, PNG ou WEBP.");
input.value="";
return;
}
if(arquivo.size>2*1024*1024){
alert("A imagem deve ter no maximo 2 MB.");
input.value="";
return;
}
var leitor=new FileReader();
leitor.onload=function(ev){
var img=new Image();
img.onload=function(){
var minimoW=tipo==="logo"?300:1200;
var minimoH=tipo==="logo"?300:400;
if(img.width<minimoW || img.height<minimoH){
alert(tipo==="logo"
?"Para melhor qualidade, envie uma logo com pelo menos 300 x 300 px."
:"Para melhor qualidade, envie uma capa com pelo menos 1200 x 400 px.");
}
var campo=document.getElementById(tipo==="logo"?"perfilLogoEM":"perfilCapaEM");
if(campo)campo.value=ev.target.result;
var preview=document.getElementById(tipo==="logo"?"previewLogoV27":"previewCapaV27");
if(preview){
preview.src=ev.target.result;
preview.style.display="block";
}
};
img.src=ev.target.result;
};
leitor.readAsDataURL(arquivo);
}
function blocoUploadV27(tipo,campo){
if(!campo)return;
var wrap=campo.closest(".empresa-perfil-campo-em")||campo.parentElement;
if(!wrap || wrap.querySelector("[data-upload-v27='"+tipo+"']"))return;
campo.style.display="none";
var label=wrap.querySelector("label");
if(label)label.style.display="none";
var small=wrap.querySelector("small");
if(small)small.style.display="none";
var logo=tipo==="logo";
var box=document.createElement("div");
box.className="upload-imagem-v27 "+(logo?"upload-logo-v27":"upload-capa-v27");
box.setAttribute("data-upload-v27",tipo);
box.innerHTML=
"<div class='upload-titulo-v27'><strong>"+(logo?"Logo da empresa":"Imagem de capa")+"</strong>"+
"<span>"+(logo?"Recomendado: 500 x 500 px &amp;bull; minimo 300 x 300 px":"Recomendado: 1600 x 500 px &amp;bull; minimo 1200 x 400 px")+"</span></div>"+
"<div class='upload-preview-v27 "+(logo?"quadrado-v27":"capa-v27")+"'>"+
"<img id='"+(logo?"previewLogoV27":"previewCapaV27")+"' alt='"+(logo?"Previa da logo":"Previa da capa")+"'/>"+
"<div class='upload-placeholder-v27'><b>"+(logo?"LOGO":"CAPA")+"</b><span>"+(logo?"Formato quadrado":"Formato horizontal")+"</span></div>"+
"</div>"+
"<label class='upload-botao-v27'>Selecionar imagem<input id='"+(logo?"uploadLogoV27":"uploadCapaV27")+"' type='file' accept='image/png,image/jpeg,image/webp'/></label>"+
"<small>JPG, PNG ou WEBP &amp;bull; ate 2 MB</small>";
wrap.appendChild(box);
var atual=String(campo.value||"").trim();
var prev=box.querySelector("img");
if(atual){
prev.src=atual;
prev.style.display="block";
}
var inp=box.querySelector("input[type=file]");
inp.addEventListener("change",function(){lerImagemV27(inp,tipo);});
}
function montarUploadsV27(){
blocoUploadV27("logo",document.getElementById("perfilLogoEM"));
blocoUploadV27("capa",document.getElementById("perfilCapaEM"));
}
window.montarUploadsPerfilV27=montarUploadsV27;
function uploadsPerfilAtivoV27(){
var p=document.getElementById("pagina-perfil-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(uploadsPerfilAtivoV27())setTimeout(montarUploadsV27,240);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-empresa")setTimeout(montarUploadsV27,180);
});
document.addEventListener("click",function(e){
var b=e.target.closest("[data-aba-dados-v22]");
if(b&&b.getAttribute("data-aba-dados-v22")==="publico")setTimeout(montarUploadsV27,180);
});
})();
//
;
//
(function(){
function perfilV28(){
try{
if(typeof perfilSalvoEM==="function")return perfilSalvoEM()||{};
}catch(e){}
return {};
}
function corrigirHeroV28(){
var pagina=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pagina)return;
var hero=pagina.querySelector(".empresa-publica-hero-em");
if(!hero)return;
var pf=perfilV28();
var logo=pagina.querySelector(".empresa-publica-logo-em");
var h1=hero.querySelector("h1");
if(!h1)return;
var capa=hero.querySelector(".empresa-publica-capa-em");
if(!capa){
capa=document.createElement("div");
capa.className="empresa-publica-capa-em";
hero.insertBefore(capa,hero.firstChild);
}
var urlCapa=String(pf.capa||"").trim();
if(urlCapa){
capa.style.backgroundImage='url("'+urlCapa.replace(/"/g,"%22")+'")';
capa.classList.remove("empresa-publica-sem-capa-v28");
}else{
capa.style.backgroundImage="none";
capa.classList.add("empresa-publica-sem-capa-v28");
}
var conteudo=hero.querySelector(".empresa-publica-hero-conteudo-em");
if(!conteudo){
conteudo=document.createElement("div");
conteudo.className="empresa-publica-hero-conteudo-em";
var mover=[];
for(var i=0;i<hero.children.length;i++){
var el=hero.children[i];
if(el!==capa && el!==conteudo)mover.push(el);
}
mover.forEach(function(el){conteudo.appendChild(el);});
hero.appendChild(conteudo);
}
var identidade=conteudo.querySelector(".empresa-publica-identidade-v28");
if(!identidade){
identidade=document.createElement("div");
identidade.className="empresa-publica-identidade-v28";
var filhos=[];
for(var j=0;j<conteudo.children.length;j++){
if(conteudo.children[j]!==logo)filhos.push(conteudo.children[j]);
}
filhos.forEach(function(el){identidade.appendChild(el);});
conteudo.appendChild(identidade);
}
if(logo){
conteudo.insertBefore(logo,identidade);
var img=logo.querySelector("img");
if(img){
img.style.objectFit="contain";
img.style.objectPosition="center";
}
}
}
window.corrigirHeroPerfilEmpresaV28=corrigirHeroV28;
function perfilPublicoVisivelV28(){
var p=document.getElementById("pagina-perfil-publico-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(perfilPublicoVisivelV28())setTimeout(corrigirHeroV28,180);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-publico-empresa"||p==="empresa-publica")setTimeout(corrigirHeroV28,140);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(tx.indexOf("visualizar como candidato")>=0 || tx.indexOf("perfil da empresa")>=0){
setTimeout(corrigirHeroV28,100);
setTimeout(corrigirHeroV28,400);
}
},true);
})();
//
;
//
(function(){
function vagasEmpresaV29(){
var vagas=[];
try{
if(typeof vagasDaEmpresa==="function")vagas=vagasDaEmpresa()||[];
}catch(e){}
return vagas;
}
function candidaturasV29(vagas){
var ids={};
vagas.forEach(function(v){ids[String(v.id||"")]=true;});
var c=[];
try{
if(typeof carregarCandidaturas==="function")c=carregarCandidaturas()||[];
}catch(e){}
return c.filter(function(x){
var id=String(x&&(x.vagaId||x.idVaga||x.vaga_id||x.jobId||x.job_id||(x.vaga&&x.vaga.id))||"");
return !!ids[id];
});
}
function empresaVerificadaV29(){
try{
if(typeof empresaVerificadaV9==="function")return !!empresaVerificadaV9();
}catch(e){}
try{
if(typeof empresaAtualPerfilEM==="function"){
var e=empresaAtualPerfilEM()||{};
return e.verificada===true || String(e.verificacaoStatus||"").toLowerCase()==="verificada";
}
}catch(e){}
return false;
}
function montarCabecalhoV29(){
var pagina=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pagina)return;
try{
if(typeof corrigirHeroPerfilEmpresaV28==="function")corrigirHeroPerfilEmpresaV28();
}catch(e){}
var hero=pagina.querySelector(".empresa-publica-hero-em");
if(!hero)return;
var selo=hero.querySelector(".perfil-verificado-v29");
if(empresaVerificadaV29()){
if(!selo){
selo=document.createElement("div");
selo.className="perfil-verificado-v29";
selo.innerHTML="<span>&amp;#10003;</span> Empresa com perfil verificado";
var capa=hero.querySelector(".empresa-publica-capa-em");
(capa||hero).appendChild(selo);
}
}else if(selo){
selo.remove();
}
var stats=hero.querySelector(".perfil-stats-v29");
if(stats)stats.remove();
var vagas=vagasEmpresaV29();
var ativas=vagas.filter(function(v){
var s=String(v.status||"").toLowerCase();
return v.ativa!==false && s!=="encerrada" && s!=="inativa";
});
var cand=candidaturasV29(vagas);
var processo=cand.filter(function(c){
var s=String(c.status||c.etapa||"").toLowerCase();
return s.indexOf("entrevista")>=0 || s.indexOf("selecion")>=0 || s.indexOf("aprov")>=0;
}).length;
stats=document.createElement("div");
stats.className="perfil-stats-v29";
stats.innerHTML=
"<div class='perfil-stat-v29'><strong>&amp;#9673;</strong><span>Visao geral</span></div>"+
"<div class='perfil-stat-v29'><strong>"+ativas.length+"</strong><span>Vagas abertas</span></div>"+
"<div class='perfil-stat-v29'><strong>"+cand.length+"</strong><span>Candidaturas</span></div>"+
"<div class='perfil-stat-v29'><strong>"+processo+"</strong><span>Em processo</span></div>";
hero.appendChild(stats);
}
window.montarCabecalhoEmpresaV29=montarCabecalhoV29;
function perfilPublicoAtivoV29(){
var p=document.getElementById("pagina-perfil-publico-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(perfilPublicoAtivoV29())setTimeout(montarCabecalhoV29,200);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-publico-empresa"||p==="empresa-publica")setTimeout(montarCabecalhoV29,160);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(tx.indexOf("visualizar como candidato")>=0 || tx.indexOf("perfil da empresa")>=0){
setTimeout(montarCabecalhoV29,150);
setTimeout(montarCabecalhoV29,450);
}
},true);
})();
//
;
//
(function(){
function normalizarHeroV30(){
var pagina=document.getElementById("pagina-perfil-publico-empresa-em");
if(!pagina)return;
var hero=pagina.querySelector(".empresa-publica-hero-em");
if(!hero)return;
var capa=hero.querySelector(".empresa-publica-capa-em");
var info=hero.querySelector(".empresa-publica-info-em");
var wrapper=hero.querySelector(".empresa-publica-hero-conteudo-em");
if(wrapper){
var infoDentro=wrapper.querySelector(".empresa-publica-info-em");
if(infoDentro){
hero.appendChild(infoDentro);
info=infoDentro;
}else{
var identidade=wrapper.querySelector(".empresa-publica-identidade-v28");
if(identidade && !info){
info=document.createElement("div");
info.className="empresa-publica-info-em";
while(identidade.firstChild)info.appendChild(identidade.firstChild);
var logoW=wrapper.querySelector(".empresa-publica-logo-em");
if(logoW)info.insertBefore(logoW,info.firstChild);
hero.appendChild(info);
}
}
wrapper.remove();
}
if(info){
var logo=info.querySelector(".empresa-publica-logo-em");
if(logo && logo.tagName==="IMG"){
logo.style.objectFit="contain";
logo.style.objectPosition="center";
}
}
if(capa){
hero.insertBefore(capa,hero.firstChild);
}
var stats=hero.querySelector(".perfil-stats-v29");
if(stats)hero.appendChild(stats);
}
window.normalizarHeroEmpresaV30=normalizarHeroV30;
function perfilPublicoAtivoV30(){
var p=document.getElementById("pagina-perfil-publico-empresa-em");
return !!(p&amp;&amp;(p.classList.contains("ativa")||p.classList.contains("pagina-ativa")));
}
window.addEventListener("load",function(){if(perfilPublicoAtivoV30())setTimeout(normalizarHeroV30,220);});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="perfil-publico-empresa"||p==="empresa-publica")setTimeout(normalizarHeroV30,180);
});
document.addEventListener("click",function(e){
var a=e.target.closest("button,a");
if(!a)return;
var tx=String(a.textContent||"").toLowerCase();
if(tx.indexOf("visualizar como candidato")>=0 || tx.indexOf("perfil da empresa")>=0){
setTimeout(normalizarHeroV30,180);
setTimeout(normalizarHeroV30,550);
}
},true);
})();
//
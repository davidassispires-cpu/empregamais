/* EmpregaMais - JavaScript externo - lote 8 */

//
(function(){
var extras=["cvModalidadeV85","cvCidadeV85","cvSalarioV85","cvDisponibilidadeV85","cvLinkedinV85","cvPortfolioV85"];
function email(){try{return String(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").trim().toLowerCase()}catch(e){return""}}
function key(){return"empregaMaisCurriculoExtrasV85:"+email()}
function salvarExtras(){var d={};extras.forEach(function(id){var e=document.getElementById(id);if(e)d[id]=e.value});try{localStorage.setItem(key(),JSON.stringify(d))}catch(e){};progresso()}
function carregarExtras(){var d={};try{d=JSON.parse(localStorage.getItem(key())||"{}")}catch(e){};extras.forEach(function(id){var e=document.getElementById(id);if(e)e.value=d[id]||""});progresso()}
function progresso(){
var ids=["cvObjetivoV84","cvAreaV84","cvResumoV84","cvCursosV84","cvHabilidadesV84","cvIdiomasV84","cvModalidadeV85","cvCidadeV85"];
var ok=0,total=ids.length+2;ids.forEach(function(id){var e=document.getElementById(id);if(e&&String(e.value).trim())ok++});
if(document.querySelector(".experiencia-v84 input")&&document.querySelector(".experiencia-v84 input").value.trim())ok++;
if(document.querySelector(".formacao-v84 input")&&document.querySelector(".formacao-v84 input").value.trim())ok++;
var p=Math.round(ok/total*100),n=document.getElementById("cvProgressoV85"),b=document.getElementById("cvBarraV85");if(n)n.textContent=p+"%";if(b)b.style.width=p+"%";
}
function init(){
var root=document.getElementById("curriculoOnlineV84");if(!root)return;
carregarExtras();
if(root.getAttribute("data-extras-v85-instalado")!=="1"){
 root.setAttribute("data-extras-v85-instalado","1");
 root.addEventListener("input",progresso);
 root.addEventListener("change",progresso);
 var save=document.getElementById("cvSalvarV84");
 if(save&amp;&amp;save.getAttribute("data-extras-v85-instalado")!=="1"){
  save.setAttribute("data-extras-v85-instalado","1");
  save.addEventListener("click",salvarExtras);
 }
}
setTimeout(progresso,120);
}
function iniciarExtrasCurriculoV85(){
var p=document.getElementById("curriculoOnlineV84");
if(p)init();
}
window.addEventListener("load",function(){setTimeout(iniciarExtrasCurriculoV85,350)});
document.addEventListener("empregamais:navegacao",function(){setTimeout(iniciarExtrasCurriculoV85,80)});
})();
//
;
//
(function(){
function q(id){return document.getElementById(id)}
function txt(id){var e=q(id);return e?String(e.value||"").trim():""}
function esc(v){return String(v||"").replace(/&amp;/g,"&amp;amp;").replace(/</g,"&amp;lt;").replace(/>/g,"&amp;gt;")}
function nome(){
try{
var em=String(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").toLowerCase(),ls=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]"),c=ls.find(function(x){return String(x.email||"").toLowerCase()===em});
if(c)return c.nome||c.nomeCompleto||"Seu nome";
}catch(e){}
return "Seu nome";
}
function experiencias(){
return [].map.call(document.querySelectorAll("#cvExperienciasV84 .experiencia-v84"),function(x){
function v(c){var e=x.querySelector(c);return e?e.value.trim():""}
return{empresa:v(".e1"),cargo:v(".e2"),inicio:v(".e3"),fim:v(".e4"),atividades:v(".e5")}
}).filter(function(x){return x.empresa||x.cargo||x.atividades});
}
function formacoes(){
return [].map.call(document.querySelectorAll("#cvFormacoesV84 .formacao-v84"),function(x){
function v(c){var e=x.querySelector(c);return e?e.value.trim():""}
return{instituicao:v(".f1"),curso:v(".f2"),nivel:v(".f3"),status:v(".f4")}
}).filter(function(x){return x.instituicao||x.curso});
}
function corpo(){
var resumo=txt("cvResumoV84"),ex=experiencias(),fo=formacoes(),hab=txt("cvHabilidadesV84"),cursos=txt("cvCursosV84"),idi=txt("cvIdiomasV84"),comp=txt("cvComplementaresV84");
return "<div class='cv86-paper-name'>"+esc(nome())+"</div>"+
"<div class='cv86-paper-role'>"+esc(txt("cvObjetivoV84")||"Seu objetivo profissional")+"</div>"+
"<div class='cv86-paper-contact'>"+esc(txt("cvCidadeV85")||"Cidade / UF")+(txt("cvModalidadeV85")?" · "+esc(txt("cvModalidadeV85")):"")+"</div>"+
"<h4>Resumo profissional</h4><p class='"+(resumo?"":"cv86-empty")+"'>"+esc(resumo||"Seu resumo profissional aparecerá aqui conforme você preencher.")+"</p>"+
(ex.length?"<h4>Experiência profissional</h4>"+ex.map(function(x){return"<div class='cv86-entry'><b>"+esc(x.cargo||"Cargo")+(x.empresa?" — "+esc(x.empresa):"")+"</b><small>"+esc(x.inicio)+(x.inicio||x.fim?" a ":"")+esc(x.fim||((x.inicio)?"Atual":""))+"</small><p>"+esc(x.atividades)+"</p></div>"}).join(""):"")+
(fo.length?"<h4>Formação acadêmica</h4>"+fo.map(function(x){return"<div class='cv86-entry'><b>"+esc(x.curso||"Formação")+"</b><small>"+esc(x.instituicao)+(x.nivel?" · "+esc(x.nivel):"")+(x.status?" · "+esc(x.status):"")+"</small></div>"}).join(""):"")+
(hab?"<h4>Habilidades</h4><p>"+esc(hab)+"</p>":"")+(cursos?"<h4>Cursos e certificações</h4><p>"+esc(cursos)+"</p>":"")+(idi?"<h4>Idiomas</h4><p>"+esc(idi)+"</p>":"")+(comp?"<h4>Informações complementares</h4><p>"+esc(comp)+"</p>":"");
}
function atualizar(){var p=q("cvPreviewPaperV86");if(p)p.innerHTML=corpo();var m=q("cvModalPaperV86");if(m)m.innerHTML=corpo()}
function montar(){
var cv=q("curriculoOnlineV84");if(!cv||q("cvWorkspaceV86"))return;
var parent=cv.parentNode,ws=document.createElement("div");ws.id="cvWorkspaceV86";ws.className="cv86-workspace";
parent.insertBefore(ws,cv);var editor=document.createElement("div");editor.className="cv86-editor";ws.appendChild(editor);editor.appendChild(cv);
var side=document.createElement("aside");side.className="cv86-preview-col";side.innerHTML="<div class='cv86-preview-shell'><div class='cv86-preview-top'><div class='cv86-preview-title'><span>PRÉVIA EM TEMPO REAL</span><strong>Seu currículo</strong></div><button class='cv86-eye' id='cvEyeV86' title='Visualizar currículo' type='button'>◉</button></div><div class='cv86-paper-wrap'><div class='cv86-paper' id='cvPreviewPaperV86'></div></div><p class='cv86-hint'>A prévia é atualizada automaticamente enquanto você preenche.</p><button class='cv86-open-full' id='cvOpenFullV86' type='button'>Visualizar currículo completo</button></div>";ws.appendChild(side);
var modal=document.createElement("div");modal.className="cv86-modal";modal.id="cvModalV86";modal.innerHTML="<div class='cv86-modal-box'><button class='cv86-modal-close' id='cvCloseV86' type='button'>×</button><div class='cv86-modal-paper' id='cvModalPaperV86'></div></div>";document.body.appendChild(modal);
function abrir(){atualizar();modal.classList.add("ativo");document.body.style.overflow="hidden"}
function fechar(){modal.classList.remove("ativo");document.body.style.overflow=""}
q("cvEyeV86").onclick=abrir;q("cvOpenFullV86").onclick=abrir;q("cvCloseV86").onclick=fechar;
modal.addEventListener("click",function(e){if(e.target===modal)fechar()});
cv.addEventListener("input",atualizar);cv.addEventListener("change",atualizar);
var exp=q("cvExperienciasV84"),form=q("cvFormacoesV84");
if(exp&&window.MutationObserver)new MutationObserver(atualizar).observe(exp,{childList:true,subtree:true});
if(form&&window.MutationObserver)new MutationObserver(atualizar).observe(form,{childList:true,subtree:true});
setTimeout(atualizar,800);
}
window.EmpregaMaisAtualizarPreviewCurriculoV86=atualizar;
function iniciarPreviewCurriculoV86(){if(q("curriculoOnlineV84"))montar()}
window.addEventListener("load",function(){setTimeout(iniciarPreviewCurriculoV86,400)});
document.addEventListener("empregamais:navegacao",function(ev){
var pagina=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
var modal=q("cvModalV86");
if(modal &amp;&amp; pagina!=="curriculo" &amp;&amp; pagina!=="cadastro-curriculo"){
 modal.classList.remove("ativo");
 document.body.style.removeProperty("overflow");
}
setTimeout(iniciarPreviewCurriculoV86,100);
});
})();
//
;
//
(function(){
var ids=["cvNomeV87","cvTelefoneV87","cvEmailV87","cvCidadePessoalV87","cvEnderecoV87"];
function emailSessao(){try{return String(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").trim().toLowerCase()}catch(e){return""}}
function key(){return"empregaMaisDadosCurriculoV87:"+emailSessao()}
function carregar(){
var d={};try{d=JSON.parse(localStorage.getItem(key())||"{}")}catch(e){}
ids.forEach(function(id){var el=document.getElementById(id);if(el&&d[id])el.value=d[id]});
var em=document.getElementById("cvEmailV87");if(em&&!em.value)em.value=emailSessao();
try{
var ls=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]"),c=ls.find(function(x){return String(x.email||"").toLowerCase()===emailSessao()});
if(c){
var n=document.getElementById("cvNomeV87"),t=document.getElementById("cvTelefoneV87");
if(n&&!n.value)n.value=c.nome||c.nomeCompleto||"";
if(t&&!t.value)t.value=c.telefone||c.celular||"";
}
}catch(e){}
}
function salvar(){var d={};ids.forEach(function(id){var el=document.getElementById(id);if(el)d[id]=el.value});try{localStorage.setItem(key(),JSON.stringify(d))}catch(e){}}
function atualizarPreview(){
var paper=document.getElementById("cvPreviewPaperV86");if(!paper)return;
var nome=document.getElementById("cvNomeV87"),cidade=document.getElementById("cvCidadePessoalV87"),tel=document.getElementById("cvTelefoneV87"),em=document.getElementById("cvEmailV87");
var n=paper.querySelector(".cv86-paper-name");if(n&&nome&&nome.value.trim())n.textContent=nome.value.trim();
var c=paper.querySelector(".cv86-paper-contact");
if(c){
var partes=[];
if(cidade&&cidade.value.trim())partes.push(cidade.value.trim());
if(tel&&tel.value.trim())partes.push(tel.value.trim());
if(em&&em.value.trim())partes.push(em.value.trim());
c.textContent=partes.join(" · ")||"Cidade / UF";
}
var modal=document.getElementById("cvModalPaperV86");if(modal)modal.innerHTML=paper.innerHTML;
}
function init(){
if(!document.getElementById("cvNomeV87"))return;
carregar();
ids.forEach(function(id){
 var e=document.getElementById(id);
 if(e&amp;&amp;e.getAttribute("data-dados-v87-instalado")!=="1"){
  e.setAttribute("data-dados-v87-instalado","1");
  e.addEventListener("input",function(){salvar();setTimeout(atualizarPreview,0)});
 }
});
var save=document.getElementById("cvSalvarV84");
if(save&amp;&amp;save.getAttribute("data-dados-v87-instalado")!=="1"){
 save.setAttribute("data-dados-v87-instalado","1");
 save.addEventListener("click",salvar);
}
setTimeout(function(){if(window.EmpregaMaisAtualizarPreviewCurriculoV86)window.EmpregaMaisAtualizarPreviewCurriculoV86();atualizarPreview()},180);
}
function iniciarDadosCurriculoV87(){if(document.getElementById("cvNomeV87"))init()}
window.addEventListener("load",function(){setTimeout(iniciarDadosCurriculoV87,450)});
document.addEventListener("empregamais:navegacao",function(){setTimeout(iniciarDadosCurriculoV87,120)});
})();
//
;
//
(function(){
function liberarStickyV89(){
if(window.innerWidth<=1100)return;
var el=document.getElementById("cvWorkspaceV86");
if(!el)return;
var p=el.parentElement;
while(p && p!==document.body){
var cs=window.getComputedStyle(p);
if((cs.overflowY==="hidden"||cs.overflowY==="auto"||cs.overflowY==="scroll") && p.scrollHeight<=p.clientHeight+5){
p.style.overflowY="visible";
}
p=p.parentElement;
}
}
window.addEventListener("load",function(){setTimeout(liberarStickyV89,500)});
document.addEventListener("empregamais:navegacao",function(){setTimeout(liberarStickyV89,150)});
window.addEventListener("resize",liberarStickyV89);
})();
//
;
//
(function(){
var ticking=false, side=null, ws=null, placeholder=null;
function resetV90(){
if(!side)return;
side.classList.remove("cv90-fixed","cv90-bottom");
side.style.left="";
side.style.width="";
if(placeholder)placeholder.style.display="none";
}
function atualizarV90(){
ticking=false;
if(!side||!ws)return;
if(window.innerWidth<=1100){resetV90();return;}
var wsRect=ws.getBoundingClientRect();
var pageTop=wsRect.top+window.scrollY;
var pageBottom=pageTop+ws.offsetHeight;
var naturalTop=pageTop;
var scroll=window.scrollY;
var topGap=18;
var sideHeight=Math.min(side.scrollHeight,window.innerHeight-topGap*2);
var desiredTop=scroll+topGap;
if(desiredTop<=naturalTop){
resetV90();
return;
}
if(desiredTop+sideHeight>=pageBottom){
side.classList.remove("cv90-fixed");
side.classList.add("cv90-bottom");
side.style.left="";
side.style.width="";
if(placeholder)placeholder.style.display="block";
return;
}
if(placeholder)placeholder.style.display="block";
var pr=placeholder.getBoundingClientRect();
side.classList.remove("cv90-bottom");
side.classList.add("cv90-fixed");
side.style.left=pr.left+"px";
side.style.width=pr.width+"px";
}
function requestV90(){
if(ticking)return;
ticking=true;
requestAnimationFrame(atualizarV90);
}
function initV90(){
ws=document.getElementById("cvWorkspaceV86");
if(!ws)return;
side=ws.querySelector(".cv86-preview-col");
if(!side)return;
placeholder=document.getElementById("cvPreviewPlaceholderV90");
if(!placeholder){
 placeholder=document.createElement("div");
 placeholder.id="cvPreviewPlaceholderV90";
 placeholder.style.display="none";
 placeholder.style.width="100%";
 placeholder.style.minHeight="1px";
 ws.insertBefore(placeholder,side);
 placeholder.style.gridColumn="2";
}
side.style.gridColumn="2";
var editor=ws.querySelector(".cv86-editor");
if(editor)editor.style.gridColumn="1";
if(ws.getAttribute("data-sticky-v90-instalado")!=="1"){
 ws.setAttribute("data-sticky-v90-instalado","1");
 window.addEventListener("scroll",requestV90,{passive:true});
 window.addEventListener("resize",function(){resetV90();setTimeout(requestV90,50)});
}
setTimeout(requestV90,120);
}
window.addEventListener("load",function(){setTimeout(initV90,550)});
document.addEventListener("empregamais:navegacao",function(){setTimeout(initV90,180)});
})();
//
;
//
(function(){
var empresas=[], candidatos=[], vagas=[];
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){return{"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c]})}
function norm(v){return String(v||"").trim().toLowerCase()}
function arr(k){try{var a=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function planoEmpresa(e){return e.plano_nome||e.planoNome||e.plano_id||e.plano||"Básico"}
function nomeEmpresa(e){return e.nome_fantasia||e.nomeFantasia||e.nome||e.razao_social||e.razaoSocial||"Empresa"}
function nomeCand(c){return c.nome||c.nomeCompleto||c.nome_completo||"Candidato"}
function emailCand(c){return c.email||"E-mail não informado"}
function premium(c){var p=norm(c.plano_candidato||c.planoCandidato||c.plano);if(!["premium","trimestral","semestral","anual"].includes(p))return false;var f=c.premium_valido_ate||c.premiumValidoAte||c.plano_valido_ate;if(f){var d=new Date(f);if(!isNaN(d)&&d<Date.now())return false}return true}
function vagasEmpresa(e){var n=norm(nomeEmpresa(e)),cnpj=String(e.cnpj||"").replace(/\D/g,"");return vagas.filter(function(v){return norm(v.empresa||v.empresaNome||v.nomeEmpresa)===n||(cnpj&&String(v.cnpj||v.empresaCnpj||"").replace(/\D/g,"")===cnpj)})}
function iniciais(n){return n.split(/\s+/).slice(0,2).map(function(x){return x.charAt(0)}).join("").toUpperCase()||"?"}
function montar(){
var page=document.getElementById("pagina-painel-admin"),container=page&&page.querySelector(".container-dashboard");if(!container)return;
var old=document.getElementById("adminV91");if(old)old.remove();
var box=document.createElement("div");box.id="adminV91";box.className="admin91";
box.innerHTML="<div class='admin91-top'><div><div class='admin91-eyebrow'>ADMINISTRAÇÃO EMPREGAMAIS</div><h1>Central administrativa</h1><p>Empresas, candidatos e operação do portal reunidos em um único painel.</p></div><div class='admin91-badge'>ADMINISTRADOR</div></div>"+
"<nav class='admin91-nav'><button class='ativo' data-v91='inicio'>Visão geral</button><button data-v91='empresas'>Central das empresas</button><button data-v91='candidatos'>Central dos candidatos</button><button class='operacional' data-v91='operacao'>Operação do portal</button></nav>"+
"<div class='admin91-resumo'><div class='admin91-metrica'><small>EMPRESAS</small><strong id='a91Emp'>0</strong><span>cadastradas</span></div><div class='admin91-metrica'><small>CANDIDATOS</small><strong id='a91Cand'>0</strong><span>cadastrados</span></div><div class='admin91-metrica'><small>VAGAS</small><strong id='a91Vagas'>0</strong><span>no portal</span></div><div class='admin91-metrica'><small>PREMIUM</small><strong id='a91Premium'>0</strong><span>candidatos ativos</span></div></div>"+
"<div class='admin91-view ativa' data-view91='inicio'><section class='admin91-section'><div class='admin91-section-head'><div><span>ACESSO RÁPIDO</span><h2>O que você deseja gerenciar?</h2><p>As duas centrais concentram todas as informações de cada cadastro.</p></div></div><div class='admin91-quick'><button data-go91='empresas'>Central das empresas<small>Planos, vagas, assinatura, verificação e cadastro.</small></button><button data-go91='candidatos'>Central dos candidatos<small>Perfil, currículo e concessão de Premium.</small></button><button data-old91='vagas'>Vagas e aprovações<small>Gerencie as oportunidades publicadas.</small></button><button data-old91='verificacoes'>Verificações<small>Analise empresas aguardando validação.</small></button></div></section></div>"+
"<div class='admin91-view' data-view91='empresas'><section class='admin91-section'><div class='admin91-section-head'><div><span>CENTRAL DAS EMPRESAS</span><h2>Empresas cadastradas</h2><p>Clique em uma empresa para abrir todas as informações em um único lugar.</p></div><input class='admin91-search' id='a91BuscaEmp' placeholder='Buscar empresa ou CNPJ...' type='search'/></div><div class='admin91-grid' id='a91EmpGrid'></div></section><div class='admin91-detail' id='a91EmpDetail'></div></div>"+
"<div class='admin91-view' data-view91='candidatos'><section class='admin91-section'><div class='admin91-section-head'><div><span>CENTRAL DOS CANDIDATOS</span><h2>Candidatos cadastrados</h2><p>Consulte o cadastro e conceda acesso Premium quando desejar.</p></div><input class='admin91-search' id='a91BuscaCand' placeholder='Buscar candidato ou e-mail...' type='search'/></div><div class='admin91-grid' id='a91CandGrid'></div></section><div class='admin91-detail' id='a91CandDetail'></div></div>"+
"<div class='admin91-view' data-view91='operacao'><section class='admin91-section'><div class='admin91-section-head'><div><span>OPERAÇÃO</span><h2>Ferramentas administrativas</h2><p>Acesse as funções operacionais já existentes no portal.</p></div></div><div class='admin91-quick'><button data-old91='vagas'>Vagas<small>Aprovação e gestão das oportunidades.</small></button><button data-old91='verificacoes'>Verificações<small>Validação das empresas.</small></button><button data-old91='assinantes'>Assinaturas de empresas<small>Planos pagos e vencimentos.</small></button><button data-old91='planos'>Planos de empresas<small>Liberação administrativa de planos.</small></button><button data-old91='configuracoes'>Configurações<small>Configurações administrativas.</small></button><button data-publicar91='1'>+ Publicar vaga<small>Publicação manual pelo administrador.</small></button></div></section></div>";
container.insertBefore(box,container.firstChild);
box.querySelectorAll("[data-v91],[data-go91]").forEach(function(b){b.onclick=function(){abrir(this.getAttribute("data-v91")||this.getAttribute("data-go91"))}});
box.querySelectorAll("[data-old91]").forEach(function(b){b.onclick=function(){var a=b.getAttribute("data-old91"),old=document.querySelector("#adminTabsPrincipaisEM [data-admin-tab-em='"+a+"']");if(old&&typeof abrirAbaAdminEM==="function"){box.style.display="none";document.getElementById("adminTabsPrincipaisEM").style.setProperty("display","flex","important");abrirAbaAdminEM(a,old);}}});
var pub=box.querySelector("[data-publicar91]");if(pub)pub.onclick=function(){irPara("admin-publicar")};
document.getElementById("a91BuscaEmp").oninput=renderEmp;
document.getElementById("a91BuscaCand").oninput=renderCand;
carregar();
}
function abrir(v){
document.querySelectorAll("#adminV91 .admin91-nav button").forEach(function(b){b.classList.toggle("ativo",b.getAttribute("data-v91")===v)});
document.querySelectorAll("#adminV91 .admin91-view").forEach(function(x){x.classList.toggle("ativa",x.getAttribute("data-view91")===v)});
if(v==="empresas")renderEmp();if(v==="candidatos")renderCand();window.scrollTo(0,0);
}
function carregar(){
empresas=arr("empresasEmpregaMais");candidatos=arr("candidatosEmpregaMais");try{vagas=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[]}catch(e){vagas=[]}
document.getElementById("a91Emp").textContent=empresas.length;document.getElementById("a91Cand").textContent=candidatos.length;document.getElementById("a91Vagas").textContent=vagas.length;document.getElementById("a91Premium").textContent=candidatos.filter(premium).length;
renderEmp();renderCand();
if(typeof carregarEmpresasMasterEM==="function")setTimeout(function(){try{carregarEmpresasMasterEM()}catch(e){}},100);
}
function renderEmp(){
var g=document.getElementById("a91EmpGrid");if(!g)return;var q=norm((document.getElementById("a91BuscaEmp")||{}).value);
var a=empresas.filter(function(x){return norm(nomeEmpresa(x)).includes(q)||String(x.cnpj||"").includes(q)});
g.innerHTML=a.length?a.map(function(x,i){var vs=vagasEmpresa(x),at=vs.filter(function(v){return norm(v.status||"ativa")==="ativa"}).length,d=vs.filter(function(v){return v.destaque===true||String(v.destaque)==="true"}).length;return"<article class='admin91-card' data-emp91='"+i+"'><div class='admin91-card-top'><div class='admin91-avatar'>"+iniciais(nomeEmpresa(x))+"</div><div><h3>"+esc(nomeEmpresa(x))+"</h3><div class='sub'>"+esc(x.cnpj||"CNPJ não informado")+"</div></div></div><div class='admin91-tags'><span class='admin91-tag plano'>"+esc(planoEmpresa(x))+"</span>"+((x.verificada===true||norm(x.verificacao_status||x.verificacaoStatus)==="verificada")?"<span class='admin91-tag ok'>Verificada</span>":"")+"</div><div class='admin91-stats'><div><strong>"+vs.length+"</strong><span>VAGAS</span></div><div><strong>"+at+"</strong><span>ATIVAS</span></div><div><strong>"+d+"</strong><span>DESTAQUES</span></div></div></article>"}).join(""):"<div class='admin91-empty'>Nenhuma empresa encontrada.</div>";
g.querySelectorAll("[data-emp91]").forEach(function(c){c.onclick=function(){detEmp(a[Number(c.getAttribute("data-emp91"))])}});
}
function info(l,v){return"<div class='admin91-info'><small>"+esc(l)+"</small><strong>"+esc(v||"—")+"</strong></div>"}
function detEmp(x){
var v=document.querySelector("[data-view91='empresas']"),sec=v.querySelector(".admin91-section"),d=document.getElementById("a91EmpDetail"),vs=vagasEmpresa(x),at=vs.filter(function(z){return norm(z.status||"ativa")==="ativa"}).length;
sec.style.display="none";d.classList.add("ativa");d.innerHTML="<button class='admin91-back' id='a91BackEmp'>← Voltar para empresas</button><div class='admin91-detail-head'><div><div class='admin91-eyebrow'>EMPRESA</div><h2>"+esc(nomeEmpresa(x))+"</h2><p>"+esc(x.cnpj||"CNPJ não informado")+"</p></div><div class='admin91-tags'><span class='admin91-tag plano'>"+esc(planoEmpresa(x))+"</span></div></div><section class='admin91-section'><div class='admin91-info-grid'>"+info("Razão social",x.razao_social||x.razaoSocial)+info("E-mail",x.email_corporativo||x.email)+info("Site",x.site)+info("Setor",x.setor)+info("Funcionários",x.funcionarios)+info("Plano atual",planoEmpresa(x))+info("Vagas cadastradas",vs.length)+info("Vagas ativas",at)+info("Validade do plano",x.plano_valido_ate||x.planoValidoAte)+"</div></section>";
document.getElementById("a91BackEmp").onclick=function(){d.classList.remove("ativa");sec.style.display=""};window.scrollTo(0,0);
}
function renderCand(){
var g=document.getElementById("a91CandGrid");if(!g)return;
var q=norm((document.getElementById("a91BuscaCand")||{}).value);
var a=candidatos.filter(function(c){return norm(nomeCand(c)).includes(q)||norm(emailCand(c)).includes(q)});
g.innerHTML=a.length?a.map(function(c,i){return"<article class='admin91-card' data-cand91='"+i+"'><div class='admin91-card-top'><div class='admin91-avatar'>"+iniciais(nomeCand(c))+"</div><div><h3>"+esc(nomeCand(c))+"</h3><div class='sub'>"+esc(emailCand(c))+"</div></div></div><div class='admin91-tags'>"+(premium(c)?"<span class='admin91-tag premium'>Premium ativo</span>":"<span class='admin91-tag'>Plano gratuito</span>")+"</div><div class='admin91-stats'><div><strong>"+esc(c.cidade||c.cidadeUf||"—")+"</strong><span>LOCAL</span></div><div><strong>"+(c.cargo||c.objetivo?"✓":"—")+"</strong><span>PERFIL</span></div><div><strong>"+(premium(c)?"★":"—")+"</strong><span>PREMIUM</span></div></div></article>"}).join(""):"<div class='admin91-empty'>Nenhum candidato encontrado.</div>";
g.querySelectorAll("[data-cand91]").forEach(function(el){el.onclick=function(){detCand(a[Number(el.getAttribute("data-cand91"))])}});
}
function detCand(c){
var v=document.querySelector("[data-view91='candidatos']"),sec=v.querySelector(".admin91-section"),d=document.getElementById("a91CandDetail"),fim=c.premium_valido_ate||c.premiumValidoAte||"";
sec.style.display="none";d.classList.add("ativa");d.innerHTML="<button class='admin91-back' id='a91BackCand'>← Voltar para candidatos</button><div class='admin91-detail-head'><div><div class='admin91-eyebrow'>CANDIDATO</div><h2>"+esc(nomeCand(c))+"</h2><p>"+esc(emailCand(c))+"</p></div><div class='admin91-tags'>"+(premium(c)?"<span class='admin91-tag premium'>Premium ativo</span>":"<span class='admin91-tag'>Gratuito</span>")+"</div></div><section class='admin91-section'><div class='admin91-info-grid'>"+info("Nome",nomeCand(c))+info("E-mail",emailCand(c))+info("Telefone",c.telefone||c.celular)+info("Cidade",c.cidade||c.cidadeUf)+info("Cargo / objetivo",c.cargo||c.objetivo||c.cargoDesejado)+info("Plano",premium(c)?"Premium":"Gratuito")+info("Premium válido até",fim?new Date(fim).toLocaleDateString("pt-BR"):"—")+"</div><div class='admin91-premium-box'><h3>Presentear com Premium</h3><p>Conceda ao candidato acesso a todos os recursos Premium. Nesta fase de desenvolvimento, a concessão é registrada no armazenamento do portal; quando conectarmos candidatos ao Supabase, ela passará a valer na conta em qualquer dispositivo.</p><div class='admin91-premium-actions'><label>Duração<select id='a91Duracao'><option value='3'>3 meses</option><option value='6'>6 meses</option><option value='12'>12 meses</option></select></label><button class='admin91-gift' id='a91Gift'>🎁 Conceder Premium</button>"+(premium(c)?"<button class='admin91-remove' id='a91Remove'>Remover Premium</button>":"")+"</div></div></section>";
document.getElementById("a91BackCand").onclick=function(){d.classList.remove("ativa");sec.style.display=""};
document.getElementById("a91Gift").onclick=function(){darPremium(c,Number(document.getElementById("a91Duracao").value))};
var rm=document.getElementById("a91Remove");if(rm)rm.onclick=function(){removerPremium(c)};window.scrollTo(0,0);
}
function salvarCand(c){var ix=candidatos.findIndex(function(x){return norm(x.email)===norm(c.email)});if(ix>=0)candidatos[ix]=c;localStorage.setItem("candidatosEmpregaMais",JSON.stringify(candidatos));document.getElementById("a91Premium").textContent=candidatos.filter(premium).length}
function darPremium(c,m){var d=new Date();d.setMonth(d.getMonth()+m);c.plano_candidato="premium";c.premium_valido_ate=d.toISOString();c.premium_origem="presente_admin";salvarCand(c);alert("Premium concedido ao candidato por "+m+" meses.");detCand(c)}
function removerPremium(c){c.plano_candidato="gratuito";delete c.premium_valido_ate;delete c.premiumValidoAte;salvarCand(c);alert("Premium removido do candidato.");detCand(c)}
window.EmpregaMaisAdminV91={abrir:abrir,recarregar:carregar};
function iniciarAdminV91(){
var q="";
try{q=new URLSearchParams(location.search).get("pagina")||"";}catch(e){}
var pagina=document.getElementById("pagina-painel-admin");
if(q==="painel-admin" || q==="admin" || (pagina&amp;&amp;pagina.classList.contains("ativa"))){
 montar();
}
}
window.addEventListener("load",function(){setTimeout(iniciarAdminV91,500)});
document.addEventListener("empregamais:navegacao",function(ev){
var p=String((ev&amp;&amp;ev.detail&amp;&amp;ev.detail.pagina)||"");
if(p==="painel-admin" || p==="admin")setTimeout(iniciarAdminV91,120);
});
})();
//
;
//
(function(){
function norm(v){return String(v||"").trim().toLowerCase()}
function ler(k,session){try{return (session?sessionStorage:localStorage).getItem(k)||""}catch(e){return""}}
function candidatos(){try{var a=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function emailLogado(){
var keys=["empregaMaisCandidatoEmail","candidatoEmail","emailCandidato","usuarioEmail","email"];
for(var i=0;i<keys.length;i++){var v=ler(keys[i],true)||ler(keys[i],false);if(v&&v.indexOf("@")>0)return norm(v)}
try{
var objs=["candidatoLogado","usuarioLogado","perfilCandidatoEmpregaMais"];
for(var j=0;j<objs.length;j++){
var o=JSON.parse(ler(objs[j],true)||ler(objs[j],false)||"{}");
if(o&&o.email)return norm(o.email);
}
}catch(e){}
return "";
}
function achar(){
var em=emailLogado(),a=candidatos();
if(em){var c=a.find(function(x){return norm(x.email)===em});if(c)return c}
return null;
}
function premium(c){
if(!c)return false;
var p=norm(c.plano_candidato||c.planoCandidato||c.plano);
if(!["premium","trimestral","semestral","anual"].includes(p))return false;
var f=c.premium_valido_ate||c.premiumValidoAte||c.plano_valido_ate;
if(f){var d=new Date(f);if(!isNaN(d)&&d<Date.now())return false}
return true;
}
function dataBR(v){if(!v)return"Sem prazo informado";var d=new Date(v);return isNaN(d)?"Sem prazo informado":d.toLocaleDateString("pt-BR")}
function aplicar(){
var page=document.getElementById("pagina-painel-candidato");if(!page)return;
var c=achar(),is=premium(c);
page.classList.toggle("candidato-premium-v92",is);
var old=document.getElementById("premium92Banner");if(old)old.remove();
if(!is)return;
var f=c.premium_valido_ate||c.premiumValidoAte||c.plano_valido_ate;
var b=document.createElement("div");b.id="premium92Banner";b.className="premium92-banner";
b.innerHTML="<div class='p92-left'><div class='premium92-crown'>★</div><div><small>EMPREGAMAIS PREMIUM</small><h3>Seu acesso Premium está ativo</h3><p>Recursos avançados do candidato liberados para esta conta.</p></div></div><div class='premium92-validade'><span>ACESSO LIBERADO ATÉ</span><strong>"+dataBR(f)+"</strong></div>";
var alvo=page.querySelector(".container-dashboard")||page.querySelector(".painel-candidato")||page.firstElementChild;
if(alvo)alvo.insertBefore(b,alvo.firstChild);
var head=page.querySelector(".painel-candidato-header,.dashboard-header,.perfil-resumo");
if(head&&!head.querySelector(".premium92-selo")){var sp=document.createElement("span");sp.className="premium92-selo";sp.textContent="★ PREMIUM";head.appendChild(sp)}
try{localStorage.setItem("empregaMaisPlanoCandidato","premium")}catch(e){}
try{
if(typeof renderizarAderenciaFinalEM==="function")renderizarAderenciaFinalEM();
else if(typeof renderizarAderenciaVagaEM==="function")renderizarAderenciaVagaEM();
}catch(e){}
}
window.EmpregaMaisPremiumCandidatoV92={atualizar:aplicar,ehPremium:function(){return premium(achar())}};
window.addEventListener("load",function(){setTimeout(aplicar,700)});
window.addEventListener("storage",function(e){if(e.key==="candidatosEmpregaMais")aplicar()});
var timerPremiumV92=0;
document.addEventListener("click",function(e){
var alvo=e.target&amp;&amp;e.target.closest?e.target.closest("#pagina-painel-candidato button,#pagina-painel-candidato a,[data-candidato-tab]"):null;
if(!alvo)return;
clearTimeout(timerPremiumV92);
timerPremiumV92=setTimeout(aplicar,120);
},true);
})();
//
;
//
(function(){
function norm(v){return String(v||"").trim().toLowerCase()}
function arr(k){try{var a=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function email(){
var ks=["empregaMaisCandidatoEmail","candidatoEmail","emailCandidato","usuarioEmail","email"];
for(var i=0;i<ks.length;i++){var v=sessionStorage.getItem(ks[i])||localStorage.getItem(ks[i]);if(v&&v.indexOf("@")>0)return norm(v)}
return "";
}
function minhas(){
var em=email(),all=arr("candidaturasEmpregaMais").concat(arr("candidaturas"));
return all.filter(function(x){return norm(x.email||x.candidato_email||x.candidatoEmail)===em})
}
function visto(x){return x.visualizada===true||x.curriculo_visualizado===true||!!x.visualizado_em||!!x.visualizadoEm}
function status(x){return x.status_processo||x.statusProcesso||x.etapa||x.status||"Candidatura enviada"}
function statusNormalizadoV93(x){
var s=norm(status(x));
try{s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}catch(e){}
if(window.EmpregaMaisEtapasCandidatoEM&&typeof window.EmpregaMaisEtapasCandidatoEM.normalizar==="function"){
 return window.EmpregaMaisEtapasCandidatoEM.normalizar(s);
}
if(s==="enviada"||s==="candidatura enviada"||s==="pendente"||s==="em analise")return "em avaliacao";
if(s==="selecionada")return "selecionado";
if(s==="contato")return "em contato";
if(s==="em entrevista")return "entrevista";
if(s==="aprovada")return "aprovado";
if(s==="rejeitada"||s==="reprovada"||s==="rejeitado")return "reprovado";
if(s==="contratada")return "contratado";
return s;
}
function aderencia(x){var n=Number(x.aderencia||x.percentual_aderencia||x.percentualAderencia);return isFinite(n)&&n>0?Math.min(100,Math.round(n)):0}
function montar(){
var page=document.getElementById("pagina-painel-candidato");if(!page)return;
var old=document.getElementById("centralPremiumV93");if(old)old.remove();
var box=document.createElement("section");box.id="centralPremiumV93";
var alvo=page.querySelector(".container-dashboard")||page.querySelector(".painel-candidato")||page.firstElementChild;if(!alvo)return;
var banner=document.getElementById("premium92Banner");
if(banner&&banner.parentNode===alvo)banner.insertAdjacentElement("afterend",box);else alvo.insertBefore(box,alvo.firstChild);
render();
}
function render(){
var box=document.getElementById("centralPremiumV93");if(!box)return;
var a=minhas(),vis=a.filter(visto).length,processo=a.filter(function(x){var s=statusNormalizadoV93(x);return ["selecionado","em contato","entrevista","aprovado"].indexOf(s)>=0}).length,entrev=a.filter(function(x){return statusNormalizadoV93(x)==="entrevista"}).length,max=a.reduce(function(m,x){return Math.max(m,aderencia(x))},0);
box.innerHTML="<div class='cp93-head'><div><small>CENTRAL PREMIUM</small><h2>Inteligência da sua busca por emprego</h2><p>Acompanhe suas candidaturas e os recursos avançados da sua conta.</p></div><span class='cp93-pill'>★ PREMIUM ATIVO</span></div>"+
"<div class='cp93-metrics'><div class='cp93-metric'><span>CANDIDATURAS</span><strong>"+a.length+"</strong><em>enviadas</em></div><div class='cp93-metric'><span>VISUALIZADAS</span><strong>"+vis+"</strong><em>pela empresa</em></div><div class='cp93-metric'><span>EM PROCESSO</span><strong>"+processo+"</strong><em>com atualização</em></div><div class='cp93-metric'><span>ENTREVISTAS</span><strong>"+entrev+"</strong><em>registradas</em></div><div class='cp93-metric'><span>MAIOR ADERÊNCIA</span><strong>"+(max?max+"%":"—")+"</strong><em>entre candidaturas</em></div></div>"+
"<div class='cp93-grid'><div class='cp93-box'><h3>Minhas candidaturas</h3><p>Movimentações mais recentes do seu processo seletivo.</p><div id='cp93Apps'>"+apps(a)+"</div></div>"+
"<div class='cp93-box'><h3>Seus recursos Premium</h3><p>Ferramentas liberadas para esta conta.</p>"+
feat("◎","Aderência às vagas","Compatibilidade entre seu currículo e os requisitos da oportunidade.")+
feat("◉","Visualização da candidatura","Identificação quando o recrutador registrar a abertura do seu currículo.")+
feat("↗","Evolução no processo","Acompanhe mudanças de etapa registradas pela empresa.")+
feat("★","Recomendações inteligentes","Base para recomendar oportunidades com maior compatibilidade.")+
feat("▦","Estatísticas avançadas","Visão consolidada do desempenho das suas candidaturas.")+"</div></div>";
}
function feat(i,t,d){return"<div class='cp93-feature'><div class='cp93-icon'>"+i+"</div><div><b>"+t+"</b><span>"+d+"</span></div></div>"}
function apps(a){
if(!a.length)return"<div class='cp93-empty'>Suas candidaturas aparecerão aqui assim que você se candidatar a uma vaga.</div>";
return a.slice().reverse().slice(0,5).map(function(x){var ad=aderencia(x),vi=visto(x),cargo=x.cargo||x.vaga||x.titulo||"Vaga",emp=x.empresa||x.empresa_nome||x.empresaNome||"Empresa";return"<div class='cp93-app'><div class='cp93-app-top'><div><strong>"+cargo+"</strong><br/><small>"+emp+"</small></div><span class='cp93-status "+(vi?"visto":"")+"'>"+status(x)+"</span></div><div class='cp93-line'><i class='cp93-dot ok'></i>Candidatura enviada <i class='cp93-dot "+(vi?"ok":"")+"'></i>"+(vi?"Visualizada pela empresa":"Aguardando visualização")+"</div>"+(ad?"<div class='cp93-aderencia'><div class='cp93-ad-top'><span>Aderência à vaga</span><b>"+ad+"%</b></div><div class='cp93-bar'><i style='width:"+ad+"%'></i></div></div>":"")+"</div>"}).join("");
}
window.EmpregaMaisCentralPremiumV93={atualizar:render};
window.addEventListener("load",function(){setTimeout(montar,700)});
var timerCentralPremiumV93=0;
document.addEventListener("click",function(e){
var alvo=e.target&amp;&amp;e.target.closest?e.target.closest("#pagina-painel-candidato button,#pagina-painel-candidato a,[data-candidato-tab]"):null;
if(!alvo)return;
clearTimeout(timerCentralPremiumV93);
timerCentralPremiumV93=setTimeout(render,180);
},true);
window.addEventListener("storage",function(e){
if(!e.key || ["candidaturasEmpregaMais","candidaturas","candidatosEmpregaMais"].indexOf(e.key)&gt;=0){
 clearTimeout(timerCentralPremiumV93);
 timerCentralPremiumV93=setTimeout(render,100);
}
});
document.addEventListener("empregamais:candidatura-atualizada",function(){
clearTimeout(timerCentralPremiumV93);
timerCentralPremiumV93=setTimeout(render,60);
});
})();
//
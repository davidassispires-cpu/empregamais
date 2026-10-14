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
carregarExtras();root.addEventListener("input",progresso);root.addEventListener("change",progresso);
var save=document.getElementById("cvSalvarV84");if(save)save.addEventListener("click",salvarExtras);
setTimeout(progresso,700);
}
window.addEventListener("load",function(){setTimeout(init,500)});
})();
//
;
//
(function(){
function q(id){return document.getElementById(id)}
function txt(id){var e=q(id);return e?String(e.value||"").trim():""}
function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
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
return{empresa:v(".e1"),cargo:v(".e2"),inicio:v(".e3"),fim:v(".e4"),atividades:v(".e5"),resultados:v(".e6")}
}).filter(function(x){return x.empresa||x.cargo||x.atividades});
}
function formacoes(){
return [].map.call(document.querySelectorAll("#cvFormacoesV84 .formacao-v84"),function(x){
function v(c){var e=x.querySelector(c);return e?e.value.trim():""}
return{instituicao:v(".f1"),curso:v(".f2"),nivel:v(".f3"),status:v(".f4"),conclusao:v(".f5")}
}).filter(function(x){return x.instituicao||x.curso});
}
function corpo(){
var resumo=txt("cvResumoV84"),ex=experiencias(),fo=formacoes(),hab=txt("cvHabilidadesV84"),cursos=txt("cvCursosV84"),idi=txt("cvIdiomasV84"),comp=txt("cvComplementaresV84");
return "<div class='cv86-paper-name'>"+esc(nome())+"</div>"+
"<div class='cv86-paper-role'>"+esc(txt("cvObjetivoV84")||"Seu objetivo profissional")+"</div>"+
"<div class='cv86-paper-contact'>"+esc(txt("cvCidadeV85")||"Cidade / UF")+(txt("cvModalidadeV85")?" · "+esc(txt("cvModalidadeV85")):"")+"</div>"+
"<h4>Resumo profissional</h4><p class='"+(resumo?"":"cv86-empty")+"'>"+esc(resumo||"Seu resumo profissional aparecerá aqui conforme você preencher.")+"</p>"+
(ex.length?"<h4>Experiência profissional</h4>"+ex.map(function(x){return"<div class='cv86-entry'><b>"+esc(x.cargo||"Cargo")+(x.empresa?" — "+esc(x.empresa):"")+"</b><small>"+esc(x.inicio)+(x.inicio||x.fim?" a ":"")+esc(x.fim||((x.inicio)?"Atual":""))+"</small><p>"+esc(x.atividades)+"</p>"+(x.resultados?"<p><b>Resultados:</b> "+esc(x.resultados)+"</p>":"")+"</div>"}).join(""):"")+
(fo.length?"<h4>Formação acadêmica</h4>"+fo.map(function(x){return"<div class='cv86-entry'><b>"+esc(x.curso||"Formação")+"</b><small>"+esc(x.instituicao)+(x.nivel?" · "+esc(x.nivel):"")+(x.status?" · "+esc(x.status):"")+(x.conclusao?" · "+esc(x.conclusao):"")+"</small></div>"}).join(""):"")+
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
new MutationObserver(atualizar).observe(q("cvExperienciasV84"),{childList:true,subtree:true});
new MutationObserver(atualizar).observe(q("cvFormacoesV84"),{childList:true,subtree:true});
setTimeout(atualizar,800);
}
window.EmpregaMaisAtualizarPreviewCurriculoV86=atualizar;
window.addEventListener("load",function(){setTimeout(montar,650)});
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
ids.forEach(function(id){var e=document.getElementById(id);if(e)e.addEventListener("input",function(){salvar();setTimeout(atualizarPreview,0)})});
var save=document.getElementById("cvSalvarV84");if(save)save.addEventListener("click",salvar);
setTimeout(function(){if(window.EmpregaMaisAtualizarPreviewCurriculoV86)window.EmpregaMaisAtualizarPreviewCurriculoV86();atualizarPreview()},900);
}
window.addEventListener("load",function(){setTimeout(init,750)});
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
window.addEventListener("load",function(){setTimeout(liberarStickyV89,900)});
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
placeholder=document.createElement("div");
placeholder.id="cvPreviewPlaceholderV90";
placeholder.style.display="none";
placeholder.style.width="100%";
placeholder.style.minHeight="1px";
ws.insertBefore(placeholder,side);
placeholder.style.gridColumn="2";
side.style.gridColumn="2";
var editor=ws.querySelector(".cv86-editor");
if(editor)editor.style.gridColumn="1";
window.addEventListener("scroll",requestV90,{passive:true});
window.addEventListener("resize",function(){resetV90();setTimeout(requestV90,50)});
setTimeout(requestV90,300);
}
window.addEventListener("load",function(){setTimeout(initV90,900)});
})();
//
;
//
(function(){
var empresas=[], candidatos=[], vagas=[];
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];})}
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
window.addEventListener("load",function(){setTimeout(montar,1100)});
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
window.addEventListener("load",function(){setTimeout(aplicar,1000);setTimeout(aplicar,2200)});
window.addEventListener("storage",function(e){if(e.key==="candidatosEmpregaMais")aplicar()});
document.addEventListener("click",function(){setTimeout(aplicar,120)},true);
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
function status(x){return x.status_processo||x.statusProcesso||x.status||"Candidatura enviada"}
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
var a=minhas(),vis=a.filter(visto).length,processo=a.filter(function(x){var s=norm(status(x));return s!=="candidatura enviada"&&s!=="enviada"}).length,entrev=a.filter(function(x){return norm(status(x)).includes("entrevista")}).length,max=a.reduce(function(m,x){return Math.max(m,aderencia(x))},0);
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
window.addEventListener("load",function(){setTimeout(montar,1500)});
document.addEventListener("click",function(){setTimeout(render,250)},true);
window.addEventListener("storage",function(){setTimeout(render,100)});
})();
//
(function(){
function el(id){return document.getElementById(id);}
function email(){return String(sessionStorage.getItem("candidatoEmail")||"").trim().toLowerCase();}
function get(){try{return JSON.parse(localStorage.getItem("empregaMaisCurriculoOnline:"+email())||"{}");}catch(e){return {};}}
var map={cvNomeV87:"nome",cvTelefoneV87:"telefone",cvEmailV87:"email",cvCidadePessoalV87:"cidade",cvEnderecoV87:"endereco",cvObjetivoV84:"objetivo",cvAreaV84:"area",cvResumoV84:"resumo",cvHabilidadesV84:"habilidades",cvIdiomasV84:"idiomas",cvComplementaresV84:"complementares",cvModalidadeV85:"modalidade",cvCidadeV85:"cidadePreferida",cvSalarioV85:"pretensao",cvDisponibilidadeV85:"disponibilidade",cvLinkedinV85:"linkedin",cvPortfolioV85:"portfolio",cvEscolaridadeAligned:"escolaridade",cvExperienciaAligned:"tempoExperiencia",cvContratoAligned:"contrato",cvJornadaAligned:"jornada",cvEstadoAligned:"uf",cvCepAligned:"cep",cvRuaAligned:"logradouro",cvBairroAligned:"bairro",cvCidadeAddress:"cidadeResidencial",cvUfAddress:"ufResidencial",cvNumeroAligned:"numero",cvComplementoAligned:"complemento",cvLatitudeAligned:"latitude",cvLongitudeAligned:"longitude",cvFerramentasExtra:"ferramentasNiveis",cvCertificacoesExtra:"certificacoesDetalhadas",cvIdiomasExtra:"idiomasNiveis",cvInicioExtra:"inicioDisponivel",cvHorariosExtra:"horariosDisponiveis",cvViagensExtra:"disponibilidadeViagens",cvMudancaExtra:"disponibilidadeMudanca",cvCnhExtra:"cnhCategoria",cvCnhValidadeExtra:"cnhValidade"};
function resumeDateText(value){var text=String(value||'').trim();if(/^\d{4}-\d{2}-\d{2}$/.test(text))return text.slice(8,10)+'/'+text.slice(5,7)+'/'+text.slice(0,4);if(/^\d{4}-\d{2}$/.test(text))return '01/'+text.slice(5,7)+'/'+text.slice(0,4);if(/^\d{2}\/\d{4}$/.test(text))return '01/'+text;var digits=text.replace(/\D/g,'').slice(0,8);return digits.replace(/^(\d{2})(\d)/,'$1/$2').replace(/^(\d{2}\/\d{2})(\d)/,'$1/$2')}
function resumeParseDate(text){var match=String(text||'').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!match)return null;var date=new Date(+match[3],+match[2]-1,+match[1]);return date.getFullYear()===+match[3]&&date.getMonth()===+match[2]-1&&date.getDate()===+match[1]?date:null}
function resumeExperienceDuration(start,end){var a=resumeParseDate(start),b=end?resumeParseDate(end):new Date();if(!a||!b)return '';if(b<a)return 'Confira as datas';var months=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth();if(b.getDate()<a.getDate())months--;months=Math.max(0,months);var years=Math.floor(months/12),rest=months%12;return [years?years+' '+(years===1?'ano':'anos'):'',rest?rest+' '+(rest===1?'mês':'meses'):''].filter(Boolean).join(' e ')||'Menos de 1 mês'}
function row(kind,data){var div=document.createElement("div");div.className=kind==="experience"?"curriculo-item-v84 experiencia-v84":"curriculo-item-v84 formacao-v84";var remove=document.createElement("button");remove.type="button";remove.textContent="Remover";remove.className="curriculo-remover-v84";remove.onclick=function(){div.remove();};div.appendChild(remove);var fields=kind==="experience"?[["Empresa","empresa","e1"],["Cargo","cargo","e2"],["Início","inicio","e3"],["Fim","fim","e4"],["Atividades","atividades","e5"],["Resultados e conquistas (opcional)","resultados","e6"]]:[["Instituição","instituicao","f1"],["Curso","curso","f2"],["Nível","nivel","f3"],["Situação","status","f4"]];fields.forEach(function(f){var label=document.createElement("label");label.textContent=f[0];var input=document.createElement(["atividades","resultados"].includes(f[1])?"textarea":"input");input.className=f[2];input.value=data[f[1]]||"";if(kind==='experience'&&(f[2]==='e3'||f[2]==='e4')){input.value=resumeDateText(input.value);input.placeholder='DD/MM/AAAA';input.inputMode='numeric';input.maxLength=10;input.addEventListener('input',function(){this.value=resumeDateText(this.value);updateDuration()});input.addEventListener('blur',function(){this.setCustomValidity(this.value&&!resumeParseDate(this.value)?'Informe uma data válida no formato DD/MM/AAAA.':'');updateDuration()});}if(f[2]==='e6'){label.className='cv-results-extra';input.rows=3;input.placeholder='Ex.: reduzi o prazo de atendimento, organizei o estoque ou superei uma meta. Use números quando tiver dados reais.';}if(f[2]==='e5'){label.className='cv-activities-wide';input.rows=6;input.placeholder='Descreva suas responsabilidades, ferramentas utilizadas e principais resultados.';}if(kind==='education'&&(f[2]==='f3'||f[2]==='f4')){var saved=input.value;input=document.createElement('select');input.className=f[2];input.appendChild(new Option('Selecione',''));(f[2]==='f3'?['Ensino fundamental','Ensino médio','Técnico','Graduação','Pós-graduação','Mestrado','Doutorado']:['Concluído','Cursando','Incompleto']).forEach(function(option){input.appendChild(new Option(option,option))});if(saved&&!Array.from(input.options).some(function(option){return option.value===saved}))input.appendChild(new Option(saved,saved));input.value=saved;}
if(kind==='education'&&f[2]==='f1'){input.placeholder='Digite o nome da escola ou instituição';input.maxLength=180;var help=document.createElement('small');help.textContent='Informe o nome da instituição. Se não encontrar uma sugestão, digite o nome completo.';label.appendChild(help);}
label.appendChild(input);div.appendChild(label);});
if(kind==='education'){var yearLabel=document.createElement('label');yearLabel.textContent='Data de conclusão ou previsão (opcional)';var year=document.createElement('input');year.className='f5';year.type='text';year.inputMode='numeric';year.maxLength=10;year.placeholder='DD/MM/AAAA';year.value=/^\d{4}$/.test(data.conclusao||'')?'01/01/'+data.conclusao:resumeDateText(data.conclusao||'');year.addEventListener('input',function(){this.value=resumeDateText(this.value);this.setCustomValidity('')});year.addEventListener('blur',function(){this.setCustomValidity(this.value&&!resumeParseDate(this.value)?'Informe uma data válida no formato DD/MM/AAAA.':'')});yearLabel.appendChild(year);div.appendChild(yearLabel);var tip=document.createElement('p');tip.className='cv-school-tip';tip.textContent='Concluiu o ensino médio? Selecione Ensino médio, informe sua escola, marque Concluído e indique o ano de conclusão. Adicione cursos técnicos e outras formações separadamente.';div.appendChild(tip);var level=div.querySelector('.f3'),course=div.querySelector('.f2');level.addEventListener('change',function(){if(['Ensino médio','Ensino fundamental'].includes(this.value)){if(!course.value||['Ensino médio','Ensino fundamental'].includes(course.value))course.value=this.value;} });}
if(kind==='experience'){var endInput=div.querySelector('.e4'),currentLabel=document.createElement('label');currentLabel.className='cv-current-role';var currentBox=document.createElement('input');currentBox.type='checkbox';currentBox.className='e-current';currentBox.checked=data.atual===true;currentLabel.appendChild(currentBox);currentLabel.appendChild(document.createTextNode('Ainda trabalho neste cargo'));endInput.closest('label').appendChild(currentLabel);function syncCurrent(){endInput.disabled=currentBox.checked;endInput.required=!currentBox.checked;endInput.placeholder=currentBox.checked?'Cargo atual':'DD/MM/AAAA';if(currentBox.checked){endInput.value='';endInput.setCustomValidity('')}updateDuration();}currentBox.addEventListener('change',syncCurrent);syncCurrent();}
if(kind==='experience'){var durationLabel=document.createElement('label');durationLabel.className='cv-role-duration';durationLabel.textContent='Tempo de experiência no cargo';var duration=document.createElement('output');duration.className='e-duration';durationLabel.appendChild(duration);var tip=document.createElement('small');tip.textContent='Calculado pelas datas. Deixe o fim vazio se ainda trabalha neste cargo.';durationLabel.appendChild(tip);div.appendChild(durationLabel);updateDuration();}
function updateDuration(){var start=div.querySelector('.e3'),end=div.querySelector('.e4'),out=div.querySelector('.e-duration');if(!start||!end)return;start.setCustomValidity(start.value&&start.value.length===10&&!resumeParseDate(start.value)?'Informe uma data válida.':'');end.setCustomValidity(end.value&&end.value.length===10&&!resumeParseDate(end.value)?'Informe uma data válida.':'');var text=resumeExperienceDuration(start.value,end.value);if(text==='Confira as datas')end.setCustomValidity('A data final deve ser igual ou posterior ao início.');if(out)out.textContent=text||'Informe as datas';}
return div;}
function restore(){if(!email()||!el("curriculoOnlineV84"))return;var cv=get();Object.keys(map).forEach(function(id){var input=el(id);if(input)input.value=cv[map[id]]||"";});if(el("cvHabilidadesV84"))el("cvHabilidadesV84").value=cv.habilidades||cv.competencias||"";if(el("cvModalidadeV85"))el("cvModalidadeV85").value=cv.modalidade||(cv.modalidades||[])[0]||"";if(el("cvCursosV84"))el("cvCursosV84").value=Array.isArray(cv.cursos)?cv.cursos.map(function(c){return [c.nome,c.instituicao,c.conclusao].filter(Boolean).join(" — ");}).join("\n"):cv.cursos||"";
[["cvExperienciasV84","experience",cv.experiencias],["cvFormacoesV84","education",cv.formacoes]].forEach(function(item){var box=el(item[0]);if(!box)return;box.replaceChildren();(item[2]&&item[2].length?item[2]:[{}]).forEach(function(data){box.appendChild(row(item[1],data));});});
if(window.EmpregaMaisAtualizarPreviewCurriculoV86)window.EmpregaMaisAtualizarPreviewCurriculoV86();var status=el("cvStatusV84");if(status&&Object.keys(cv).length)status.textContent="Currículo recuperado da sua conta.";
}
function collect(){var cv=get();Object.keys(map).forEach(function(id){var input=el(id);if(input)cv[map[id]]=input.value.trim();});var courses=el("cvCursosV84");if(courses&&(!Array.isArray(cv.cursos)||courses.value!==cv.cursos.map(function(c){return [c.nome,c.instituicao,c.conclusao].filter(Boolean).join(" — ");}).join("\n")))cv.cursos=courses.value;cv.experiencias=Array.from(document.querySelectorAll("#cvExperienciasV84 .experiencia-v84")).map(function(r){var out={};[["empresa","e1"],["cargo","e2"],["inicio","e3"],["fim","e4"],["atividades","e5"],["resultados","e6"]].forEach(function(f){out[f[0]]=r.querySelector("."+f[1])?.value||"";});out.atual=!!r.querySelector(".e-current")?.checked;out.tempoNoCargo=resumeExperienceDuration(out.inicio,out.fim);return out;});cv.formacoes=Array.from(document.querySelectorAll("#cvFormacoesV84 .formacao-v84")).map(function(r){var out={};[["instituicao","f1"],["curso","f2"],["nivel","f3"],["status","f4"],["conclusao","f5"]].forEach(function(f){out[f[0]]=r.querySelector("."+f[1])?.value||"";});return out;});var levels={'Ensino fundamental':1,'Ensino médio':2,'Técnico':3,'Graduação':4,'Pós-graduação':5,'Mestrado':6,'Doutorado':7},highest=cv.formacoes.filter(function(f){return f.nivel}).sort(function(a,b){return (levels[b.nivel]||0)-(levels[a.nivel]||0)})[0];if(highest){var schoolMap={'Ensino fundamental':'Fundamental','Ensino médio':'Médio','Graduação':'Superior'};cv.escolaridade=(schoolMap[highest.nivel]||highest.nivel)+(highest.status==='Concluído'?' completo':highest.status==='Cursando'?' cursando':' incompleto');}cv.atualizadoEm=new Date().toISOString();return cv;}
function install(){restore();var save=el("cvSalvarV84");if(save){save.onclick=async function(){if(!email())return;save.disabled=true;try{if(window.emResolveResumeCep)await window.emResolveResumeCep();localStorage.setItem("empregaMaisCurriculoOnline:"+email(),JSON.stringify(collect()));if(window.emSyncResumeProfile)window.emSyncResumeProfile(collect());if(!window.EmpregaMaisPerfilCloud)throw new Error("Entre novamente para conectar sua conta.");await window.EmpregaMaisPerfilCloud.flush();el("cvStatusV84").textContent="Currículo salvo na sua conta."; }catch(e){el("cvStatusV84").textContent=e.message;}finally{save.disabled=false;}};}
[["cvAddExperienciaV84","cvExperienciasV84","experience"],["cvAddFormacaoV84","cvFormacoesV84","education"]].forEach(function(item){var button=el(item[0]);if(button)button.onclick=function(){el(item[1]).appendChild(row(item[2],{}));};});
}
window.EmpregaMaisRestaurarCurriculo=restore;
window.carregarCurriculoOnlineEM=get;
if(typeof window.preencherPerfilCandidato==="function"){var previous=window.preencherPerfilCandidato;window.preencherPerfilCandidato=function(){var result=previous.apply(this,arguments);restore();return result;};}
window.addEventListener("load",function(){setTimeout(install,1100);});
})();

;
// Premium adherence teaser V96
(function(){
function isPremium(){try{return !!(window.EmpregaMaisPremiumCandidatoV92&&window.EmpregaMaisPremiumCandidatoV92.ehPremium());}catch(e){return false;}}
function openPremium(){if(typeof window.irPara==="function")window.irPara("premium-candidato");}
function render(){
 var page=document.getElementById("pagina-vaga"),box=document.getElementById("aderenciaVagaEM");
 if(!page||!box||isPremium())return;
 box.className="aderencia-vaga-em ad96-card";
 box.innerHTML="<div class='ad96-intro'><span class='ad96-icon'>✦</span><div><div class='ad96-title'><strong>Aderência à vaga</strong><span>PREMIUM</span></div><p>Veja o quanto o seu perfil combina com cada oportunidade.</p></div></div>"+
 "<div class='ad96-example'><div class='ad96-ring'><b>92%</b><small>aderência</small></div><div class='ad96-bars'><div><span>Experiência</span><b>100%</b><i><em style='width:100%'></em></i></div><div><span>Formação</span><b>90%</b><i><em style='width:90%'></em></i></div><div><span>Habilidades</span><b>82%</b><i><em style='width:82%'></em></i></div></div></div>"+
 "<div class='ad96-action'><div><strong>Candidate-se a vagas com maior aderência</strong><p>Compare oportunidades e foque nas que mais combinam com o seu perfil.</p></div><button type='button' id='ad96Premium'>Conhecer o Premium <span>→</span></button></div>";
 var btn=document.getElementById("ad96Premium");if(btn)btn.onclick=openPremium;
}
var old=document.getElementById("ad95Style");if(old)old.remove();
var st=document.createElement("style");st.id="ad96Style";st.textContent=
"#pagina-vaga #aderenciaVagaEM.ad96-card{box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;margin:16px 0 14px!important;padding:14px 16px!important;border:1px solid #edcf75!important;border-radius:14px!important;background:linear-gradient(110deg,#fffdf8,#fffaf0)!important;display:grid!important;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.05fr) minmax(290px,1.15fr)!important;gap:18px!important;align-items:center!important;overflow:hidden!important}"+
"#pagina-vaga .ad96-card *{box-sizing:border-box}.ad96-intro{display:flex!important;align-items:center!important;gap:12px!important;min-width:0!important}.ad96-icon{width:44px!important;height:44px!important;border-radius:50%!important;display:grid!important;place-items:center!important;flex:0 0 44px!important;background:#fff0bd!important;color:#ad7500!important;font-size:19px!important}.ad96-title{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:wrap!important}.ad96-title strong{font-size:13px!important;line-height:1.25!important;color:#132238!important;white-space:normal!important}.ad96-title span{padding:3px 7px!important;border-radius:999px!important;background:#ffe28a!important;color:#775600!important;font-size:7px!important;font-weight:800!important;letter-spacing:.05em!important}.ad96-intro p,.ad96-action p{margin:4px 0 0!important;color:#65748a!important;font-size:9px!important;line-height:1.45!important;white-space:normal!important}"+
".ad96-example{min-width:0!important;display:flex!important;align-items:center!important;gap:14px!important;padding:9px 13px!important;border:1px solid #e3e9ef!important;border-radius:12px!important;background:#fff!important;box-shadow:0 4px 12px rgba(15,23,42,.04)!important}.ad96-ring{width:64px!important;height:64px!important;border-radius:50%!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;flex:0 0 64px!important;background:conic-gradient(#18a957 0 92%,#e8edf1 92% 100%)!important;position:relative!important}.ad96-ring:before{content:''!important;position:absolute!important;inset:7px!important;border-radius:50%!important;background:#fff!important}.ad96-ring b,.ad96-ring small{position:relative!important;z-index:1!important}.ad96-ring b{font-size:17px!important;line-height:1!important;color:#132238!important}.ad96-ring small{margin-top:3px!important;font-size:7px!important;color:#65748a!important}.ad96-bars{display:grid!important;gap:5px!important;flex:1!important;min-width:120px!important}.ad96-bars>div{display:grid!important;grid-template-columns:1fr auto!important;gap:2px 8px!important;align-items:center!important}.ad96-bars span,.ad96-bars b{font-size:7px!important;color:#536174!important;line-height:1!important}.ad96-bars b{font-weight:700!important}.ad96-bars i{grid-column:1/3!important;display:block!important;height:4px!important;border-radius:99px!important;background:#edf1f4!important;overflow:hidden!important}.ad96-bars em{display:block!important;height:100%!important;border-radius:99px!important;background:#23a95b!important}"+
".ad96-action{min-width:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:13px!important;padding-left:17px!important;border-left:1px solid #eadfbf!important}.ad96-action>div{min-width:0!important}.ad96-action strong{display:block!important;color:#132238!important;font-size:11px!important;line-height:1.35!important;white-space:normal!important}.ad96-action button{flex:0 0 auto!important;min-width:145px!important;border:0!important;border-radius:10px!important;padding:11px 12px!important;background:#101d38!important;color:#fff!important;font:700 9px Montserrat,Arial,sans-serif!important;cursor:pointer!important;box-shadow:0 5px 12px rgba(16,29,56,.16)!important;white-space:nowrap!important}.ad96-action button span{margin-left:4px!important;font-size:12px!important}"+
"@media(max-width:1050px){#pagina-vaga #aderenciaVagaEM.ad96-card{grid-template-columns:minmax(200px,.8fr) minmax(260px,1fr)!important}.ad96-action{grid-column:1/3!important;padding:11px 0 0!important;border-left:0!important;border-top:1px solid #eadfbf!important}}"+
"@media(max-width:680px){#pagina-vaga #aderenciaVagaEM.ad96-card{display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:14px!important;gap:12px!important}.ad96-action{padding-top:12px!important;align-items:flex-start!important;flex-direction:column!important}.ad96-action button{width:100%!important}.ad96-example{width:100%!important}.ad96-ring{width:58px!important;height:58px!important;flex-basis:58px!important}}";
document.head.appendChild(st);
window.addEventListener("load",function(){setTimeout(render,900);setTimeout(render,2200)});
document.addEventListener("click",function(){setTimeout(render,120)},true);
window.renderAderenciaPremiumTeaserV96=render;
})();

/* Currículo online em etapas, com orientação contextual. */
(function(){
 'use strict';
 var cv,ws,steps=[],current=0;

/* University names: https://github.com/Hipo/university-domains-list
The MIT License (MIT)

Copyright (c) 2014-2025 Hipo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
 window.emBrazilUniversities=["Centro Regional Universitário de Espiríto Santo do Pinhal", "Centro Universitário Antônio Eufrásio de Toledo de Presidente Prudente - TOLEDO PRUDENTE", "Centro Universitário Barao de Maua", "Centro Universitário Claretiano", "Centro Universitário De Goiás - UNIGOIÁS", "Centro Universitário Facens - UniFACENS", "Centro Universitário Monte Serrat", "Centro Universitário Newton Paiva", "Centro Universitário Plinio Leite", "Centro Universitário Senac", "Centro Universitário Serra dos Órgãos", "Centro Universitário UniFatecie", "Centro Universitário de Araraquara", "Centro Universitário de Brasília, UNICEUB", "Centro Universitário de João Pessoa", "Centro Universitário Álvares Penteado - FECAP", "Cruzeiro do Sul University", "EMESCAM - Escola Superior de Ciências da Santa Casa de Misericórdia de Vitória", "FAAP - Fundação Armando Alvares Penteado", "FAE Business School - Faculdade de Administração e Economia", "Faculdade Do Instituto Nacional De Pós-Graduação - Faculdade INPG", "Faculdade Dom Bosco", "Faculdade Impacta - IMPACTA", "Faculdade Integradas do Ceará", "Faculdade Italo Brasileira", "Faculdades Integradas Curitiba", "Faculdades Integradas Toledo", "Faculdades Integradas UPIS", "Faculdades Integradas do Brasil - UNIBRASIL", "Federal Institute of Education", "Fundação Educacional de Ituverava", "Fundação Hermínio Ometto", "Insper Instituto de Ensino e Pesquisa", "Instituto Infnet", "Instituto Mauá de Tecnologia", "Instituto Militar de Engenharia", "Instituto Nacional de Matemática Pura e Aplicada - IMPA", "Instituto Tecnológico de Aeronáutica", "Instituto de Tecnologia e Liderança - Inteli", "Polytechnic University of Pernambuco", "Pontificia Universidade Católica do Paraná", "Pontifícia Universidade Católica de Campinas", "Pontifícia Universidade Católica de Minas Gerais", "Pontifícia Universidade Católica de São Paulo", "Pontifícia Universidade Católica do Rio Grande do Sul", "Pontifícia Universidade Católica do Rio de Janeiro", "UNINOVE", "Universidade Anhembi Morumbi - UAM", "Universidade Bandeirante de São Paulo", "Universidade Braz Cubas", "Universidade Camilo Castelo Branco", "Universidade Candido Mendes", "Universidade Castelo Branco", "Universidade Católica Dom Bosco", "Universidade Católica de Brasília", "Universidade Católica de Goiás", "Universidade Católica de Pelotas", "Universidade Católica de Pernambuco", "Universidade Católica de Petrópolis", "Universidade Católica de Santos", "Universidade Católica do Salvador", "Universidade Cidade de São Paulo", "Universidade Comunitária da Região de Chapecó - Unochapecó", "Universidade Cruzeiro do Sul", "Universidade Estadual Paulista", "Universidade Estadual Sudoeste da Bahia", "Universidade Estadual da Paraíba", "Universidade Estadual de Campinas", "Universidade Estadual de Feira de Santana", "Universidade Estadual de Londrina", "Universidade Estadual de Maringá", "Universidade Estadual de Montes Claros", "Universidade Estadual de Ponta Grossa", "Universidade Estadual de Santa Cruz", "Universidade Estadual do Ceará", "Universidade Estadual do Maranhão", "Universidade Estadual do Norte Fluminense", "Universidade Estadual do Norte do Parana", "Universidade Estadual do Oeste do Paraná", "Universidade Estadual do Piauí", "Universidade Estadual do Vale do Acaraú", "Universidade Estácio de Sá", "Universidade Federal Fluminense", "Universidade Federal Rural de Pernambuco", "Universidade Federal Rural do Rio de Janeiro", "Universidade Federal da Bahia", "Universidade Federal da Grande Dourados", "Universidade Federal da Paraíba", "Universidade Federal de Alagoas", "Universidade Federal de Campina Grande", "Universidade Federal de Goiás", "Universidade Federal de Itajubá", "Universidade Federal de Juiz de Fora", "Universidade Federal de Lavras", "Universidade Federal de Mato Grosso", "Universidade Federal de Mato Grosso do Sul", "Universidade Federal de Minas Gerais", "Universidade Federal de Ouro Preto", "Universidade Federal de Pelotas", "Universidade Federal de Pernambuco", "Universidade Federal de Rondônia", "Universidade Federal de Santa Catarina", "Universidade Federal de Santa Maria", "Universidade Federal de Sergipe", "Universidade Federal de São Carlos", "Universidade Federal de São João del-Rei", "Universidade Federal de São Paulo", "Universidade Federal de Uberlândia", "Universidade Federal de Viçosa", "Universidade Federal do ABC", "Universidade Federal do Acre", "Universidade Federal do Amapá", "Universidade Federal do Ceará", "Universidade Federal do Espírito Santo", "Universidade Federal do Maranhão", "Universidade Federal do Paraná", "Universidade Federal do Pará", "Universidade Federal do Piauí", "Universidade Federal do Rio Grande", "Universidade Federal do Rio Grande do Norte", "Universidade Federal do Rio Grande do Sul", "Universidade Federal do Rio de Janeiro", "Universidade Federal do Triângulo Mineiro", "Universidade Federal do Vale do São Francisco", "Universidade Federal dos Vales do Jequitinhonha e Mucuri", "Universidade Franciscana", "Universidade Gama Filho", "Universidade Ibirapuera", "Universidade Luterana do Brasil", "Universidade Mackenzie", "Universidade Metodista de Piracicaba", "Universidade Metropolitana de Santos", "Universidade Paulista", "Universidade Potiguar", "Universidade Regional Integrada do Alto Uruguai e das Missões", "Universidade Regional de Blumenau", "Universidade Regional do Cariri", "Universidade Regional do Noroeste do Estado do Rio Grande do Sul", "Universidade Salgado de Oliveira", "Universidade Salvador", "Universidade Santa Cecília dos Bandeirantes", "Universidade Santa Úrsula", "Universidade São Francisco", "Universidade São Judas Tadeu", "Universidade São Marcos", "Universidade Tecnológica Federal do Paraná", "Universidade Tiradentes", "Universidade Vale do Rio Doce", "Universidade Vale do Rio dos Sinos", "Universidade Veiga de Almeida", "Universidade Virtual do Estado de São Paulo", "Universidade da Amazônia", "Universidade da Região da Campanha", "Universidade de Alfenas", "Universidade de Brasília", "Universidade de Caxias do Sul", "Universidade de Cruz Alta", "Universidade de Fortaleza", "Universidade de Franca", "Universidade de Guarulhos", "Universidade de Marília", "Universidade de Mogi das Cruzes", "Universidade de Nova Iguaçu", "Universidade de Passo Fundo", "Universidade de Pernambuco", "Universidade de Ribeirão Preto", "Universidade de Santa Cruz do Sul", "Universidade de Santo Amaro", "Universidade de São Paulo", "Universidade de Taubaté", "Universidade de Tocantins", "Universidade de Uberaba", "Universidade do Amazonas", "Universidade do Estado da Bahia", "Universidade do Estado de Santa Catarina", "Universidade do Estado do Rio Grande do Norte", "Universidade do Estado do Rio de Janeiro", "Universidade do Extremo Sul Catarinense", "Universidade do Grande Rio", "Universidade do Oeste Paulista", "Universidade do Oeste de Santa Catarina", "Universidade do Rio de Janeiro", "Universidade do Sagrado Coração", "Universidade do Sul de Santa Catarina", "Universidade do Vale do Itajaí", "Universidade do Vale do Paraíba – Univap", "Universidade para o Desenvolvimento do Alto Vale do Itajaí"];
 window.emResumeCourses=["Ensino fundamental", "Ensino médio", "Administração", "Agronomia", "Análise e Desenvolvimento de Sistemas", "Arquitetura e Urbanismo", "Biomedicina", "Ciências Biológicas", "Ciências Contábeis", "Ciência da Computação", "Ciências Econômicas", "Design", "Direito", "Educação Física", "Enfermagem", "Engenharia Ambiental", "Engenharia Civil", "Engenharia de Controle e Automação", "Engenharia de Produção", "Engenharia Elétrica", "Engenharia Mecânica", "Engenharia Química", "Farmácia", "Fisioterapia", "Fonoaudiologia", "Gastronomia", "Gestão Comercial", "Gestão de Recursos Humanos", "Gestão Financeira", "Gestão Pública", "História", "Jornalismo", "Letras", "Logística", "Marketing", "Matemática", "Medicina", "Medicina Veterinária", "Nutrição", "Odontologia", "Pedagogia", "Psicologia", "Publicidade e Propaganda", "Radiologia", "Redes de Computadores", "Serviço Social", "Sistemas de Informação", "Técnico em Administração", "Técnico em Contabilidade", "Técnico em Enfermagem", "Técnico em Informática", "Técnico em Logística", "Técnico em Segurança do Trabalho", "Turismo"];
 window.emLookupResumePostalCode=async function(code){
  var providers=[['https://viacep.com.br/ws/'+code+'/json/',function(d){return {street:d.logradouro,neighborhood:d.bairro,city:d.localidade,state:d.uf}}],['https://brasilapi.com.br/api/cep/v2/'+code,function(d){return d}]];
  var invalid=false;
  for(var i=0;i<providers.length;i++){var controller=new AbortController(),timeout=setTimeout(function(){controller.abort()},7000);try{var response=await fetch(providers[i][0],{signal:controller.signal});if(response.status===404){invalid=true;continue}if(!response.ok)continue;var raw=await response.json();if(raw.erro){invalid=true;continue}var data=providers[i][1](raw);if(data.city&&data.state)return data;}catch(error){}finally{clearTimeout(timeout)}}
  throw Error(invalid?'CEP não encontrado. Confira os 8 dígitos.':'Não foi possível consultar o CEP nos dois serviços. Confira sua conexão e tente novamente.');
 };

 var guide=[
 ['Dados pessoais','Confira seus contatos','Use seu nome completo e um e-mail que você acompanha. Digite seu CEP para preencher o endereço, confira os dados e informe número e complemento.','O endereço completo permanece privado.'],
 ['Objetivo profissional','Diga qual oportunidade procura','Informe um cargo específico, escolha a mesma área usada nas vagas e escreva um resumo de 3 a 6 linhas.','Exemplo: Assistente administrativo com experiência em atendimento, planilhas e organização de documentos.'],
 ['Experiência','Mostre o que você já fez','Comece pela experiência mais recente. Informe cargo, empresa, período e atividades. Inclua resultados concretos quando possível.','Se ainda não trabalhou, selecione Sem experiência e descreva projetos, estágios ou atividades voluntárias relevantes.'],
 ['Formação','Informe sua escolaridade real','Escolha o nível atual e descreva instituição, curso e situação. Não marque uma formação como concluída se ainda estiver cursando.','A escolaridade é comparada ao requisito informado na vaga.'],
 ['Conhecimentos','Liste competências relevantes','Separe habilidades por vírgulas. Informe cursos, certificações e idiomas com o nível que consegue usar no trabalho.','Exemplo: Excel, atendimento ao cliente, controle de estoque. Evite incluir conhecimentos que você ainda não domina.'],
 ['Preferências','Defina as condições que aceita','Informe cidade, estado, modalidade, contratação e jornada preferidas. Use Sem preferência quando estiver aberto a outras possibilidades.','Preferências ajudam a encontrar oportunidades; não garantem participação ou aprovação em um processo seletivo.'],
 ['Complementos','Acrescente informações úteis','Inclua LinkedIn, portfólio e informações relevantes, como disponibilidade para viagens. Revise os links antes de salvar.','Não inclua documentos pessoais, informações bancárias ou dados sensíveis no resumo.'],
 ['Revisão','Confira antes de salvar','Leia o resumo completo e volte às etapas para corrigir informações. Confirme que experiências, formação e contatos estão atualizados.','Ao salvar, os campos profissionais também atualizam o perfil utilizado na comparação de aderência.']
 ];
 function el(id){return document.getElementById(id)}
 function value(id){return el(id)?el(id).value.trim():''}
 function setSelect(id,sourceId,label,parent){
  var source=el(sourceId);if(!source)return;
  var input=el(id),select=document.createElement('select');select.id=id;
  Array.from(source.options).forEach(function(op){select.appendChild(op.cloneNode(true))});
  if(id==='cvExperienciaAligned'||id==='cvEscolaridadeAligned'){Array.from(select.options).filter(function(op){return op.value==='Não exigida'}).forEach(function(op){op.remove()});if(!select.options.length||select.options[0].value!=='')select.prepend(new Option('Selecione',''));}
  var none=select.options[0];if(none&&none.value==='')none.textContent=id==='cvAreaV84'?'Selecione sua área':id==='cvExperienciaAligned'||id==='cvEscolaridadeAligned'?'Selecione':'Sem preferência';
  if(input){var previous=input.value;if(previous&&!Array.from(select.options).some(function(op){return op.value===previous})){var old=document.createElement('option');old.value=previous;old.textContent=previous+' (revise a opção)';select.appendChild(old)}select.value=previous;input.replaceWith(select)}
  else{var wrap=document.createElement('label');wrap.className='curriculo-campo-v84';wrap.textContent=label;wrap.appendChild(select);parent.appendChild(wrap)}
 }
 function summary(){
  var paper=el('cvPreviewPaperV86'),target=el('cvFinalSummary');if(!target)return;
  if(typeof window.EmpregaMaisAtualizarPreviewCurriculoV86==='function')window.EmpregaMaisAtualizarPreviewCurriculoV86();
  target.replaceChildren();if(paper){Array.from(paper.childNodes).forEach(function(node){target.appendChild(node.cloneNode(true))})}else{var h=document.createElement('h3');h.textContent=value('cvNomeV87');var p=document.createElement('p');p.textContent=value('cvObjetivoV84')+' — '+value('cvResumoV84');target.append(h,p)}
  var line=document.createElement('p');line.className='cv-summary-match';line.textContent=[value('cvAreaV84'),value('cvEscolaridadeAligned'),value('cvExperienciaAligned'),value('cvModalidadeV85'),value('cvCidadeV85'),value('cvEstadoAligned'),value('cvContratoAligned'),value('cvJornadaAligned')].filter(Boolean).join(' · ');target.appendChild(line);[['cvFerramentasExtra','Ferramentas e sistemas'],['cvCertificacoesExtra','Certificações'],['cvInicioExtra','Disponibilidade para início'],['cvHorariosExtra','Horários e escalas'],['cvViagensExtra','Viagens'],['cvMudancaExtra','Mudança de cidade'],['cvCnhExtra','CNH'],['cvCnhValidadeExtra','Validade da CNH']].forEach(function(row){var text=value(row[0]);if(text){var heading=document.createElement('h4');heading.textContent=row[1];var paragraph=document.createElement('p');paragraph.textContent=text;paragraph.style.whiteSpace='pre-line';target.append(heading,paragraph)}});
 }
 function show(n){
  current=Math.max(0,Math.min(steps.length-1,n));var editor=ws.querySelector('.cv86-editor');if(editor)editor.scrollTop=0;steps.forEach(function(step,i){step.hidden=i!==current});ws.querySelectorAll('.cv-step-nav button').forEach(function(button,i){button.setAttribute('aria-current',i===current?'step':'false');button.classList.toggle('complete',i<current);if(i===current&&button.parentElement.scrollWidth>button.parentElement.clientWidth)button.scrollIntoView({block:'nearest',inline:'nearest'})});
  var g=guide[current];el('cvGuideTitle').textContent=g[1];el('cvGuideCopy').textContent=g[2];el('cvGuideExample').textContent=g[3];el('cvStepCounter').textContent='Etapa '+(current+1)+' de '+steps.length;el('cvWizardBack').disabled=current===0;el('cvWizardNext').hidden=current===steps.length-1;
  var footer=cv.querySelector('.cv85-footer');if(footer)footer.hidden=current!==steps.length-1;if(current===steps.length-1)summary();if(window.emResumeScrollReset)window.emResumeScrollReset();
 }
 function next(){var controls=steps[current].querySelectorAll('input,select,textarea');for(var i=0;i<controls.length;i++){if(!controls[i].checkValidity()){controls[i].reportValidity();return}}show(current+1)}
 window.emSyncResumeProfile=function(data){
  var email=String(sessionStorage.getItem('candidatoEmail')||'').trim().toLowerCase();if(!email)return;
  var list;try{list=JSON.parse(localStorage.getItem('candidatosEmpregaMais')||'[]')}catch(e){return}if(!Array.isArray(list))return;
  var candidate=list.find(function(c){return String(c.email||'').trim().toLowerCase()===email});if(!candidate)return;
  var fields={cargoDesejado:data.objetivo,areaProfissional:data.area,escolaridadeProfissional:data.escolaridade,experienciaProfissional:data.tempoExperiencia,habilidadesProfissionais:data.habilidades,modalidadePreferida:data.modalidade,cidadeProfissional:data.cidadePreferida,contratoPreferido:data.contrato,jornadaPreferida:data.jornada,uf:data.ufResidencial||data.uf,cep:data.cep,cidade:data.cidadeResidencial,logradouro:data.logradouro,bairro:data.bairro,numero:data.numero,complemento:data.complemento,latitude:data.latitude||null,longitude:data.longitude||null};Object.keys(fields).forEach(function(k){if(fields[k]!==undefined)candidate[k]=fields[k]});localStorage.setItem('candidatosEmpregaMais',JSON.stringify(list));
 };
 function setup(){
  cv=el('curriculoOnlineV84');var page=el('pagina-curriculo');if(!cv||!page||el('cvResumeWizard'))return;
  ws=el('cvWorkspaceV86');if(!ws){ws=document.createElement('div');ws.id='cvWorkspaceV86';cv.parentNode.insertBefore(ws,cv);ws.appendChild(cv)}ws.id='cvResumeWizard';ws.classList.add('cv-wizard');
  var oldSide=ws.querySelector('.cv86-preview-col');if(oldSide){oldSide.hidden=true;oldSide.classList.add('cv-old-preview');var previewHolder=document.createElement('div');previewHolder.className='cv-hidden-preview-source';previewHolder.hidden=true;previewHolder.appendChild(oldSide);cv.appendChild(previewHolder)}
  var destination=page.querySelector('.container-menor');if(!destination)return;destination.prepend(ws);
  var oldUpload=destination.querySelector('.curriculo-box');if(oldUpload){var upload=document.createElement('details');upload.className='cv-attachment-option';var title=document.createElement('summary');title.textContent='Também deseja anexar um currículo em arquivo?';upload.append(title,oldUpload);destination.appendChild(upload)}
  var hero=cv.querySelector('.cv85-hero');if(hero){
    hero.classList.add('cv-purple-hero');destination.insertBefore(hero,ws);
    hero.querySelector('.cv85-kicker').innerHTML='CURRÍCULO PROFISSIONAL <span>GRATUITO</span>';
    hero.querySelector('h2').textContent='Criar currículo online';
    hero.querySelector('.cv85-hero-copy p').innerHTML='Preencha as etapas e revise seu currículo antes de salvar.<br>Suas informações ajudam a comparar seu perfil com os requisitos das vagas.';
    hero.querySelector('.cv85-score>span').textContent='do perfil preenchido';
    var back=document.createElement('button');back.type='button';back.className='cv-hero-back';back.innerHTML='<span aria-hidden="true">←</span> Voltar ao meu painel';back.onclick=function(){window.irPara('painel-candidato')};hero.querySelector('.cv85-hero-copy').prepend(back);
    function syncRing(){var score=el('cvProgressoV85');if(score)hero.style.setProperty('--cv-progress',score.textContent.trim())}syncRing();new MutationObserver(syncRing).observe(el('cvProgressoV85'),{childList:true,characterData:true,subtree:true});
    var oldHeader=page.querySelector('.page-header');if(oldHeader)oldHeader.hidden=true;
    ['.cv85-progress','.cv85-info'].forEach(function(selector){var old=cv.querySelector(selector);if(old)old.hidden=true});
  }
  var heading=page.querySelector('.page-header h1'),sub=page.querySelector('.page-header p');if(heading)heading.textContent='Criar currículo online';if(sub)sub.textContent='Preencha as etapas e revise seu currículo antes de salvar.';
  steps=Array.from(cv.querySelectorAll(':scope > .cv85-section'));if(steps.length!==7)return;
  var review=document.createElement('section');review.className='cv85-section cv-review-step';review.innerHTML='<div class="cv85-section-head"><div class="cv85-number">08</div><div><span>REVISÃO</span><h3>Resumo do seu currículo</h3><p>Confira todas as informações antes de salvar.</p></div></div><div id="cvFinalSummary" class="cv86-paper"></div>';cv.insertBefore(review,cv.querySelector('.cv85-footer'));steps.push(review);
  steps.forEach(function(step,i){var number=step.querySelector('.cv85-number');if(number)number.textContent=String(i+1).padStart(2,'0')});
  setSelect('cvAreaV84','areaVaga','',steps[1]);
  [['cvEscolaridadeAligned','escolaridadeVaga','Escolaridade atual',3],['cvExperienciaAligned','experienciaVaga','Tempo de experiência na área',2],['cvContratoAligned','contratoVaga','Tipo de contratação preferido',5],['cvJornadaAligned','jornadaVaga','Jornada preferida',5]].forEach(function(row){var grid=steps[row[3]].querySelector('.curriculo-grid-v84');if(!grid){grid=document.createElement('div');grid.className='curriculo-grid-v84';steps[row[3]].appendChild(grid)}setSelect(row[0],row[1],row[2],grid)});
  var uf=document.createElement('label');uf.className='curriculo-campo-v84';uf.textContent='Estado onde busca oportunidades';var ufSelect=document.createElement('select');ufSelect.id='cvEstadoAligned';ufSelect.appendChild(new Option('Sem preferência',''));'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').forEach(function(state){ufSelect.appendChild(new Option(state,state))});uf.appendChild(ufSelect);steps[5].querySelector('.curriculo-grid-v84').appendChild(uf);
  var nav=document.createElement('nav');nav.className='cv-step-nav';nav.setAttribute('aria-label','Etapas do currículo');guide.forEach(function(g,i){var b=document.createElement('button');b.type='button';b.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span><strong>'+g[0]+'</strong>';b.onclick=function(){show(i)};nav.appendChild(b)});cv.prepend(nav);
  var controls=document.createElement('div');controls.className='cv-wizard-actions';controls.innerHTML='<span id="cvStepCounter"></span><button id="cvWizardBack" type="button">Voltar</button><button id="cvWizardNext" type="button">Continuar →</button>';cv.appendChild(controls);el('cvWizardBack').onclick=function(){show(current-1)};el('cvWizardNext').onclick=next;
  var aside=document.createElement('aside');aside.className='cv-context-guide';aside.innerHTML='<small>COMO PREENCHER</small><h2 id="cvGuideTitle"></h2><p id="cvGuideCopy"></p><div class="cv-guide-tip"><strong>Dica para esta etapa</strong><p id="cvGuideExample"></p></div><div class="cv-guide-match"><strong>Seu perfil e as vagas</strong><p>Usamos as mesmas opções de cadastro para comparar seus dados com os requisitos das oportunidades. Preencha com informações atuais e verdadeiras.</p></div>';ws.appendChild(aside);
  var addressGrid=steps[0].querySelector('.curriculo-grid-v84');
  var addressFields=[['cvCepAligned','CEP residencial','00000-000'],['cvRuaAligned','Rua / Logradouro','Preenchido pelo CEP'],['cvBairroAligned','Bairro','Preenchido pelo CEP'],['cvCidadeAddress','Cidade','Preenchida pelo CEP'],['cvUfAddress','Estado','UF'],['cvNumeroAligned','Número','Informe o número'],['cvComplementoAligned','Complemento (opcional)','Apartamento, bloco ou referência']];
  addressFields.forEach(function(row){var label=document.createElement('label');label.className='curriculo-campo-v84';label.textContent=row[1];var input=document.createElement('input');input.id=row[0];input.type='text';input.placeholder=row[2];label.appendChild(input);addressGrid.appendChild(label)});
  ['cvLatitudeAligned','cvLongitudeAligned'].forEach(function(id){var input=document.createElement('input');input.id=id;input.type='hidden';cv.appendChild(input)});
  var cepStatus=document.createElement('p');cepStatus.id='cvCepLookupStatus';cepStatus.className='cv-cep-status';cepStatus.setAttribute('role','status');addressGrid.appendChild(cepStatus);
  var cep=el('cvCepAligned');cep.required=true;cep.inputMode='numeric';cep.autocomplete='postal-code';cep.maxLength=9;cep.pattern='[0-9]{5}-?[0-9]{3}';
  var city=el('cvCidadePessoalV87');if(city)city.readOnly=true;
  var oldAddress=el('cvEnderecoV87');if(oldAddress)oldAddress.closest('label').hidden=true;
  var requestId=0,pending=null,lookedUp='',timer;
  function compose(){if(oldAddress)oldAddress.value=[value('cvRuaAligned'),value('cvNumeroAligned'),value('cvBairroAligned'),value('cvComplementoAligned')].filter(Boolean).join(', ');if(city)city.value=[value('cvCidadeAddress'),value('cvUfAddress')].filter(Boolean).join(' - ')}
  function lookup(){
   var code=cep.value.replace(/\D/g,'');if(code.length!==8)return Promise.reject(Error('Informe um CEP residencial com 8 dígitos.'));
   if(lookedUp===code)return Promise.resolve();if(pending&&pending.code===code)return pending.promise;
   var own=++requestId;cepStatus.textContent='Consultando CEP…';cep.setCustomValidity('');
   var promise=(async function(){try{var data=await window.emLookupResumePostalCode(code);if(own!==requestId||cep.value.replace(/\D/g,'')!==code)return;
    el('cvRuaAligned').value=data.street||'';el('cvBairroAligned').value=data.neighborhood||'';el('cvCidadeAddress').value=data.city||'';el('cvUfAddress').value=data.state||'';
    var coordinates=data.location&&data.location.coordinates||{},lat=Number.parseFloat(coordinates.latitude),lng=Number.parseFloat(coordinates.longitude);el('cvLatitudeAligned').value=Number.isFinite(lat)?lat:'';el('cvLongitudeAligned').value=Number.isFinite(lng)?lng:'';compose();lookedUp=code;cepStatus.textContent='CEP localizado. Confira o endereço e informe o número.';cv.dispatchEvent(new Event('change',{bubbles:true}));
   }catch(error){if(own!==requestId)return;cepStatus.textContent=error.name==='AbortError'?'A consulta demorou demais. Tente novamente.':error.message;throw Error(cepStatus.textContent)}finally{if(own===requestId)pending=null}})();pending={code:code,promise:promise};return promise;
  }
  cep.addEventListener('input',function(){clearTimeout(timer);++requestId;pending=null;lookedUp='';cep.setCustomValidity('');el('cvLatitudeAligned').value='';el('cvLongitudeAligned').value='';cep.value=cep.value.replace(/\D/g,'').slice(0,8).replace(/^(\d{5})(\d)/,'$1-$2');cepStatus.textContent='';if(cep.value.replace(/\D/g,'').length===8)timer=setTimeout(function(){lookup().catch(function(){})},300)});
  cep.addEventListener('blur',function(){if(cep.value.replace(/\D/g,'').length===8)lookup().catch(function(){})});
  addressGrid.addEventListener('input',function(event){if(event.target.id!=='cvCepAligned')compose()});
  window.emResolveResumeCep=async function(){await lookup();if(cep.value.replace(/\D/g,'')!==lookedUp)throw Error('Confirme o CEP antes de salvar.');compose()};
  function extraField(stepIndex,id,title,type,placeholder,options){var grid=steps[stepIndex].querySelector('.curriculo-grid-v84');if(!grid){grid=document.createElement('div');grid.className='curriculo-grid-v84';steps[stepIndex].appendChild(grid)}var label=document.createElement('label');label.className='curriculo-campo-v84'+(type==='textarea'?' curriculo-full-v84':'');label.textContent=title+' (opcional)';var input=document.createElement(type==='select'?'select':type==='textarea'?'textarea':'input');input.id=id;if(type==='select'){input.appendChild(new Option('Selecione',''));options.forEach(function(option){input.appendChild(new Option(option,option))})}else{if(type!=='textarea')input.type=type;input.placeholder=placeholder||'';if(type==='textarea'){input.rows=3;input.maxLength=1800}}label.appendChild(input);grid.appendChild(label)}
  extraField(4,'cvFerramentasExtra','Ferramentas e sistemas com nível','textarea','Uma ferramenta por linha. Ex.: Excel — avançado; CRM — intermediário; ERP — básico.');
  extraField(4,'cvCertificacoesExtra','Certificações: instituição, conclusão e validade','textarea','Ex.: Nome da certificação — instituição — conclusão MM/AAAA — validade MM/AAAA ou sem validade.');
  extraField(4,'cvIdiomasExtra','Idiomas e nível de domínio','textarea','Ex.: Inglês — intermediário; Espanhol — básico.');
  var oldLanguages=el('cvIdiomasV84');if(oldLanguages){var oldLanguageLabel=oldLanguages.closest('label');var languagesLabel=el('cvIdiomasExtra').closest('label');languagesLabel.replaceChild(oldLanguages,el('cvIdiomasExtra'));oldLanguages.placeholder='Ex.: Inglês — intermediário; Espanhol — básico.';if(oldLanguageLabel&&oldLanguageLabel!==languagesLabel)oldLanguageLabel.remove();}
  extraField(5,'cvInicioExtra','Quando pode começar','select','',['Imediatamente','Em até 15 dias','Em até 30 dias','A combinar']);
  extraField(5,'cvHorariosExtra','Horários e escalas disponíveis','textarea','Ex.: horário comercial, manhã, tarde, noite, escala 6x1 ou 12x36.');
  extraField(5,'cvViagensExtra','Disponibilidade para viagens','select','',['Sim','Não','A combinar']);
  extraField(5,'cvMudancaExtra','Disponibilidade para mudança de cidade','select','',['Sim','Não','A combinar']);
  extraField(6,'cvCnhExtra','Categoria da CNH','select','',['Não possuo','A','B','AB','C','AC','D','AD','E','AE']);
  extraField(6,'cvCnhValidadeExtra','Validade da CNH','date','');
  var originalRestore=window.EmpregaMaisRestaurarCurriculo;if(originalRestore)originalRestore();
  if(!cep.value&&typeof window.obterCandidatoAtual==='function'){var existing=window.obterCandidatoAtual()||{};cep.value=existing.cep||'';}
  if(!el('cvUniversitiesList')){var universityList=document.createElement('datalist');universityList.id='cvUniversitiesList';(window.emBrazilUniversities||[]).forEach(function(name){universityList.appendChild(new Option(name,name))});cv.appendChild(universityList);}
  var objective=el('cvObjetivoV84');if(objective){objective.maxLength=600;objective.placeholder='Ex.: Assistente administrativo, Auxiliar de escritório';var hint=objective.closest('label').querySelector('small');if(!hint){hint=document.createElement('small');objective.closest('label').appendChild(hint)}hint.textContent='Informe os cargos desejados. Use Enter ou vírgula para separar; ao sair do campo, o último cargo será confirmado.';
    function normalizeRoles(raw){var seen=new Set();return String(raw||'').split(/[,;\n]+/).map(function(role){return role.trim().replace(/\s+/g,' ')}).filter(function(role){var key=role.toLocaleLowerCase('pt-BR');if(!role||seen.has(key))return false;seen.add(key);return true}).join(', ')}
    objective.addEventListener('keydown',function(event){if(event.key==='Enter'&&!event.isComposing){event.preventDefault();this.value=normalizeRoles(this.value);if(this.value)this.value+=', ';this.dispatchEvent(new Event('input',{bubbles:true}))}});
    objective.addEventListener('blur',function(){this.value=normalizeRoles(this.value);this.dispatchEvent(new Event('change',{bubbles:true}))});
    objective.addEventListener('paste',function(){setTimeout(function(){objective.value=normalizeRoles(objective.value);objective.dispatchEvent(new Event('input',{bubbles:true}))},0)});
  }
  var salary=el('cvSalarioV85');if(salary){salary.inputMode='decimal';salary.placeholder='R$ 0,00';
    function formatMoneyDigits(raw){var digits=String(raw||'').replace(/\D/g,'').slice(0,12);return digits?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(digits)/100):''}
    if(salary.value){var raw=salary.value.trim();salary.value=raw.includes(',')?formatMoneyDigits(raw):new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(raw.replace(/[^0-9.]/g,''))||0)}
    salary.addEventListener('input',function(){this.value=formatMoneyDigits(this.value)});salary.addEventListener('blur',function(){if(this.value)this.value=formatMoneyDigits(this.value)});
  }
  ['cvNomeV87','cvEmailV87','cvObjetivoV84','cvAreaV84'].forEach(function(id){if(el(id))el(id).required=true});
  var save=el('cvSalvarV84');save.addEventListener('click',function(event){var invalid=cv.querySelector(':invalid');if(invalid){event.preventDefault();event.stopImmediatePropagation();show(steps.findIndex(function(step){return step.contains(invalid)}));invalid.reportValidity()}},true);
  var viewport=document.createElement('div');viewport.className='cv-fields-viewport';viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label','Campos da etapa do currículo');
  var frame=document.createElement('div');frame.className='cv-fields-frame';nav.after(frame);frame.appendChild(viewport);steps.forEach(function(step){viewport.appendChild(step)});
  var up=document.createElement('button');up.type='button';up.className='cv-scroll-arrow cv-scroll-up';up.setAttribute('aria-label','Rolar campos para cima');up.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
  var down=document.createElement('button');down.type='button';down.className='cv-scroll-arrow cv-scroll-down';down.setAttribute('aria-label','Rolar campos para baixo');down.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  frame.append(up,down);
  function arrows(){var max=viewport.scrollHeight-viewport.clientHeight;up.disabled=viewport.scrollTop<=1;down.disabled=viewport.scrollTop>=max-1;up.hidden=down.hidden=max<2;frame.classList.toggle('cv-more-above',!up.disabled);frame.classList.toggle('cv-more-below',!down.disabled)}
  function scrollByDirection(direction){viewport.scrollBy({top:direction*Math.max(120,viewport.clientHeight*.65),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  up.onclick=function(){scrollByDirection(-1)};down.onclick=function(){scrollByDirection(1)};viewport.addEventListener('scroll',arrows,{passive:true});
  window.emResumeScrollReset=function(){viewport.scrollTop=0;requestAnimationFrame(arrows)};
  if(typeof ResizeObserver!=='undefined'){var resize=new ResizeObserver(arrows);resize.observe(viewport);steps.forEach(function(step){resize.observe(step)})}
  window.addEventListener('resize',arrows);cv.addEventListener('input',function(){requestAnimationFrame(arrows)});
  var footer=cv.querySelector('.cv85-footer'),status=el('cvStatusV84');if(footer)controls.before(footer);if(status)controls.before(status);
  var helper=document.createElement('aside');helper.className='cv-professional-assistant';helper.hidden=true;helper.setAttribute('aria-label','Assistente de preenchimento');helper.innerHTML='<span class="cv-helper-symbol" aria-hidden="true">+</span><div class="cv-helper-card"><small>ASSISTENTE +EMPREGOS</small><button type="button" class="cv-helper-close" aria-label="Dispensar dica">×</button><strong>Sugestão para seu currículo</strong><p class="cv-helper-copy"></p><div class="cv-helper-buttons"><button type="button" class="cv-helper-example">Ver exemplo</button><button type="button" class="cv-helper-dismiss">Dispensar</button></div><p class="cv-helper-example-text" hidden></p><footer>Você decide o que incluir.</footer></div>';cv.appendChild(helper);
  var dismissed=new WeakSet(),activeField=null,example='';
  var tips={cvResumoV84:['Conte sua experiência, seus principais conhecimentos e o tipo de oportunidade que procura.','Profissional com experiência em atendimento ao cliente e rotinas administrativas, com conhecimentos em Excel e organização de documentos.'],cvHabilidadesV84:['Inclua ferramentas e conhecimentos específicos que você utiliza no trabalho.','Excel, atendimento ao cliente, organização de documentos e controle de estoque.'],activities:['Detalhe suas atividades e as ferramentas que utilizava para apresentar melhor sua experiência.','Atendimento ao cliente, organização de documentos e atualização de planilhas.'],results:['Se tiver resultados reais para compartilhar, descreva a melhoria ou a meta alcançada. Não é necessário inventar números.','Organizei o controle de documentos para facilitar a consulta da equipe.']};
  cv.addEventListener('focusout',function(event){var field=event.target,tip=tips[field.id]||((field.classList&&field.classList.contains('e5'))?tips.activities:(field.classList&&field.classList.contains('e6'))?tips.results:null);if(!tip||dismissed.has(field))return;var words=String(field.value||'').trim().split(/\s+/).filter(Boolean).length;if(words===0||words>=10)return;activeField=field;example=tip[1];helper.querySelector('.cv-helper-copy').textContent=tip[0];helper.querySelector('.cv-helper-example-text').hidden=true;helper.hidden=false;field.closest('label').after(helper)});
  function dismiss(){if(activeField)dismissed.add(activeField);helper.hidden=true;activeField=null}helper.querySelector('.cv-helper-close').onclick=dismiss;helper.querySelector('.cv-helper-dismiss').onclick=dismiss;helper.querySelector('.cv-helper-example').onclick=function(){var text=helper.querySelector('.cv-helper-example-text');text.textContent='Exemplo: '+example;text.hidden=!text.hidden};
  nav.addEventListener('click',dismiss);controls.addEventListener('click',dismiss);
  function polishRows(){cv.querySelectorAll('.experiencia-v84,.formacao-v84').forEach(function(row){if(row.dataset.professionalCard)return;row.dataset.professionalCard='1';var title=document.createElement('strong');title.className='cv-entry-title';title.textContent=row.classList.contains('experiencia-v84')?'Experiência profissional':'Formação acadêmica';row.prepend(title);if(row.classList.contains('formacao-v84')){
 var institution=row.querySelector('.f1');if(institution){institution.setAttribute('list','cvUniversitiesList');institution.placeholder='Digite o nome para buscar a instituição';var originalHelp=institution.closest('label').querySelector('small');if(originalHelp)originalHelp.remove();var institutionHelp=document.createElement('small');institutionHelp.className='cv-institution-help';institutionHelp.textContent='Escolha uma sugestão. Não encontrou? Digite o nome completo da sua instituição.';institution.closest('label').appendChild(institutionHelp);}
 var course=row.querySelector('.f2');if(course){course.type='hidden';var courseSelect=document.createElement('select');courseSelect.className='cv-course-selector';courseSelect.appendChild(new Option('Selecione seu curso',''));window.emResumeCourses.forEach(function(name){courseSelect.appendChild(new Option(name,name))});courseSelect.appendChild(new Option('Não encontrei meu curso','__manual__'));course.after(courseSelect);var manual=document.createElement('input');manual.type='text';manual.className='cv-manual-course';manual.placeholder='Digite o nome completo do curso';manual.hidden=true;manual.value=course.value;
 var notice=document.createElement('div');notice.className='cv-manual-course-card';notice.innerHTML='<strong>Não encontrou seu curso?</strong>';var manualButton=document.createElement('button');manualButton.type='button';manualButton.textContent='Inserir manualmente';notice.append(manualButton,manual);course.closest('label').appendChild(notice);
 function choose(){manual.hidden=courseSelect.value!=='__manual__';course.value=manual.hidden?courseSelect.value:manual.value;course.dispatchEvent(new Event('change',{bubbles:true}))}courseSelect.onchange=choose;manual.oninput=function(){course.value=manual.value};manualButton.onclick=function(){courseSelect.value='__manual__';choose();manual.focus()};
 courseSelect.value=course.value&&window.emResumeCourses.includes(course.value)?course.value:course.value?'__manual__':'';manual.hidden=courseSelect.value!=='__manual__';
 var level=row.querySelector('.f3');if(level)level.addEventListener('change',function(){if(['Ensino médio','Ensino fundamental'].includes(level.value)){courseSelect.value=level.value;choose()}});
 }
}row.querySelectorAll('.e3,.e4,.f5').forEach(function(input){var holder=document.createElement('span');holder.className='cv-date-control';input.parentNode.insertBefore(holder,input);holder.appendChild(input);var icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');icon.innerHTML='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M7 17h2"/>';holder.appendChild(icon)})})}
  polishRows();applyProfessionalFields();['cvExperienciasV84','cvFormacoesV84'].forEach(function(id){var box=el(id);if(box)new MutationObserver(function(records){if(records.some(function(record){return Array.from(record.addedNodes).some(function(node){return node.nodeType===1&&node.matches('.experiencia-v84,.formacao-v84')})})){polishRows();applyProfessionalFields()}}).observe(box,{childList:true})});
  function applyProfessionalFields(){
   var icons={calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',building:'<path d="M4 21V3h11v18M15 9h5v12M2 21h20M7 7h2M7 11h2M7 15h2"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',education:'<path d="m2 9 10-5 10 5-10 5-10-5M6 11v6c4 3 8 3 12 0v-6M22 9v8"/>',phone:'<path d="M5 3h4l2 5-3 2c2 4 3 5 6 6l2-3 5 2v4c0 3-6 3-12-3S2 3 5 3Z"/>'};
   function makeIcon(name){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[name]||icons.briefcase;return svg}
   cv.querySelectorAll('label').forEach(function(label){label.style.setProperty('font-family','Montserrat, Arial, sans-serif','important');label.style.setProperty('font-weight','650','important')});
   cv.querySelectorAll('h3,.cv-entry-title').forEach(function(title){title.style.setProperty('font-family','Montserrat, Arial, sans-serif','important');title.style.setProperty('font-weight','750','important');if(title.classList.contains('cv-entry-title')&&!title.querySelector('svg'))title.prepend(makeIcon(title.closest('.formacao-v84')?'education':'briefcase'))});
   cv.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(input){input.style.setProperty('font-family','Montserrat, Arial, sans-serif','important');input.style.setProperty('font-weight','400','important');if(input.tagName==='TEXTAREA'||input.closest('.cv-date-control,.cv-professional-field'))return;var name=input.classList.contains('e1')||input.classList.contains('f1')?'building':input.classList.contains('f2')||input.classList.contains('f3')||input.classList.contains('cv-course-selector')?'education':/Email/.test(input.id)?'mail':/Telefone/.test(input.id)?'phone':/Cidade|Cep|Rua|Bairro|Estado|Uf/.test(input.id)?'pin':/Nome/.test(input.id)?'user':'briefcase';var wrap=document.createElement('span');wrap.className='cv-professional-field';input.parentNode.insertBefore(wrap,input);wrap.append(makeIcon(name),input)});
  }
  show(0);
 }
 var style=document.createElement('style');style.textContent=`
#pagina-curriculo .container-menor:has(#cvResumeWizard){max-width:1180px!important;width:calc(100% - 40px)!important;padding:28px 0!important}
#cvResumeWizard.cv-wizard{display:grid!important;grid-template-columns:minmax(0,1fr) 320px!important;gap:24px!important;align-items:start!important}
#cvResumeWizard .cv86-editor{min-width:0}#cvResumeWizard #curriculoOnlineV84{margin:0!important;border:1px solid #e1d9eb!important;border-radius:14px!important;background:#fff!important;padding:24px!important;box-shadow:none!important;max-width:none!important}
#cvResumeWizard [hidden]{display:none!important}.cv-old-preview{display:none!important}
#cvResumeWizard .cv-step-nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:24px;border-bottom:1px solid #eee7f6;padding-bottom:20px}
#cvResumeWizard .cv-step-nav button{display:flex;align-items:center;gap:7px;border:1px solid #e4dced;background:#fff;border-radius:8px;padding:9px 7px;color:#7a698d;font:11px Inter,Arial,sans-serif;cursor:pointer;min-width:0}
#cvResumeWizard .cv-step-nav span{display:grid;place-items:center;width:24px;height:24px;flex:0 0 24px;border-radius:50%;background:#f1eafa;color:#7540ae}#cvResumeWizard .cv-step-nav button[aria-current=step]{border-color:#7540ae;background:#f6f0fd;color:#51258a}#cvResumeWizard .cv-step-nav button[aria-current=step] span{background:#7540ae;color:#fff}
#cvResumeWizard .cv85-section{margin:0!important;border:0!important;padding:0!important;background:#fff!important}#cvResumeWizard .cv85-section-head{margin-bottom:20px!important}#cvResumeWizard .cv85-number{background:#f1eafa!important;color:#7540ae!important}#cvResumeWizard .cv85-section-head h3{font:700 22px/1.4 Inter,Arial,sans-serif!important;color:#271a3b!important}#cvResumeWizard .curriculo-grid-v84{gap:18px!important}#cvResumeWizard .curriculo-campo-v84{font:600 13px/1.5 Inter,Arial,sans-serif!important;color:#302141!important}#cvResumeWizard input,#cvResumeWizard select,#cvResumeWizard textarea{border:1px solid #ded5e9!important;border-radius:7px!important;padding:11px 12px!important;font:14px/1.5 Inter,Arial,sans-serif!important;background:#fff!important;box-sizing:border-box!important;width:100%!important}#cvResumeWizard small{font:12px/1.6 Inter,Arial,sans-serif;color:#887698}
.cv-context-guide{position:sticky;top:24px;background:linear-gradient(145deg,#f6f0fd,#ede3f8);border:1px solid #ded0ed;border-radius:14px;padding:24px;color:#49325e}.cv-context-guide>small{letter-spacing:.1em;font:600 11px Inter,Arial,sans-serif!important;color:#7540ae!important}.cv-context-guide h2{font:700 23px/1.35 Inter,Arial,sans-serif;margin:12px 0 16px;color:#51258a}.cv-context-guide p{font:14px/1.8 Inter,Arial,sans-serif;margin:0}.cv-guide-tip{background:#fff;border-radius:10px;padding:18px;margin:22px 0}.cv-guide-tip strong,.cv-guide-match strong{font:700 13px Inter,Arial,sans-serif;display:block;margin-bottom:9px}.cv-guide-tip p,.cv-guide-match p{font-size:13px}.cv-guide-match{border-top:1px solid #d8c8e8;padding-top:18px}
.cv-wizard-actions{display:flex;align-items:center;gap:12px;border-top:1px solid #eee7f5;padding-top:18px;margin-top:24px}.cv-wizard-actions>span{margin-right:auto;color:#887698;font:12px Inter,Arial,sans-serif}.cv-wizard-actions button{border:1px solid #d6c8e5;border-radius:7px;padding:11px 19px;background:#fff;color:#7540ae;font:600 13px Inter,Arial,sans-serif;cursor:pointer}.cv-wizard-actions #cvWizardNext{background:#7540ae;border-color:#7540ae;color:white}.cv-wizard-actions button:disabled{opacity:.4;cursor:default}#cvResumeWizard .cv85-footer{margin-top:20px!important}.cv-attachment-option{background:white;border:1px solid #e1d9eb;border-radius:12px;padding:16px;margin-top:24px}.cv-attachment-option>summary{color:#7540ae;font:600 14px Inter,Arial,sans-serif;cursor:pointer}#cvFinalSummary{box-shadow:none!important;padding:24px!important;border:1px solid #e5dfed;width:100%!important;max-width:none!important;box-sizing:border-box}.cv-summary-match{border-top:1px solid #eee7f5;padding-top:16px;color:#7540ae}
@media(max-width:950px){#cvResumeWizard.cv-wizard{grid-template-columns:minmax(0,1fr) 270px!important;gap:16px!important}.cv-context-guide{padding:18px}}
@media(max-width:760px){#cvResumeWizard.cv-wizard{grid-template-columns:1fr!important}.cv-context-guide{position:static}#cvResumeWizard .cv-step-nav{grid-template-columns:repeat(2,minmax(0,1fr))}#cvResumeWizard #curriculoOnlineV84{padding:18px!important}#cvResumeWizard .curriculo-grid-v84{grid-template-columns:1fr!important}}
@media(max-width:450px){.cv-wizard-actions{flex-wrap:wrap}.cv-wizard-actions>span{width:100%}.cv-wizard-actions button{flex:1}}

/* Duas colunas estáveis: a rolagem pertence ao editor. */
#cvResumeWizard.cv-wizard>.cv-context-guide{grid-column:2!important;grid-row:1!important;position:static!important;align-self:start!important;max-height:100%;box-sizing:border-box}
#cvResumeWizard.cv-wizard>.cv86-editor{grid-column:1!important;grid-row:1!important;height:100%!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:6px;box-sizing:border-box}
#cvResumeWizard.cv-wizard{height:calc(100dvh - 180px)!important;min-height:560px!important;align-items:start!important}
#cvResumeWizard .cv-hidden-preview-source,#cvResumeWizard .cv-old-preview,#cvResumeWizard.cv-wizard>.cv86-preview-col{display:none!important}
@media(max-width:760px){#cvResumeWizard.cv-wizard{height:auto!important;min-height:0!important}#cvResumeWizard.cv-wizard>.cv86-editor{height:auto!important;overflow:visible!important;padding-right:0}#cvResumeWizard.cv-wizard>.cv-context-guide{display:none!important}}

/* En-tête roxo integrado: referência aprovada. */
#pagina-curriculo>.page-header[hidden]{display:none!important}
#pagina-curriculo .cv-purple-hero{position:relative;isolation:isolate;display:grid!important;grid-template-columns:minmax(0,1fr) 210px!important;gap:24px!important;align-items:center!important;background:linear-gradient(110deg,#42216f,#7540ae 85%,#8755c5)!important;border-radius:14px!important;border:0!important;padding:28px 38px!important;margin:0 0 24px!important;color:#fff!important;overflow:hidden!important;box-shadow:none!important;min-height:230px!important;box-sizing:border-box!important}
#pagina-curriculo .cv-purple-hero:after{content:'';position:absolute;z-index:-1;width:450px;height:450px;border:1px solid #ffffff22;border-radius:50%;right:-300px;bottom:-300px;box-shadow:0 0 0 60px #ffffff09}
#pagina-curriculo .cv-purple-hero .cv85-hero-copy{min-width:0!important}#pagina-curriculo .cv-purple-hero .cv85-kicker{font:600 12px Inter,Arial,sans-serif!important;color:#e8d7ff!important;letter-spacing:1.3px!important;margin:22px 0 10px!important;display:flex;align-items:center;gap:16px}
#pagina-curriculo .cv-purple-hero .cv85-kicker span{font:700 11px Inter,Arial,sans-serif!important;border:0!important;color:white!important;background:#9867ce70!important;border-radius:20px!important;padding:7px 13px!important;letter-spacing:.5px!important}
#pagina-curriculo .cv-purple-hero h2{font:750 clamp(26px,3vw,40px)/1.2 Inter,Arial,sans-serif!important;color:#fff!important;margin:0 0 14px!important;letter-spacing:-.8px!important}
#pagina-curriculo .cv-purple-hero .cv85-hero-copy p{font:400 15px/1.7 Inter,Arial,sans-serif!important;color:#f4ebff!important;margin:0!important;max-width:850px!important}
#pagina-curriculo .cv-purple-hero .cv-hero-back{display:inline-flex;gap:10px;align-items:center;border:1px solid #c8a4ed99;border-radius:7px;background:#ffffff08;color:white;padding:9px 15px;font:600 13px Inter,Arial,sans-serif;cursor:pointer}
#pagina-curriculo .cv-purple-hero .cv85-score{width:142px!important;height:142px!important;border:0!important;border-radius:50%!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:6px!important;text-align:center!important;justify-self:center!important;background:radial-gradient(circle at center,#6536a1 62%,transparent 63%),conic-gradient(#ebd9ff var(--cv-progress,0%),#ffffff22 0)!important;box-shadow:none!important;flex-shrink:0!important}
#pagina-curriculo .cv-purple-hero .cv85-score strong{font:750 28px Inter,Arial,sans-serif!important;color:#fff!important}#pagina-curriculo .cv-purple-hero .cv85-score>span{font:400 12px/1.4 Inter,Arial,sans-serif!important;color:#f4ebff!important;max-width:95px!important}
#cvResumeWizard #curriculoOnlineV84>.cv85-progress,#cvResumeWizard #curriculoOnlineV84>.cv85-info{display:none!important}
#cvResumeWizard .cv-step-nav{gap:10px!important;padding-bottom:24px!important}#cvResumeWizard .cv-step-nav button{border:0!important;background:transparent!important;padding:9px 6px!important;font-size:12px!important}#cvResumeWizard .cv-step-nav button[aria-current=step]{border-radius:25px!important;background:#f1e8fc!important}#cvResumeWizard .cv-step-nav span{width:30px!important;height:30px!important;flex-basis:30px!important}
@media(max-width:760px){#pagina-curriculo .cv-purple-hero{grid-template-columns:minmax(0,1fr) 120px!important;padding:24px!important;gap:16px!important}#pagina-curriculo .cv-purple-hero .cv85-score{width:110px!important;height:110px!important}#pagina-curriculo .cv-purple-hero .cv85-hero-copy p{font-size:13px!important}#pagina-curriculo .cv-purple-hero .cv85-kicker{font-size:10px!important;letter-spacing:.5px!important;flex-wrap:wrap}}
@media(max-width:480px){#pagina-curriculo .cv-purple-hero{grid-template-columns:1fr!important;padding:20px!important}#pagina-curriculo .cv-purple-hero .cv85-score{justify-self:start!important}#pagina-curriculo .cv-purple-hero h2{font-size:28px!important}}

/* Cartes de même hauteur, champs seuls défilants, flèches accessibles. */
#cvResumeWizard.cv-wizard{height:620px!important;min-height:0!important;align-items:stretch!important}
#cvResumeWizard.cv-wizard>.cv86-editor{height:100%!important;overflow:hidden!important;padding:0!important}
#cvResumeWizard #curriculoOnlineV84{height:100%!important;display:flex!important;flex-direction:column!important;box-sizing:border-box!important;min-height:0!important;padding:20px!important;overflow:hidden!important}
#cvResumeWizard .cv-step-nav{flex:0 0 auto!important;margin:0 0 12px!important;padding-bottom:12px!important}
#cvResumeWizard .cv-fields-frame{position:relative;flex:1 1 auto;min-height:0;padding:20px 0 28px;box-sizing:border-box;overflow:hidden}
#cvResumeWizard .cv-fields-viewport{height:100%;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;overscroll-behavior:contain;padding:0 4px;box-sizing:border-box;outline-offset:-2px}
#cvResumeWizard .cv-fields-viewport::-webkit-scrollbar{display:none}
#cvResumeWizard .cv-scroll-arrow{position:absolute;left:50%;transform:translateX(-50%);z-index:3;width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:50%;background:#7540ae;color:white;cursor:pointer;padding:7px;box-shadow:0 3px 12px #51258a25}
#cvResumeWizard .cv-scroll-arrow svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
#cvResumeWizard .cv-scroll-up{top:0}#cvResumeWizard .cv-scroll-down{bottom:0}
#cvResumeWizard .cv-scroll-arrow:disabled{background:#f1eafa;color:#a292b5;box-shadow:none;cursor:default}
#cvResumeWizard .cv-fields-frame:before,#cvResumeWizard .cv-fields-frame:after{content:'';position:absolute;left:0;right:0;height:30px;pointer-events:none;z-index:2;opacity:0}
#cvResumeWizard .cv-fields-frame:before{top:20px;background:linear-gradient(#fff,transparent)}#cvResumeWizard .cv-fields-frame:after{bottom:28px;background:linear-gradient(transparent,#fff)}#cvResumeWizard .cv-more-above:before,#cvResumeWizard .cv-more-below:after{opacity:1}
#cvResumeWizard .cv-wizard-actions{flex:0 0 auto;margin-top:10px!important;background:#fff;padding-top:14px!important}
#cvResumeWizard.cv-wizard>.cv-context-guide{height:100%!important;max-height:none!important;align-self:stretch!important;padding:22px!important;position:static!important;overflow:hidden!important}
#cvResumeWizard .cv-context-guide h2{font-size:23px!important}.cv-context-guide p{font-size:13px!important;line-height:1.7!important}
#cvResumeWizard .cv85-footer{flex:0 0 auto;margin:10px 0 0!important;padding:12px 0!important}#cvResumeWizard .cv85-footer>div:first-child{display:none!important}
#cvResumeWizard .curriculo-status-v84{flex:0 0 auto;font-size:12px!important;margin:4px 0!important}
#pagina-curriculo .cv-purple-hero{min-height:0!important;padding:20px 30px!important;margin-bottom:18px!important}#pagina-curriculo .cv-purple-hero h2{font-size:32px!important}#pagina-curriculo .cv-purple-hero .cv85-kicker{margin-top:12px!important}#pagina-curriculo .cv-purple-hero .cv85-score{width:110px!important;height:110px!important}
@media(max-width:760px){#cvResumeWizard.cv-wizard{height:650px!important;grid-template-columns:1fr!important}#cvResumeWizard.cv-wizard>.cv86-editor{height:100%!important;overflow:hidden!important}#cvResumeWizard.cv-wizard>.cv-context-guide{display:none!important}#cvResumeWizard .cv-step-nav{gap:4px!important}#cvResumeWizard .cv-step-nav button{padding:4px!important;font-size:11px!important}#cvResumeWizard #curriculoOnlineV84{padding:16px!important}}

/* Guia horizontal acima do formulário e etapas em uma linha. */
#cvResumeWizard.cv-wizard{height:auto!important;display:flex!important;flex-direction:column!important;gap:16px!important}
#cvResumeWizard.cv-wizard>.cv-context-guide{order:-1!important;display:grid!important;grid-template-columns:minmax(190px,.8fr) minmax(0,1.4fr) minmax(190px,.8fr)!important;grid-template-rows:auto auto!important;gap:6px 24px!important;padding:18px 24px!important;border-left:5px solid #9860ee!important;height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important;width:100%!important;box-sizing:border-box!important;border-radius:10px!important;align-items:center!important}
#cvResumeWizard .cv-context-guide>small{grid-column:1;grid-row:1;font-size:10px!important}
#cvResumeWizard .cv-context-guide h2{grid-column:1;grid-row:2;font-size:19px!important;margin:0!important;line-height:1.35!important}
#cvResumeWizard .cv-context-guide>p{grid-column:2;grid-row:1/3;padding-left:22px;border-left:1px solid #d9c9ee;font-size:13px!important;line-height:1.7!important}
#cvResumeWizard .cv-guide-tip{grid-column:3;grid-row:1/3;margin:0!important;padding:12px 15px!important;background:#ffffff65!important;border:1px solid #d9c9ee!important;border-radius:8px!important}
#cvResumeWizard .cv-guide-tip strong{display:none!important}#cvResumeWizard .cv-guide-tip p{font-size:12px!important;line-height:1.6!important}
#cvResumeWizard .cv-guide-match{display:none!important}
#cvResumeWizard.cv-wizard>.cv86-editor{width:100%!important;height:610px!important;min-height:0!important;overflow:hidden!important}
#cvResumeWizard #curriculoOnlineV84{padding:22px 26px!important}
#cvResumeWizard .cv-step-nav{display:flex!important;flex-wrap:nowrap!important;gap:6px!important;overflow-x:auto!important;scrollbar-width:none!important;padding:0 0 14px!important;margin:0 0 12px!important}
#cvResumeWizard .cv-step-nav::-webkit-scrollbar{display:none}
#cvResumeWizard .cv-step-nav button{flex:1 0 auto!important;white-space:nowrap!important;gap:6px!important;padding:8px 5px!important;font-size:11px!important}
#cvResumeWizard .cv-step-nav span{width:26px!important;height:26px!important;flex-basis:26px!important}
#cvResumeWizard .curriculo-grid-v84{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:15px 20px!important}
#cvResumeWizard .curriculo-full-v84{grid-column:1/-1!important}
#cvResumeWizard label:has(#cvRuaAligned),#cvResumeWizard label:has(#cvComplementoAligned){grid-column:span 2!important}
#cvResumeWizard label:has(#cvCidadePessoalV87){display:none!important}
#cvResumeWizard .cv-cep-status{grid-column:1/-1;margin:0;font:12px/1.5 Inter,Arial,sans-serif;color:#7540ae}
#pagina-curriculo .cv-purple-hero{padding:20px 28px!important;grid-template-columns:minmax(0,1fr) 150px!important;min-height:0!important;border-radius:12px!important}
#pagina-curriculo .cv-purple-hero h2{font-size:32px!important;margin-bottom:8px!important}#pagina-curriculo .cv-purple-hero .cv85-hero-copy p{font-size:13px!important}
@media(max-width:950px){#cvResumeWizard.cv-wizard>.cv-context-guide{grid-template-columns:minmax(160px,.8fr) minmax(0,1.3fr)!important}#cvResumeWizard .cv-guide-tip{grid-column:1/-1;grid-row:3;padding:10px!important}#cvResumeWizard .curriculo-grid-v84{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:600px){#cvResumeWizard.cv-wizard>.cv-context-guide{grid-template-columns:1fr!important;padding:16px!important;gap:8px!important}#cvResumeWizard .cv-context-guide>small{grid-column:1;grid-row:1}#cvResumeWizard .cv-context-guide h2{grid-column:1;grid-row:2}#cvResumeWizard .cv-context-guide>p{grid-column:1;grid-row:3;border:0;padding:0}#cvResumeWizard .cv-guide-tip{grid-column:1;grid-row:4}#cvResumeWizard .curriculo-grid-v84{grid-template-columns:1fr!important}#cvResumeWizard label:has(#cvRuaAligned),#cvResumeWizard label:has(#cvComplementoAligned){grid-column:auto!important}#cvResumeWizard.cv-wizard>.cv86-editor{height:650px!important}#cvResumeWizard #curriculoOnlineV84{padding:16px!important}#pagina-curriculo .cv-purple-hero{grid-template-columns:1fr!important}}

/* Etapa inteira visível; apenas a página rola. */
#cvResumeWizard.cv-wizard,#cvResumeWizard.cv-wizard>.cv86-editor,#cvResumeWizard #curriculoOnlineV84{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
#cvResumeWizard .cv-fields-frame{flex:none!important;height:auto!important;min-height:0!important;overflow:visible!important;padding:0!important}
#cvResumeWizard .cv-fields-viewport{height:auto!important;max-height:none!important;overflow:visible!important;padding:0!important}
#cvResumeWizard .cv-scroll-arrow,#cvResumeWizard .cv-fields-frame:before,#cvResumeWizard .cv-fields-frame:after{display:none!important}

#cvResumeWizard #cvExperienciasV84 .experiencia-v84{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px 20px!important;align-items:start!important}
#cvResumeWizard .experiencia-v84>.curriculo-remover-v84{grid-column:1/-1;justify-self:end}
#cvResumeWizard .experiencia-v84>label:has(.e1),#cvResumeWizard .experiencia-v84>label:has(.e2),#cvResumeWizard .experiencia-v84>label:has(.e3),#cvResumeWizard .experiencia-v84>label:has(.e4){grid-column:span 1!important}
#cvResumeWizard .experiencia-v84>label:has(.e2){grid-column:span 2!important}
#cvResumeWizard .experiencia-v84>label:has(.e4){grid-column:span 2!important}
#cvResumeWizard .experiencia-v84>.cv-activities-wide{grid-column:1/3!important}#cvResumeWizard .experiencia-v84 textarea.e5{min-height:170px!important;width:100%!important;resize:vertical!important}
#cvResumeWizard .cv-role-duration{grid-column:3!important;background:#f6f0fd;border:1px solid #e4d7f1;border-radius:9px;padding:18px;box-sizing:border-box;color:#51258a;font:600 13px/1.5 Inter,Arial,sans-serif}
#cvResumeWizard .e-duration{display:block;font:700 22px/1.4 Inter,Arial,sans-serif;color:#7540ae;margin:14px 0}#cvResumeWizard .cv-role-duration small{display:block;font:12px/1.6 Inter,Arial,sans-serif}
@media(max-width:600px){#cvResumeWizard #cvExperienciasV84 .experiencia-v84{grid-template-columns:1fr!important}#cvResumeWizard .experiencia-v84>label,#cvResumeWizard .experiencia-v84>.cv-activities-wide,#cvResumeWizard .experiencia-v84>.cv-role-duration,#cvResumeWizard .experiencia-v84>label:has(.e2),#cvResumeWizard .experiencia-v84>label:has(.e4){grid-column:1!important}}

#cvResumeWizard .cv-current-role{display:flex!important;align-items:center;gap:9px;margin-top:10px;color:#7540ae;font:500 13px/1.5 Inter,Arial,sans-serif;cursor:pointer}
#cvResumeWizard .cv-current-role input.e-current{width:17px!important;height:17px!important;min-height:0!important;padding:0!important;margin:0!important;accent-color:#7540ae}
#cvResumeWizard input.e4:disabled{background:#f3eef9!important;color:#8c7c9c!important}

/* Experiências compactas: dois formulários por linha. */
#cvResumeWizard #cvExperienciasV84{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px!important;align-items:start!important}
#cvResumeWizard #cvExperienciasV84 .experiencia-v84{width:100%!important;min-width:0!important;margin:0!important;padding:18px!important;box-sizing:border-box!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;border:1px solid #e1d9eb!important;border-radius:12px!important;background:#faf9fc!important}
#cvResumeWizard #cvExperienciasV84 .experiencia-v84>label:has(.e1),#cvResumeWizard #cvExperienciasV84 .experiencia-v84>label:has(.e2),#cvResumeWizard #cvExperienciasV84 .experiencia-v84>label:has(.e3),#cvResumeWizard #cvExperienciasV84 .experiencia-v84>label:has(.e4){grid-column:span 1!important;min-width:0!important}
#cvResumeWizard #cvExperienciasV84 .experiencia-v84>.cv-activities-wide,#cvResumeWizard #cvExperienciasV84 .experiencia-v84>.cv-role-duration{grid-column:1/-1!important}
#cvResumeWizard #cvExperienciasV84 textarea.e5{min-height:155px!important}
#cvResumeWizard #cvExperienciasV84 .cv-role-duration{padding:13px 15px!important}#cvResumeWizard #cvExperienciasV84 .e-duration{font-size:19px!important;margin:8px 0!important}
#cvResumeWizard .cv85-section{outline:none!important;box-shadow:none!important}
@media(max-width:800px){#cvResumeWizard #cvExperienciasV84{grid-template-columns:1fr!important}}

#cvResumeWizard label:has(#cvExperienciaAligned){display:none!important}

#cvResumeWizard #cvExperienciasV84 .cv-results-extra{grid-column:1/-1!important}#cvResumeWizard .cv-results-extra textarea{min-height:95px!important}

/* Campos alinhados e controles sem corte de texto. */
#cvResumeWizard .curriculo-grid-v84{align-items:start!important}
#cvResumeWizard .curriculo-campo-v84 .cv85-opcional{display:inline!important;font:400 10px/1.4 Inter,Arial,sans-serif!important;margin:0 0 0 5px!important;padding:0!important;vertical-align:baseline!important}
#cvResumeWizard .curriculo-campo-v84 input,#cvResumeWizard .curriculo-campo-v84 select{height:44px!important;min-height:44px!important;line-height:20px!important;padding-top:11px!important;padding-bottom:11px!important}
#cvResumeWizard .curriculo-campo-v84 select{padding-right:32px!important;text-overflow:clip!important}
#cvResumeWizard .cv-wizard-actions button,#cvResumeWizard .curriculo-acoes-v84 button,#cvResumeWizard .cv85-section-action button{height:auto!important;min-height:42px!important;width:auto!important;max-width:none!important;overflow:visible!important;text-overflow:clip!important;white-space:normal!important;line-height:1.5!important;padding:10px 18px!important;box-sizing:border-box!important;flex-shrink:0!important}
#cvResumeWizard .cv-step-nav button,#cvResumeWizard .cv-step-nav button strong{height:auto!important;overflow:visible!important;text-overflow:clip!important;line-height:1.5!important;max-width:none!important}
#cvResumeWizard .cv-step-nav button strong{font-weight:600!important}

#cvResumeWizard .formacao-v84{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important;padding:20px!important;border:1px solid #e1d9eb!important;border-radius:12px!important;background:#faf9fc!important}
#cvResumeWizard .formacao-v84>.curriculo-remover-v84{grid-column:1/-1;justify-self:end}
#cvResumeWizard .formacao-v84 label{font:600 13px/1.5 Inter,Arial,sans-serif;color:#302141;min-width:0}
#cvResumeWizard .formacao-v84 label small{display:block;font:400 11px/1.5 Inter,Arial,sans-serif;margin:4px 0;color:#887698}
#cvResumeWizard .cv-school-tip{grid-column:1/-1;margin:0;padding:14px;background:#f1eafa;border-radius:8px;color:#654582;font:13px/1.7 Inter,Arial,sans-serif}
@media(max-width:600px){#cvResumeWizard .formacao-v84{grid-template-columns:1fr!important}}

/* Identidade profissional em Montserrat. */
#pagina-curriculo #cvResumeWizard,#pagina-curriculo #cvResumeWizard input,#pagina-curriculo #cvResumeWizard select,#pagina-curriculo #cvResumeWizard textarea,#pagina-curriculo #cvResumeWizard button,#pagina-curriculo #cvResumeWizard label,#pagina-curriculo #cvResumeWizard p,#pagina-curriculo #cvResumeWizard small,#pagina-curriculo #cvResumeWizard strong,#pagina-curriculo #cvResumeWizard h2,#pagina-curriculo #cvResumeWizard h3,#pagina-curriculo .cv-purple-hero *{font-family:Montserrat,Arial,sans-serif!important}
#cvResumeWizard .cv85-section-head h3{font-weight:750!important}#cvResumeWizard .cv-entry-title{grid-column:1/-1;font-size:16px;color:#1c2147;font-weight:700;padding-bottom:4px}#cvResumeWizard .experiencia-v84>label,#cvResumeWizard .formacao-v84>label{font-weight:600!important}
#cvResumeWizard .cv-date-control{display:block;position:relative}#cvResumeWizard .cv-date-control input{padding-right:38px!important}#cvResumeWizard .cv-date-control svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;fill:none;stroke:#8870ae;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
#cvResumeWizard .cv-professional-assistant{grid-column:1/-1;position:relative;display:flex;align-items:flex-start;gap:12px;margin:8px 0;max-width:510px;box-sizing:border-box}
#cvResumeWizard .cv-professional-assistant[hidden]{display:none!important}#cvResumeWizard .cv-helper-symbol{width:44px;height:44px;flex:0 0 44px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#9860ee,#51258a);color:white;font:700 32px Montserrat,Arial,sans-serif;box-shadow:0 3px 12px #7540ae25}
#cvResumeWizard .cv-helper-card{position:relative;flex:1;min-width:0;background:white;border:1px solid #cfb8ef;border-radius:10px;padding:18px;box-shadow:0 4px 18px #7540ae13}
#cvResumeWizard .cv-helper-card>small{display:block;font-size:9px;letter-spacing:.7px;color:#7540ae;margin-bottom:10px}#cvResumeWizard .cv-helper-card>strong{display:block;font-size:15px;line-height:1.5;color:#1c2147;font-weight:700}#cvResumeWizard .cv-helper-copy{font-size:12px;line-height:1.7;color:#4b4162;margin:8px 0 13px}
#cvResumeWizard .cv-helper-close{position:absolute;right:8px;top:5px;border:0;background:transparent;color:#8870ae;font-size:22px;padding:0 5px;cursor:pointer}
#cvResumeWizard .cv-helper-buttons{display:flex;gap:10px;flex-wrap:wrap}#cvResumeWizard .cv-helper-buttons button{height:auto;min-height:36px;border:1px solid #d3beed;border-radius:7px;padding:8px 13px;background:white;color:#7540ae;font-size:11px;font-weight:650;cursor:pointer}#cvResumeWizard .cv-helper-buttons .cv-helper-example{background:#7540ae;color:white;border-color:#7540ae}
#cvResumeWizard .cv-helper-card footer{margin-top:12px;border-top:1px solid #eee7f5;padding-top:9px;font-size:10px;color:#9382a5}#cvResumeWizard .cv-helper-example-text{font-size:12px;line-height:1.7;background:#f6f0fd;padding:12px;border-radius:7px;color:#654582;white-space:pre-line}
@media(max-width:500px){#cvResumeWizard .cv-professional-assistant{gap:8px}#cvResumeWizard .cv-helper-symbol{width:32px;height:32px;flex-basis:32px;font-size:25px}#cvResumeWizard .cv-helper-card{padding:14px}}

#cvResumeWizard label:has(#cvEscolaridadeAligned){display:none!important}
#cvResumeWizard .formacao-v84 input,#cvResumeWizard .formacao-v84 select{height:44px!important;min-height:44px!important;margin-top:6px!important;box-sizing:border-box!important}
#cvResumeWizard .formacao-v84 .cv-manual-course-card{border:1px solid #e3d7f0;background:#f6f0fd;border-radius:8px;padding:10px 12px;margin-top:10px;font-size:11px;color:#7540ae}
#cvResumeWizard .cv-manual-course-card strong{display:inline;font-size:11px}#cvResumeWizard .cv-manual-course-card button{border:0;background:transparent;color:#7540ae;font:600 11px Montserrat,Arial,sans-serif;padding:4px 8px;cursor:pointer}#cvResumeWizard .cv-manual-course[hidden]{display:none!important}

#pagina-curriculo #cvResumeWizard .cv85-section[hidden]{display:none!important}
#pagina-curriculo #cvResumeWizard .cv85-section:not([hidden]){display:block!important}
#pagina-curriculo #cvResumeWizard .cv85-footer[hidden]{display:none!important}
#pagina-curriculo #cvResumeWizard .cv-entry-title{display:block!important;font-weight:750!important;color:#171d43!important}
#pagina-curriculo #cvResumeWizard .cv85-section-head h3{font-weight:750!important;color:#171d43!important}
#pagina-curriculo #cvResumeWizard .cv85-number{display:grid!important;place-items:center!important;border-radius:9px!important;background:#f1eafa!important;font-weight:700!important}

#pagina-curriculo #cvResumeWizard .cv-professional-field{position:relative;display:block;width:100%;margin-top:6px}
#pagina-curriculo #cvResumeWizard .cv-professional-field>svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;fill:none;stroke:#8666a9;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none;z-index:1}
#pagina-curriculo #cvResumeWizard .cv-professional-field>input,#pagina-curriculo #cvResumeWizard .cv-professional-field>select{padding-left:39px!important;margin-top:0!important}
#pagina-curriculo #cvResumeWizard .cv-entry-title{display:flex!important;align-items:center;gap:10px;margin-bottom:7px;font-family:Montserrat,Arial,sans-serif!important;font-weight:750!important}
#pagina-curriculo #cvResumeWizard .cv-entry-title svg{width:22px;height:22px;fill:none;stroke:#7540ae;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#pagina-curriculo #cvResumeWizard .cv-date-control svg{display:block!important;width:19px!important;height:19px!important;stroke:#7540ae!important;stroke-width:1.8!important}
`;document.head.appendChild(style);
 window.addEventListener('load',function(){setTimeout(setup,1200)},{once:true});
})();

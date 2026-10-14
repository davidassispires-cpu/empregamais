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
var map={cvNomeV87:"nome",cvTelefoneV87:"telefone",cvEmailV87:"email",cvCidadePessoalV87:"cidade",cvEnderecoV87:"endereco",cvObjetivoV84:"objetivo",cvAreaV84:"area",cvResumoV84:"resumo",cvHabilidadesV84:"habilidades",cvIdiomasV84:"idiomas",cvComplementaresV84:"complementares",cvModalidadeV85:"modalidade",cvCidadeV85:"cidadePreferida",cvSalarioV85:"pretensao",cvDisponibilidadeV85:"disponibilidade",cvLinkedinV85:"linkedin",cvPortfolioV85:"portfolio",cvEscolaridadeAligned:"escolaridade",cvExperienciaAligned:"tempoExperiencia",cvContratoAligned:"contrato",cvJornadaAligned:"jornada",cvEstadoAligned:"uf",cvCepAligned:"cep",cvRuaAligned:"logradouro",cvBairroAligned:"bairro",cvCidadeAddress:"cidadeResidencial",cvUfAddress:"ufResidencial",cvNumeroAligned:"numero",cvComplementoAligned:"complemento",cvLatitudeAligned:"latitude",cvLongitudeAligned:"longitude"};
function row(kind,data){var div=document.createElement("div");div.className=kind==="experience"?"curriculo-item-v84 experiencia-v84":"curriculo-item-v84 formacao-v84";var remove=document.createElement("button");remove.type="button";remove.textContent="Remover";remove.className="curriculo-remover-v84";remove.onclick=function(){div.remove();};div.appendChild(remove);var fields=kind==="experience"?[["Empresa","empresa","e1"],["Cargo","cargo","e2"],["Início","inicio","e3"],["Fim","fim","e4"],["Atividades","atividades","e5"]]:[["Instituição","instituicao","f1"],["Curso","curso","f2"],["Nível","nivel","f3"],["Situação","status","f4"]];fields.forEach(function(f){var label=document.createElement("label");label.textContent=f[0];var input=document.createElement(f[1]==="atividades"?"textarea":"input");input.className=f[2];input.value=data[f[1]]||"";label.appendChild(input);div.appendChild(label);});return div;}
function restore(){if(!email()||!el("curriculoOnlineV84"))return;var cv=get();Object.keys(map).forEach(function(id){var input=el(id);if(input)input.value=cv[map[id]]||"";});if(el("cvHabilidadesV84"))el("cvHabilidadesV84").value=cv.habilidades||cv.competencias||"";if(el("cvModalidadeV85"))el("cvModalidadeV85").value=cv.modalidade||(cv.modalidades||[])[0]||"";if(el("cvCursosV84"))el("cvCursosV84").value=Array.isArray(cv.cursos)?cv.cursos.map(function(c){return [c.nome,c.instituicao,c.conclusao].filter(Boolean).join(" — ");}).join("\n"):cv.cursos||"";
[["cvExperienciasV84","experience",cv.experiencias],["cvFormacoesV84","education",cv.formacoes]].forEach(function(item){var box=el(item[0]);if(!box)return;box.replaceChildren();(item[2]&&item[2].length?item[2]:[{}]).forEach(function(data){box.appendChild(row(item[1],data));});});
if(window.EmpregaMaisAtualizarPreviewCurriculoV86)window.EmpregaMaisAtualizarPreviewCurriculoV86();var status=el("cvStatusV84");if(status&&Object.keys(cv).length)status.textContent="Currículo recuperado da sua conta.";
}
function collect(){var cv=get();Object.keys(map).forEach(function(id){var input=el(id);if(input)cv[map[id]]=input.value.trim();});var courses=el("cvCursosV84");if(courses&&(!Array.isArray(cv.cursos)||courses.value!==cv.cursos.map(function(c){return [c.nome,c.instituicao,c.conclusao].filter(Boolean).join(" — ");}).join("\n")))cv.cursos=courses.value;cv.experiencias=Array.from(document.querySelectorAll("#cvExperienciasV84 .experiencia-v84")).map(function(r){var out={};[["empresa","e1"],["cargo","e2"],["inicio","e3"],["fim","e4"],["atividades","e5"]].forEach(function(f){out[f[0]]=r.querySelector("."+f[1])?.value||"";});return out;});cv.formacoes=Array.from(document.querySelectorAll("#cvFormacoesV84 .formacao-v84")).map(function(r){var out={};[["instituicao","f1"],["curso","f2"],["nivel","f3"],["status","f4"]].forEach(function(f){out[f[0]]=r.querySelector("."+f[1])?.value||"";});return out;});cv.atualizadoEm=new Date().toISOString();return cv;}
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
  var line=document.createElement('p');line.className='cv-summary-match';line.textContent=[value('cvAreaV84'),value('cvEscolaridadeAligned'),value('cvExperienciaAligned'),value('cvModalidadeV85'),value('cvCidadeV85'),value('cvEstadoAligned'),value('cvContratoAligned'),value('cvJornadaAligned')].filter(Boolean).join(' · ');target.appendChild(line);
 }
 function show(n){
  current=Math.max(0,Math.min(steps.length-1,n));var editor=ws.querySelector('.cv86-editor');if(editor)editor.scrollTop=0;steps.forEach(function(step,i){step.hidden=i!==current});ws.querySelectorAll('.cv-step-nav button').forEach(function(button,i){button.setAttribute('aria-current',i===current?'step':'false');button.classList.toggle('complete',i<current)});
  var g=guide[current];el('cvGuideTitle').textContent=g[1];el('cvGuideCopy').textContent=g[2];el('cvGuideExample').textContent=g[3];el('cvStepCounter').textContent='Etapa '+(current+1)+' de '+steps.length;el('cvWizardBack').disabled=current===0;el('cvWizardNext').hidden=current===steps.length-1;
  var footer=cv.querySelector('.cv85-footer');if(footer)footer.hidden=current!==steps.length-1;if(current===steps.length-1)summary();
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
   var promise=(async function(){var controller=new AbortController(),timeout=setTimeout(function(){controller.abort()},12000);try{var response=await fetch('https://brasilapi.com.br/api/cep/v2/'+code,{signal:controller.signal});if(!response.ok)throw Error(response.status===404?'CEP não encontrado. Confira o número informado.':'Não foi possível consultar o CEP. Tente novamente.');var data=await response.json();if(own!==requestId||cep.value.replace(/\D/g,'')!==code)return;
    el('cvRuaAligned').value=data.street||'';el('cvBairroAligned').value=data.neighborhood||'';el('cvCidadeAddress').value=data.city||'';el('cvUfAddress').value=data.state||'';
    var coordinates=data.location&&data.location.coordinates||{},lat=Number.parseFloat(coordinates.latitude),lng=Number.parseFloat(coordinates.longitude);el('cvLatitudeAligned').value=Number.isFinite(lat)?lat:'';el('cvLongitudeAligned').value=Number.isFinite(lng)?lng:'';compose();lookedUp=code;cepStatus.textContent='CEP localizado. Confira o endereço e informe o número.';cv.dispatchEvent(new Event('change',{bubbles:true}));
   }catch(error){if(own!==requestId)return;cepStatus.textContent=error.name==='AbortError'?'A consulta demorou demais. Tente novamente.':error.message;throw Error(cepStatus.textContent)}finally{clearTimeout(timeout);if(own===requestId)pending=null}})();pending={code:code,promise:promise};return promise;
  }
  cep.addEventListener('input',function(){clearTimeout(timer);++requestId;pending=null;lookedUp='';cep.setCustomValidity('');el('cvLatitudeAligned').value='';el('cvLongitudeAligned').value='';cep.value=cep.value.replace(/\D/g,'').slice(0,8).replace(/^(\d{5})(\d)/,'$1-$2');cepStatus.textContent='';if(cep.value.replace(/\D/g,'').length===8)timer=setTimeout(function(){lookup().catch(function(){})},300)});
  cep.addEventListener('blur',function(){if(cep.value.replace(/\D/g,'').length===8)lookup().catch(function(){})});
  addressGrid.addEventListener('input',function(event){if(event.target.id!=='cvCepAligned')compose()});
  window.emResolveResumeCep=async function(){await lookup();if(cep.value.replace(/\D/g,'')!==lookedUp)throw Error('Confirme o CEP antes de salvar.');compose()};
  var originalRestore=window.EmpregaMaisRestaurarCurriculo;if(originalRestore)originalRestore();
  if(!cep.value&&typeof window.obterCandidatoAtual==='function'){var existing=window.obterCandidatoAtual()||{};cep.value=existing.cep||'';}
  ['cvNomeV87','cvEmailV87','cvObjetivoV84','cvAreaV84'].forEach(function(id){if(el(id))el(id).required=true});
  var save=el('cvSalvarV84');save.addEventListener('click',function(event){var invalid=cv.querySelector(':invalid');if(invalid){event.preventDefault();event.stopImmediatePropagation();show(steps.findIndex(function(step){return step.contains(invalid)}));invalid.reportValidity()}},true);
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
`;document.head.appendChild(style);
 window.addEventListener('load',function(){setTimeout(setup,1200)},{once:true});
})();

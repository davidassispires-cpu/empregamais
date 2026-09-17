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
var ok=0,total=ids.length+2;ids.forEach(function(id){var e=document.getElementById(id);if(e&amp;&amp;String(e.value).trim())ok++});
if(document.querySelector(".experiencia-v84 input")&amp;&amp;document.querySelector(".experiencia-v84 input").value.trim())ok++;
if(document.querySelector(".formacao-v84 input")&amp;&amp;document.querySelector(".formacao-v84 input").value.trim())ok++;
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
function esc(v){return String(v||"").replace(/&amp;/g,"&amp;amp;").replace(/&lt;/g,"&amp;lt;").replace(/&gt;/g,"&amp;gt;")}
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
return "&lt;div class='cv86-paper-name'&gt;"+esc(nome())+"&lt;/div&gt;"+
"&lt;div class='cv86-paper-role'&gt;"+esc(txt("cvObjetivoV84")||"Seu objetivo profissional")+"&lt;/div&gt;"+
"&lt;div class='cv86-paper-contact'&gt;"+esc(txt("cvCidadeV85")||"Cidade / UF")+(txt("cvModalidadeV85")?" · "+esc(txt("cvModalidadeV85")):"")+"&lt;/div&gt;"+
"&lt;h4&gt;Resumo profissional&lt;/h4&gt;&lt;p class='"+(resumo?"":"cv86-empty")+"'&gt;"+esc(resumo||"Seu resumo profissional aparecerá aqui conforme você preencher.")+"&lt;/p&gt;"+
(ex.length?"&lt;h4&gt;Experiência profissional&lt;/h4&gt;"+ex.map(function(x){return"&lt;div class='cv86-entry'&gt;&lt;b&gt;"+esc(x.cargo||"Cargo")+(x.empresa?" — "+esc(x.empresa):"")+"&lt;/b&gt;&lt;small&gt;"+esc(x.inicio)+(x.inicio||x.fim?" a ":"")+esc(x.fim||((x.inicio)?"Atual":""))+"&lt;/small&gt;&lt;p&gt;"+esc(x.atividades)+"&lt;/p&gt;&lt;/div&gt;"}).join(""):"")+
(fo.length?"&lt;h4&gt;Formação acadêmica&lt;/h4&gt;"+fo.map(function(x){return"&lt;div class='cv86-entry'&gt;&lt;b&gt;"+esc(x.curso||"Formação")+"&lt;/b&gt;&lt;small&gt;"+esc(x.instituicao)+(x.nivel?" · "+esc(x.nivel):"")+(x.status?" · "+esc(x.status):"")+"&lt;/small&gt;&lt;/div&gt;"}).join(""):"")+
(hab?"&lt;h4&gt;Habilidades&lt;/h4&gt;&lt;p&gt;"+esc(hab)+"&lt;/p&gt;":"")+(cursos?"&lt;h4&gt;Cursos e certificações&lt;/h4&gt;&lt;p&gt;"+esc(cursos)+"&lt;/p&gt;":"")+(idi?"&lt;h4&gt;Idiomas&lt;/h4&gt;&lt;p&gt;"+esc(idi)+"&lt;/p&gt;":"")+(comp?"&lt;h4&gt;Informações complementares&lt;/h4&gt;&lt;p&gt;"+esc(comp)+"&lt;/p&gt;":"");
}
function atualizar(){var p=q("cvPreviewPaperV86");if(p)p.innerHTML=corpo();var m=q("cvModalPaperV86");if(m)m.innerHTML=corpo()}
function montar(){
var cv=q("curriculoOnlineV84");if(!cv||q("cvWorkspaceV86"))return;
var parent=cv.parentNode,ws=document.createElement("div");ws.id="cvWorkspaceV86";ws.className="cv86-workspace";
parent.insertBefore(ws,cv);var editor=document.createElement("div");editor.className="cv86-editor";ws.appendChild(editor);editor.appendChild(cv);
var side=document.createElement("aside");side.className="cv86-preview-col";side.innerHTML="&lt;div class='cv86-preview-shell'&gt;&lt;div class='cv86-preview-top'&gt;&lt;div class='cv86-preview-title'&gt;&lt;span&gt;PRÉVIA EM TEMPO REAL&lt;/span&gt;&lt;strong&gt;Seu currículo&lt;/strong&gt;&lt;/div&gt;&lt;button class='cv86-eye' id='cvEyeV86' title='Visualizar currículo' type='button'&gt;◉&lt;/button&gt;&lt;/div&gt;&lt;div class='cv86-paper-wrap'&gt;&lt;div class='cv86-paper' id='cvPreviewPaperV86'&gt;&lt;/div&gt;&lt;/div&gt;&lt;p class='cv86-hint'&gt;A prévia é atualizada automaticamente enquanto você preenche.&lt;/p&gt;&lt;button class='cv86-open-full' id='cvOpenFullV86' type='button'&gt;Visualizar currículo completo&lt;/button&gt;&lt;/div&gt;";ws.appendChild(side);
var modal=document.createElement("div");modal.className="cv86-modal";modal.id="cvModalV86";modal.innerHTML="&lt;div class='cv86-modal-box'&gt;&lt;button class='cv86-modal-close' id='cvCloseV86' type='button'&gt;×&lt;/button&gt;&lt;div class='cv86-modal-paper' id='cvModalPaperV86'&gt;&lt;/div&gt;&lt;/div&gt;";document.body.appendChild(modal);
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
ids.forEach(function(id){var el=document.getElementById(id);if(el&amp;&amp;d[id])el.value=d[id]});
var em=document.getElementById("cvEmailV87");if(em&amp;&amp;!em.value)em.value=emailSessao();
try{
var ls=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]"),c=ls.find(function(x){return String(x.email||"").toLowerCase()===emailSessao()});
if(c){
var n=document.getElementById("cvNomeV87"),t=document.getElementById("cvTelefoneV87");
if(n&amp;&amp;!n.value)n.value=c.nome||c.nomeCompleto||"";
if(t&amp;&amp;!t.value)t.value=c.telefone||c.celular||"";
}
}catch(e){}
}
function salvar(){var d={};ids.forEach(function(id){var el=document.getElementById(id);if(el)d[id]=el.value});try{localStorage.setItem(key(),JSON.stringify(d))}catch(e){}}
function atualizarPreview(){
var paper=document.getElementById("cvPreviewPaperV86");if(!paper)return;
var nome=document.getElementById("cvNomeV87"),cidade=document.getElementById("cvCidadePessoalV87"),tel=document.getElementById("cvTelefoneV87"),em=document.getElementById("cvEmailV87");
var n=paper.querySelector(".cv86-paper-name");if(n&amp;&amp;nome&amp;&amp;nome.value.trim())n.textContent=nome.value.trim();
var c=paper.querySelector(".cv86-paper-contact");
if(c){
var partes=[];
if(cidade&amp;&amp;cidade.value.trim())partes.push(cidade.value.trim());
if(tel&amp;&amp;tel.value.trim())partes.push(tel.value.trim());
if(em&amp;&amp;em.value.trim())partes.push(em.value.trim());
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
if(window.innerWidth&lt;=1100)return;
var el=document.getElementById("cvWorkspaceV86");
if(!el)return;
var p=el.parentElement;
while(p &amp;&amp; p!==document.body){
var cs=window.getComputedStyle(p);
if((cs.overflowY==="hidden"||cs.overflowY==="auto"||cs.overflowY==="scroll") &amp;&amp; p.scrollHeight&lt;=p.clientHeight+5){
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
if(window.innerWidth&lt;=1100){resetV90();return;}
var wsRect=ws.getBoundingClientRect();
var pageTop=wsRect.top+window.scrollY;
var pageBottom=pageTop+ws.offsetHeight;
var naturalTop=pageTop;
var scroll=window.scrollY;
var topGap=18;
var sideHeight=Math.min(side.scrollHeight,window.innerHeight-topGap*2);
var desiredTop=scroll+topGap;
if(desiredTop&lt;=naturalTop){
resetV90();
return;
}
if(desiredTop+sideHeight&gt;=pageBottom){
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
function esc(v){return String(v==null?"":v).replace(/[&amp;&lt;&gt;"']/g,function(c){return{"&amp;":"&amp;amp;","&lt;":"&amp;lt;","&gt;":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c]})}
function norm(v){return String(v||"").trim().toLowerCase()}
function arr(k){try{var a=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function planoEmpresa(e){return e.plano_nome||e.planoNome||e.plano_id||e.plano||"Básico"}
function nomeEmpresa(e){return e.nome_fantasia||e.nomeFantasia||e.nome||e.razao_social||e.razaoSocial||"Empresa"}
function nomeCand(c){return c.nome||c.nomeCompleto||c.nome_completo||"Candidato"}
function emailCand(c){return c.email||"E-mail não informado"}
function premium(c){var p=norm(c.plano_candidato||c.planoCandidato||c.plano);if(!["premium","trimestral","semestral","anual"].includes(p))return false;var f=c.premium_valido_ate||c.premiumValidoAte||c.plano_valido_ate;if(f){var d=new Date(f);if(!isNaN(d)&amp;&amp;d&lt;Date.now())return false}return true}
function vagasEmpresa(e){var n=norm(nomeEmpresa(e)),cnpj=String(e.cnpj||"").replace(/\D/g,"");return vagas.filter(function(v){return norm(v.empresa||v.empresaNome||v.nomeEmpresa)===n||(cnpj&amp;&amp;String(v.cnpj||v.empresaCnpj||"").replace(/\D/g,"")===cnpj)})}
function iniciais(n){return n.split(/\s+/).slice(0,2).map(function(x){return x.charAt(0)}).join("").toUpperCase()||"?"}
function montar(){
var page=document.getElementById("pagina-painel-admin"),container=page&amp;&amp;page.querySelector(".container-dashboard");if(!container)return;
var old=document.getElementById("adminV91");if(old)old.remove();
var box=document.createElement("div");box.id="adminV91";box.className="admin91";
box.innerHTML="&lt;div class='admin91-top'&gt;&lt;div&gt;&lt;div class='admin91-eyebrow'&gt;ADMINISTRAÇÃO EMPREGAMAIS&lt;/div&gt;&lt;h1&gt;Central administrativa&lt;/h1&gt;&lt;p&gt;Empresas, candidatos e operação do portal reunidos em um único painel.&lt;/p&gt;&lt;/div&gt;&lt;div class='admin91-badge'&gt;ADMINISTRADOR&lt;/div&gt;&lt;/div&gt;"+
"&lt;nav class='admin91-nav'&gt;&lt;button class='ativo' data-v91='inicio'&gt;Visão geral&lt;/button&gt;&lt;button data-v91='empresas'&gt;Central das empresas&lt;/button&gt;&lt;button data-v91='candidatos'&gt;Central dos candidatos&lt;/button&gt;&lt;button class='operacional' data-v91='operacao'&gt;Operação do portal&lt;/button&gt;&lt;/nav&gt;"+
"&lt;div class='admin91-resumo'&gt;&lt;div class='admin91-metrica'&gt;&lt;small&gt;EMPRESAS&lt;/small&gt;&lt;strong id='a91Emp'&gt;0&lt;/strong&gt;&lt;span&gt;cadastradas&lt;/span&gt;&lt;/div&gt;&lt;div class='admin91-metrica'&gt;&lt;small&gt;CANDIDATOS&lt;/small&gt;&lt;strong id='a91Cand'&gt;0&lt;/strong&gt;&lt;span&gt;cadastrados&lt;/span&gt;&lt;/div&gt;&lt;div class='admin91-metrica'&gt;&lt;small&gt;VAGAS&lt;/small&gt;&lt;strong id='a91Vagas'&gt;0&lt;/strong&gt;&lt;span&gt;no portal&lt;/span&gt;&lt;/div&gt;&lt;div class='admin91-metrica'&gt;&lt;small&gt;PREMIUM&lt;/small&gt;&lt;strong id='a91Premium'&gt;0&lt;/strong&gt;&lt;span&gt;candidatos ativos&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='admin91-view ativa' data-view91='inicio'&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-section-head'&gt;&lt;div&gt;&lt;span&gt;ACESSO RÁPIDO&lt;/span&gt;&lt;h2&gt;O que você deseja gerenciar?&lt;/h2&gt;&lt;p&gt;As duas centrais concentram todas as informações de cada cadastro.&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class='admin91-quick'&gt;&lt;button data-go91='empresas'&gt;Central das empresas&lt;small&gt;Planos, vagas, assinatura, verificação e cadastro.&lt;/small&gt;&lt;/button&gt;&lt;button data-go91='candidatos'&gt;Central dos candidatos&lt;small&gt;Perfil, currículo e concessão de Premium.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='vagas'&gt;Vagas e aprovações&lt;small&gt;Gerencie as oportunidades publicadas.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='verificacoes'&gt;Verificações&lt;small&gt;Analise empresas aguardando validação.&lt;/small&gt;&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;&lt;/div&gt;"+
"&lt;div class='admin91-view' data-view91='empresas'&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-section-head'&gt;&lt;div&gt;&lt;span&gt;CENTRAL DAS EMPRESAS&lt;/span&gt;&lt;h2&gt;Empresas cadastradas&lt;/h2&gt;&lt;p&gt;Clique em uma empresa para abrir todas as informações em um único lugar.&lt;/p&gt;&lt;/div&gt;&lt;input class='admin91-search' id='a91BuscaEmp' placeholder='Buscar empresa ou CNPJ...' type='search'/&gt;&lt;/div&gt;&lt;div class='admin91-grid' id='a91EmpGrid'&gt;&lt;/div&gt;&lt;/section&gt;&lt;div class='admin91-detail' id='a91EmpDetail'&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='admin91-view' data-view91='candidatos'&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-section-head'&gt;&lt;div&gt;&lt;span&gt;CENTRAL DOS CANDIDATOS&lt;/span&gt;&lt;h2&gt;Candidatos cadastrados&lt;/h2&gt;&lt;p&gt;Consulte o cadastro e conceda acesso Premium quando desejar.&lt;/p&gt;&lt;/div&gt;&lt;input class='admin91-search' id='a91BuscaCand' placeholder='Buscar candidato ou e-mail...' type='search'/&gt;&lt;/div&gt;&lt;div class='admin91-grid' id='a91CandGrid'&gt;&lt;/div&gt;&lt;/section&gt;&lt;div class='admin91-detail' id='a91CandDetail'&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='admin91-view' data-view91='operacao'&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-section-head'&gt;&lt;div&gt;&lt;span&gt;OPERAÇÃO&lt;/span&gt;&lt;h2&gt;Ferramentas administrativas&lt;/h2&gt;&lt;p&gt;Acesse as funções operacionais já existentes no portal.&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class='admin91-quick'&gt;&lt;button data-old91='vagas'&gt;Vagas&lt;small&gt;Aprovação e gestão das oportunidades.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='verificacoes'&gt;Verificações&lt;small&gt;Validação das empresas.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='assinantes'&gt;Assinaturas de empresas&lt;small&gt;Planos pagos e vencimentos.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='planos'&gt;Planos de empresas&lt;small&gt;Liberação administrativa de planos.&lt;/small&gt;&lt;/button&gt;&lt;button data-old91='configuracoes'&gt;Configurações&lt;small&gt;Configurações administrativas.&lt;/small&gt;&lt;/button&gt;&lt;button data-publicar91='1'&gt;+ Publicar vaga&lt;small&gt;Publicação manual pelo administrador.&lt;/small&gt;&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;&lt;/div&gt;";
container.insertBefore(box,container.firstChild);
box.querySelectorAll("[data-v91],[data-go91]").forEach(function(b){b.onclick=function(){abrir(this.getAttribute("data-v91")||this.getAttribute("data-go91"))}});
box.querySelectorAll("[data-old91]").forEach(function(b){b.onclick=function(){var a=b.getAttribute("data-old91"),old=document.querySelector("#adminTabsPrincipaisEM [data-admin-tab-em='"+a+"']");if(old&amp;&amp;typeof abrirAbaAdminEM==="function"){box.style.display="none";document.getElementById("adminTabsPrincipaisEM").style.setProperty("display","flex","important");abrirAbaAdminEM(a,old);}}});
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
g.innerHTML=a.length?a.map(function(x,i){var vs=vagasEmpresa(x),at=vs.filter(function(v){return norm(v.status||"ativa")==="ativa"}).length,d=vs.filter(function(v){return v.destaque===true||String(v.destaque)==="true"}).length;return"&lt;article class='admin91-card' data-emp91='"+i+"'&gt;&lt;div class='admin91-card-top'&gt;&lt;div class='admin91-avatar'&gt;"+iniciais(nomeEmpresa(x))+"&lt;/div&gt;&lt;div&gt;&lt;h3&gt;"+esc(nomeEmpresa(x))+"&lt;/h3&gt;&lt;div class='sub'&gt;"+esc(x.cnpj||"CNPJ não informado")+"&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class='admin91-tags'&gt;&lt;span class='admin91-tag plano'&gt;"+esc(planoEmpresa(x))+"&lt;/span&gt;"+((x.verificada===true||norm(x.verificacao_status||x.verificacaoStatus)==="verificada")?"&lt;span class='admin91-tag ok'&gt;Verificada&lt;/span&gt;":"")+"&lt;/div&gt;&lt;div class='admin91-stats'&gt;&lt;div&gt;&lt;strong&gt;"+vs.length+"&lt;/strong&gt;&lt;span&gt;VAGAS&lt;/span&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+at+"&lt;/strong&gt;&lt;span&gt;ATIVAS&lt;/span&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+d+"&lt;/strong&gt;&lt;span&gt;DESTAQUES&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;&lt;/article&gt;"}).join(""):"&lt;div class='admin91-empty'&gt;Nenhuma empresa encontrada.&lt;/div&gt;";
g.querySelectorAll("[data-emp91]").forEach(function(c){c.onclick=function(){detEmp(a[Number(c.getAttribute("data-emp91"))])}});
}
function info(l,v){return"&lt;div class='admin91-info'&gt;&lt;small&gt;"+esc(l)+"&lt;/small&gt;&lt;strong&gt;"+esc(v||"—")+"&lt;/strong&gt;&lt;/div&gt;"}
function detEmp(x){
var v=document.querySelector("[data-view91='empresas']"),sec=v.querySelector(".admin91-section"),d=document.getElementById("a91EmpDetail"),vs=vagasEmpresa(x),at=vs.filter(function(z){return norm(z.status||"ativa")==="ativa"}).length;
sec.style.display="none";d.classList.add("ativa");d.innerHTML="&lt;button class='admin91-back' id='a91BackEmp'&gt;← Voltar para empresas&lt;/button&gt;&lt;div class='admin91-detail-head'&gt;&lt;div&gt;&lt;div class='admin91-eyebrow'&gt;EMPRESA&lt;/div&gt;&lt;h2&gt;"+esc(nomeEmpresa(x))+"&lt;/h2&gt;&lt;p&gt;"+esc(x.cnpj||"CNPJ não informado")+"&lt;/p&gt;&lt;/div&gt;&lt;div class='admin91-tags'&gt;&lt;span class='admin91-tag plano'&gt;"+esc(planoEmpresa(x))+"&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-info-grid'&gt;"+info("Razão social",x.razao_social||x.razaoSocial)+info("E-mail",x.email_corporativo||x.email)+info("Site",x.site)+info("Setor",x.setor)+info("Funcionários",x.funcionarios)+info("Plano atual",planoEmpresa(x))+info("Vagas cadastradas",vs.length)+info("Vagas ativas",at)+info("Validade do plano",x.plano_valido_ate||x.planoValidoAte)+"&lt;/div&gt;&lt;/section&gt;";
document.getElementById("a91BackEmp").onclick=function(){d.classList.remove("ativa");sec.style.display=""};window.scrollTo(0,0);
}
function renderCand(){
var g=document.getElementById("a91CandGrid");if(!g)return;
var q=norm((document.getElementById("a91BuscaCand")||{}).value);
var a=candidatos.filter(function(c){return norm(nomeCand(c)).includes(q)||norm(emailCand(c)).includes(q)});
g.innerHTML=a.length?a.map(function(c,i){return"&lt;article class='admin91-card' data-cand91='"+i+"'&gt;&lt;div class='admin91-card-top'&gt;&lt;div class='admin91-avatar'&gt;"+iniciais(nomeCand(c))+"&lt;/div&gt;&lt;div&gt;&lt;h3&gt;"+esc(nomeCand(c))+"&lt;/h3&gt;&lt;div class='sub'&gt;"+esc(emailCand(c))+"&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class='admin91-tags'&gt;"+(premium(c)?"&lt;span class='admin91-tag premium'&gt;Premium ativo&lt;/span&gt;":"&lt;span class='admin91-tag'&gt;Plano gratuito&lt;/span&gt;")+"&lt;/div&gt;&lt;div class='admin91-stats'&gt;&lt;div&gt;&lt;strong&gt;"+esc(c.cidade||c.cidadeUf||"—")+"&lt;/strong&gt;&lt;span&gt;LOCAL&lt;/span&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+(c.cargo||c.objetivo?"✓":"—")+"&lt;/strong&gt;&lt;span&gt;PERFIL&lt;/span&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+(premium(c)?"★":"—")+"&lt;/strong&gt;&lt;span&gt;PREMIUM&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;&lt;/article&gt;"}).join(""):"&lt;div class='admin91-empty'&gt;Nenhum candidato encontrado.&lt;/div&gt;";
g.querySelectorAll("[data-cand91]").forEach(function(el){el.onclick=function(){detCand(a[Number(el.getAttribute("data-cand91"))])}});
}
function detCand(c){
var v=document.querySelector("[data-view91='candidatos']"),sec=v.querySelector(".admin91-section"),d=document.getElementById("a91CandDetail"),fim=c.premium_valido_ate||c.premiumValidoAte||"";
sec.style.display="none";d.classList.add("ativa");d.innerHTML="&lt;button class='admin91-back' id='a91BackCand'&gt;← Voltar para candidatos&lt;/button&gt;&lt;div class='admin91-detail-head'&gt;&lt;div&gt;&lt;div class='admin91-eyebrow'&gt;CANDIDATO&lt;/div&gt;&lt;h2&gt;"+esc(nomeCand(c))+"&lt;/h2&gt;&lt;p&gt;"+esc(emailCand(c))+"&lt;/p&gt;&lt;/div&gt;&lt;div class='admin91-tags'&gt;"+(premium(c)?"&lt;span class='admin91-tag premium'&gt;Premium ativo&lt;/span&gt;":"&lt;span class='admin91-tag'&gt;Gratuito&lt;/span&gt;")+"&lt;/div&gt;&lt;/div&gt;&lt;section class='admin91-section'&gt;&lt;div class='admin91-info-grid'&gt;"+info("Nome",nomeCand(c))+info("E-mail",emailCand(c))+info("Telefone",c.telefone||c.celular)+info("Cidade",c.cidade||c.cidadeUf)+info("Cargo / objetivo",c.cargo||c.objetivo||c.cargoDesejado)+info("Plano",premium(c)?"Premium":"Gratuito")+info("Premium válido até",fim?new Date(fim).toLocaleDateString("pt-BR"):"—")+"&lt;/div&gt;&lt;div class='admin91-premium-box'&gt;&lt;h3&gt;Presentear com Premium&lt;/h3&gt;&lt;p&gt;Conceda ao candidato acesso a todos os recursos Premium. Nesta fase de desenvolvimento, a concessão é registrada no armazenamento do portal; quando conectarmos candidatos ao Supabase, ela passará a valer na conta em qualquer dispositivo.&lt;/p&gt;&lt;div class='admin91-premium-actions'&gt;&lt;label&gt;Duração&lt;select id='a91Duracao'&gt;&lt;option value='3'&gt;3 meses&lt;/option&gt;&lt;option value='6'&gt;6 meses&lt;/option&gt;&lt;option value='12'&gt;12 meses&lt;/option&gt;&lt;/select&gt;&lt;/label&gt;&lt;button class='admin91-gift' id='a91Gift'&gt;🎁 Conceder Premium&lt;/button&gt;"+(premium(c)?"&lt;button class='admin91-remove' id='a91Remove'&gt;Remover Premium&lt;/button&gt;":"")+"&lt;/div&gt;&lt;/div&gt;&lt;/section&gt;";
document.getElementById("a91BackCand").onclick=function(){d.classList.remove("ativa");sec.style.display=""};
document.getElementById("a91Gift").onclick=function(){darPremium(c,Number(document.getElementById("a91Duracao").value))};
var rm=document.getElementById("a91Remove");if(rm)rm.onclick=function(){removerPremium(c)};window.scrollTo(0,0);
}
function salvarCand(c){var ix=candidatos.findIndex(function(x){return norm(x.email)===norm(c.email)});if(ix&gt;=0)candidatos[ix]=c;localStorage.setItem("candidatosEmpregaMais",JSON.stringify(candidatos));document.getElementById("a91Premium").textContent=candidatos.filter(premium).length}
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
for(var i=0;i&lt;keys.length;i++){var v=ler(keys[i],true)||ler(keys[i],false);if(v&amp;&amp;v.indexOf("@")&gt;0)return norm(v)}
try{
var objs=["candidatoLogado","usuarioLogado","perfilCandidatoEmpregaMais"];
for(var j=0;j&lt;objs.length;j++){
var o=JSON.parse(ler(objs[j],true)||ler(objs[j],false)||"{}");
if(o&amp;&amp;o.email)return norm(o.email);
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
if(f){var d=new Date(f);if(!isNaN(d)&amp;&amp;d&lt;Date.now())return false}
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
b.innerHTML="&lt;div class='p92-left'&gt;&lt;div class='premium92-crown'&gt;★&lt;/div&gt;&lt;div&gt;&lt;small&gt;EMPREGAMAIS PREMIUM&lt;/small&gt;&lt;h3&gt;Seu acesso Premium está ativo&lt;/h3&gt;&lt;p&gt;Recursos avançados do candidato liberados para esta conta.&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class='premium92-validade'&gt;&lt;span&gt;ACESSO LIBERADO ATÉ&lt;/span&gt;&lt;strong&gt;"+dataBR(f)+"&lt;/strong&gt;&lt;/div&gt;";
var alvo=page.querySelector(".container-dashboard")||page.querySelector(".painel-candidato")||page.firstElementChild;
if(alvo)alvo.insertBefore(b,alvo.firstChild);
var head=page.querySelector(".painel-candidato-header,.dashboard-header,.perfil-resumo");
if(head&amp;&amp;!head.querySelector(".premium92-selo")){var sp=document.createElement("span");sp.className="premium92-selo";sp.textContent="★ PREMIUM";head.appendChild(sp)}
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
for(var i=0;i&lt;ks.length;i++){var v=sessionStorage.getItem(ks[i])||localStorage.getItem(ks[i]);if(v&amp;&amp;v.indexOf("@")&gt;0)return norm(v)}
return "";
}
function minhas(){
var em=email(),all=arr("candidaturasEmpregaMais").concat(arr("candidaturas"));
return all.filter(function(x){return norm(x.email||x.candidato_email||x.candidatoEmail)===em})
}
function visto(x){return x.visualizada===true||x.curriculo_visualizado===true||!!x.visualizado_em||!!x.visualizadoEm}
function status(x){return x.status_processo||x.statusProcesso||x.status||"Candidatura enviada"}
function aderencia(x){var n=Number(x.aderencia||x.percentual_aderencia||x.percentualAderencia);return isFinite(n)&amp;&amp;n&gt;0?Math.min(100,Math.round(n)):0}
function montar(){
var page=document.getElementById("pagina-painel-candidato");if(!page)return;
var old=document.getElementById("centralPremiumV93");if(old)old.remove();
var box=document.createElement("section");box.id="centralPremiumV93";
var alvo=page.querySelector(".container-dashboard")||page.querySelector(".painel-candidato")||page.firstElementChild;if(!alvo)return;
var banner=document.getElementById("premium92Banner");
if(banner&amp;&amp;banner.parentNode===alvo)banner.insertAdjacentElement("afterend",box);else alvo.insertBefore(box,alvo.firstChild);
render();
}
function render(){
var box=document.getElementById("centralPremiumV93");if(!box)return;
var a=minhas(),vis=a.filter(visto).length,processo=a.filter(function(x){var s=norm(status(x));return s!=="candidatura enviada"&amp;&amp;s!=="enviada"}).length,entrev=a.filter(function(x){return norm(status(x)).includes("entrevista")}).length,max=a.reduce(function(m,x){return Math.max(m,aderencia(x))},0);
box.innerHTML="&lt;div class='cp93-head'&gt;&lt;div&gt;&lt;small&gt;CENTRAL PREMIUM&lt;/small&gt;&lt;h2&gt;Inteligência da sua busca por emprego&lt;/h2&gt;&lt;p&gt;Acompanhe suas candidaturas e os recursos avançados da sua conta.&lt;/p&gt;&lt;/div&gt;&lt;span class='cp93-pill'&gt;★ PREMIUM ATIVO&lt;/span&gt;&lt;/div&gt;"+
"&lt;div class='cp93-metrics'&gt;&lt;div class='cp93-metric'&gt;&lt;span&gt;CANDIDATURAS&lt;/span&gt;&lt;strong&gt;"+a.length+"&lt;/strong&gt;&lt;em&gt;enviadas&lt;/em&gt;&lt;/div&gt;&lt;div class='cp93-metric'&gt;&lt;span&gt;VISUALIZADAS&lt;/span&gt;&lt;strong&gt;"+vis+"&lt;/strong&gt;&lt;em&gt;pela empresa&lt;/em&gt;&lt;/div&gt;&lt;div class='cp93-metric'&gt;&lt;span&gt;EM PROCESSO&lt;/span&gt;&lt;strong&gt;"+processo+"&lt;/strong&gt;&lt;em&gt;com atualização&lt;/em&gt;&lt;/div&gt;&lt;div class='cp93-metric'&gt;&lt;span&gt;ENTREVISTAS&lt;/span&gt;&lt;strong&gt;"+entrev+"&lt;/strong&gt;&lt;em&gt;registradas&lt;/em&gt;&lt;/div&gt;&lt;div class='cp93-metric'&gt;&lt;span&gt;MAIOR ADERÊNCIA&lt;/span&gt;&lt;strong&gt;"+(max?max+"%":"—")+"&lt;/strong&gt;&lt;em&gt;entre candidaturas&lt;/em&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='cp93-grid'&gt;&lt;div class='cp93-box'&gt;&lt;h3&gt;Minhas candidaturas&lt;/h3&gt;&lt;p&gt;Movimentações mais recentes do seu processo seletivo.&lt;/p&gt;&lt;div id='cp93Apps'&gt;"+apps(a)+"&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='cp93-box'&gt;&lt;h3&gt;Seus recursos Premium&lt;/h3&gt;&lt;p&gt;Ferramentas liberadas para esta conta.&lt;/p&gt;"+
feat("◎","Aderência às vagas","Compatibilidade entre seu currículo e os requisitos da oportunidade.")+
feat("◉","Visualização da candidatura","Identificação quando o recrutador registrar a abertura do seu currículo.")+
feat("↗","Evolução no processo","Acompanhe mudanças de etapa registradas pela empresa.")+
feat("★","Recomendações inteligentes","Base para recomendar oportunidades com maior compatibilidade.")+
feat("▦","Estatísticas avançadas","Visão consolidada do desempenho das suas candidaturas.")+"&lt;/div&gt;&lt;/div&gt;";
}
function feat(i,t,d){return"&lt;div class='cp93-feature'&gt;&lt;div class='cp93-icon'&gt;"+i+"&lt;/div&gt;&lt;div&gt;&lt;b&gt;"+t+"&lt;/b&gt;&lt;span&gt;"+d+"&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"}
function apps(a){
if(!a.length)return"&lt;div class='cp93-empty'&gt;Suas candidaturas aparecerão aqui assim que você se candidatar a uma vaga.&lt;/div&gt;";
return a.slice().reverse().slice(0,5).map(function(x){var ad=aderencia(x),vi=visto(x),cargo=x.cargo||x.vaga||x.titulo||"Vaga",emp=x.empresa||x.empresa_nome||x.empresaNome||"Empresa";return"&lt;div class='cp93-app'&gt;&lt;div class='cp93-app-top'&gt;&lt;div&gt;&lt;strong&gt;"+cargo+"&lt;/strong&gt;&lt;br/&gt;&lt;small&gt;"+emp+"&lt;/small&gt;&lt;/div&gt;&lt;span class='cp93-status "+(vi?"visto":"")+"'&gt;"+status(x)+"&lt;/span&gt;&lt;/div&gt;&lt;div class='cp93-line'&gt;&lt;i class='cp93-dot ok'&gt;&lt;/i&gt;Candidatura enviada &lt;i class='cp93-dot "+(vi?"ok":"")+"'&gt;&lt;/i&gt;"+(vi?"Visualizada pela empresa":"Aguardando visualização")+"&lt;/div&gt;"+(ad?"&lt;div class='cp93-aderencia'&gt;&lt;div class='cp93-ad-top'&gt;&lt;span&gt;Aderência à vaga&lt;/span&gt;&lt;b&gt;"+ad+"%&lt;/b&gt;&lt;/div&gt;&lt;div class='cp93-bar'&gt;&lt;i style='width:"+ad+"%'&gt;&lt;/i&gt;&lt;/div&gt;&lt;/div&gt;":"")+"&lt;/div&gt;"}).join("");
}
window.EmpregaMaisCentralPremiumV93={atualizar:render};
window.addEventListener("load",function(){setTimeout(montar,1500)});
document.addEventListener("click",function(){setTimeout(render,250)},true);
window.addEventListener("storage",function(){setTimeout(render,100)});
})();
//
/* EMPREGAI - RECRUTADOR V2
   Primeira camada da reconstrucao. Nao remove nem altera o painel legado. */
(function(){
'use strict';
const ROTAS=[
 ['visao','Visão geral'],['vagas','Minhas vagas'],['processos','Processos seletivos'],['candidaturas','Candidaturas'],
 ['banco','Banco de candidatos'],['contratacoes','Contratações'],['empresa','Minha empresa'],['plano','Plano e assinatura'],['config','Configurações']
];
function vagas(){try{return typeof window.vagasDaEmpresa==='function'?(window.vagasDaEmpresa()||[]):[]}catch(_){return[]}}
function candidaturas(){try{return typeof window.candidaturas==='function'?(window.candidaturas()||[]):[]}catch(_){return[]}}
function plano(){try{return typeof window.planoEmpresaAtual==='function'?(window.planoEmpresaAtual()||{}):{}}catch(_){return{}}}
function ativa(v){return String(v?.status||'').toLowerCase()==='aprovada'}
function escRH2(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
const PLANOS_RH2={
 gratis:{nome:'Grátis',ciclo:'Sem cobrança',descricao:'Para começar a publicar e receber candidaturas.'},
 mensal:{nome:'Mensal',ciclo:'Cobrança mensal',descricao:'Recursos profissionais com flexibilidade mensal.'},
 semestral:{nome:'Semestral',ciclo:'Cobrança a cada 6 meses',descricao:'Operação contínua de recrutamento por semestre.'},
 anual:{nome:'Anual',ciclo:'Cobrança anual',descricao:'Estrutura completa para recrutamento durante o ano.'}
};
function chavePlanoRH2(pl){
 const n=String(pl?.nome||'gratis').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(n.includes('anual'))return'anual';if(n.includes('semes'))return'semestral';if(n.includes('mens'))return'mensal';return'gratis'
}
const RECURSOS_RH2={
 // Mantém as permissões já aplicadas no portal legado.
 gratis:{publicar:true,candidaturas:true,processos:true,banco:false,destaque:false,urgencia:false},
 mensal:{publicar:true,candidaturas:true,processos:true,banco:false,destaque:true,urgencia:true},
 semestral:{publicar:true,candidaturas:true,processos:true,banco:true,destaque:true,urgencia:true},
 anual:{publicar:true,candidaturas:true,processos:true,banco:true,destaque:true,urgencia:true}
};
function recursosPlanoRH2(pl){return RECURSOS_RH2[chavePlanoRH2(pl)]||RECURSOS_RH2.gratis}
function configHtmlRH2(pl){
 const r=recursosPlanoRH2(pl),nome=PLANOS_RH2[chavePlanoRH2(pl)].nome;
 return '<div class="rh2-settings"><article><div><strong>Plano da empresa</strong><small>Permissões comerciais centralizadas</small></div><span>'+nome+'</span></article><article><div><strong>Publicação de vagas</strong><small>Permissão para criar oportunidades</small></div><span>'+(r.publicar?'Ativa':'Indisponível')+'</span></article><article><div><strong>Banco de candidatos</strong><small>Acesso conforme modalidade contratada</small></div><span>'+(r.banco?'Disponível no plano':'Recurso de plano pago')+'</span></article><article><div><strong>Destaque e urgência</strong><small>Recursos promocionais das vagas</small></div><span>'+(r.destaque&&r.urgencia?'Disponíveis':'Conforme upgrade')+'</span></article></div>'
}
function bancoHtmlRH2(cs){
 const unicos=new Map();cs.forEach(c=>{const k=String(c.email||c.candidatoId||c.candidato_id||c.nome||Math.random());if(!unicos.has(k))unicos.set(k,c)});
 const itens=[...unicos.values()].slice(0,60).map(c=>'<article class="rh2-person"><div><strong>'+escRH2(c.nome||c.candidatoNome||c.nome_candidato||'Candidato')+'</strong><small>'+escRH2(c.cidade||c.localizacao||'Localização não informada')+'</small></div><span>'+escRH2(String(c.status||'Candidato').replace(/_/g,' '))+'</span></article>').join('');
 return itens||'<div class="rh2-empty">O banco de candidatos será formado conforme a empresa receber candidaturas.</div>'
}
function contratacoesHtmlRH2(cs,vs){
 const mapa=new Map(vs.map(v=>[String(v.id||''),v]));const arr=cs.filter(c=>String(c.status||'').toLowerCase().includes('contrat'));
 return arr.map(c=>{const v=mapa.get(String(c.vagaId||c.vaga_id||''))||{};return '<article class="rh2-person"><div><strong>'+escRH2(c.nome||c.candidatoNome||c.nome_candidato||'Candidato')+'</strong><small>'+escRH2(v.cargo||v.titulo||'Vaga')+'</small></div><span>Contratado</span></article>'}).join('')||'<div class="rh2-empty">Nenhuma contratação registrada ainda.</div>'
}
function empresaHtmlRH2(){
 let e={};try{if(typeof window.empresaLogada==='function')e=window.empresaLogada()||{};else if(typeof window.empresaAtual==='function')e=window.empresaAtual()||{}}catch(_){}
 return '<div class="rh2-company"><div><small>EMPRESA</small><strong>'+escRH2(e.nomeFantasia||e.nome||e.razaoSocial||'Sua empresa')+'</strong></div><div><small>CNPJ</small><strong>'+escRH2(e.cnpj||'Não informado')+'</strong></div><div><small>LOCALIZAÇÃO</small><strong>'+escRH2([e.cidade,e.estado||e.uf].filter(Boolean).join(' - ')||'Não informada')+'</strong></div><div><small>STATUS</small><strong>'+(e.verificada?'Empresa verificada':'Cadastro da empresa')+'</strong></div></div><div class="rh2-inline-actions"><button type="button" class="rh2-primary" data-rh2-action="editar-empresa">Editar dados da empresa</button></div>'
}
function processosHtmlRH2(vs,cs){
 const itens=vs.map(v=>{const n=cs.filter(c=>String(c.vagaId||c.vaga_id||'')===String(v.id||'')).length;return '<article class="rh2-process"><div><strong>'+escRH2(v.cargo||v.titulo||'Vaga')+'</strong><small>'+n+' candidatura(s) · '+(ativa(v)?'Processo ativo':'Processo '+escRH2(v.status||'em análise'))+'</small></div><button type="button" data-processo="'+String(v.id||'')+'">Ver candidaturas</button></article>'}).join('');
 return itens||'<div class="rh2-empty">Nenhum processo seletivo disponível.</div>'
}
function candidaturasHtmlRH2(cs,vs){
 const mapa=new Map(vs.map(v=>[String(v.id||''),v]));
 const itens=cs.slice(0,50).map(c=>{const v=mapa.get(String(c.vagaId||c.vaga_id||''))||{};const nome=escRH2(c.nome||c.candidatoNome||c.nome_candidato||'Candidato');const status=escRH2(String(c.status||'Recebida').replace(/_/g,' '));return '<article class="rh2-candidate"><div><strong>'+nome+'</strong><small>'+escRH2(v.cargo||v.titulo||'Vaga')+'</small></div><span>'+status+'</span><button type="button" data-candidatura-vaga="'+String(v.id||c.vagaId||c.vaga_id||'')+'">Abrir</button></article>'}).join('');
 return itens||'<div class="rh2-empty">Nenhuma candidatura recebida.</div>'
}
function planosHtmlRH2(pl){
 const atual=chavePlanoRH2(pl);
 return '<div class="rh2-plans">'+Object.entries(PLANOS_RH2).map(([k,p])=>'<article class="rh2-plan-card '+(k===atual?'atual':'')+'"><div><span>'+(k===atual?'PLANO ATUAL':'PLANO')+'</span><h3>'+p.nome+'</h3><p>'+p.descricao+'</p></div><strong>'+p.ciclo+'</strong>'+(k===atual?'<button type="button" disabled>Plano atual</button>':'<button type="button" data-plano="'+k+'">Ver plano</button>')+'</article>').join('')+'</div>'
}
function shell(rota){
 const vs=vagas(),cs=candidaturas(),pl=plano();
 const nav=ROTAS.map(([r,t])=>'<button type="button" data-rh2="'+r+'" class="'+(r===rota?'ativo':'')+'">'+t+'</button>').join('');
 const vagasCards=vs.length?vs.slice(0,6).map(v=>'<article class="rh2-job"><div><strong>'+escRH2(v.cargo||v.titulo||'Vaga')+'</strong><small>'+escRH2([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada')+'</small></div><span class="rh2-status '+(ativa(v)?'on':'')+'">'+(ativa(v)?'Ativa':escRH2(v.status||'Em análise'))+'</span><button type="button" data-vaga="'+String(v.id||'')+'">Gerenciar</button></article>').join(''):'<div class="rh2-empty">Nenhuma vaga publicada ainda.</div>';const conteudo=rota==='visao'?'<div class="rh2-grid"><article class="rh2-card"><small>VAGAS PUBLICADAS</small><strong>'+vs.length+'</strong></article><article class="rh2-card"><small>VAGAS ATIVAS</small><strong>'+vs.filter(ativa).length+'</strong></article><article class="rh2-card"><small>CANDIDATURAS</small><strong>'+cs.length+'</strong></article><article class="rh2-card"><small>CONTRATAÇÕES</small><strong>'+cs.filter(c=>String(c.status||'').toLowerCase().includes('contrat')).length+'</strong></article></div><section class="rh2-section"><div class="rh2-plan"><div><span class="rh2-plan-badge">PLANO '+escRH2(String(pl.nome||'Grátis').toUpperCase())+'</span><h2 style="margin-top:12px">Sua operação de recrutamento</h2><p style="margin:0;color:#718491;font-size:13px">Vagas, candidatos e processos seletivos organizados em um único painel.</p></div><button class="rh2-primary" type="button" data-rh2="plano">Ver meu plano</button></div></section>':rota==='config'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Configurações</h2><p>Conta, permissões e recursos do ambiente da empresa.</p></div></div>'+configHtmlRH2(pl)+'</section>':rota==='banco'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Banco de candidatos</h2><p>Profissionais que já tiveram relacionamento com as oportunidades da empresa.</p></div></div><div class="rh2-people">'+bancoHtmlRH2(cs)+'</div></section>':rota==='contratacoes'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Contratações</h2><p>Histórico de candidatos marcados como contratados.</p></div></div><div class="rh2-people">'+contratacoesHtmlRH2(cs,vs)+'</div></section>':rota==='empresa'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Minha empresa</h2><p>Dados cadastrais e identificação da empresa no portal.</p></div></div>'+empresaHtmlRH2()+'</section>':rota==='processos'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Processos seletivos</h2><p>Cada vaga possui seu próprio processo e suas candidaturas.</p></div></div><div class="rh2-processes">'+processosHtmlRH2(vs,cs)+'</div></section>':rota==='candidaturas'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Candidaturas</h2><p>Acompanhe os candidatos recebidos sem alterar a configuração das vagas.</p></div></div><div class="rh2-candidates">'+candidaturasHtmlRH2(cs,vs)+'</div></section>':rota==='plano'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Plano e assinatura</h2><p>Escolha a modalidade adequada à rotina de recrutamento da empresa.</p></div></div>'+planosHtmlRH2(pl)+'</section>':rota==='vagas'?'<section class="rh2-section"><div class="rh2-section-head"><div><h2>Suas vagas</h2><p>Edite, acompanhe ou encerre oportunidades sem misturar a gestão da vaga com o processo seletivo.</p></div></div><div class="rh2-jobs">'+vagasCards+'</div></section>':'<section class="rh2-section"><h2>'+((ROTAS.find(x=>x[0]===rota)||[])[1]||'Painel')+'</h2><p style="color:#718491;font-size:13px">Módulo em migração segura. As funções atuais continuam disponíveis no painel anterior até esta etapa ser validada.</p></section>';
 return '<div class="rh2-shell"><aside class="rh2-side"><div class="rh2-brand">Emprega<b>í</b> Empresas</div><nav class="rh2-nav">'+nav+'</nav></aside><main class="rh2-main"><header class="rh2-top"><div><h1>'+((ROTAS.find(x=>x[0]===rota)||[])[1]||'Visão geral')+'</h1><p>Novo painel do recrutador</p></div>'+(rota==='vagas'?'<button class="rh2-primary" type="button" data-rh2-action="nova-vaga">+ Nova vaga</button>':'')+'</header>'+conteudo+'</main></div>';
}
function render(rota='visao'){const root=document.getElementById('empregaiRecrutadorV2');if(!root)return;root.innerHTML=shell(rota);
root.querySelectorAll('[data-rh2-action="nova-vaga"]').forEach(b=>b.addEventListener('click',()=>{if(typeof window.irPara==='function')window.irPara('publicar')}));
root.querySelectorAll('[data-rh2-action="editar-empresa"]').forEach(b=>b.addEventListener('click',()=>{if(typeof window.irPara==='function')window.irPara('perfil-empresa')}));
root.querySelectorAll('[data-plano]').forEach(b=>b.addEventListener('click',()=>{if(typeof window.irPara==='function')window.irPara('planos')}));root.querySelectorAll('[data-rh2]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.rh2)));root.querySelectorAll('[data-processo],[data-candidatura-vaga]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.processo||b.dataset.candidaturaVaga;sessionStorage.setItem('vagaCandidatosSelecionada',id);if(typeof window.irPara==='function')window.irPara('candidatos-empresa')}));root.querySelectorAll('[data-vaga]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.vaga;if(typeof window.abrirGestaoVagaIndividualEM==='function')return window.abrirGestaoVagaIndividualEM(id);if(typeof window.abrirGestaoVaga==='function')return window.abrirGestaoVaga(id);sessionStorage.setItem('vagaCandidatosSelecionada',id);if(typeof window.irPara==='function')window.irPara('candidatos-empresa')}))}

function garantirPaginaRH2(){
 let sec=document.getElementById('pagina-painel-recrutador-v2');
 if(sec)return sec;
 sec=document.createElement('section');sec.id='pagina-painel-recrutador-v2';sec.className='pagina';
 sec.innerHTML='<div id="empregaiRecrutadorV2"></div>';document.body.appendChild(sec);return sec
}
function abrirPainelRH2(rota='visao'){
 if(typeof window.papelAtual==='function'&&window.papelAtual()!=='empresa'){if(typeof window.irPara==='function')window.irPara('login-empresa');return}
 garantirPaginaRH2();document.querySelectorAll('.pagina').forEach(x=>x.classList.remove('ativa'));document.getElementById('pagina-painel-recrutador-v2').classList.add('ativa');render(rota)
}
window.EmpregaiRecrutadorV2={render,abrir:abrirPainelRH2};window.abrirPainelRecrutadorV2=abrirPainelRH2;
})();

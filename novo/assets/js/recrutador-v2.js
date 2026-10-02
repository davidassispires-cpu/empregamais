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
function shell(rota){
 const vs=vagas(),cs=candidaturas(),pl=plano();
 const nav=ROTAS.map(([r,t])=>'<button type="button" data-rh2="'+r+'" class="'+(r===rota?'ativo':'')+'">'+t+'</button>').join('');
 const conteudo=rota==='visao'?'<div class="rh2-grid"><article class="rh2-card"><small>VAGAS PUBLICADAS</small><strong>'+vs.length+'</strong></article><article class="rh2-card"><small>VAGAS ATIVAS</small><strong>'+vs.filter(ativa).length+'</strong></article><article class="rh2-card"><small>CANDIDATURAS</small><strong>'+cs.length+'</strong></article><article class="rh2-card"><small>CONTRATAÇÕES</small><strong>'+cs.filter(c=>String(c.status||'').toLowerCase()==='contratado').length+'</strong></article></div><section class="rh2-section"><div class="rh2-plan"><div><span class="rh2-plan-badge">PLANO '+String(pl.nome||'Grátis').toUpperCase()+'</span><h2 style="margin-top:12px">Sua operação de recrutamento</h2><p style="margin:0;color:#718491;font-size:13px">Vagas, candidatos e processos seletivos organizados em um único painel.</p></div><button class="rh2-primary" type="button" data-rh2="plano">Ver meu plano</button></div></section>':'<section class="rh2-section"><h2>'+((ROTAS.find(x=>x[0]===rota)||[])[1]||'Painel')+'</h2><p style="color:#718491;font-size:13px">Módulo em migração segura. As funções atuais continuam disponíveis no painel anterior até esta etapa ser validada.</p></section>';
 return '<div class="rh2-shell"><aside class="rh2-side"><div class="rh2-brand">Emprega<b>í</b> Empresas</div><nav class="rh2-nav">'+nav+'</nav></aside><main class="rh2-main"><header class="rh2-top"><div><h1>'+((ROTAS.find(x=>x[0]===rota)||[])[1]||'Visão geral')+'</h1><p>Novo painel do recrutador</p></div>'+(rota==='vagas'?'<button class="rh2-primary" type="button" onclick="if(window.irPara)irPara(\'publicar-vaga\')">+ Nova vaga</button>':'')+'</header>'+conteudo+'</main></div>';
}
function render(rota='visao'){const root=document.getElementById('empregaiRecrutadorV2');if(!root)return;root.innerHTML=shell(rota);root.querySelectorAll('[data-rh2]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.rh2)))}
window.EmpregaiRecrutadorV2={render};
})();

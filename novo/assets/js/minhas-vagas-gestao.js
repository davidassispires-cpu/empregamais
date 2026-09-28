/* EMPREGAMAIS - MINHAS VAGAS GESTAO V1 */
(function(){
'use strict';

function escEM(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]})}
function vagasEmpresaEM(){return typeof window.vagasDaEmpresa==='function'?(window.vagasDaEmpresa()||[]):[]}
function candidaturasEM(){return typeof window.candidaturas==='function'?(window.candidaturas()||[]):[]}
function statusVagaEM(v){
 if(v.status==='aprovada'&&(!v.dataEncerramento||new Date(v.dataEncerramento+'T23:59:59')>=new Date()))return 'Ativa';
 if(['pendente','em_analise','analise'].includes(v.status))return 'Em análise';
 return 'Encerrada';
}
function flagsVagaEM(v){
 const a=[];
 if(v.destaque)a.push('<span class="evp-flag destaque">★ Destaque</span>');
 if(v.urgente)a.push('<span class="evp-flag urgente">⚡ Urgente</span>');
 if(v.confidencial)a.push('<span class="evp-flag confidencial">◉ Confidencial</span>');
 return a.join('');
}
function cssEM(){
 if(document.getElementById('emMinhasVagasGestaoCss'))return;
 const s=document.createElement('style');
 s.id='emMinhasVagasGestaoCss';
 s.textContent=`
 #pagina-vagas-empresa .evp-vaga{grid-template-columns:minmax(260px,1.35fr) 115px 105px 105px minmax(360px,1fr)!important;gap:14px!important;align-items:center!important}
 #pagina-vagas-empresa .evp-title{min-width:0}
 #pagina-vagas-empresa .evp-title strong{display:block;color:#123d56;font-size:15px;line-height:1.3}
 #pagina-vagas-empresa .evp-title small{display:block;margin-top:5px;color:#718697;font-size:11px;line-height:1.4}
 #pagina-vagas-empresa .evp-flags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
 #pagina-vagas-empresa .evp-flag{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;font-size:9.5px;font-weight:800;border:1px solid #d9e6ed;background:#f6fafc;color:#526f82}
 #pagina-vagas-empresa .evp-flag.destaque{background:#fff8df;border-color:#f0dda1;color:#8a6512}
 #pagina-vagas-empresa .evp-flag.urgente{background:#fff0ed;border-color:#efc9c1;color:#a94735}
 #pagina-vagas-empresa .evp-flag.confidencial{background:#eef5fb;border-color:#c9dcea;color:#2f6687}
 #pagina-vagas-empresa .evp-actions{display:grid!important;grid-template-columns:1.3fr .8fr!important;gap:7px!important;align-items:stretch!important}
 #pagina-vagas-empresa .evp-actions button{min-height:38px!important;border-radius:8px!important;padding:0 10px!important;font-size:11px!important;font-weight:750!important;white-space:normal!important;line-height:1.2!important}
 #pagina-vagas-empresa .evp-actions .manage{grid-column:1/2}
 #pagina-vagas-empresa .evp-actions .edit{grid-column:2/3}
 #pagina-vagas-empresa .evp-actions .view{grid-column:1/2}
 #pagina-vagas-empresa .evp-actions .toggle{background:#fff!important;border:1px solid #cfdde5!important;color:#315b71!important}
 #pagina-vagas-empresa .evp-actions .toggle.ativo{background:#eef8f6!important;border-color:#b9ded5!important;color:#17725e!important}
 #pagina-vagas-empresa .evp-actions .end{background:#fff5f4!important;border:1px solid #ebc9c5!important;color:#a63f35!important}
 #pagina-vagas-empresa .evp-actions .reopen{background:#edf8f3!important;border:1px solid #bfe1d1!important;color:#16745d!important}
 #pagina-vagas-empresa .evp-actions-more{grid-column:1/3;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
 @media(max-width:1100px){#pagina-vagas-empresa .evp-vaga{grid-template-columns:1fr!important}.evp-table-head{display:none!important}#pagina-vagas-empresa .evp-actions{grid-template-columns:1fr 1fr!important}#pagina-vagas-empresa .evp-actions-more{grid-template-columns:1fr 1fr!important}}
 @media(max-width:600px){#pagina-vagas-empresa .evp-actions,#pagina-vagas-empresa .evp-actions-more{grid-template-columns:1fr!important}#pagina-vagas-empresa .evp-actions>*{grid-column:1!important}}
 `;
 document.head.appendChild(s);
}
async function patchVagaEM(id,body){
 if(typeof window.sbGarantirSessaoEM!=='function'||typeof window.sbJsonEM!=='function')throw new Error('Sessão da empresa indisponível.');
 const token=await window.sbGarantirSessaoEM();
 if(!token)throw new Error('Sua sessão expirou. Entre novamente.');
 const base=window.EMPREGAMAIS_SUPABASE_URL||'https://mkezlcewyengejdmtppl.supabase.co';
 const headers=typeof window.sbHeadersEM==='function'?window.sbHeadersEM(token):{Authorization:'Bearer '+token,apikey:'sb_publishable_8YnXpzGXz8zj-tvzvcMYdyw_FVBhQutR','Content-Type':'application/json'};
 await window.sbJsonEM(base+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:Object.assign(headers,{'Prefer':'return=minimal'}),body:JSON.stringify(body)});
 const locais=typeof window.ler==='function'?window.ler('empregaMaisVagas'):[];
 const i=locais.findIndex(x=>String(x.id)===String(id));
 if(i>=0){Object.assign(locais[i],body.status?{status:body.status}:{},body.destaque!==undefined?{destaque:body.destaque}:{},body.urgente!==undefined?{urgente:body.urgente}:{},body.confidencial!==undefined?{confidencial:body.confidencial}:{});if(body.data_encerramento===null)locais[i].dataEncerramento='';if(body.encerrada_em===null)locais[i].encerradaEm='';if(typeof window.gravar==='function')window.gravar('empregaMaisVagas',locais)}
 if(typeof window.sbCarregarVagasEM==='function')await window.sbCarregarVagasEM();
}
async function reabrirVagaEM(id,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(!confirm('Reabrir a vaga “'+(v.cargo||v.titulo||'Vaga')+'” e voltar a receber candidaturas?'))return;
 try{if(btn){btn.disabled=true;btn.textContent='Reabrindo...'}await patchVagaEM(id,{status:'aprovada',encerrada_em:null,data_encerramento:null});renderVagasEmpresaPaginaGestaoEM()}catch(e){alert(e.message||'Não foi possível reabrir a vaga.');if(btn){btn.disabled=false;btn.textContent='Reabrir processo'}}
}
async function encerrarVagaGestaoEM(id,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(!confirm('Encerrar a vaga “'+(v.cargo||v.titulo||'Vaga')+'”? Ela deixará de receber novas candidaturas, mas poderá ser reaberta depois.'))return;
 try{if(btn){btn.disabled=true;btn.textContent='Encerrando...'}await patchVagaEM(id,{status:'encerrada',encerrada_em:new Date().toISOString()});renderVagasEmpresaPaginaGestaoEM()}catch(e){alert(e.message||'Não foi possível encerrar a vaga.');if(btn){btn.disabled=false;btn.textContent='Encerrar processo'}}
}
async function alternarFlagGestaoEM(id,recurso,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(typeof window.alternarRecursoVagaEM==='function'){
  try{if(btn)btn.disabled=true;await window.alternarRecursoVagaEM(id,recurso)}finally{setTimeout(renderVagasEmpresaPaginaGestaoEM,250)}
 }
}
function renderVagasEmpresaPaginaGestaoEM(){
 cssEM();
 const box=document.getElementById('empresaVagasPagina');if(!box)return;
 const vagas=vagasEmpresaEM().filter(Boolean),cs=candidaturasEM().filter(Boolean);
 const ativa=vagas.filter(v=>statusVagaEM(v)==='Ativa').length,analise=vagas.filter(v=>statusVagaEM(v)==='Em análise').length,enc=vagas.filter(v=>statusVagaEM(v)==='Encerrada').length;
 const rows=vagas.map(v=>{
  const cand=cs.filter(x=>String(x.vagaId)===String(v.id)),st=statusVagaEM(v),cl=st==='Em análise'?'analise':st==='Encerrada'?'encerrada':'';
  const encerrada=st==='Encerrada';
  return '<article class="evp-vaga" data-titulo="'+escEM((v.cargo||v.titulo||'')+' '+(v.cidade||''))+'" data-status="'+escEM(st)+'">'+
   '<div class="evp-title"><strong>'+escEM(v.cargo||v.titulo||'Vaga')+'</strong><small>'+escEM([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada')+' · '+escEM(v.modalidade||'Modalidade não informada')+' · '+escEM(v.dataPublicacao||v.data||'')+'</small><div class="evp-flags">'+flagsVagaEM(v)+'</div></div>'+
   '<span class="evp-status '+cl+'">'+st+'</span><div class="evp-metric"><strong>'+cand.length+'</strong><span>Candidaturas</span></div><div class="evp-metric"><strong>'+escEM(v.visualizacoes||0)+'</strong><span>Visualizações</span></div>'+
   '<div class="evp-actions"><button class="manage" onclick="abrirGestaoVaga(\''+escEM(v.id)+'\')">Gerenciar processo</button><button class="edit" onclick="editarVaga(\''+escEM(v.id)+'\')">Editar</button><button class="view" onclick="sessionStorage.setItem(\'vagaSelecionada\',\''+escEM(v.id)+'\');irPara(\'vaga\')">Ver vaga</button>'+
   '<button class="'+(encerrada?'reopen':'end')+'" onclick="'+(encerrada?'reabrirVagaEM(\''+escEM(v.id)+'\',this)':'encerrarVagaGestaoEM(\''+escEM(v.id)+'\',this)')+'">'+(encerrada?'Reabrir processo':'Encerrar processo')+'</button>'+
   '<div class="evp-actions-more"><button class="toggle '+(v.destaque?'ativo':'')+'" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'destaque\',this)">'+(v.destaque?'Remover destaque':'Destacar')+'</button><button class="toggle '+(v.urgente?'ativo':'')+'" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'urgente\',this)">'+(v.urgente?'Retirar urgência':'Marcar urgente')+'</button><button class="toggle '+(v.confidencial?'ativo':'')+'" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'confidencial\',this)">'+(v.confidencial?'Exibir empresa':'Empresa confidencial')+'</button></div></div></article>';
 }).join('');
 box.innerHTML='<div class="evp-summary"><article><span>TOTAL DE VAGAS</span><strong>'+vagas.length+'</strong><small>Todas as oportunidades</small></article><article><span>ATIVAS</span><strong>'+ativa+'</strong><small>Publicadas no portal</small></article><article><span>EM ANÁLISE</span><strong>'+analise+'</strong><small>Aguardando publicação</small></article><article><span>ENCERRADAS</span><strong>'+enc+'</strong><small>Processos finalizados</small></article></div><section class="evp-board"><div class="evp-tools"><input id="evpBusca" placeholder="Buscar vaga por cargo ou localização"><select id="evpStatus"><option value="">Todos os status</option><option>Ativa</option><option>Em análise</option><option>Encerrada</option></select><select><option>Mais recentes</option></select></div><div class="evp-table-head"><span>VAGA</span><span>STATUS</span><span>CANDIDATURAS</span><span>VISUALIZAÇÕES</span><span>AÇÕES</span></div><div id="evpLista">'+(rows||'<div class="evp-empty"><strong>Nenhuma vaga cadastrada</strong><span>Publique uma nova vaga para começar.</span></div>')+'</div></section>';
 const filtrar=function(){const q=(document.getElementById('evpBusca').value||'').toLowerCase(),s=document.getElementById('evpStatus').value;box.querySelectorAll('.evp-vaga').forEach(function(el){el.style.display=(!q||el.dataset.titulo.toLowerCase().includes(q))&&(!s||el.dataset.status===s)?'grid':'none'})};
 document.getElementById('evpBusca').oninput=filtrar;document.getElementById('evpStatus').onchange=filtrar;
}
window.renderVagasEmpresaPaginaGestaoEM=renderVagasEmpresaPaginaGestaoEM;
window.reabrirVagaEM=reabrirVagaEM;
window.encerrarVagaGestaoEM=encerrarVagaGestaoEM;
window.alternarFlagGestaoEM=alternarFlagGestaoEM;
window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;

document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;if(new URLSearchParams(location.search).get('pagina')==='vagas-empresa')renderVagasEmpresaPaginaGestaoEM()},700)});
})();

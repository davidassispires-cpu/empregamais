/* EMPREGAMAIS - MINHAS VAGAS GESTAO V3 */
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
function ajustarCabecalhoMinhasVagasEM(detalhe){
 const p=document.getElementById('pagina-vagas-empresa');if(!p)return;
 const span=p.querySelector('.evp-head>div>span'),h1=p.querySelector('.evp-head h1'),desc=p.querySelector('.evp-head p');
 if(span)span.textContent='RECRUTAMENTO';
 if(h1)h1.textContent=detalhe?'Gerenciar vaga':'Minhas vagas';
 if(desc)desc.textContent=detalhe?'Gerencie os dados e recursos desta oportunidade sem misturar com o processo seletivo.':'Gerencie suas oportunidades publicadas, configurações e recursos em um único lugar.';
}
function cssEM(){
 if(document.getElementById('emMinhasVagasGestaoCss'))return;
 const s=document.createElement('style');
 s.id='emMinhasVagasGestaoCss';
 s.textContent=`
 #pagina-vagas-empresa #evpLista{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;padding:15px!important;background:#f3f7fb}
 #pagina-vagas-empresa .evp-vaga{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important;min-width:0!important;padding:11px 14px!important;border:1.5px solid #c9d9ea!important;border-radius:14px!important;background:#fff!important;box-shadow:0 4px 14px rgba(13,74,143,.07)!important}
 #pagina-vagas-empresa .evp-vaga:hover{background:#fff!important;border-color:#8fb7df!important;box-shadow:0 8px 22px rgba(13,74,143,.12)!important}
 #pagina-vagas-empresa .evp-title{min-width:0}
 #pagina-vagas-empresa .evp-title-line{display:flex;align-items:center;justify-content:space-between;gap:12px}
 #pagina-vagas-empresa .evp-title-line strong{display:block;min-width:0;color:#123d56;font-size:15px;line-height:1.3}
 #pagina-vagas-empresa .evp-title-line .evp-status{flex:0 0 auto}
 #pagina-vagas-empresa .evp-title strong{display:block;color:#123d56;font-size:15px;line-height:1.3}
 #pagina-vagas-empresa .evp-title small{display:block;margin-top:3px;color:#718697;font-size:11px;line-height:1.3}
 #pagina-vagas-empresa .evp-flags{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
 #pagina-vagas-empresa .evp-flag{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;font-size:9.5px;font-weight:800;border:1px solid #d9e6ed;background:#f6fafc;color:#526f82}
 #pagina-vagas-empresa .evp-flag.destaque{background:#fff8df;border-color:#f0dda1;color:#8a6512}
 #pagina-vagas-empresa .evp-flag.urgente{background:#fff0ed;border-color:#efc9c1;color:#a94735}
 #pagina-vagas-empresa .evp-flag.confidencial{background:#eef5fb;border-color:#c9dcea;color:#2f6687}
 #pagina-vagas-empresa .evp-card-status{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding-top:4px;border-top:1px solid #edf2f4}
 #pagina-vagas-empresa .evp-card-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px}
 #pagina-vagas-empresa .evp-card-metrics .evp-metric{display:grid!important;grid-template-columns:28px auto!important;grid-template-rows:auto auto!important;align-items:center!important;justify-content:center!important;column-gap:8px!important;padding:5px 8px!important;min-height:42px!important;border-radius:8px;background:#f5f8fa;text-align:left!important}
 #pagina-vagas-empresa .evp-card-metrics .evp-metric svg{grid-row:1/3;width:20px;height:20px;fill:none;stroke:#0d5ea8;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 #pagina-vagas-empresa .evp-card-metrics .evp-metric strong{display:block!important;font-size:15px!important;line-height:1!important;margin:0!important}
 #pagina-vagas-empresa .evp-card-metrics .evp-metric span{display:block!important;font-size:10px!important;line-height:1.1!important;margin:2px 0 0!important}
 #pagina-vagas-empresa .evp-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;align-items:center!important;margin-top:auto!important}
 #pagina-vagas-empresa .evp-actions button{min-height:32px!important;border-radius:9px!important;padding:0 12px!important;font-size:10.5px!important;font-weight:750!important;white-space:nowrap!important;line-height:1.2!important}
 #pagina-vagas-empresa .evp-actions .manage-job{background:#0d5ea8!important;border:1px solid #0d5ea8!important;color:#fff!important}
 #pagina-vagas-empresa .evp-actions .view-job{background:#fff!important;border:1px solid #c9d9e1!important;color:#315f8f!important}
 #pagina-vagas-empresa .evp-job-detail{display:grid;gap:18px}
 #pagina-vagas-empresa .evp-detail-back{width:max-content;border:0;background:transparent;color:#58758a;font-size:12px;font-weight:750;cursor:pointer;padding:0}
 #pagina-vagas-empresa .evp-detail-hero{display:flex;justify-content:space-between;gap:22px;align-items:flex-start;padding:25px;border:1px solid #d7e4ea;border-radius:18px;background:#fff;box-shadow:0 8px 28px rgba(15,61,84,.06)}
 #pagina-vagas-empresa .evp-detail-hero h2{margin:7px 0 7px;color:#123d56;font-size:25px;line-height:1.2}
 #pagina-vagas-empresa .evp-detail-hero p{margin:0;color:#6b8190;font-size:12.5px;line-height:1.5}
 #pagina-vagas-empresa .evp-detail-status{display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:#eaf7ef;color:#187044;font-size:11px;font-weight:800;white-space:nowrap}
 #pagina-vagas-empresa .evp-detail-status.analise{background:#fff6dd;color:#8a6714}
 #pagina-vagas-empresa .evp-detail-status.encerrada{background:#f2f4f5;color:#667681}
 #pagina-vagas-empresa .evp-detail-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(290px,.7fr);gap:18px}
 #pagina-vagas-empresa .evp-detail-card{padding:22px;border:1px solid #dbe6eb;border-radius:16px;background:#fff}
 #pagina-vagas-empresa .evp-detail-card>span{display:block;margin-bottom:5px;color:#0d5ea8;font-size:10px;font-weight:800;letter-spacing:.09em}
 #pagina-vagas-empresa .evp-detail-card h3{margin:0 0 16px;color:#173f52;font-size:18px}
 #pagina-vagas-empresa .evp-detail-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 #pagina-vagas-empresa .evp-detail-info div{padding:13px;border-radius:11px;background:#f6f9fa}
 #pagina-vagas-empresa .evp-detail-info small{display:block;color:#7a8d98;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
 #pagina-vagas-empresa .evp-detail-info strong{display:block;margin-top:4px;color:#284f63;font-size:13px;line-height:1.35}
 #pagina-vagas-empresa .evp-detail-actions{display:grid;gap:9px}
 #pagina-vagas-empresa .evp-detail-actions button{min-height:44px;padding:0 14px;border-radius:10px;font-size:12px;font-weight:750;cursor:pointer}
 #pagina-vagas-empresa .evp-detail-actions .primary{background:#0d5ea8;border:1px solid #0d5ea8;color:#fff}
 #pagina-vagas-empresa .evp-detail-actions .secondary{background:#fff;border:1px solid #cddce4;color:#315f8f}
 #pagina-vagas-empresa .evp-detail-actions .toggle{background:#f8fafb;border:1px solid #d8e3e8;color:#466677}
 #pagina-vagas-empresa .evp-detail-actions .toggle.ativo{background:#eef8f6;border-color:#b9ded5;color:#17725e}
 #pagina-vagas-empresa .evp-detail-actions .danger{background:#fff5f4;border:1px solid #ebc9c5;color:#a63f35}
 #pagina-vagas-empresa .evp-detail-actions .reopen{background:#edf8f3;border:1px solid #bfe1d1;color:#16745d}
 #pagina-vagas-empresa .evp-process-callout{padding:20px;border-radius:15px;background:#eef7f9;border:1px solid #cfe3e8}
 #pagina-vagas-empresa .evp-process-callout strong{display:block;color:#174d63;font-size:15px}
 #pagina-vagas-empresa .evp-process-callout p{margin:6px 0 13px;color:#69808c;font-size:12px;line-height:1.45}
 #pagina-vagas-empresa .evp-process-callout button{width:100%;min-height:43px;border:0;border-radius:10px;background:#176b78;color:#fff;font-size:12px;font-weight:800;cursor:pointer}
 #pagina-vagas-empresa .evp-summary{grid-template-columns:repeat(3,1fr)!important;gap:14px!important}
 #pagina-vagas-empresa .evp-summary article{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:118px!important;padding:16px!important;text-align:center!important;cursor:pointer!important;overflow:hidden!important;transition:transform .18s ease,box-shadow .18s ease!important}
 #pagina-vagas-empresa .evp-summary article:hover{transform:translateY(-2px)!important;box-shadow:0 12px 28px rgba(17,61,96,.12)!important}
 #pagina-vagas-empresa .evp-summary article svg{width:22px;height:22px;margin-bottom:5px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 #pagina-vagas-empresa .evp-summary article:nth-child(1){background:linear-gradient(145deg,#fff,#eef6ff)!important;border-color:#cfe1f4!important;color:#1d5d96!important}
 #pagina-vagas-empresa .evp-summary article:nth-child(2){background:linear-gradient(145deg,#fff,#edf9f4)!important;border-color:#cce8db!important;color:#197356!important}
 #pagina-vagas-empresa .evp-summary article:nth-child(3){background:linear-gradient(145deg,#fff,#fff7e9)!important;border-color:#f0ddbb!important;color:#c45c10!important}
 #pagina-vagas-empresa .evp-summary article:nth-child(4){background:linear-gradient(145deg,#fff,#fff1ec)!important;border-color:#f0d1c5!important;color:#c94f19!important}
 #pagina-vagas-empresa .evp-summary article span{font-size:10px!important;font-weight:800!important;letter-spacing:.06em!important;color:inherit!important}
 #pagina-vagas-empresa .evp-summary article strong{margin:2px 0!important;font-size:25px!important;line-height:1!important;color:inherit!important}
 #pagina-vagas-empresa .evp-summary article small{font-size:10.5px!important;color:#637b8b!important}
 #pagina-vagas-empresa .evp-summary article.ativo{box-shadow:0 0 0 2px currentColor inset,0 10px 25px rgba(17,61,96,.10)!important}
 #pagina-vagas-empresa .evp-closed-head{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:13px 15px;background:#fff7f3;border:1px solid #efd5ca;border-radius:12px;margin-bottom:12px}
 #pagina-vagas-empresa .evp-closed-head strong{color:#9e451e;font-size:14px}
 #pagina-vagas-empresa .evp-closed-head span{color:#7b6a63;font-size:11px}
 #pagina-vagas-empresa .evp-closed-head button{height:34px;padding:0 12px;border:1px solid #e2c6ba;border-radius:8px;background:#fff;color:#8d492b;font-weight:700;font-size:11px;cursor:pointer}
 #pagina-vagas-empresa .evp-table-head{display:none!important}
 #pagina-vagas-empresa .evp-pagination{display:flex;align-items:center;justify-content:center;gap:6px;padding:16px;border-top:1px solid #e5ecef;background:#fff}
 #pagina-vagas-empresa .evp-pagination button{min-width:36px;height:36px;border:1px solid #d2e0e6;border-radius:8px;background:#fff;color:#315f8f;font:700 11px Inter;cursor:pointer}
 #pagina-vagas-empresa .evp-pagination button.ativo{background:#0d5ea8;border-color:#0d5ea8;color:#fff}
 #pagina-vagas-empresa .evp-pagination button:disabled{opacity:.4;cursor:default}
 #pagina-vagas-empresa .evp-pagination span{margin:0 5px;color:#718697;font-size:11px}
 @media(max-width:900px){#pagina-vagas-empresa .evp-summary{grid-template-columns:repeat(2,1fr)!important}#pagina-vagas-empresa #evpLista{grid-template-columns:1fr!important}#pagina-vagas-empresa .evp-detail-grid{grid-template-columns:1fr}}
 @media(max-width:650px){#pagina-vagas-empresa #evpLista{grid-template-columns:1fr!important;padding:10px!important}#pagina-vagas-empresa .evp-actions{grid-template-columns:1fr 1fr!important}#pagina-vagas-empresa .evp-actions button{width:100%!important}#pagina-vagas-empresa .evp-detail-hero{flex-direction:column}#pagina-vagas-empresa .evp-detail-info{grid-template-columns:1fr}}
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
function voltarMinhasVagasEM(){
 const url=location.pathname+'?pagina=vagas-empresa';
 history.pushState({pagina:'vagas-empresa'},'',url);
 renderVagasEmpresaPaginaGestaoEM();
}
function abrirGestaoVagaIndividualEM(id){
 const url=location.pathname+'?pagina=vagas-empresa&vaga='+encodeURIComponent(id);
 history.pushState({pagina:'vagas-empresa',vaga:String(id)},'',url);
 renderVagasEmpresaPaginaGestaoEM();
}
function abrirProcessoVagaEM(id){
 if(typeof window.abrirGestaoVaga==='function')return window.abrirGestaoVaga(id);
 sessionStorage.setItem('vagaCandidatosSelecionada',String(id));
 if(typeof window.irPara==='function')window.irPara('candidatos-empresa');
}
async function reabrirVagaEM(id,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(!confirm('Reabrir a vaga “'+(v.cargo||v.titulo||'Vaga')+'” e voltar a receber candidaturas?'))return;
 try{if(btn){btn.disabled=true;btn.textContent='Reabrindo...'}await patchVagaEM(id,{status:'aprovada',encerrada_em:null,data_encerramento:null});renderVagasEmpresaPaginaGestaoEM()}catch(e){alert(e.message||'Não foi possível reabrir a vaga.');if(btn){btn.disabled=false;btn.textContent='Reabrir vaga'}}
}
async function encerrarVagaGestaoEM(id,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(!confirm('Encerrar a vaga “'+(v.cargo||v.titulo||'Vaga')+'”? Ela deixará de receber novas candidaturas, mas poderá ser reaberta depois.'))return;
 try{if(btn){btn.disabled=true;btn.textContent='Encerrando...'}await patchVagaEM(id,{status:'encerrada',encerrada_em:new Date().toISOString()});renderVagasEmpresaPaginaGestaoEM()}catch(e){alert(e.message||'Não foi possível encerrar a vaga.');if(btn){btn.disabled=false;btn.textContent='Encerrar vaga'}}
}
async function alternarFlagGestaoEM(id,recurso,btn){
 const v=vagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 if(typeof window.alternarRecursoVagaEM==='function'){
  try{if(btn)btn.disabled=true;await window.alternarRecursoVagaEM(id,recurso)}finally{setTimeout(renderVagasEmpresaPaginaGestaoEM,250)}
 }
}
function renderDetalheVagaEM(box,v,cs){
 ajustarCabecalhoMinhasVagasEM(true);
 const cand=cs.filter(x=>String(x.vagaId)===String(v.id)),st=statusVagaEM(v),cl=st==='Em análise'?'analise':st==='Encerrada'?'encerrada':'',encerrada=st==='Encerrada';
 const local=[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada';
 const data=v.dataPublicacao||v.data||v.criadoEm||'';
 const dataTxt=data?(()=>{try{return new Date(data).toLocaleDateString('pt-BR')}catch(_){return String(data)}})():'—';
 box.innerHTML='<div class="evp-job-detail">'+
  '<button class="evp-detail-back" type="button" onclick="voltarMinhasVagasEM()">← Voltar para Minhas vagas</button>'+
  '<section class="evp-detail-hero"><div><span style="font-size:10px;font-weight:800;letter-spacing:.09em;color:#0d5ea8">GESTÃO DA VAGA</span><h2>'+escEM(v.cargo||v.titulo||'Vaga')+'</h2><p>'+escEM(local)+' · '+escEM(v.modalidade||'Modalidade não informada')+' · Publicada em '+escEM(dataTxt)+'</p><div class="evp-flags">'+flagsVagaEM(v)+'</div></div><span class="evp-detail-status '+cl+'">'+escEM(st)+'</span></section>'+
  '<div class="evp-detail-grid"><main class="evp-detail-card"><span>INFORMAÇÕES DA OPORTUNIDADE</span><h3>Dados da vaga</h3><div class="evp-detail-info"><div><small>Cargo</small><strong>'+escEM(v.cargo||v.titulo||'—')+'</strong></div><div><small>Localização</small><strong>'+escEM(local)+'</strong></div><div><small>Modalidade</small><strong>'+escEM(v.modalidade||'—')+'</strong></div><div><small>Tipo de contrato</small><strong>'+escEM(v.contrato||v.tipoContrato||'—')+'</strong></div><div><small>Candidaturas</small><strong>'+cand.length+'</strong></div><div><small>Visualizações</small><strong>'+escEM(v.visualizacoes||0)+'</strong></div></div></main>'+
  '<aside class="evp-detail-card"><span>AÇÕES DA VAGA</span><h3>Gerenciar oportunidade</h3><div class="evp-detail-actions"><button class="primary" type="button" onclick="editarVaga(\''+escEM(v.id)+'\')">Editar vaga</button><button class="secondary" type="button" onclick="sessionStorage.setItem(\'vagaSelecionada\',\''+escEM(v.id)+'\');irPara(\'vaga\')">Ver publicação</button><button class="toggle '+(v.destaque?'ativo':'')+'" type="button" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'destaque\',this)">'+(v.destaque?'Remover destaque':'Destacar vaga')+'</button><button class="toggle '+(v.urgente?'ativo':'')+'" type="button" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'urgente\',this)">'+(v.urgente?'Retirar urgência':'Marcar como urgente')+'</button><button class="toggle '+(v.confidencial?'ativo':'')+'" type="button" onclick="alternarFlagGestaoEM(\''+escEM(v.id)+'\',\'confidencial\',this)">'+(v.confidencial?'Exibir empresa':'Empresa confidencial')+'</button><button class="'+(encerrada?'reopen':'danger')+'" type="button" onclick="'+(encerrada?'reabrirVagaEM(\''+escEM(v.id)+'\',this)':'encerrarVagaGestaoEM(\''+escEM(v.id)+'\',this)')+'">'+(encerrada?'Reabrir vaga':'Encerrar vaga')+'</button></div></aside></div>'+
  '<section class="evp-process-callout"><strong>Processo seletivo desta vaga</strong><p>Candidatos, etapas, entrevistas e comunicação ficam em uma área separada da configuração da vaga.</p><button type="button" onclick="abrirProcessoVagaEM(\''+escEM(v.id)+'\')">Abrir processo seletivo →</button></section>'+
  '</div>';
}
function renderVagasEmpresaPaginaGestaoEM(){
 cssEM();
 const box=document.getElementById('empresaVagasPagina');if(!box)return;
 const vagas=vagasEmpresaEM().filter(Boolean),cs=candidaturasEM().filter(Boolean),params=new URLSearchParams(location.search),vagaId=params.get('vaga');
 if(vagaId){
  const vaga=vagas.find(v=>String(v.id)===String(vagaId));
  if(vaga){renderDetalheVagaEM(box,vaga,cs);return}
 }
 ajustarCabecalhoMinhasVagasEM(false);
 const ativa=vagas.filter(v=>statusVagaEM(v)==='Ativa').length,analise=vagas.filter(v=>statusVagaEM(v)==='Em análise').length,enc=vagas.filter(v=>statusVagaEM(v)==='Encerrada').length;
 const rows=vagas.map(v=>{
  const cand=cs.filter(x=>String(x.vagaId)===String(v.id)),st=statusVagaEM(v),cl=st==='Em análise'?'analise':st==='Encerrada'?'encerrada':'';
  const dataOrdem=Date.parse(v.dataPublicacao||v.data||v.criadoEm||'')||0;
  return '<article class="evp-vaga" data-titulo="'+escEM((v.cargo||v.titulo||'')+' '+(v.cidade||''))+'" data-status="'+escEM(st)+'" data-candidaturas="'+cand.length+'" data-data="'+dataOrdem+'">'+
   '<div class="evp-title"><div class="evp-title-line"><strong>'+escEM(v.cargo||v.titulo||'Vaga')+'</strong><span class="evp-status '+cl+'">'+st+'</span></div><small>'+escEM([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada')+' · '+escEM(v.modalidade||'Modalidade não informada')+'</small><div class="evp-flags">'+flagsVagaEM(v)+'</div></div>'+
   '<div class="evp-card-status"><small>'+escEM(v.dataPublicacao||v.data||'')+'</small></div>'+
   '<div class="evp-card-metrics"><div class="evp-metric"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3.4 2.3-5.2 5.5-5.2s5 1.8 5.5 5.2"/><path d="M16 9.5a2.4 2.4 0 1 0 0-4.8M16 14c2.7-.1 4.2 1.5 4.5 4"/></svg><strong>'+cand.length+'</strong><span>Candidaturas</span></div><div class="evp-metric"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg><strong>'+escEM(v.visualizacoes||0)+'</strong><span>Visualizações</span></div></div>'+
   '<div class="evp-actions"><button class="view-job" type="button" onclick="sessionStorage.setItem(\'vagaSelecionada\',\''+escEM(v.id)+'\');irPara(\'vaga\')">Ver vaga</button><button class="manage-job" type="button" onclick="abrirGestaoVagaIndividualEM(\''+escEM(v.id)+'\')">Gerenciar vaga</button></div></article>';
 }).join('');
 box.innerHTML='<div class="evp-summary"><article data-kpi="Ativa" title="Mostrar vagas ativas"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4h8v2M3 11h18"/></svg><span>VAGAS ATIVAS NO SITE</span><strong>'+ativa+'</strong><small>Publicadas no portal</small></article><article data-kpi="Em análise" title="Filtrar vagas em análise"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>EM ANÁLISE</span><strong>'+analise+'</strong><small>Aguardando publicação</small></article><article data-kpi="Encerrada" title="Abrir vagas encerradas"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M8 12h8M8 16h5"/></svg><span>VAGAS ENCERRADAS</span><strong>'+enc+'</strong><small>Abrir lista de encerradas</small></article></div><div id="evpClosedHead"></div><section class="evp-board"><div class="evp-tools"><input id="evpBusca" placeholder="Buscar vaga por cargo ou localização"><select id="evpStatus" style="display:none"><option value="Ativa">Vagas ativas</option><option value="Em análise">Em análise</option><option value="Encerrada">Encerradas</option></select><select id="evpOrdem"><option value="recentes">Mais recentes</option><option value="antigas">Mais antigas</option><option value="candidaturas">Mais candidaturas</option></select></div><div class="evp-table-head"><span>VAGA</span><span>STATUS</span><span>CANDIDATURAS</span><span>VISUALIZAÇÕES</span><span>AÇÕES</span></div><div id="evpLista">'+(rows||'<div class="evp-empty"><strong>Nenhuma vaga cadastrada</strong><span>Publique uma nova vaga para começar.</span></div>')+'</div><div id="evpPaginacao" class="evp-pagination"></div></section>';
 let paginaAtual=1,modoLista='Ativa';
 const porPagina=6;
 const atualizarLista=function(reset){
  if(reset)paginaAtual=1;
  const q=(document.getElementById('evpBusca').value||'').toLowerCase(),ordem=(document.getElementById('evpOrdem')||{}).value||'recentes';
  const lista=document.getElementById('evpLista'),todos=Array.from(lista.querySelectorAll('.evp-vaga'));
  const filtrados=todos.filter(function(el){return el.dataset.status===modoLista&&(!q||el.dataset.titulo.toLowerCase().includes(q))});
  filtrados.sort(function(a,b){if(ordem==='antigas')return Number(a.dataset.data)-Number(b.dataset.data);if(ordem==='candidaturas')return Number(b.dataset.candidaturas)-Number(a.dataset.candidaturas);return Number(b.dataset.data)-Number(a.dataset.data)});
  filtrados.forEach(function(el){lista.appendChild(el)});
  const paginas=Math.max(1,Math.ceil(filtrados.length/porPagina));if(paginaAtual>paginas)paginaAtual=paginas;
  todos.forEach(function(el){el.style.display='none'});
  filtrados.slice((paginaAtual-1)*porPagina,paginaAtual*porPagina).forEach(function(el){el.style.display='flex'});
  const pg=document.getElementById('evpPaginacao');if(!pg)return;
  if(filtrados.length<=porPagina){pg.innerHTML='';pg.style.display='none';return}
  pg.style.display='flex';
  let html='<button type="button" data-pg="'+(paginaAtual-1)+'" '+(paginaAtual===1?'disabled':'')+'>‹</button>';
  for(let i=1;i<=paginas;i++)html+='<button type="button" class="'+(i===paginaAtual?'ativo':'')+'" data-pg="'+i+'">'+i+'</button>';
  html+='<button type="button" data-pg="'+(paginaAtual+1)+'" '+(paginaAtual===paginas?'disabled':'')+'>›</button><span>'+filtrados.length+' vagas</span>';
  pg.innerHTML=html;
  pg.querySelectorAll('button[data-pg]:not([disabled])').forEach(function(btn){btn.onclick=function(){paginaAtual=Number(btn.dataset.pg);atualizarLista(false)}});
 };
 const closedHead=document.getElementById('evpClosedHead');
 const marcarKpi=function(valor){box.querySelectorAll('.evp-summary article').forEach(function(a){a.classList.toggle('ativo',a.dataset.kpi===valor)})};
 const abrirModo=function(valor){
  modoLista=valor;
  closedHead.innerHTML='';
  if(valor==='Encerrada'){
   closedHead.innerHTML='<div class="evp-closed-head"><div><strong>Vagas encerradas</strong><br><span>'+enc+' oportunidades arquivadas.</span></div><button type="button" id="evpVoltarAbertas">← Voltar às vagas ativas</button></div>';
  }else if(valor==='Em análise'){
   closedHead.innerHTML='<div class="evp-closed-head" style="background:#fff8ec;border-color:#efd9ad"><div><strong style="color:#a95a13">Vagas em análise</strong><br><span>'+analise+' oportunidade aguardando publicação.</span></div><button type="button" id="evpVoltarAbertas">← Voltar às vagas ativas</button></div>';
  }
  const voltar=document.getElementById('evpVoltarAbertas');if(voltar)voltar.onclick=function(){abrirModo('Ativa')};
  marcarKpi(valor);atualizarLista(true);
 };
 box.querySelectorAll('.evp-summary article[data-kpi]').forEach(function(a){a.onclick=function(){abrirModo(a.dataset.kpi)}});
 document.getElementById('evpBusca').oninput=function(){atualizarLista(true)};
 document.getElementById('evpOrdem').onchange=function(){atualizarLista(true)};
 abrirModo('Ativa');
}
window.renderVagasEmpresaPaginaGestaoEM=renderVagasEmpresaPaginaGestaoEM;
window.abrirGestaoVagaIndividualEM=abrirGestaoVagaIndividualEM;
window.abrirProcessoVagaEM=abrirProcessoVagaEM;
window.voltarMinhasVagasEM=voltarMinhasVagasEM;
window.reabrirVagaEM=reabrirVagaEM;
window.encerrarVagaGestaoEM=encerrarVagaGestaoEM;
window.alternarFlagGestaoEM=alternarFlagGestaoEM;
window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;

function assumirRotaMinhasVagasEM(){window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;if(new URLSearchParams(location.search).get('pagina')==='vagas-empresa')renderVagasEmpresaPaginaGestaoEM()}
document.addEventListener('DOMContentLoaded',function(){[0,250,700,1400].forEach(function(ms){setTimeout(assumirRotaMinhasVagasEM,ms)})});
window.addEventListener('load',function(){setTimeout(assumirRotaMinhasVagasEM,0)});
window.addEventListener('popstate',function(){if(new URLSearchParams(location.search).get('pagina')==='vagas-empresa')setTimeout(renderVagasEmpresaPaginaGestaoEM,30)});
})();

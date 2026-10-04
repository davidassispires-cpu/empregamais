/* EMPREGAMAIS - MINHAS VAGAS GESTAO V2 */
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
 #pagina-vagas-empresa .evp-head{padding:22px 24px!important;margin:0 0 16px!important;border:1px solid #dbe7ed!important;border-radius:16px!important;background:linear-gradient(135deg,#f8fbfd 0%,#eef6fa 100%)!important;box-shadow:0 5px 18px rgba(18,61,86,.045)!important}
 #pagina-vagas-empresa .evp-head>div>span{display:block!important;margin-bottom:5px!important;color:#0b7a87!important;font-size:10px!important;font-weight:850!important;letter-spacing:.09em!important}
 #pagina-vagas-empresa .evp-head h1{margin:0!important;color:#123d56!important;font-size:25px!important;line-height:1.15!important;font-weight:800!important}
 #pagina-vagas-empresa .evp-head p{margin:7px 0 0!important;max-width:720px!important;color:#6f8390!important;font-size:12.5px!important;line-height:1.5!important}
 #pagina-vagas-empresa .evp-head button,#pagina-vagas-empresa .evp-head .btn{min-height:42px!important;padding:0 17px!important;border-radius:10px!important;font-size:12px!important;font-weight:800!important;box-shadow:none!important}
 #pagina-vagas-empresa .evp-summary{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important;margin:0 0 18px!important}
 #pagina-vagas-empresa .evp-summary article{min-width:0!important;min-height:118px!important;padding:18px!important;border:1px solid #dbe7ed!important;border-radius:14px!important;background:#fff!important;box-shadow:0 5px 18px rgba(18,61,86,.055)!important}
 #pagina-vagas-empresa .evp-summary article span{display:block!important;color:#6f8390!important;font-size:10px!important;font-weight:800!important;letter-spacing:.055em!important;line-height:1.25!important}
 #pagina-vagas-empresa .evp-summary article strong{display:block!important;margin:8px 0 3px!important;color:#123d56!important;font-size:27px!important;line-height:1!important}
 #pagina-vagas-empresa .evp-summary article small{display:block!important;color:#81929d!important;font-size:10.5px!important;line-height:1.35!important}
 #pagina-vagas-empresa .evp-board{overflow:hidden!important;border:1px solid #dbe7ed!important;border-radius:16px!important;background:#fff!important;box-shadow:0 5px 18px rgba(18,61,86,.045)!important}
 #pagina-vagas-empresa .evp-tools{display:grid!important;grid-template-columns:minmax(260px,1fr) 190px 170px!important;gap:10px!important;padding:16px!important;background:#f8fafb!important;border-bottom:1px solid #e4edf1!important}
 #pagina-vagas-empresa .evp-tools input,#pagina-vagas-empresa .evp-tools select{width:100%!important;min-height:42px!important;padding:0 13px!important;border:1px solid #cfdee5!important;border-radius:10px!important;background:#fff!important;color:#294f62!important;font-size:12px!important;outline:none!important}
 #pagina-vagas-empresa .evp-tools input:focus,#pagina-vagas-empresa .evp-tools select:focus{border-color:#6da8bd!important;box-shadow:0 0 0 3px rgba(53,130,158,.10)!important}
 #pagina-vagas-empresa .evp-table-head{padding:12px 16px!important;background:#f3f7f9!important;border-bottom:1px solid #e2ebef!important;color:#718794!important;font-size:9.5px!important;font-weight:850!important;letter-spacing:.055em!important}
 #pagina-vagas-empresa #evpLista{padding:0 16px!important}
 #pagina-vagas-empresa .evp-empty{min-height:150px!important;place-items:center!important;align-content:center!important;text-align:center!important;padding:28px 18px!important;color:#758995!important}
 #pagina-vagas-empresa .evp-empty strong{display:block!important;color:#31586c!important;font-size:14px!important}
 #pagina-vagas-empresa .evp-empty span{display:block!important;margin-top:5px!important;font-size:11.5px!important}
 #pagina-vagas-empresa .evp-vaga{margin:0!important;padding:16px 0!important;border:0!important;border-bottom:1px solid #e6edf0!important;border-radius:0!important;background:#fff!important;box-shadow:none!important;grid-template-columns:minmax(280px,1.45fr) 115px 105px 105px minmax(300px,.95fr)!important;gap:14px!important;align-items:center!important}
 #pagina-vagas-empresa .evp-title{min-width:0;padding-right:8px}
 #pagina-vagas-empresa .evp-status{justify-self:start!important;display:inline-flex!important;align-items:center!important;min-height:27px!important;padding:0 9px!important;border-radius:999px!important;background:#eaf7ef!important;color:#187044!important;font-size:10px!important;font-weight:800!important}
 #pagina-vagas-empresa .evp-status.analise{background:#fff6dd!important;color:#8a6714!important}
 #pagina-vagas-empresa .evp-status.encerrada{background:#f1f4f5!important;color:#667681!important}
 #pagina-vagas-empresa .evp-metric{text-align:center!important}
 #pagina-vagas-empresa .evp-metric strong{display:block!important;color:#173f52!important;font-size:17px!important;line-height:1.1!important}
 #pagina-vagas-empresa .evp-metric span{display:block!important;margin-top:3px!important;color:#84949d!important;font-size:9.5px!important}
 #pagina-vagas-empresa .evp-title strong{display:block;color:#123d56;font-size:15px;line-height:1.3}
 #pagina-vagas-empresa .evp-title small{display:block;margin-top:5px;color:#718697;font-size:11px;line-height:1.4}
 #pagina-vagas-empresa .evp-flags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
 #pagina-vagas-empresa .evp-flag{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;font-size:9.5px;font-weight:800;border:1px solid #d9e6ed;background:#f6fafc;color:#526f82}
 #pagina-vagas-empresa .evp-flag.destaque{background:#fff8df;border-color:#f0dda1;color:#8a6512}
 #pagina-vagas-empresa .evp-flag.urgente{background:#fff0ed;border-color:#efc9c1;color:#a94735}
 #pagina-vagas-empresa .evp-flag.confidencial{background:#eef5fb;border-color:#c9dcea;color:#2f6687}
 #pagina-vagas-empresa .evp-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;align-items:stretch!important}
 #pagina-vagas-empresa .evp-actions button{min-height:40px!important;border-radius:9px!important;padding:0 12px!important;font-size:11px!important;font-weight:750!important;white-space:normal!important;line-height:1.2!important}
 #pagina-vagas-empresa .evp-actions .manage-job{background:#fff!important;border:1px solid #bcd2dd!important;color:#174e69!important}
 #pagina-vagas-empresa .evp-actions button{cursor:pointer!important;transition:transform .15s ease,box-shadow .15s ease,background .15s ease!important}
 #pagina-vagas-empresa .evp-actions button:hover{transform:translateY(-1px)!important;box-shadow:0 4px 12px rgba(18,61,86,.10)!important}
 #pagina-vagas-empresa .evp-actions button:focus-visible{outline:3px solid rgba(46,130,159,.20)!important;outline-offset:2px!important}
 #pagina-vagas-empresa .evp-actions .process{background:#0b7a87!important;border:1px solid #0b7a87!important;color:#fff!important}
 #pagina-vagas-empresa .evp-job-detail{display:grid;gap:18px}
 #pagina-vagas-empresa .evp-detail-back{width:max-content;border:0;background:transparent;color:#58758a;font-size:12px;font-weight:750;cursor:pointer;padding:0}
 #pagina-vagas-empresa .evp-detail-hero{display:flex;justify-content:space-between;gap:22px;align-items:flex-start;padding:25px;border:1px solid #d7e4ea;border-radius:18px;background:#fff;box-shadow:0 8px 28px rgba(15,61,84,.06)}
 #pagina-vagas-empresa .evp-detail-hero h2{margin:7px 0 7px;color:#123d56;font-size:25px;line-height:1.2}
 #pagina-vagas-empresa .evp-detail-hero p{margin:0;color:#6b8190;font-size:12.5px;line-height:1.5}
 #pagina-vagas-empresa .evp-detail-status{display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:#eaf7ef;color:#187044;font-size:11px;font-weight:800;white-space:nowrap}
 #pagina-vagas-empresa .evp-detail-status.analise{background:#fff6dd;color:#8a6714}
 #pagina-vagas-empresa .evp-detail-status.encerrada{background:#f2f4f5;color:#667681}
 #pagina-vagas-empresa .evp-detail-back{display:inline-flex!important;align-items:center!important;min-height:38px!important;padding:0 12px!important;border:1px solid #d7e4ea!important;border-radius:9px!important;background:#fff!important;color:#41677a!important}
 #pagina-vagas-empresa .evp-detail-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(290px,.7fr);gap:18px}
 #pagina-vagas-empresa .evp-detail-card{padding:22px;border:1px solid #dbe6eb;border-radius:16px;background:#fff}
 #pagina-vagas-empresa .evp-detail-card>span{display:block;margin-bottom:5px;color:#0b7a87;font-size:10px;font-weight:800;letter-spacing:.09em}
 #pagina-vagas-empresa .evp-detail-card h3{margin:0 0 16px;color:#173f52;font-size:18px}
 #pagina-vagas-empresa .evp-detail-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 #pagina-vagas-empresa .evp-detail-info div{padding:13px;border-radius:11px;background:#f6f9fa}
 #pagina-vagas-empresa .evp-detail-info small{display:block;color:#7a8d98;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
 #pagina-vagas-empresa .evp-detail-info strong{display:block;margin-top:4px;color:#284f63;font-size:13px;line-height:1.35}
 #pagina-vagas-empresa .evp-detail-actions{display:grid;gap:9px}
 #pagina-vagas-empresa .evp-detail-actions button{min-height:44px;padding:0 14px;border-radius:10px;font-size:12px;font-weight:750;cursor:pointer}
 #pagina-vagas-empresa .evp-detail-actions button{transition:transform .15s ease,box-shadow .15s ease!important}
 #pagina-vagas-empresa .evp-detail-actions button:hover{transform:translateY(-1px)!important;box-shadow:0 4px 12px rgba(18,61,86,.09)!important}
 #pagina-vagas-empresa .evp-detail-actions .primary{background:#0b7a87;border:1px solid #0b7a87;color:#fff}
 #pagina-vagas-empresa .evp-detail-actions .secondary{background:#fff;border:1px solid #cddce4;color:#315c72}
 #pagina-vagas-empresa .evp-detail-actions .toggle{background:#f8fafb;border:1px solid #d8e3e8;color:#466677}
 #pagina-vagas-empresa .evp-detail-actions .toggle.ativo{background:#eef8f6;border-color:#b9ded5;color:#17725e}
 #pagina-vagas-empresa .evp-detail-actions .danger{background:#fff5f4;border:1px solid #ebc9c5;color:#a63f35}
 #pagina-vagas-empresa .evp-detail-actions .reopen{background:#edf8f3;border:1px solid #bfe1d1;color:#16745d}
 #pagina-vagas-empresa .evp-process-callout{position:relative!important;overflow:hidden!important;padding:20px;border-radius:15px;background:#eef7f9;border:1px solid #cfe3e8}
 #pagina-vagas-empresa .evp-process-callout:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:#0b7a87}
 #pagina-vagas-empresa .evp-process-callout strong{display:block;color:#174d63;font-size:15px}
 #pagina-vagas-empresa .evp-process-callout p{margin:6px 0 13px;color:#69808c;font-size:12px;line-height:1.45}
 #pagina-vagas-empresa .evp-process-callout button{width:100%;min-height:43px;border:0;border-radius:10px;background:#176b78;color:#fff;font-size:12px;font-weight:800;cursor:pointer}
 @media(max-width:1100px){#pagina-vagas-empresa .evp-tools{grid-template-columns:1fr 1fr!important}#pagina-vagas-empresa .evp-tools input{grid-column:1/-1!important}#pagina-vagas-empresa .evp-summary{grid-template-columns:repeat(3,minmax(0,1fr))!important}#pagina-vagas-empresa .evp-vaga{grid-template-columns:1fr!important}.evp-table-head{display:none!important}#pagina-vagas-empresa .evp-actions{grid-template-columns:1fr 1fr!important}#pagina-vagas-empresa .evp-detail-grid{grid-template-columns:1fr}}
 @media(max-width:600px){#pagina-vagas-empresa .evp-tools{grid-template-columns:1fr!important}#pagina-vagas-empresa .evp-tools input{grid-column:auto!important}#pagina-vagas-empresa .evp-head{padding:18px!important}#pagina-vagas-empresa .evp-head h1{font-size:22px!important}#pagina-vagas-empresa .evp-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}#pagina-vagas-empresa .evp-actions{grid-template-columns:1fr!important}#pagina-vagas-empresa .evp-detail-hero{flex-direction:column}#pagina-vagas-empresa .evp-detail-info{grid-template-columns:1fr}}
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
  '<section class="evp-detail-hero"><div><span style="font-size:10px;font-weight:800;letter-spacing:.09em;color:#0b7a87">GESTÃO DA VAGA</span><h2>'+escEM(v.cargo||v.titulo||'Vaga')+'</h2><p>'+escEM(local)+' · '+escEM(v.modalidade||'Modalidade não informada')+' · Publicada em '+escEM(dataTxt)+'</p><div class="evp-flags">'+flagsVagaEM(v)+'</div></div><span class="evp-detail-status '+cl+'">'+escEM(st)+'</span></section>'+
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
  return '<article class="evp-vaga" data-titulo="'+escEM((v.cargo||v.titulo||'')+' '+(v.cidade||''))+'" data-status="'+escEM(st)+'">'+
   '<div class="evp-title"><strong>'+escEM(v.cargo||v.titulo||'Vaga')+'</strong><small>'+escEM([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada')+' · '+escEM(v.modalidade||'Modalidade não informada')+' · '+escEM(v.dataPublicacao||v.data||'')+'</small><div class="evp-flags">'+flagsVagaEM(v)+'</div></div>'+
   '<span class="evp-status '+cl+'">'+st+'</span><div class="evp-metric"><strong>'+cand.length+'</strong><span>Candidaturas</span></div><div class="evp-metric"><strong>'+escEM(v.visualizacoes||0)+'</strong><span>Visualizações</span></div>'+
   '<div class="evp-actions"><button class="manage-job" type="button" onclick="abrirGestaoVagaIndividualEM(\''+escEM(v.id)+'\')">Gerenciar vaga</button><button class="process" type="button" onclick="abrirProcessoVagaEM(\''+escEM(v.id)+'\')">Processo seletivo</button></div></article>';
 }).join('');
 const destaques=vagas.filter(v=>v.destaque).length,urgentes=vagas.filter(v=>v.urgente).length,confidenciais=vagas.filter(v=>v.confidencial).length;\n box.innerHTML='<div class="evp-summary"><article><span>VAGAS ATIVAS NO SITE</span><strong>'+ativa+'</strong><small>Publicadas no portal</small></article><article><span>EM ANÁLISE</span><strong>'+analise+'</strong><small>Aguardando publicação</small></article><article><span>VAGAS ENCERRADAS</span><strong>'+enc+'</strong><small>Oportunidades encerradas</small></article><article><span>VAGAS EM DESTAQUE</span><strong>'+destaques+'</strong><small>Em uso</small></article><article><span>VAGAS COM URGÊNCIA</span><strong>'+urgentes+'</strong><small>Em uso</small></article><article><span>VAGAS CONFIDENCIAIS</span><strong>'+confidenciais+'</strong><small>Em uso</small></article></div><section class="evp-board"><div class="evp-tools"><input id="evpBusca" placeholder="Buscar vaga por cargo ou localização"><select id="evpStatus"><option value="">Todos os status</option><option>Ativa</option><option>Em análise</option><option>Encerrada</option></select><select><option>Mais recentes</option></select></div><div class="evp-table-head"><span>VAGA</span><span>STATUS</span><span>CANDIDATURAS</span><span>VISUALIZAÇÕES</span><span>AÇÕES</span></div><div id="evpLista">'+(rows||'<div class="evp-empty"><strong>Nenhuma vaga cadastrada</strong><span>Publique uma nova vaga para começar.</span></div>')+'</div></section>';
 const filtrar=function(){const q=(document.getElementById('evpBusca').value||'').trim().toLowerCase(),s=document.getElementById('evpStatus').value;let visiveis=0;box.querySelectorAll('.evp-vaga').forEach(function(el){const ok=(!q||el.dataset.titulo.toLowerCase().includes(q))&&(!s||el.dataset.status===s);el.style.display=ok?'grid':'none';if(ok)visiveis++});let vazio=document.getElementById('evpFiltroVazio');if(!visiveis&&vagas.length){if(!vazio){vazio=document.createElement('div');vazio.id='evpFiltroVazio';vazio.className='evp-empty';vazio.innerHTML='<strong>Nenhuma vaga encontrada</strong><span>Tente outro cargo, localização ou status.</span>';document.getElementById('evpLista').appendChild(vazio)}vazio.style.display='grid'}else if(vazio)vazio.style.display='none'};
 document.getElementById('evpBusca').oninput=filtrar;document.getElementById('evpStatus').onchange=filtrar;
}
window.renderVagasEmpresaPaginaGestaoEM=renderVagasEmpresaPaginaGestaoEM;
window.abrirGestaoVagaIndividualEM=abrirGestaoVagaIndividualEM;
window.abrirProcessoVagaEM=abrirProcessoVagaEM;
window.voltarMinhasVagasEM=voltarMinhasVagasEM;
window.reabrirVagaEM=reabrirVagaEM;
window.encerrarVagaGestaoEM=encerrarVagaGestaoEM;
window.alternarFlagGestaoEM=alternarFlagGestaoEM;
window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;

document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaGestaoEM;if(new URLSearchParams(location.search).get('pagina')==='vagas-empresa')renderVagasEmpresaPaginaGestaoEM()},700)});
window.addEventListener('popstate',function(){if(new URLSearchParams(location.search).get('pagina')==='vagas-empresa')setTimeout(renderVagasEmpresaPaginaGestaoEM,30)});
})();

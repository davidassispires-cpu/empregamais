(function () {
 'use strict';
 var base='https://mkezlcewyengejdmtppl.supabase.co/rest/v1/';
 var key='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
 var fields=['status','favoritoRecrutador','observacaoRecrutador','statusAtualizadoEm','contratadoEm'];
 var remote={},owner='',pending={},busy=false,ready=false,timer,lastPull=0;
 var feedback='';
 function token(){return sessionStorage.getItem('empregaMaisSupabaseAccessToken')||'';}
 function cnpj(){var current=typeof window.obterEmpresaAtual==='function'?window.obterEmpresaAtual():null;return String(sessionStorage.getItem('empresaCnpj')||localStorage.getItem('empresaCnpj')||current&&current.cnpj||'').replace(/\D/g,'');}
 function queueKey(){return 'emRecruiterPending:'+owner;}
 function remember(){localStorage.setItem(queueKey(),JSON.stringify(pending));}
 function job(c){return String(c.vagaId||c.vaga_id||c.idVaga||'');}
 function ownedJobs(){try{return new Set((window.vagasDaEmpresa()||[]).map(function(v){return String(v.id);}));}catch(e){return new Set();}}
 async function api(path,options,allowPublic){
  var access=token();if(!access&&!allowPublic)throw Error('Entre novamente para sincronizar.');
  var headers=Object.assign({apikey:key,'Content-Type':'application/json'},options&&options.headers||{});
  if(access)headers.Authorization='Bearer '+access;
  var controller=new AbortController(),timeout=setTimeout(function(){controller.abort();},25000);
  try{var response=await fetch(base+path,Object.assign({},options||{},{headers:headers,signal:controller.signal}));
   var text=await response.text(),data=text?JSON.parse(text):null;
   if(!response.ok)throw Error(response.status===401?'Sua sessão expirou. Entre novamente.':data&&data.message||'Não foi possível concluir a operação.');
   return data;
  }finally{clearTimeout(timeout);}
 }
 function show(text){
  feedback=text;var host=document.getElementById('listaCandidatosEmpresa');if(!host)return;
  var bar=document.getElementById('emRecruiterStateSync');if(!bar){bar=document.createElement('div');bar.id='emRecruiterStateSync';bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');bar.style.cssText='display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 0;color:#52657a;font:500 12px/1.5 Inter,Arial,sans-serif';var span=document.createElement('span'),button=document.createElement('button');button.type='button';button.textContent='Sincronizar alterações';button.onclick=function(){sync(true);};bar.append(span,button);host.prepend(bar);}
  bar.firstChild.textContent=text;bar.lastChild.disabled=busy;
 }
 function switchOwner(){
  var next=cnpj();if(owner===next)return;owner=next;remote={};pending={};ready=false;lastPull=0;
  if(owner){try{pending=JSON.parse(localStorage.getItem(queueKey())||'{}');}catch(e){pending={};}}
 }
 function merge(rows){
  remote={};(rows||[]).forEach(function(row){remote[row.application_ref]={job_ref:row.job_ref,state:row.state};});
  var all=originalLoad();all.forEach(function(c){var r=remote[String(c.id)];if(r&&r.job_ref===job(c))Object.assign(c,r.state,pending[String(c.id)]&&pending[String(c.id)].state||{});});
  originalSave(all);
 }
 async function sync(force){
  switchOwner();if(busy||!owner||!token())return;
  if(!force&&ready&&!Object.keys(pending).length&&Date.now()-lastPull<30000){show(feedback);return;}
  var requestOwner=owner,access=token();busy=true;show('Sincronizando etapas, anotações e favoritos…');
  try{
   if(!ready){var initial=await api('rpc/em_sync_recruiter_state',{method:'POST',body:JSON.stringify({p_company_cnpj:owner,p_changes:[]})});
    if(owner!==requestOwner||cnpj()!==requestOwner||token()!==access)return;merge(initial);ready=true;
    var jobs=ownedJobs();originalLoad().forEach(function(c){var id=String(c.id);if(remote[id]||pending[id]||!jobs.has(job(c)))return;
     if(c.observacaoRecrutador||c.favoritoRecrutador||c.statusAtualizadoEm){var state={};fields.forEach(function(f){if(c[f]!==undefined)state[f]=c[f];});pending[id]={application_ref:id,job_ref:job(c),state:state};}
    });remember();
   }
   var batch=Object.keys(pending).slice(0,100).map(function(id){return JSON.parse(JSON.stringify(pending[id]));});
   var rows=await api('rpc/em_sync_recruiter_state',{method:'POST',body:JSON.stringify({p_company_cnpj:requestOwner,p_changes:batch})});
   if(cnpj()!==requestOwner||token()!==access)return;
   batch.forEach(function(sent){var current=pending[sent.application_ref];if(!current)return;Object.keys(sent.state).forEach(function(f){if(JSON.stringify(current.state[f])===JSON.stringify(sent.state[f]))delete current.state[f];});if(!Object.keys(current.state).length)delete pending[sent.application_ref];});
   remember();merge(rows);lastPull=Date.now();show(Object.keys(pending).length?'Há alterações aguardando sincronização.':'Etapas, anotações e favoritos sincronizados.');
   if(!document.getElementById('emCandidateDetails')&&typeof window.renderizarCandidatosEmpresa==='function')window.renderizarCandidatosEmpresa();
  }catch(e){show('Salvo neste navegador. Sincronização pendente: '+(e.name==='AbortError'?'conexão demorou a responder.':e.message));}
  finally{busy=false;show(feedback);if(Object.keys(pending).length&&ready)timer=setTimeout(function(){sync(true);},10000);}
 }
 var originalLoad,originalSave;
 function install(){
  if(typeof window.salvarCandidaturas!=='function'||typeof window.carregarCandidaturas!=='function')return;
  originalSave=window.salvarCandidaturas;originalLoad=window.carregarCandidaturas;
  window.carregarCandidaturas=function(){switchOwner();var all=originalLoad.apply(this,arguments);all.forEach(function(c){var r=remote[String(c.id)];if(r&&r.job_ref===job(c))Object.assign(c,r.state,pending[String(c.id)]&&pending[String(c.id)].state||{});});return all;};
  window.salvarCandidaturas=function(all){
   switchOwner();var before=new Map(originalLoad().map(function(c){return [String(c.id),c];})),jobs=ownedJobs();
   if(owner&&token())all.forEach(function(c){var id=String(c.id),old=before.get(id);if(!old||!jobs.has(job(c)))return;
    var patch={};fields.forEach(function(f){if(c[f]!==undefined&&JSON.stringify(c[f])!==JSON.stringify(old[f]))patch[f]=c[f];});
    if(Object.keys(patch).length){var current=pending[id]||{application_ref:id,job_ref:job(c),state:{}};Object.assign(current.state,patch);pending[id]=current;}
   });
   var result=originalSave.apply(this,arguments);if(owner&&Object.keys(pending).length){remember();show('Salvo neste navegador. Sincronizando…');clearTimeout(timer);timer=setTimeout(function(){sync(true);},300);}return result;
  };
  window.sincronizarEstadoCandidaturasEM=sync;
  setInterval(function(){var page=document.getElementById('pagina-candidatos-empresa');if(page&&page.classList.contains('ativa')&&!document.hidden)sync(false);},5000);
  window.addEventListener('online',function(){sync(true);});window.addEventListener('focus',function(){sync(false);});
 }
 window.registrarDenunciaVaga=async function(id,motivo,relato){
  var button=document.getElementById('enviarDenunciaEmpregaMais');if(button&&button.disabled)return;
  id=String(id||'');if(!id||id.length>200)throw Error('Reabra a vaga para identificar a denúncia.');
  if(!motivo||!relato||relato.length>3000)throw Error('Preencha o motivo e o relato.');
  var input=document.getElementById('arquivoDenunciaEmpregaMais'),file=input&&input.files&&input.files[0],evidence=null;
  if(button){button.disabled=true;button.textContent='Enviando…';}
  try{
   if(file){if(file.size>2*1024*1024)throw Error('O anexo deve ter até 2 MB.');
    if(!['image/jpeg','image/png','application/pdf'].includes(file.type))throw Error('Use um arquivo JPG, PNG ou PDF.');
    var encoded=await new Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(){resolve(String(reader.result).split(',')[1]);};reader.onerror=function(){reject(Error('Não foi possível ler o anexo.'));};reader.readAsDataURL(file);});
    evidence={name:file.name.slice(0,255),mime:file.type,data:encoded};
   }
   var uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
   await api('denuncias_vagas',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({vaga_id:uuid?id:null,job_ref:id,motivo:motivo,detalhes:relato,evidencia:evidence})},true);
  }finally{if(button){button.disabled=false;button.textContent='DENUNCIAR VAGA';}}
 };
 function installReports(){
  var info=document.querySelector('.denuncia-arquivo-info-em');if(info)info.textContent='Anexe uma evidência em JPG, PNG ou PDF, de até 2 MB.';
  var original=window.renderizarDenunciasAdminEstavel;if(typeof original!=='function')return;
  window.renderizarDenunciasAdminEstavel=function(){
   original.apply(this,arguments);var host=document.getElementById('listaDenunciasAdminEstavel');if(!host||!token())return;
   api('denuncias_vagas?status=eq.pendente&order=criado_em.desc&limit=100&select=id,vaga_id,job_ref,motivo,detalhes,criado_em').then(function(rows){
    if(!rows||!rows.length)return;host.replaceChildren();rows.forEach(function(row){
     var item=document.createElement('article');item.className='admin-denuncia-item';var title=document.createElement('strong'),text=document.createElement('p'),link=document.createElement('a'),resolve=document.createElement('button');
     title.textContent=row.motivo;text.textContent=row.detalhes;text.style.whiteSpace='pre-wrap';link.textContent='Ver vaga';link.href='?pagina=vaga&id='+encodeURIComponent(row.vaga_id||row.job_ref);link.target='_blank';link.rel='noopener';
     var attachment=document.createElement('button');attachment.type='button';attachment.textContent='Consultar evidência';attachment.onclick=async function(){attachment.disabled=true;try{var data=await api('denuncias_vagas?id=eq.'+encodeURIComponent(row.id)+'&select=evidencia');var evidence=data&&data[0]&&data[0].evidencia;if(!evidence){attachment.textContent='Sem anexo';return;}var bytes=Uint8Array.from(atob(evidence.data),function(c){return c.charCodeAt(0);}),url=URL.createObjectURL(new Blob([bytes],{type:evidence.mime})),download=document.createElement('a');download.href=url;download.download=evidence.name;download.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);}catch(e){attachment.textContent='Falha ao carregar. Tente novamente.';}finally{attachment.disabled=false;}};
     resolve.type='button';resolve.textContent='Marcar como analisada';resolve.onclick=async function(){resolve.disabled=true;try{await api('denuncias_vagas?id=eq.'+encodeURIComponent(row.id),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'resolvida',acao:'Analisada pelo administrador',resolvida_em:new Date().toISOString()})}).then(function(result){if(!result||!result.length)throw Error('Sem autorização.');});item.remove();}catch(e){resolve.textContent='Não foi possível salvar. Tente novamente.';resolve.disabled=false;}};
     item.append(title,text,link,attachment,resolve);host.append(item);
    });
   }).catch(function(){var note=document.createElement('p');note.textContent='Não foi possível carregar as denúncias do servidor. Atualize o painel.';host.prepend(note);});
  };
 }
 function init(){install();installReports();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

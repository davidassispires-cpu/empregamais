(function(){
 'use strict';
 var endpoint='https://mkezlcewyengejdmtppl.supabase.co/rest/v1/rpc/em_candidate_application_stages_v2';
 var publishable='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
 var pending=null,lastAttempt=0,failures=0,message='';
 function demo(){return new URLSearchParams(location.search).get('pagina')==='demo-candidato';}
 function identity(){return {email:String(sessionStorage.getItem('candidatoEmail')||'').trim().toLowerCase(),token:sessionStorage.getItem('empregaMaisSupabaseAccessToken')||'',uid:sessionStorage.getItem('candidatoUserId')||''};}
 function active(){return ['pagina-candidaturas','pagina-painel-candidato'].some(function(id){var page=document.getElementById(id);return page&&page.classList.contains('ativa');});}
 function statusUI(){
  var status=document.getElementById('cpApplicationSyncState'),button=document.getElementById('cpApplicationRefresh');
  if(status)status.textContent=demo()?'Demonstração · dados fictícios':message;
  if(button){button.disabled=!!pending;button.textContent=pending?'Atualizando…':'Atualizar';}
 }
 function key(id,job){return String(id)+'\n'+String(job);}
 function merge(rows,owner){
  var all=typeof window.carregarCandidaturas==='function'?window.carregarCandidaturas():[];
  if(!Array.isArray(all))all=[];
  var positions=new Map();
  all.forEach(function(c,i){var email=String(c.email||c.candidatoEmail||c.emailCandidato||c.candidato_email||'').trim().toLowerCase();if(email===owner.email)positions.set(key(c.id,c.vagaId||c.vaga_id||c.idVaga),i);});
  rows.forEach(function(row){
   if(!row||typeof row.application_ref!=='string'||!row.application_ref||typeof row.job_ref!=='string'||!row.job_ref||typeof row.status!=='string')return;
   var position=positions.get(key(row.application_ref,row.job_ref));
   var old=position===undefined?{}:all[position];
   var job=typeof window.localizarVaga==='function'?window.localizarVaga(row.job_ref):null;
   var updated=Object.assign({},old,{id:row.application_ref,vagaId:row.job_ref,email:owner.email,status:row.status,statusProcesso:row.status,statusAtualizadoEm:row.status_updated_at||''});
   if(Object.prototype.hasOwnProperty.call(row,'first_viewed_at')){updated.visualizadoEm=row.first_viewed_at||'';updated.visualizada=!!row.first_viewed_at;}
   updated.vaga=old.vaga||row.job_title||job&&job.cargo||'Processo seletivo';
   updated.empresa=old.empresa||job&&job.empresa||row.company_name||'Empresa';
   if(position===undefined){positions.set(key(row.application_ref,row.job_ref),all.length);all.push(updated);}else all[position]=updated;
  });
  if(typeof window.salvarCandidaturas==='function')window.salvarCandidaturas(all);
  document.dispatchEvent(new CustomEvent('empregamais:candidaturas-sincronizadas'));
 }
 async function sync(force){
  if(demo()){if(window.EmpregaMaisCandidaturasCandidato)window.EmpregaMaisCandidaturasCandidato.atualizar();statusUI();return;}
  var owner=identity();
  if(!owner.email||!owner.token||sessionStorage.getItem('empregaMaisPapel')==='empresa'){message='Entre na sua conta para atualizar.';statusUI();return;}
  if(pending)return pending;
  if(navigator.onLine===false){message='Sem conexão. Exibindo a última atualização.';statusUI();return;}
  if(!force&&(!active()||document.hidden||Date.now()-lastAttempt<Math.min(300000,60000*Math.pow(2,failures))))return;
  lastAttempt=Date.now();message='Atualizando o andamento…';
  pending=(async function(){
   var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},20000);
   try{
    var response=await fetch(endpoint,{method:'POST',headers:{apikey:publishable,Authorization:'Bearer '+owner.token,'Content-Type':'application/json'},body:'{}',cache:'no-store',signal:controller.signal});
    if(!response.ok)throw Error(response.status===401||response.status===403?'Sua sessão expirou. Entre novamente.':'Não foi possível atualizar. Tente novamente.');
    var rows=await response.json();if(!Array.isArray(rows))throw Error('Não foi possível atualizar. Tente novamente.');
    var current=identity();if(current.email!==owner.email||current.uid!==owner.uid||current.token!==owner.token||sessionStorage.getItem('empregaMaisPapel')==='empresa')return;
    merge(rows,owner);failures=0;message='Andamento atualizado.';
   }finally{clearTimeout(timer);}
  })().catch(function(error){failures++;message=error.name==='AbortError'?'A conexão demorou. Tente atualizar novamente.':error.message;}).finally(function(){pending=null;statusUI();});
  statusUI();return pending;
 }
 window.EmpregaMaisCandidaturasCloud={sincronizar:sync,atualizarIndicador:statusUI};
 function start(){
  ['pagina-candidaturas','pagina-painel-candidato'].forEach(function(id){var page=document.getElementById(id);if(page&&window.MutationObserver)new MutationObserver(function(){if(active())sync(false);}).observe(page,{attributes:true,attributeFilter:['class']});});
  window.addEventListener('focus',function(){sync(false);});window.addEventListener('online',function(){if(active())sync(true);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)sync(false);});
  document.addEventListener('empregamais:candidato-sincronizado',function(){lastAttempt=0;if(active())sync(false);});
  setInterval(function(){sync(false);},60000);if(active())sync(false);statusUI();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

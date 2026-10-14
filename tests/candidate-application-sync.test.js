'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

function environment({demo=false,fetcher}={}){
 const session=new Map([['candidatoEmail','ana@example.com'],['candidatoUserId','candidate-1'],['empregaMaisSupabaseAccessToken','candidate-token'],['empregaMaisPapel','candidato']]);
 let applications=[{id:'app-1',vagaId:'job-1',email:'ana@example.com',vaga:'Assistente Administrativo',empresa:'Empresa Exemplo',status:'Em avaliação',data:'2026-10-14'},{id:'app-other',vagaId:'job-1',email:'other@example.com',status:'Em contato'}];
 const events=[],requests=[];
 const context={location:{search:demo?'?pagina=demo-candidato':'?pagina=candidaturas'},sessionStorage:{getItem:key=>session.get(key)||null},navigator:{onLine:true},document:{readyState:'loading',hidden:false,addEventListener(){},getElementById(){return null;},dispatchEvent(event){events.push(event.type);}},URLSearchParams,AbortController,CustomEvent:class{constructor(type){this.type=type;}},Map,Date,Promise,setTimeout,clearTimeout,setInterval(){},addEventListener(){},carregarCandidaturas(){return applications;},salvarCandidaturas(rows){applications=rows;},fetch(url,options){requests.push({url,options});return fetcher?fetcher(url,options):Promise.resolve({ok:true,json:async()=>[{application_ref:'app-1',job_ref:'job-1',status:'Entrevista agendada',status_updated_at:'2026-10-14T10:00:00Z',job_title:'Assistente Administrativo',company_name:'Empresa',observacaoRecrutador:'PRIVATE NOTE'}]});}};
 context.window=context;
 vm.createContext(context);
 for(const file of ['processo-seletivo-etapas.js','candidato-candidaturas-sync.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
 return {context,session,events,requests,applications:()=>applications};
}

test('reads the recruiter stage and updates only the matching candidate application',async()=>{
 const env=environment();await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 const [mine,other]=env.applications();
 assert.equal(mine.status,'Entrevista agendada');
 assert.equal(mine.statusProcesso,mine.status);
 assert.equal(mine.statusAtualizadoEm,'2026-10-14T10:00:00Z');
 assert.equal(mine.empresa,'Empresa Exemplo');
 assert.equal(mine.data,'2026-10-14');
 assert.equal(mine.observacaoRecrutador,undefined,'Do not import internal recruiter fields');
 assert.equal(other.status,'Em contato');
 assert.equal(env.context.EmpregaMaisEtapasCandidatura.classificar(mine),'entrevista');
 assert(env.events.includes('empregamais:candidaturas-sincronizadas'));
 assert.equal(env.requests[0].options.headers.Authorization,'Bearer candidate-token');
});

test('deduplicates overlapping refreshes and ignores responses after an account switch',async()=>{
 let release;
 const env=environment({fetcher:()=>new Promise(resolve=>{release=resolve;})});
 const first=env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 const second=env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 assert.equal(env.requests.length,1);
 env.session.set('candidatoEmail','other@example.com');
 env.session.set('empregaMaisSupabaseAccessToken','other-token');
 release({ok:true,json:async()=>[{application_ref:'app-1',job_ref:'job-1',status:'Aprovado'}]});
 await Promise.all([first,second]);
 assert.equal(env.applications()[0].status,'Em avaliação');
 assert.equal(env.events.length,0);
});

test('preserves the last known status on failed requests and does not query without candidate auth',async()=>{
 const env=environment({fetcher:async()=>({ok:false,status:503})});
 await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 assert.equal(env.applications()[0].status,'Em avaliação');
 env.session.delete('empregaMaisSupabaseAccessToken');
 await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 env.session.set('empregaMaisSupabaseAccessToken','company-token');env.session.set('empregaMaisPapel','empresa');
 await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 assert.equal(env.requests.length,1);
});

test('the isolated demo refreshes without making a backend request',async()=>{
 const env=environment({demo:true});let refreshed=0;
 env.context.EmpregaMaisCandidaturasCandidato={atualizar(){refreshed++;}};
 await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 assert.equal(env.requests.length,0);
 assert.equal(refreshed,1);
 assert.equal(env.applications()[0].status,'Em avaliação');
});

test('new server records can be shown without a browser-local application or resume',async()=>{
 const env=environment({fetcher:async()=>({ok:true,json:async()=>[{application_ref:'app-new',job_ref:'job-new',status:'Contratado',job_title:'Analista de RH',company_name:'Empresa',status_updated_at:'2026-10-14T10:00:00Z'}]})});
 await env.context.EmpregaMaisCandidaturasCloud.sincronizar(true);
 const row=env.applications().find(item=>item.id==='app-new');
 assert.equal(row.vaga,'Analista de RH');assert.equal(row.email,'ana@example.com');
 assert.equal(row.status,'Contratado');assert.equal(row.curriculoDados,undefined);
});

test('older queued recruiter changes acquire the candidate identity before being retried',async()=>{
 const session=new Map([['empresaCnpj','12345678000199'],['empregaMaisSupabaseAccessToken','company-token'],['empregaMaisPapel','empresa']]);
 const persisted=new Map([['emRecruiterPending:12345678000199',JSON.stringify({'app-1':{application_ref:'app-1',job_ref:'job-1',state:{status:'Em contato'}}})]]);
 const listeners={},requests=[];
 let applications=[{id:'app-1',vagaId:'job-1',candidatoEmail:'ana@example.com',vaga:'Assistente Administrativo',status:'Em avaliação'}];
 const context={sessionStorage:{getItem:key=>session.get(key)||null},localStorage:{getItem:key=>persisted.get(key)||null,setItem:(key,value)=>persisted.set(key,value)},navigator:{onLine:true},document:{readyState:'loading',hidden:false,addEventListener:(type,fn)=>listeners[type]=fn,getElementById(){return null;},querySelector(){return null;}},AbortController,Map,Set,Date,Promise,setTimeout(){return 1;},clearTimeout(){},setInterval(){},addEventListener(){},vagasDaEmpresa(){return [{id:'job-1'}];},carregarCandidaturas(){return JSON.parse(JSON.stringify(applications));},salvarCandidaturas(rows){applications=rows;},fetch:async(url,options)=>{const body=JSON.parse(options.body);requests.push(body);return {ok:true,text:async()=>JSON.stringify(body.p_changes.map(change=>({application_ref:change.application_ref,job_ref:change.job_ref,state:change.state,candidate_uid:'candidate-1'})))};}};
 context.window=context;vm.createContext(context);
 for(const file of ['processo-seletivo-etapas.js','recruiter-sync-and-reports.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
 listeners.DOMContentLoaded();
 await context.sincronizarEstadoCandidaturasEM(true);
 const change=requests[1].p_changes[0];
 assert.equal(change.candidate_email,'ana@example.com');
 assert.equal(change.job_title,'Assistente Administrativo');
 assert.equal(change.state.status,'Em contato','Do not overwrite an older pending change during association');
 session.set('empregaMaisPapel','candidato');
 await context.sincronizarEstadoCandidaturasEM(true);
 assert.equal(requests.length,2,'Candidate sessions must not write recruiter state');
});

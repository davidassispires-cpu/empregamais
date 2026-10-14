'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../candidato-demo.js'),'utf8');
function createContext(search){
 const nativeLocal=new Map([['real-account','untouched']]),nativeSession=new Map([['empregaMaisPapel','empresa']]);
 const wrap=map=>({getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)});
 const listeners={},calls=[],notice={textContent:''},page={querySelector(){return {}},insertBefore(){},classList:{contains(){return true;},add(){}}};
 const originalFetch=()=>{calls.push('real-fetch');return Promise.resolve(new Response('{}'))};
 const ctx={location:{search,href:'https://example.com/'+search,pathname:'/',origin:'https://example.com'},localStorage:wrap(nativeLocal),sessionStorage:wrap(nativeSession),fetch:originalFetch,URLSearchParams,URL,Response,Promise,Map,Date,JSON,Object,btoa:s=>Buffer.from(s,'binary').toString('base64'),setTimeout:fn=>fn(),history:{pushState(a,b,url){ctx.location.href=url},replaceState(a,b,url){ctx.location.href=url}},document:{documentElement:{classList:{add(){}}},head:{appendChild(){}},getElementById(id){return id==='pagina-painel-candidato'?page:id==='emCandidateDemoNotice'?notice:null},createElement(){return {style:{}}},querySelectorAll(){return []},addEventListener(){}},addEventListener(type,fn){listeners[type]=fn},abrirRota(route,id){calls.push([route,id])},EmpregaMaisPerfilCloud:{refresh(){throw Error('Real profile refresh must not run')}}};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);return {ctx,listeners,calls,nativeLocal,nativeSession,originalFetch};
}
for(const route of ['demo-recrutador','painel-empresa','painel-candidato','home']){
 const env=createContext('?pagina='+route);
 assert.equal(env.ctx.fetch,env.originalFetch);
 assert.equal(env.ctx.localStorage.getItem('real-account'),'untouched');
 assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),'empresa');
 assert.equal(Object.keys(env.listeners).length,0,'Other pages must have no demo behavior');
 assert.equal(env.nativeLocal.size,1);
}
const env=createContext('?pagina=demo-candidato');
assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),null,'No demo login during the application startup');
assert.equal(env.nativeSession.get('empregaMaisPapel'),'empresa','The real session must be preserved');
env.ctx.localStorage.setItem('candidatosEmpregaMais','[]');
env.listeners.load();
assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),'candidato');
assert.equal(env.calls[0][0],'painel-candidato','Reuse the existing candidate route');
const candidates=JSON.parse(env.ctx.localStorage.getItem('candidatosEmpregaMais'));
assert.equal(candidates[0].nome,'Ana Exemplo');
assert.equal(env.ctx.carregarCandidaturas().length,2);
assert.equal(env.ctx.carregarVagasPortal().length,2);
const cv=JSON.parse(env.ctx.localStorage.getItem('curriculoEmpregaMais_ana@example.com'));
assert(Buffer.from(cv.dados.split(',')[1],'base64').toString('binary').startsWith('%PDF-1.4'));
env.ctx.irPara('candidaturas');
assert.equal(env.calls.at(-1)[0],'candidaturas');
assert.equal(new URL(env.ctx.location.href).searchParams.get('pagina'),'demo-candidato');
env.ctx.irPara('curriculo');assert.equal(env.calls.at(-1)[0],'curriculo');
env.ctx.irPara('painel-admin');assert.equal(env.calls.at(-1)[0],'painel-candidato');
assert.equal(env.nativeLocal.get('real-account'),'untouched');
assert([...env.nativeLocal.keys()].every(k=>k==='real-account'||k.startsWith('emCandidatePreviewV1:')));
(async()=>{
 const response=await env.ctx.fetch('https://example.supabase.co/rest/v1/candidatos?user_id=eq.demo');
 assert.equal((await response.json())[0].nome,'Ana Exemplo');
 await env.ctx.EmpregaMaisPerfilCloud.refresh();
 assert(!env.calls.includes('real-fetch'));
 console.log('PASS: existing company and production pages untouched; real session preserved; candidate demo uses existing routes, isolated sample data, resume and local backend responses.');
})().catch(e=>{console.error(e);process.exitCode=1;});

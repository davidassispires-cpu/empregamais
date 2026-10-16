const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../candidato-preparacao.js');
const now=Date.parse('2026-10-16T15:00:00Z');
const job={dataPublicacao:'2026-10-15T15:00:00Z',totalCandidaturas:14};
test('low competition starts exactly at 24 hours and ends at 15 applications',()=>{
 assert.equal(core.baixaConcorrencia(job,now-1),false);
 assert.equal(core.baixaConcorrencia(job,now),true);
 assert.equal(core.baixaConcorrencia({...job,totalCandidaturas:15},now),false);
 assert.equal(core.baixaConcorrencia({...job,totalCandidaturas:0},now),true);
});
test('missing or invalid totals and dates cannot imply low competition',()=>{
 for(const count of [undefined,null,'',-1,1.5,NaN,true,'unknown'])assert.equal(core.baixaConcorrencia({...job,totalCandidaturas:count},now),false);
 for(const date of [undefined,'invalid','2026-10-17T15:00:00Z'])assert.equal(core.baixaConcorrencia({...job,dataPublicacao:date},now),false);
 assert.equal(core.baixaConcorrencia({created_at:job.dataPublicacao,candidaturas_count:'14'},now),true);
 assert.equal(core.baixaConcorrencia({...job,status:'encerrada'},now),false);
 assert.equal(core.baixaConcorrencia({...job,expiraEm:'2026-10-16T14:00:00Z'},now),false);
});
test('only a current Premium candidate sees the badge and refreshed counts remove it',()=>{
 const live={dataPublicacao:new Date(Date.now()-86400001).toISOString(),totalCandidaturas:14};
 global.obterCandidatoAtual=()=>({plano:'gratis'});
 assert.equal(core.seloBaixaConcorrencia(live),'');
 global.obterCandidatoAtual=()=>({plano:'premium',premium_valido_ate:new Date(Date.now()+86400000).toISOString()});
 assert.match(core.seloBaixaConcorrencia(live),/Baixa concorrência/);
 assert.equal(core.seloBaixaConcorrencia({...live,totalCandidaturas:15}),'');
 global.obterCandidatoAtual=()=>({plano:'premium',premium_valido_ate:'2000-01-01'});
 assert.equal(core.seloBaixaConcorrencia(live),'');
 delete global.obterCandidatoAtual;
});

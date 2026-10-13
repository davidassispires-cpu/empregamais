'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const P=require('../planos-config.js');
const expected={mensal:[49.90,8,0,0,0],trimestral:[129.90,30,2,2,1],semestral:[239.90,70,4,4,2],anual:[399.90,150,6,6,3]};
for(const [key,values] of Object.entries(expected)){let p=P.get(key);assert.deepEqual([p.preco,p.vagas,p.destaques,p.urgentes,p.confidenciais],values);}
const now=Date.parse('2026-10-13T12:00:00Z');
const e={id:'company-a',cnpj:'11111111111111',plano_id:'trimestral',plano:'basico',plano_inicio:'2026-09-13T12:00:00Z',plano_valido_ate:'2026-12-13T12:00:00Z'};
assert.equal(P.companyKey(e,now),'trimestral');
assert.equal(P.companyKey({...e,plano_valido_ate:new Date(now).toISOString()},now),'basico');
assert.equal(P.companyKey({...e,suspensa_admin:true},now),'basico');
assert.equal(P.cycle('2026-01-31T10:00:00Z','2026-02-28T10:00:00Z').inicio,'2026-02-28T10:00:00.000Z');
assert.equal(P.cycle('2026-01-31T10:00:00Z','2026-03-30T10:00:00Z').inicio,'2026-02-28T10:00:00.000Z');
assert.equal(P.cycle('2026-01-31T10:00:00Z','2026-03-31T10:00:00Z').inicio,'2026-03-31T10:00:00.000Z');
assert.equal(P.cycle('2028-01-31T10:00:00Z','2028-02-29T10:00:00Z').inicio,'2028-02-29T10:00:00.000Z');
const jobs=[
 {empresa_id:'company-a',criadoEm:'2026-09-14T12:00:00Z',status:'encerrada'},
 {empresa_id:'company-a',criadoEm:'2026-10-01T12:00:00Z',status:'pendente'},
 {empresa_id:'company-a',criadoEm:'2026-09-12T12:00:00Z',status:'ativa'},
 {empresa_id:'company-b',criadoEm:'2026-10-01T12:00:00Z',status:'ativa'}
];
assert.equal(P.publicationCount(e,jobs,now),2,'closed jobs still consume a publication; previous subscriptions and other companies do not');
assert.equal(P.serviceActive({destaque:true,destaqueAte:'2026-10-13T11:59:59Z'},'destaque',now),false);
assert.equal(P.serviceActive({destaque:true,destaqueAte:'2026-10-14T12:00:00Z'},'destaque',now),true);
assert.deepEqual(Object.values(P.services).map(s=>s.dias),[15,7,15]);
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function extract(source,name){let m=new RegExp('function\\s+'+name+'\\s*\\(').exec(source);assert(m,name);let a=source.indexOf('{',m.index),depth=0,q=null,esc=false;for(let i=a;i<source.length;i++){const c=source[i];if(q){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===q)q=null;}else if(['"',"'",'`'].includes(c))q=c;else if(c==='{')depth++;else if(c==='}'&&--depth===0)return source.slice(m.index,i+1);}throw Error(name);}
const context=vm.createContext({window:{EMPlanos:P}});
vm.runInContext(extract(html,'planoCardNovoEM')+'\n'+extract(html,'htmlPlanosNovosEmpregaMais'),context);
const rendered=vm.runInContext('htmlPlanosNovosEmpregaMais()',context);
for(const [key,v] of Object.entries(expected)){assert(rendered.includes('data-plano-em="'+key+'"'));assert(rendered.includes(P.money(v[0]).replace(/\u00a0/g,' '))||rendered.includes(P.money(v[0])));assert(rendered.includes(P.quotaText(key)));}
assert(!/6 vagas por mês|12 vagas por mês|25 vagas por mês|60 vagas por mês|720 no período/.test(rendered));
assert(fs.readFileSync(path.join(root,'empresa-cadastro-etapas.js'),'utf8').includes("heading.textContent='Cadastre sua empresa grátis'"));
for(const file of ['planos-config.js','empresa-cadastro-etapas.js','empregamais_lote3.js','empregamais_lote5.js','empregamais_lote7.js','empregamais_lote10.js','empregamais_lote14.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
console.log('PASS: prices, period quotas, expiry, calendar renewal, company isolation, rendered cards, cadastro heading and JavaScript syntax.');

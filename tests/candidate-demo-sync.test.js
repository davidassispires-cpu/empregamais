const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('recruiter changes persist into the candidate demo without altering real application storage',()=>{
 const values=new Map([['candidaturasEmpregaMais','REAL APPLICATIONS']]);
 const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 function panel(){
  const events=[],context={window:{localStorage:storage},document:{dispatchEvent(event){events.push(event.type);}},Event:class{constructor(type){this.type=type;}},Date,JSON};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../processo-seletivo-etapas.js'),'utf8'),context);
  return {api:context.window.EmpregaMaisEtapasCandidatura,events};
 }
 const recruiter=panel(),candidate=panel(),rows=recruiter.api.demo();
 const ana=rows.find(row=>row.id==='demo-c0');
 assert.equal(ana.email,'ana@example.com');
 for(const stage of recruiter.api.etapas){
  ana.status=stage.label;ana.statusAtualizadoEm=new Date().toISOString();recruiter.api.salvarDemo(rows);
  const after=candidate.api.demo().find(row=>row.id===ana.id);
  assert.equal(after.status,stage.label);
  assert.equal(candidate.api.classificar(after),stage.key);
  assert.equal(after.vagaId,ana.vagaId);
 }
 assert.equal(candidate.api.demo().filter(row=>row.email==='ana@example.com').length,2);
 assert.equal(values.get('candidaturasEmpregaMais'),'REAL APPLICATIONS');
 assert.equal(recruiter.events.at(-1),'empregamais:candidaturas-sincronizadas');
 const page=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(page.indexOf('processo-seletivo-etapas.js')<page.indexOf('candidato-demo.js'),'shared demo must capture original storage before candidate isolation');
});

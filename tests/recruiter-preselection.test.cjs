'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../recruiter-preselection.js');
const source=fs.readFileSync(require.resolve('../recruiter-preselection.js'),'utf8');
const sample=()=>[{id:'one',vagaId:'job-one',status:'Em avaliação',statusAtualizadoEm:'2026-10-01',historicoEtapasPublico:[{status:'Em avaliação'}],favoritoRecrutador:false},{id:'two',vagaId:'job-one',status:'Entrevista agendada'},{id:'three',vagaId:'job-two',status:'Contratado'}];
test('preselection only changes the private flag of the exact application and job',()=>{
 const rows=sample(),updated=core.update(rows,'one','job-one',true,['job-one']);
 assert.equal(core.selected(updated[0]),true);assert.equal(rows[0].preSelecionadoRecrutador,undefined);
 assert.deepEqual(Object.keys(updated[0]).filter(key=>!Object.hasOwn(rows[0],key)),['preSelecionadoRecrutador']);
 for(const key of Object.keys(rows[0]))assert.deepEqual(updated[0][key],rows[0][key]);
 assert.equal(updated[1],rows[1]);assert.equal(updated[2],rows[2]);
 const cleared=core.update(updated,'one','job-one',false,['job-one']);assert.equal(core.selected(cleared[0]),false);assert.equal(cleared[0].status,'Em avaliação');
});
test('other jobs, other companies and invalid flag types are rejected',()=>{
 assert.throws(()=>core.update(sample(),'one','job-two',true,['job-two']));
 assert.throws(()=>core.update(sample(),'three','job-two',true,['job-one']));
 assert.throws(()=>core.update(sample(),'one','job-one','true',['job-one']));
 for(const value of ['true',1,null,undefined,false])assert.equal(core.selected({preSelecionadoRecrutador:value}),false);
});
test('existing recruiter favorites become preselected and an explicit removal takes precedence',()=>{
 const old={id:'legacy',vagaId:'job-one',favoritoRecrutador:true,status:'Em avaliação'};
 assert.equal(core.selected(old),true);
 const removed=core.update([old],'legacy','job-one',false,['job-one'])[0];
 assert.equal(core.selected(removed),false);assert.equal(removed.favoritoRecrutador,true);assert.equal(removed.status,old.status);
});
test('the existing favorite button is reused with a single private selection action',()=>{
 const attrs=new Map(),classes=new Set(['gc-ref-favorite']),span={textContent:''};let writes=0;
 const button={dataset:{},onclick(){throw Error('The old favorite handler must not run');},classList:{add:key=>classes.add(key),contains:key=>classes.has(key),toggle(key,on){on?classes.add(key):classes.delete(key);}},getAttribute:key=>attrs.get(key)||null,setAttribute:(key,value)=>attrs.set(key,value),querySelector:()=>span,set innerHTML(value){writes++;},get innerHTML(){return '';}};
 const context={selected:core.selected};vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf(' function icon(){'),source.indexOf(' function enhance(){')),context);
 context.prepare(button,{id:'one',preSelecionadoRecrutador:false},'job-one');
 assert.equal(button.onclick,null);assert.equal(button.dataset.rpsToggle,'one');assert.equal(span.textContent,'Pré-selecionar');assert.equal(attrs.get('aria-pressed'),'false');
 context.prepare(button,{id:'one',preSelecionadoRecrutador:true},'job-one');
 assert.equal(writes,1,'Repainting reuses the existing button');assert.equal(span.textContent,'Pré-selecionado');assert.equal(attrs.get('aria-pressed'),'true');assert.match(button.title,/apenas para a empresa/);
});
function browser(){
 let saved=JSON.stringify(sample()),refreshes=0;
 const values=new Map([['vagaCandidatosSelecionada','job-one'],['empresaCnpj','11111111000111'],['empregaMaisPapel','empresa']]);
 const context={document:{readyState:'loading',addEventListener(){},getElementById:()=>null},sessionStorage:{getItem:key=>values.get(key)||null},vagasDaEmpresa:()=>[{id:'job-one'}],carregarCandidaturas:()=>JSON.parse(saved),salvarCandidaturas:rows=>{saved=JSON.stringify(rows);},requestAnimationFrame(){}};
 context.window=context;vm.runInNewContext(source,context);
 const api=context.EMRecruiterPreselection;api.attach('job-one',()=>refreshes++);
 return {context,values,api,read:()=>JSON.parse(saved),refreshes:()=>refreshes};
}
test('marking, filtering and clearing persist independently from the application stage',()=>{
 const {api,read,refreshes}=browser();
 assert.equal(api.toggle('one','job-one'),true);assert.equal(refreshes(),1);assert.equal(read()[0].preSelecionadoRecrutador,true);
 api.changeFilter();assert.equal(api.active('job-one'),true);assert.deepEqual(api.filtered(read(),'job-one').map(row=>row.id),['one']);
 api.toggle('one','job-one');assert.equal(api.filtered(read(),'job-one').length,0);assert.equal(read()[0].status,'Em avaliação');
 api.changeFilter();assert.equal(api.filtered(read(),'job-one').length,3);
});
test('a changed company resets the private filter and a candidate cannot change any flag',()=>{
 const {api,values,read}=browser();api.toggle('one','job-one');api.changeFilter();assert.equal(api.active('job-one'),true);
 values.set('empresaCnpj','22222222000122');assert.equal(api.active('job-one'),false);
 values.set('empregaMaisPapel','candidato');const before=read();assert.equal(api.toggle('one','job-one'),false);assert.deepEqual(read(),before);
 values.set('empregaMaisPapel','empresa');values.set('vagaCandidatosSelecionada','job-two');assert.equal(api.toggle('one','job-one'),false);
});
test('the synchronizer queues only the changed private field, including an explicit false',()=>{
 const syncSource=fs.readFileSync(require.resolve('../recruiter-sync-and-reports.js'),'utf8');
 let saved=sample();
 const context={window:{carregarCandidaturas:()=>JSON.parse(JSON.stringify(saved)),salvarCandidaturas:rows=>{saved=JSON.parse(JSON.stringify(rows));}},pending:{},remote:{},timer:null,owner:'company',fields:[],document:{dispatchEvent(){}},Event:class{},switchOwner(){},ownedJobs:()=>new Set(['job-one']),token:()=>true,job:core.jobId,recipient:(row,change)=>change,remember(){},show(){},clearTimeout(){},setTimeout:()=>1};
 vm.createContext(context);vm.runInContext(syncSource.match(/var fields=([^;]+);/)[0]+syncSource.slice(syncSource.indexOf(' function install(){'),syncSource.indexOf('  function recordOpenedApplication(){'))+'\n}\ninstall();',context);
 context.window.salvarCandidaturas(core.update(context.window.carregarCandidaturas(),'one','job-one',true,['job-one']));
 assert.equal(JSON.stringify(context.pending.one.state),JSON.stringify({preSelecionadoRecrutador:true}));
 context.window.salvarCandidaturas(core.update(context.window.carregarCandidaturas(),'one','job-one',false,['job-one']));
 assert.equal(JSON.stringify(context.pending.one.state),JSON.stringify({preSelecionadoRecrutador:false}));
});

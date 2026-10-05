const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(fetchRows){
 const context={console,URLSearchParams,Date,Set,Map,Number,String,Promise,window:{},document:{addEventListener(){}},location:{search:''},sessionStorage:{getItem(){return null}},sbVagasCacheEM:[{id:'stale',status:'aprovada'},{id:'private',status:'pendente'}],EMPREGAMAIS_SUPABASE_URL:'https://example.test',sbHeadersEM:()=>({}),sbJsonEM:fetchRows,sbMapVagaEM:r=>r,gravar(){},vagaDentroPrazo:()=>true,abrirRota(){},sbCarregarVagasEM(){},vagasPublicas(){},renderizarVagasPortal(){}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('novo/assets/js/portal-jobs.js','utf8'),context);return context;
}
test('normalizes accented search, corrupted contract labels and zero coordinates',()=>{
 const c=setup();assert.equal(c.textoBuscaPortalEM('  São José  '),'sao jose');assert.equal(c.textoContratoPortalEM('Estágio. Você precisa de um cadastro válido '+'.'.repeat(200)),'Estágio');assert.equal(c.textoContratoPortalEM('Efetivo – CLT'),'CLT');assert.equal(c.coordenadaPortalEM(0),0);assert.equal(c.coordenadaPortalEM(null),null);
});
test('loads all pages, removes stale public jobs and retains private cache',async()=>{
 let count=0;const c=setup(async()=>++count===1?Array.from({length:500},(_,i)=>({id:String(i),status:'aprovada'})):[{id:'last',status:'aprovada'}]);
 const rows=await c.sbCarregarVagasEM();assert.equal(rows.length,501);assert.equal(count,2);assert.equal(c.sbVagasCacheEM.some(v=>v.id==='stale'),false);assert.equal(c.sbVagasCacheEM.some(v=>v.id==='private'),true);await c.sbCarregarVagasEM();assert.equal(count,2);
});
test('coalesces concurrent catalog requests and keeps the last successful response on failure',async()=>{
 let count=0;const c=setup(async()=>{count++;return [{id:'live',status:'aprovada'}];});await Promise.all([c.sbCarregarVagasEM(),c.sbCarregarVagasEM()]);assert.equal(count,1);c.sbJsonEM=async()=>{throw Error('offline')};await assert.rejects(c.sbCarregarVagasEM(true));assert.equal(c.vagasPublicas()[0].id,'live');
});

test('salary presentation handles maximum-only, fixed, ranged and undisclosed values',()=>{
 const c=setup();
 const spaces=s=>s.replace(/\s/g,' ');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'R$ 0,00',salarioMax:'R$ 2.200,00'})),'Até R$ 2.200,00');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'1621',salarioMax:'5000'})),'R$ 1.621,00 a R$ 5.000,00');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'2200',salarioMax:'2200'})),'R$ 2.200,00');
 assert.equal(c.textoSalarioPortalEM({salario:0,salarioMax:0}),'Salário a combinar');
 assert.equal(c.textoSalarioPortalEM({salario:5000,salarioCombinar:true}),'Salário a combinar');
});

test('salary presentation retains legacy ranges stored in a single field',()=>{
 const c=setup();const spaces=s=>s.replace(/\s/g,' ');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'R$ 0,00 a R$ 1.100,00',salarioMax:null})),'Até R$ 1.100,00');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'R$ 1.621,00 a R$ 5.000,00'})),'R$ 1.621,00 a R$ 5.000,00');
 assert.equal(spaces(c.textoSalarioPortalEM({salario:'Até R$ 2.200,00'})),'Até R$ 2.200,00');
});

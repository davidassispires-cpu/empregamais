const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const C = require('../admin-core.js');

test('preview actions change only their copy and register a decision',()=>{
 const original=C.demoSeed();const next=C.applyDemo(original,{kind:'jobs',id:'vaga-exemplo-0',action:'approve'});
 assert.equal(original.jobs[0].status,'pendente');assert.equal(next.jobs[0].status,'aprovada');assert.equal(next.history.length,original.history.length+1);
 assert.throws(()=>C.applyDemo(original,{kind:'jobs',id:'missing',action:'approve'}),/encontrado/);
 assert.throws(()=>C.applyDemo(original,{kind:'jobs',id:'vaga-exemplo-0',action:'reject',reason:''}),/motivo/);
});
test('plan courtesies replace the preview subscription and respect duration',()=>{
 const seed=C.demoSeed();const next=C.applyDemo(seed,{kind:'companies',id:'empresa-exemplo-0',action:'grantPlan',plan:'anual',days:365});
 assert.equal(next.companies[0].plano_id,'anual');assert.equal(next.subscriptions.filter(s=>s.empresa_id==='empresa-exemplo-0').length,1);
 assert.equal(next.subscriptions[0].valor_pago,0);assert.throws(()=>C.applyDemo(seed,{kind:'companies',id:'empresa-exemplo-0',action:'grantPlan',plan:'anual',days:0}),/duração/);
});
test('verification decisions update the company; reports can suspend the linked job',()=>{
 const seed=C.demoSeed();const verified=C.applyDemo(seed,{kind:'verifications',id:'verificacao-exemplo-0',action:'approveVerification'});
 assert.equal(verified.companies[2].verificada,true);assert.equal(verified.verifications[0].status,'verificada');
 const resolved=C.applyDemo(seed,{kind:'reports',id:'denuncia-exemplo-0',action:'suspendJob'});assert.equal(resolved.jobs[7].status,'suspensa');assert.equal(resolved.reports[0].status,'resolvida');
});
test('expired jobs cannot be reactivated; expired or suspended plans are free',()=>{
 const seed=C.demoSeed();seed.jobs[0].data_encerramento='2000-01-01';assert.throws(()=>C.applyDemo(seed,{kind:'jobs',id:'vaga-exemplo-0',action:'approve'}),/prazo/);
 assert.equal(C.planActive({plano_id:'anual',plano_valido_ate:'2000-01-01'}),'basico');assert.equal(C.planActive({plano_id:'anual',plano_valido_ate:'2099-01-01',suspensa_admin:true}),'basico');
});
test('search is accent-insensitive and IDs survive filtering',()=>{
 const rows=[{id:'first',nome:'Júlia',status:'ativa'},{id:'second',nome:'Paulo',status:'suspensa'}];
 assert.equal(C.filter(rows,'julia','ativa')[0].id,'first');assert.equal(C.filter(rows,'','suspensa')[0].id,'second');
});
test('untrusted text and exports cannot become HTML or spreadsheet formulas',()=>{
 assert.equal(C.escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
 assert.equal(C.safeUrl('javascript:alert(1)'),'');assert.equal(C.safeUrl('https://example.com'),'https://example.com/');
 const csv=C.csv(['Nome'],[['=SUM(1;1)'],['\t=RUN()'],['João "Exemplo"']]);assert.ok(csv.includes('"\'=SUM(1;1)"'));assert.ok(csv.includes('João ""Exemplo""'));
});
test('admin catalog matches the actual portal plan catalog',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../admin-catalog.js'),'utf8'),context);
 const catalog=JSON.parse(JSON.stringify(context.window.EMAdminCatalog));assert.deepEqual(catalog,require('../planos-config.js').catalog);
 assert.deepEqual(['mensal','trimestral','semestral','anual'].map(k=>catalog[k].vagas),[8,30,70,150]);assert.equal(catalog.mensal.destaques,0);
});

test('legacy administrative routes open the independent workspace without copying credentials',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const code=html.match(/<script id="em-admin-workspace-route">([\s\S]*?)<\/script>/)[1];
 for(const route of ['admin','login-admin']){
  const destinations=[];const location={href:'https://example.com/empregamais/?pagina='+route+'&token=private',search:'?pagina='+route+'&token=private',replace:url=>destinations.push(url)};
  vm.runInNewContext(code,{window:{},location,URL,URLSearchParams});
  assert.deepEqual(destinations,['https://example.com/empregamais/admin.html']);
 }
 const destinations=[];
 vm.runInNewContext(code,{window:{},location:{href:'https://example.com/empregamais/?pagina=home',search:'?pagina=home',replace:url=>destinations.push(url)},URL,URLSearchParams});
 assert.equal(destinations.length,0);
});

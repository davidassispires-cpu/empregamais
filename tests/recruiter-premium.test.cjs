'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../recruiter-premium.js');
test('comparison only accepts up to three applications from one job',()=>{
 const rows=[1,2,3].map(id=>({id,vagaId:'A'}));
 assert.equal(core.selectionError([],rows[0]),'');
 assert.equal(core.selectionError(rows.slice(0,2),rows[2]),'');
 assert.match(core.selectionError(rows,{id:4,vagaId:'A'}),/até 3/);
 assert.match(core.selectionError(rows.slice(0,1),{id:4,vaga_id:'B'}),/mesma vaga/);
 assert.equal(core.selectionError(rows,rows[0]),'');
});
test('comparison extracts only professional fields from submitted snapshots',()=>{
 const candidate={data_nascimento:'1990-01-01',orientacao_sexual:'private',perfil_profissional:{escolaridade:'Superior completo',experiencia:'3 anos',habilidades:['Excel','Atendimento'],pretensao_salarial:'R$ 3.000'},curriculoOnline:{objetivoProfissional:'Assistente Administrativo'}};
 const facts=core.comparisonFacts(candidate);
 assert.equal(facts.length,5);
 assert.equal(facts[0][1],'3 anos');
 assert.equal(facts[1][1],'Superior completo');
 assert.equal(facts[2][1],'Excel; Atendimento');
 assert.equal(facts[3][1],'R$ 3.000');
 assert.equal(facts[4][1],'Assistente Administrativo');
 assert.ok(!JSON.stringify(facts).includes('1990'));
 assert.ok(!JSON.stringify(facts).includes('private'));
 assert.ok(core.comparisonFacts({}).every(row=>row[1]==='Não informado'));
});
test('preview replaces literal tokens safely, including replacement special characters',()=>{
 assert.equal(core.preview('Olá, {candidato}. {empresa}: {vaga} · {etapa}',{candidato:'Ana $&',empresa:'A & B',vaga:'RH',etapa:'Em contato'}),'Olá, Ana $&. A & B: RH · Em contato');
 assert.equal(core.templateError('Olá {candidato}!'), '');
 assert.match(core.templateError('Olá {email}'),/apenas/);
 assert.match(core.templateError('   '),/Escreva/);
 assert.match(core.templateError('x'.repeat(4001)),/4.000/);
});
test('HTML displayed in comparison cells is escaped',()=>{
 assert.equal(core.esc('<img onerror="x"> & \'x\''),'&lt;img onerror=&quot;x&quot;&gt; &amp; &#39;x&#39;');
});

test('company identity remains stable when the profile receives its remote ID',()=>{
 const before={company:{cnpj:'12.345.678/0001-90'}};
 const after={company:{cnpj:'12345678000190',id:'remote-company-id'}};
 assert.equal(core.companyIdentity(before),core.companyIdentity(after));
 assert.notEqual(core.companyIdentity(before),core.companyIdentity({company:{cnpj:'98765432000199'}}));
});
test('tools follow the Premium state of the displayed panel',()=>{
 const plans={get:()=>({pago:false}),companyKey:()=> 'basico'};
 assert.equal(core.premiumEnabled({premium:true,company:{}},plans),true);
 assert.equal(core.premiumEnabled({premium:false,company:{}},plans),false);
 assert.equal(core.premiumEnabled({company:{}},plans),false);
});
test('loading agenda and message rules no longer queries interview evaluations',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),requests=[];
 const token='header.'+Buffer.from(JSON.stringify({sub:'recruiter-user'})).toString('base64url')+'.signature';
 const interview={id:'interview-1',state:'confirmed'},rule={id:'rule-1',stage_key:'entrevista'};
 function surface(){return {querySelector:()=>null,querySelectorAll:()=>[],append:()=>{},getElementById:()=>null};}
 const sandbox={document:{head:surface(),hidden:false,createElement:()=>({dataset:{},textContent:''}),getElementById:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}},sessionStorage:{getItem:()=>token},atob,requestAnimationFrame:()=>1,setInterval:()=>1,MutationObserver:class {observe(){}disconnect(){}},addEventListener:()=>{},EMInterviews:{api:async(path)=>{requests.push(path);if(path.startsWith('em_interviews?'))return [interview];if(path.startsWith('em_recruiter_message_rules?'))return [rule];throw Error('Unexpected request: '+path);}}};
 sandbox.window=sandbox;
 vm.runInNewContext(fs.readFileSync(require.resolve('../recruiter-premium.js'),'utf8'),sandbox);
 sandbox.EMRecruiterPremium.sync(surface(),{view:'interviews',premium:true,company:{id:'11111111-1111-4111-8111-111111111111',cnpj:'12345678000190'},jobs:[],applications:[],demo:false});
 const data=await sandbox.EMRecruiterPremium.load(true);
 assert.equal(requests.length,2);
 assert.equal(data.interviews[0].id,'interview-1');
 assert.equal(data.rules[0].id,'rule-1');
 assert.equal('scores' in data,false);
});
test('tool styles are mounted synchronously and reused across panel renders',()=>{
 const fs=require('node:fs'),vm=require('node:vm');
 class Element {
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.textContent='';}
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
  querySelectorAll(s){const tag=s.startsWith('style')?'STYLE':s.startsWith('link')?'LINK':null;return tag?this.children.filter(c=>c.tagName===tag&&c.dataset.emPremiumStyle):[];}
  append(node){node.parent=this;this.children.push(node);}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
 }
 const head=new Element('head'),shadow=new Element('shadow');
 const token='header.'+Buffer.from(JSON.stringify({sub:'recruiter-user'})).toString('base64url')+'.signature';
 const document={head,hidden:false,createElement:tag=>new Element(tag),getElementById:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};
 const sandbox={document,sessionStorage:{getItem:()=>token},atob,requestAnimationFrame:()=>1,setInterval:()=>1,MutationObserver:class {observe(){}disconnect(){}},addEventListener:()=>{}};
 sandbox.window=sandbox;
 vm.runInNewContext(fs.readFileSync(require.resolve('../recruiter-premium.js'),'utf8'),sandbox);
 const context={view:'jobs',premium:true,company:{cnpj:'12345678000190'},jobs:[],applications:[],demo:false};
 sandbox.EMRecruiterPremium.sync(shadow,context);
 assert.equal(shadow.children.length,1);
 assert.equal(head.children.length,1);
 assert.equal(shadow.children[0].tagName,'STYLE');
 assert.match(shadow.children[0].textContent,/\.emp-tasks\{display:grid!important/);
 assert.match(shadow.children[0].textContent,/@media\(max-width:600px\)/);
 sandbox.EMRecruiterPremium.sync(shadow,{...context,company:{...context.company,id:'remote-id'}});
 assert.equal(shadow.children.length,1);
 assert.equal(head.children.length,1);
 assert.equal(shadow.children.some(c=>c.tagName==='LINK'),false);
 assert.equal(shadow.children[0].textContent,fs.readFileSync(require.resolve('../recruiter-premium.css'),'utf8'));
});

function premiumHarness(values,api){
 const fs=require('node:fs'),vm=require('node:vm');
 class Element{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.textContent='';}
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
  querySelectorAll(s){const tag=s.startsWith('style')?'STYLE':s.startsWith('link')?'LINK':null;return tag?this.children.filter(c=>c.tagName===tag&&c.dataset.emPremiumStyle):[];}
  append(node){node.parent=this;this.children.push(node);}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
 }
 const head=new Element('head'),shadow=new Element('shadow'),context={view:'jobs',premium:true,company:{id:'11111111-1111-4111-8111-111111111111',cnpj:'12345678000190'},jobs:[],applications:[],demo:false};
 const document={head,hidden:false,createElement:tag=>new Element(tag),getElementById:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};
 const sandbox={document,sessionStorage:{getItem:key=>values[key]||'',setItem:(key,value)=>values[key]=value},atob,requestAnimationFrame:()=>1,setInterval:()=>1,MutationObserver:class {observe(){}disconnect(){}},addEventListener:()=>{},EMInterviews:{api}};
 sandbox.window=sandbox;vm.runInNewContext(fs.readFileSync(require.resolve('../recruiter-premium.js'),'utf8'),sandbox);
 return {sandbox,head,shadow,context,premium:sandbox.EMRecruiterPremium};
}
const jwt=(user,revision=1)=>'header.'+Buffer.from(JSON.stringify({sub:user,iat:revision})).toString('base64url')+'.signature';
test('daily card styles are available while the secure session is still being recovered',()=>{
 const h=premiumHarness({},async()=>[]);h.premium.sync(h.shadow,h.context);
 assert.equal(h.shadow.children.length,1);assert.equal(h.head.children.length,1);
 assert.match(h.shadow.children[0].textContent,/\.emp-tasks\{display:grid!important/);
 assert.match(h.shadow.children[0].textContent,/\.emp-task\{display:grid!important/);
});
test('a missing access token is recovered through the existing authenticated API before loading agenda data',async()=>{
 const values={empregaMaisSupabaseRefreshToken:'refresh-value'},paths=[];
 const h=premiumHarness(values,async path=>{
  paths.push(path);
  if(path.startsWith('empresas?')){values.empregaMaisSupabaseAccessToken=jwt('recruiter');return [{id:'11111111-1111-4111-8111-111111111111'}];}
  if(path.startsWith('em_interviews?'))return [{id:'interview-recovered'}];
  if(path.startsWith('em_recruiter_message_rules?'))return [];
  throw Error('Unexpected request');
 });
 h.premium.sync(h.shadow,h.context);const data=await h.premium.load(true);
 assert.equal(paths.length,3);assert.match(paths[0],/cnpj=eq\.12345678000190/);assert.equal(data.interviews[0].id,'interview-recovered');assert.equal(h.shadow.children.length,1);
});
test('rotating an access token for the same user does not invalidate an agenda request',async()=>{
 const values={empregaMaisSupabaseAccessToken:jwt('recruiter',1)};
 const h=premiumHarness(values,async path=>{values.empregaMaisSupabaseAccessToken=jwt('recruiter',2);return path.startsWith('em_interviews?')?[{id:'interview-current'}]:[];});
 h.premium.sync(h.shadow,h.context);assert.equal((await h.premium.load(true)).interviews[0].id,'interview-current');
});
test('switching the company during session recovery discards the previous response',async()=>{
 const values={empregaMaisSupabaseRefreshToken:'refresh-value'};let finish;
 const h=premiumHarness(values,path=>path.startsWith('empresas?')?new Promise(resolve=>finish=resolve):Promise.resolve([]));
 h.premium.sync(h.shadow,h.context);const old=h.premium.load(true);
 const next={...h.context,company:{id:'22222222-2222-4222-8222-222222222222',cnpj:'98765432000199'}};
 h.premium.sync(h.shadow,next);values.empregaMaisSupabaseAccessToken=jwt('new-recruiter');finish([{id:h.context.company.id}]);
 await assert.rejects(old,/conta mudou/);const data=await h.premium.load(true);assert.equal(data.companyId,next.company.id);assert.equal(data.interviews.length,0);
});



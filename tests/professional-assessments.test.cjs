const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../professional-assessments.js');
const sql=fs.readFileSync(require.resolve('../supabase/professional-tools.sql'),'utf8');
const bank=Array.from(sql.matchAll(/\$exam\$([\s\S]*?)\$exam\$/g),m=>JSON.parse(m[1]));
test('six professional themes contain 48 questions with explicit objective and open criteria',()=>{
 assert.deepEqual(core.catalog.map(t=>t.topic),['comunicacao','excel','atendimento','administrativo','vendas','ecommerce']);
 assert.equal(bank.length,6);
 assert.equal(bank.reduce((n,t)=>n+t.questions.length,0),48);
 for(const exam of bank){
  assert.equal(exam.questions.length,8);
  for(const q of exam.questions){assert.ok(q.prompt&&q.skill);if(q.type==='open')assert.ok(q.rubric.length>=3);else assert.ok(q.explanation&&q.correct!==undefined);}
 }
});
test('all objective answers are actually graded and open responses cannot inflate the score',()=>{
 for(const exam of bank){
  const answers=exam.questions.map(q=>q.type==='open'?'Minha resposta aberta para leitura da empresa.':q.type==='formula'?q.correct[0]:q.correct);
  const result=core.grade(exam.questions,answers);
  assert.equal(result.percent,100);
  assert.equal(result.total,exam.questions.filter(q=>q.type!=='open').length);
  assert.equal(result.open_count,exam.questions.filter(q=>q.type==='open').length);
  const wrong=answers.map((v,i)=>exam.questions[i].type==='choice'?99:exam.questions[i].type==='open'?v:'resposta incorreta');
  assert.equal(core.grade(exam.questions,wrong).percent,0);
  assert.ok(result.feedback.every((f,i)=>exam.questions[i].type==='open'?f.correct===null:f.correct===true));
 }
});
test('blank, fractional and nonnumeric answers do not turn into correct values',()=>{
 const choice={type:'choice',correct:0};
 for(const value of [null,undefined,'',false,'0',0.1])assert.equal(core.sameAnswer(choice,value),false);
 const numeric={type:'number',correct:0};
 assert.equal(core.sameAnswer(numeric,''),false);
 assert.equal(core.sameAnswer(numeric,'0'),true);
 assert.equal(core.sameAnswer({type:'number',correct:12.5},'12,50'),true);
 assert.equal(core.sameAnswer({type:'number',correct:12.5},'R$ 12,50'),false);
 assert.equal(core.sameAnswer({type:'formula',correct:['=SOMA(B2:B4)']},' =soma( B2:B4 ) '),true);
 assert.equal(core.sameAnswer({type:'formula',correct:['=SOMA(B2:B4)']},'=WEBSERVICE("https://example.invalid")'),false);
});
test('interview modes have distinct six-question scripts and adapt to the selected role',()=>{
 assert.equal(core.modes.length,3);
 for(const mode of core.modes){const qs=core.questions(mode.id,'Assistente Administrativo');assert.equal(qs.length,6);assert.ok(qs.every(q=>q.text&&q.hint));}
 assert.notDeepEqual(core.questions('primeira','Vendedor'),core.questions('situacoes','Vendedor'));
 assert.ok(core.questions('cargo','Vendedor').some(q=>/negociação/.test(q.text)));
 assert.ok(core.questions('cargo','Analista de Recursos Humanos').some(q=>/candidatos/.test(q.text)));
 assert.ok(core.questions('cargo','Assistente de e-commerce').some(q=>/estoque/.test(q.text)));
});
test('interview guidance explains structure without fabricating a hiring or personality score',()=>{
 const brief=core.feedback('Sou responsável.');
 assert.ok(brief.suggestions.some(s=>/exemplo/.test(s)));
 const detailed=core.feedback('Organizei o atendimento de 20 clientes e consegui reduzir as pendências. Aprendi a conferir os dados com a equipe e entreguei o relatório no prazo combinado após verificar as informações.');
 assert.ok(detailed.strengths.length>=2);
 assert.equal(detailed.score,undefined);
 assert.equal(detailed.percent,undefined);
 assert.equal(detailed.personality,undefined);
});
test('display values are escaped before appearing in cards, scripts and results',()=>{
 assert.equal(core.esc('<img src=x onerror="x"> & \'x\''),'&lt;img src=x onerror=&quot;x&quot;&gt; &amp; &#39;x&#39;');
});
function browser(){
 const calls=[],storage=new Map([['empregaMaisSupabaseAccessToken','test-token']]);
 const head={querySelector:()=>({}),append:()=>{}};
 const target={isConnected:true,innerHTML:'',dataset:{},getRootNode:()=>({querySelector:()=>({}),append:()=>{}}),querySelector:()=>null,querySelectorAll:()=>[]};
 const sandbox={document:{head,createElement:()=>({dataset:{}})},sessionStorage:{getItem:k=>storage.get(k)||null},localStorage:{getItem:()=>null,setItem:()=>{}},console,crypto:globalThis.crypto,setTimeout,URL,Blob,EMInterviews:{api:async(path,body)=>{calls.push({path,body});if(body.p_action==='catalog')return core.catalog;if(body.p_action==='list')return {assignments:[],attempts:[],simulations:[]};throw Error('Unexpected call');}}};
 sandbox.window=sandbox;
 const code=fs.readFileSync(require.resolve('../professional-assessments.js'),'utf8').replace('global.EMProfessionalTools={mount:mount,core:core};','global.EMProfessionalTools={mount:mount,core:core,active:function(){return active;}};');
 vm.runInNewContext(code,sandbox);
 return {sandbox,target,calls,storage};
}
test('the company view renders all six tests and scopes every request to the displayed company',async()=>{
 const {sandbox,target,calls}=browser();
 sandbox.EMProfessionalTools.mount(target,{role:'company',view:'tests',company:{cnpj:'12345678000190'},jobs:[],applications:[],demo:false});
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(target.innerHTML.includes('Comunicação profissional'));
 assert.ok(target.innerHTML.includes('E-commerce e pedidos'));
 assert.equal((target.innerHTML.match(/data-pt-action="assign-form"/g)||[]).length,6);
 assert.ok(calls.every(c=>c.path==='rpc/em_professional_tools'&&c.body.p_data.company_cnpj==='12345678000190'&&c.body.p_data.role==='company'));
});
test('candidate entry renders the three preparation tabs and never asks for company results',async()=>{
 const {sandbox,target,calls}=browser();
 sandbox.EMProfessionalTools.mount(target,{role:'candidate',view:'tests',jobs:[],applications:[],demo:false});
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(target.innerHTML.includes('Testes recebidos'));
 assert.ok(target.innerHTML.includes('data-id="simulator"'));
 assert.ok(target.innerHTML.includes('data-id="results"'));
 assert.ok(calls.every(c=>c.body.p_data.role===undefined&&c.body.p_data.company_cnpj===undefined));
});
test('a session change during a request discards the response rather than displaying another account data',async()=>{
 const {sandbox,target,storage}=browser();let resolveList;
 sandbox.EMInterviews.api=async(path,body)=>body.p_action==='catalog'?core.catalog:new Promise(resolve=>{resolveList=resolve;});
 sandbox.EMProfessionalTools.mount(target,{role:'candidate',view:'results',jobs:[],applications:[],demo:false});
 storage.set('empregaMaisSupabaseAccessToken','another-account');
 resolveList({assignments:[{candidate_name:'DO NOT SHOW'}],attempts:[],simulations:[]});
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(!target.innerHTML.includes('DO NOT SHOW'));
});

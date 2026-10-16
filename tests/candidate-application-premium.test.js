const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const preparation=require('../candidato-preparacao.js');

function controller(options={}){
 const context={window:{
  EmpregaMaisPreparacao:options.core||preparation,
  EmpregaMaisPremiumCandidatoV92:{ehPremium:()=>options.premium!==false},
  obterCandidatoAtual:()=>options.profile||{},
  localizarVaga:()=>options.job||{},
  carregarCandidaturas:()=>[{id:'own-application',vagaId:'job-1'}]
 },document:{readyState:'loading',addEventListener(){}},location:{search:options.demo?'?pagina=demo-candidato':''},sessionStorage:{getItem:()=> 'ana@example.com'},URLSearchParams,URL};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../processo-seletivo-etapas.js'),'utf8'),context);
 context.window.EmpregaMaisEtapasCandidatura.demo=()=>options.rows||[];
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../candidato-candidaturas.js'),'utf8'),context);
 return context.window.EmpregaMaisCandidaturasCandidato;
}
const application={id:'own-application',vagaId:'job-1',vaga:'Assistente Administrativo',email:'ana@example.com'};

test('free accounts see the Premium explanation without exposing totals or calculating compatibility',()=>{
 const api=controller({premium:false,job:{totalCandidaturas:129},core:{compatibilidade(){throw Error('Must remain locked');}}});
 for(const kind of ['match','applicants']){
  const html=api.detalhesPremium(application,kind);
  assert.match(html,/Conhecer Premium/);
  assert.doesNotMatch(html,/129|cp-insight-total|cp-insight-criteria/);
 }
});

test('application compatibility uses professional profile criteria and requires sufficient information',()=>{
 const job={cargo:'Assistente Administrativo',area:'Administrativo',requisitos:'Excel, organização',cidade:'Belo Horizonte',modalidade:'Presencial'};
 const profile={cargoDesejado:job.cargo,areaProfissional:job.area,habilidadesProfissionais:'Excel, organização',cidadeProfissional:job.cidade,modalidadePreferida:['Presencial']};
 const html=controller({job,profile}).detalhesPremium(application,'match');
 assert.match(html,new RegExp(preparation.compatibilidade(job,profile).percent+'%'));
 assert.match(html,/Habilidades em comum/);
 assert.match(controller({job}).detalhesPremium(application,'match'),/Complete seu perfil/);
 assert.doesNotMatch(controller({job}).detalhesPremium(application,'match'),/\d+%/);
});

test('production totals require a valid job aggregate and never use the candidate-only cache as a total',()=>{
 for(const value of [undefined,null,'',false,-1,1.5,'not a number']){
  const html=controller({job:{totalCandidaturas:value}}).detalhesPremium(application,'applicants');
  assert.match(html,/ainda não foi informado/);
  assert.doesNotMatch(html,/cp-insight-total/);
 }
 for(const value of [0,12,'27'])assert.match(controller({job:{candidaturas_count:value}}).detalhesPremium(application,'applicants'),new RegExp('<strong>'+value+'</strong>'));
});

test('demo totals include other fictional candidates, match the job and deduplicate repeated records',()=>{
 const rows=[{id:'a',vagaId:'job-1'},{id:'b',vagaId:'job-1'},{id:'b',vagaId:'job-1'},{id:'c',vagaId:'other-job'}];
 const html=controller({demo:true,rows}).detalhesPremium(application,'applicants');
 assert.match(html,/<strong>2<\/strong> candidaturas recebidas/);
 assert.match(html,/Dados fictícios/);
});

test('compatibility detail escapes criterion text before inserting markup',()=>{
 const core={compatibilidade:()=>({percent:60,criteria:[{label:'<img src=x onerror=alert(1)>',available:true,match:1}]})};
 const html=controller({core}).detalhesPremium(application,'match');
 assert.match(html,/&lt;img/);
 assert.doesNotMatch(html,/<img/);
});

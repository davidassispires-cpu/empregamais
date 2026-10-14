const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function controller(search = '') {
 const context = {window:{},document:{readyState:'loading',addEventListener(){}},location:{search},sessionStorage:{getItem(){return 'ana@example.com';}},URLSearchParams,URL};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../candidato-candidaturas.js'),'utf8'),context);
 return context.window.EmpregaMaisCandidaturasCandidato;
}

test('normalizes application stages and keeps rejection separate from selection', () => {
 const api=controller();
 for(const [status,stage] of [['Em análise','analise'],['Em avaliação','analise'],['Selecionada','selecionadas'],['Pré-selecionado','selecionadas'],['Finalista','finalistas'],['Etapa final','finalistas'],['Não selecionado','outras'],['Reprovado','outras'],['Contratado','outras'],['Entrevista agendada','outras'],['Aguardando análise','outras']]) {
  assert.equal(api.classificar({status}),stage,status);
 }
});

test('uses only the signed-in candidate records', () => {
 const api=controller();
 assert.equal(api.pertence({email:' ANA@example.com '}),true);
 assert.equal(api.pertence({candidatoEmail:'ana@example.com'}),true);
 assert.equal(api.pertence({email:'outra@example.com'}),false);
 assert.equal(api.pertence({}),false);
});

test('summary totals correspond to the rows shown by each filter', () => {
 const api=controller();
 const mine=[{status:'Em avaliação'},{status:'Selecionado'},{status:'Finalista'},{status:'Não selecionado'},{status:'Entrevista agendada'}];
 const totals=api.contar(mine);
 assert.deepEqual(JSON.parse(JSON.stringify(totals)),{todas:5,analise:1,selecionadas:1,finalistas:1});
 for(const key of ['todas','analise','selecionadas','finalistas'])assert.equal(mine.filter(item=>api.corresponde(item,key)).length,totals[key]);
});

test('supports direct filter URLs, empty stages and unknown filter values', () => {
 const selected=controller('?pagina=candidaturas&etapaCandidatura=selecionadas');
 assert.equal(selected.filtroAtual(),'selecionadas');
 assert.equal(selected.corresponde({status:'Selecionado'}),true);
 assert.equal(selected.corresponde({status:'Não selecionado'}),false);
 assert.match(selected.mensagemVazia(),/nesta etapa/);
 const invalid=controller('?etapaCandidatura=desconhecida');
 assert.equal(invalid.filtroAtual(),'todas');
 assert.equal(invalid.corresponde({status:'Entrevista agendada'}),true);
});

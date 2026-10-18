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
test('missing or invalid ratings never become a zero or a fabricated score',()=>{
 assert.equal(core.average(null),null);
 assert.equal(core.average({technical_score:5}),null);
 assert.equal(core.average({technical_score:6,experience_score:5,communication_score:5,problem_solving_score:5}),null);
 assert.equal(core.average({technical_score:4,experience_score:3,communication_score:5,problem_solving_score:2}),3.5);
});
test('pending scorecards exclude future, in-progress and cancelled interviews',()=>{
 const now=Date.parse('2026-10-18T12:00:00Z');
 const row={scheduled_at:'2026-10-18T11:00:00Z',duration_minutes:30,state:'confirmed'};
 assert.equal(core.dueScorecard(row,now),true);
 assert.equal(core.dueScorecard({...row,state:'cancelled'},now),false);
 assert.equal(core.dueScorecard({...row,scheduled_at:'2026-10-18T12:00:00Z'},now),false);
 assert.equal(core.dueScorecard({...row,scheduled_at:'2026-10-18T13:00:00Z'},now),false);
 assert.equal(core.dueScorecard({...row,state:'completed'},now),true);
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

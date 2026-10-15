const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../candidato-preparacao.js');

const candidate={cargoDesejado:'Assistente Administrativo',areaProfissional:'Administrativo',habilidadesProfissionais:'Excel, atendimento, organização',experienciaProfissional:'Organizei o atendimento e os documentos administrativos',cidadeProfissional:'Belo Horizonte',modalidadePreferida:['Presencial','Híbrido']};
const job={cargo:'Assistente Administrativo',area:'Administrativo',requisitos:'Excel, atendimento, organização',cidade:'Belo Horizonte',modalidade:'Presencial'};
test('compatibility uses actual criteria, handles multiple choices and stays in range',()=>{
 const match=core.compatibilidade(job,candidate);
 assert.ok(match.percent>=80&&match.percent<=100);
 assert.equal(match.coverage,100);
 assert.equal(match.criteria.find(x=>x.label==='Modalidade preferida').match,1);
 assert.equal(core.compatibilidade({...job,modalidade:'Híbrido'},candidate).criteria[4].match,1);
 const unrelated=core.compatibilidade({cargo:'Programador Java',area:'Tecnologia',requisitos:'Java, SQL',cidade:'Betim',modalidade:'Remoto'},candidate);
 assert.ok(unrelated.percent<match.percent);
 assert.equal(unrelated.criteria[3].available,false,'remote jobs do not penalize a different city');
 for(const profile of [{},candidate,{cidade:'Betim'},{cargoDesejado:'Auxiliar'}, {...candidate,cargoDesejado:['Assistente Administrativo','Auxiliar']}]) {
  const result=core.compatibilidade(job,profile);
  assert.ok(result.percent==null||result.percent>=0&&result.percent<=100);
 }
});
test('missing profile data cannot produce a made-up match percentage',()=>{
 assert.equal(core.compatibilidade(job,{}).percent,null);
 assert.equal(core.compatibilidade(job,{cidade:'Belo Horizonte'}).percent,null);
 assert.equal(core.compatibilidade({},candidate).percent,null);
 assert.equal(core.compatibilidade(job,{modalidadePreferida:'Presencial'}).percent,null);
});
test('alerts combine role, multiple cities and multiple modalities, with remote support',()=>{
 const alert=core.validarAlerta({cargo:'Assistente Administrativo',cidade:'Belo Horizonte, Contagem',modalidades:['Presencial','Híbrido']});
 assert.equal(core.correspondeAlerta(job,alert),true);
 assert.equal(core.correspondeAlerta({...job,cidade:'Contagem',modalidade:'Híbrido'},alert),true);
 assert.equal(core.correspondeAlerta({...job,cidade:'Betim'},alert),false);
 assert.equal(core.correspondeAlerta({...job,cargo:'Desenvolvedor Java'},alert),false);
 assert.equal(core.correspondeAlerta({...job,cidade:'São Paulo',modalidade:'Remoto'},{...alert,modalidades:['Remoto']}),true);
 assert.throws(()=>core.validarAlerta({}),/Escolha pelo menos/);
 assert.equal(core.validarAlerta({cargo:' Excel ',modalidades:['Outra']}).cargo,'Excel');
});
test('interview content adapts to the role and does not fabricate a hiring grade',()=>{
 const admin=core.perguntasEntrevista('Assistente Administrativo');
 assert.equal(admin.length,6);
 assert.ok(admin.some(q=>q.text.includes('Excel')));
 assert.ok(core.perguntasEntrevista('Analista de Recursos Humanos').some(q=>q.text.includes('currículos')));
 assert.ok(core.perguntasEntrevista('Vendedor').some(q=>q.text.includes('cliente')));
 assert.ok(core.perguntasEntrevista('Programador').some(q=>q.text.includes('aprender')));
 const brief=core.orientarResposta('Sou responsável.');
 assert.ok(brief.suggestions.some(s=>s.includes('exemplo real')));
 const detailed=core.orientarResposta('Organizei o atendimento de 20 clientes por dia e consegui reduzir o tempo de espera. Aprendi a definir prioridades com a equipe.');
 assert.ok(detailed.strengths.length>0);
 assert.equal(detailed.percent,undefined);
 assert.equal(detailed.score,undefined);
});
test('all four practice tests grade real answers and explain every question',()=>{
 assert.equal(Object.keys(core.testes).length,4);
 for(const [topic,exam] of Object.entries(core.testes)){
  assert.equal(exam.questions.length,5);
  for(const question of exam.questions){
   assert.ok(question[1].length>=3);
   assert.ok(question[2]>=0&&question[2]<question[1].length);
   assert.ok(question[3].length>20);
  }
  const correct=exam.questions.map(q=>q[2]);
  assert.deepEqual(core.corrigirTeste(topic,correct),{correct:5,total:5,percent:100});
  assert.equal(core.corrigirTeste(topic,[]).percent,0);
  assert.equal(core.corrigirTeste(topic,null).percent,0);
  assert.equal(core.corrigirTeste(topic,correct.map(i=>String(i))).percent,0,'a malformed stored answer is not credited');
  const partial=correct.slice();partial[2]=(partial[2]+1)%3;
  assert.equal(core.corrigirTeste(topic,partial).percent,80);
 }
 assert.throws(()=>core.corrigirTeste('unknown',[]),/disponível/);
});
test('joining an interview requires an actual HTTPS link, confirmation and the time window',()=>{
 const at=Date.parse('2026-10-18T17:30:00Z');
 const item={scheduled_at:new Date(at).toISOString(),duration_minutes:30,state:'confirmed',instructions:'[Online externo] https://meet.google.com/abc-defg-hij\nTenha seu currículo em mãos.'};
 assert.equal(core.podeEntrar(item,at),true);
 assert.equal(core.podeEntrar(item,at-1),false);
 assert.equal(core.podeEntrar(item,at+90*60000+1),false);
 assert.equal(core.podeEntrar({...item,state:'invited'},at),false);
 assert.equal(core.podeEntrar({...item,state:'cancelled'},at),false);
 assert.equal(core.podeEntrar({...item,instructions:'[Online externo] javascript:alert(1)'},at),false);
 assert.equal(core.podeEntrar({...item,instructions:'[Presencial] Rua Exemplo'},at),false);
 assert.equal(core.podeEntrar({...item,instructions:'[Online externo] Demonstração'},at),false);
});
test('candidate-entered content is escaped in all generated HTML',()=>{
 assert.equal(core.escape('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 assert.equal(core.escape("Ana & 'Exemplo'"),'Ana &amp; &#39;Exemplo&#39;');
});

const recommendationNow=Date.parse('2026-10-15T13:00:00Z');
const premiumCandidate={...candidate,plano_candidato:'premium',premium_valido_ate:'2027-01-01T00:00:00Z'};
test('the urgency flame follows the vacancy flag and its validity period',()=>{
 assert.equal(core.vagaUrgente({contratacaoUrgente:true},recommendationNow),true);
 assert.equal(core.vagaUrgente({urgente:'sim',urgenteAte:'2026-11-01'},recommendationNow),true);
 assert.equal(core.vagaUrgente({urgente:true,urgenteAte:'2026-10-01'},recommendationNow),false);
 assert.equal(core.vagaUrgente({urgente:true,urgenteAte:'invalid'},recommendationNow),false);
 assert.equal(core.vagaUrgente({urgente:'false'},recommendationNow),false);
 assert.equal(core.vagaUrgente({},recommendationNow),false);
});
test('personal recommendations require an active Premium subscription',()=>{
 const rows=[{...job,id:'1'}];
 assert.deepEqual(core.recomendarVagas(rows,candidate,recommendationNow),[]);
 assert.deepEqual(core.recomendarVagas(rows,{...premiumCandidate,premium_valido_ate:'2026-10-01'},recommendationNow),[]);
 assert.deepEqual(core.recomendarVagas(rows,{...premiumCandidate,premium_valido_ate:'invalid'},recommendationNow),[]);
 assert.equal(core.recomendarVagas(rows,premiumCandidate,recommendationNow).length,1);
});
test('recommendations exclude unavailable, expired, duplicate and unapproved jobs',()=>{
 const available={...job,id:'available',status:'ativa',aprovacao:'aprovada',expiraEm:'2026-11-01T00:00:00Z'};
 const rows=[available,available,{...available,id:'closed',status:'Encerrada'},{...available,id:'paused',status:'Pausada'},{...available,id:'expired',expiraEm:'2026-10-01'},{...available,id:'draft',status:'rascunho'},{...available,id:'pending',aprovacao:'pendente'}];
 const result=core.recomendarVagas(rows,premiumCandidate,recommendationNow);
 assert.deepEqual(result.map(item=>item.job.id),['available']);
 assert.equal(rows.length,7,'The public vacancy list is not mutated');
});
test('recommendations include low and zero compatibility without inventing missing percentages',()=>{
 const low={id:'low',cargo:'Programador Java',area:'Tecnologia',requisitos:'Java, SQL',cidade:candidate.cidadeProfissional,modalidade:'Presencial'};
 const zero={...low,id:'zero',cidade:'São Paulo',modalidade:'Remoto'};
 const lowScore=core.compatibilidade(low,premiumCandidate).percent;
 assert.ok(lowScore>0&&lowScore<50);
 assert.equal(core.compatibilidade(zero,premiumCandidate).percent,0);
 const result=core.recomendarVagas([zero,low],premiumCandidate,recommendationNow);
 assert.deepEqual(result.map(item=>item.job.id),['low','zero']);
 assert.equal(result[1].match.percent,0);
 assert.deepEqual(core.recomendarVagas([{...job,id:'1'}],{plano_candidato:'premium'},recommendationNow),[]);
});
test('the full recommendations list retains all low-score vacancies without a preview limit',()=>{
 const rows=Array.from({length:40},(_,i)=>({id:'low-'+i,cargo:'Programador Java',area:'Tecnologia',requisitos:'Java, SQL',cidade:candidate.cidadeProfissional,modalidade:'Presencial'}));
 const result=core.recomendarVagas(rows,premiumCandidate,recommendationNow);
 assert.equal(result.length,rows.length);
 assert.deepEqual(new Set(result.map(item=>item.job.id)),new Set(rows.map(item=>item.id)));
 assert.ok(result.every(item=>item.match.percent>0&&item.match.percent<50));
});
test('recommendations use compatibility first and newest publication to break ties',()=>{
 const high={...job,id:'high',dataPublicacao:'2026-10-10'},newer={...job,id:'newer',dataPublicacao:'2026-10-14'};
 const lower={...job,id:'lower',cargo:'Auxiliar Administrativo',area:'Administrativo',requisitos:'Atendimento',cidade:'Betim',modalidade:'Híbrido'};
 const result=core.recomendarVagas([lower,high,newer],premiumCandidate,recommendationNow);
 assert.deepEqual(result.map(item=>item.job.id),['newer','high','lower']);
 assert.ok(result[0].match.percent>result[2].match.percent);
 assert.equal(core.recomendarVagas(null,premiumCandidate,recommendationNow).length,0);
});

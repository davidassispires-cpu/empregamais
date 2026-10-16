const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const core=require('../aderencia-recrutador.js');
const job={cargo:'Assistente Administrativo',area:'Administrativo',competencias:['Excel','Atendimento','Organização'],experiencia:'2 anos',escolaridade:'Ensino médio completo',modalidade:'Presencial',cidade:'Belo Horizonte',uf:'MG'};
const candidate={cargoDesejado:'Assistente Administrativo',areaProfissional:'Administrativo',competencias:['Excel','Atendimento','Organização'],tempoExperiencia:'3 anos',escolaridade:'Ensino médio completo',modalidadePreferida:['Presencial','Híbrido'],cidade:'Belo Horizonte',uf:'MG'};

test('all scores trace to seven weighted comparisons and the formula',()=>{
 const result=core.analyze(job,candidate);
 assert.equal(result.criteria.reduce((n,c)=>n+c.weight,0),100);
 assert.equal(result.percent,100);
 assert.equal(result.coverage,100);
 assert.equal(result.evaluatedCount,7);
 assert.equal(result.points,100);
 const partial=core.analyze(job,{...candidate,competencias:['Excel'],tempoExperiencia:'1 ano',cidade:'Contagem'});
 assert.ok(Math.abs(partial.criteria.find(x=>x.key==='skills').points-20/3)<1e-9);
 assert.equal(partial.criteria.find(x=>x.key==='experience').points,10);
 assert.equal(partial.percent,Math.round(partial.points/partial.evaluatedWeight*100));
 assert.ok(partial.percent<result.percent);
});
test('legacy demo percentages cannot become evidence or a calculated result',()=>{
 const result=core.analyze({cargo:'Analista de Recursos Humanos'}, {aderencia:85,match:99,compatibilidade:100,competencias:['Excel'],cidade:'Contagem',vaga:'Analista de Recursos Humanos',modalidade:'Híbrido'});
 assert.equal(result.percent,null);
 assert.equal(result.evaluatedCount,0);
 assert.equal(core.analyze(job,{aderencia:85}).percent,null);
 assert.equal(core.analyze({},candidate).percent,null);
});
test('missing data is excluded and coverage discloses the incomplete comparison',()=>{
 const result=core.analyze(job,{...candidate,tempoExperiencia:'Não informado'});
 assert.equal(result.percent,100);
 assert.equal(result.coverage,80);
 assert.equal(result.evaluatedWeight,80);
 assert.equal(result.criteria.find(x=>x.key==='experience').points,null);
 assert.equal(result.missingCount,1);
 assert.equal(core.analyze(job,{cidade:'Belo Horizonte',modalidadePreferida:['Presencial']}).percent,null);
});
test('remote location and expressly waived requirements never add free points',()=>{
 const result=core.analyze({...job,modalidade:'Remoto',experiencia:'Não exige experiência',escolaridade:'Não exigida'}, {...candidate,modalidadePreferida:['Remoto'],cidade:'Contagem'});
 assert.equal(result.percent,100);
 assert.equal(result.applicableWeight,60);
 assert.equal(result.evaluatedWeight,60);
 for(const key of ['location','experience','education']){
  const row=result.criteria.find(x=>x.key===key);
  assert.equal(row.applicable,false);
  assert.equal(row.points,null);
 }
});
test('exact word boundaries avoid Java/JavaScript and SQL/NoSQL false matches',()=>{
 const result=core.analyze({...job,competencias:['Java','SQL','C++','C#','.NET']},{...candidate,competencias:['JavaScript','NoSQL','C++','C#','.NET']});
 const row=result.criteria.find(x=>x.key==='skills');
 assert.deepEqual(row.found,['C++','C#','.NET']);
 assert.deepEqual(row.unmatched,['Java','SQL']);
});
test('absence of a skill match means no textual evidence, not a claim of inability',()=>{
 const row=core.analyze({...job,competencias:['Excel avançado','Atendimento']},{...candidate,competencias:['Excel']}).criteria.find(x=>x.key==='skills');
 assert.equal(row.match,0);
 assert.match(row.reason,/Não infere domínio/);
 assert.deepEqual(row.unmatched,['Excel avançado','Atendimento']);
});
test('experience compares explicit months/years and leaves unstructured narratives pending',()=>{
 const row=(req,actual)=>core.analyze({...job,experiencia:req},{...candidate,tempoExperiencia:actual}).criteria.find(x=>x.key==='experience');
 assert.equal(row('1 ano','6 meses').match,.5);
 assert.equal(row('2 a 3 anos','3 anos').match,1);
 assert.equal(row('1,5 anos','1 ano').match,2/3);
 assert.equal(row('2 anos','Atuei com atendimento ao cliente').available,false);
 assert.equal(row('2 anos','Sem experiência').match,0);
});
test('formation and modality do not assume unreported qualifications or preferences',()=>{
 assert.equal(core.analyze({...job,escolaridade:'Superior completo'},{...candidate,escolaridade:'Superior cursando'}).criteria.find(x=>x.key==='education').match,0);
 assert.equal(core.analyze({...job,escolaridade:'Técnico completo'},{...candidate,escolaridade:'Superior completo'}).criteria.find(x=>x.key==='education').available,false);
 assert.equal(core.analyze(job,{...candidate,modalidadePreferida:'',modalidade:'Presencial'}).criteria.find(x=>x.key==='mode').available,false);
 assert.equal(core.analyze(job,{...candidate,modalidadePreferida:['Híbrido','Presencial']}).criteria.find(x=>x.key==='mode').match,1);
});
test('structured curriculum fields are read, URLs and sensitive fields are not scored',()=>{
 assert.equal(core.analyze(job,{curriculoPerfil:JSON.stringify(candidate)}).percent,100);
 assert.equal(core.analyze(job,{curriculoOnline:'https://example.com/cv.pdf',curriculoDados:'data:application/pdf;base64,AA=='}).percent,null);
 const a=core.analyze(job,candidate),b=core.analyze(job,{...candidate,idade:70,sexo:'Feminino',raca:'Preta',estadoCivil:'Casada',foto:'photo.png'});
 assert.deepEqual(a,b);
});
test('report shows inputs, points, coverage, missing data and escapes untrusted fields',()=>{
 const result=core.analyze({...job,cargo:'<img src=x onerror=alert(1)>'},candidate);
 const html=core.reportHTML(result,{cargo:'<script>alert(1)</script>'});
 assert.match(html,/Vaga pede/);assert.match(html,/Candidato informou/);assert.match(html,/Cobertura/);assert.match(html,/pontos encontrados/);
 assert(!html.includes('<script>'));assert(!html.includes('<img'));
 assert.match(html,/&lt;script&gt;/);
 const empty=core.reportHTML(core.analyze(job,{}),job);
 assert.match(empty,/Dados insuficientes/);assert.match(empty,/Não informado pelo candidato/);
});
test('recruiter list, detail panel and tab navigation use the same calculation',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
 assert.match(html,/function ader\(c,v\)\{return window.EMRecruiterAdherence\?window.EMRecruiterAdherence.analyze\(v,c\).percent:null\}/);
 assert.match(html,/EMRecruiterAdherence.mount\(modal,c,v,matchAllowed\)/);
 assert.match(html,/src="aderencia-recrutador.js\?v=/);
 assert(!html.includes("function ader(c,v){var p=Number(c.aderencia"));
 assert.match(fs.readFileSync(require.resolve('../candidatura-abas-profissionais.js'),'utf8'),/'Aderência':'adherence'/);
});

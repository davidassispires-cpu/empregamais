/* Explainable recruiter comparison. Only structured application and vacancy data is used. */
(function(global){
'use strict';
var VERSION='criterios-1';
function norm(v){return String(v==null?'':v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/c\+\+/g,' cplusplus ').replace(/c#/g,' csharp ').replace(/\.net/g,' dotnet ').replace(/[^a-z0-9]+/g,' ').trim();}
function text(v){if(Array.isArray(v))return v.map(text).filter(Boolean).join(', ');if(v&&typeof v==='object')return text(v.nome||v.label||v.curso||v.cargo||v.nivel||'');return String(v==null?'':v).trim();}
function present(v){var s=norm(text(v));return !!s&&!/^(nao informad[oa]s?|nao definid[oa]s?|nao preenchid[oa]s?|a combinar|indefinido|null|undefined)$/.test(s);}
function object(v){if(v&&typeof v==='object'&&!Array.isArray(v))return v;if(typeof v==='string'&&v.trim().charAt(0)==='{'){try{return object(JSON.parse(v));}catch(ignore){}}return {};}
function pick(sources,keys){for(var i=0;i<sources.length;i++)for(var j=0;j<keys.length;j++)if(present(sources[i][keys[j]]))return sources[i][keys[j]];return '';}
function values(v){return (Array.isArray(v)?v:String(v||'').split(/[,;\n|]+/)).map(text).filter(present);}
function words(v){return norm(text(v)).split(' ').filter(function(w){return w.length>1&&!/^(de|da|do|das|dos|em|na|no|nas|nos|com|para|por|ou|conhecimento|conhecimentos|dominio|obrigatorio|obrigatoria|necessario|necessaria)$/.test(w);});}
function unique(v){return Array.from(new Set(v));}
function months(v){
 if(typeof v==='number')return Number.isFinite(v)&&v>=0?v*12:null;
 var s=norm(text(v));if(/^(sem experiencia|nenhuma experiencia|nunca trabalhei|primeiro emprego)$/.test(s))return 0;
 var m=s.match(/(?:^|\s)(\d+(?:\s+[0-9]+)?)\s*(?:a\s*\d+\s*)?(anos?|meses?)(?:\s|$)/);
 if(!m)return null;var n=Number(m[1].replace(' ','.'));return /ano/.test(m[2])?n*12:n;
}
function education(v,required){
 var s=norm(text(v)),rank=null,kind='general';
 if(/doutor/.test(s))rank=8;else if(/mestrad/.test(s))rank=7;else if(/pos gradu|especializa|mba/.test(s))rank=6;
 else if(/superior|graduacao/.test(s))rank=/curs|incomplet/.test(s)?4:/complet|concluid|formad/.test(s)||required?5:null;
 else if(/tecnic/.test(s)){kind='technical';rank=/curs|incomplet/.test(s)?2.5:3;}
 else if(/medio/.test(s))rank=/curs|incomplet/.test(s)?1.5:2;
 else if(/fundamental/.test(s))rank=/curs|incomplet/.test(s)?.5:1;
 return {rank:rank,kind:kind};
}
function mode(v){var s=norm(v);return /hibrid/.test(s)?'hibrido':/remot|home office/.test(s)?'remoto':/presencial/.test(s)?'presencial':s;}
function notRequired(v){return /nao exig|nao necess|sem exig|dispensad|qualquer escolaridade/.test(norm(text(v)));}
function criterion(key,label,weight,jobValue,candidateValue,ratio,reason,applicable){
 var available=typeof ratio==='number'&&Number.isFinite(ratio),score=available?Math.max(0,Math.min(1,ratio)):null;
 return {key:key,label:label,weight:weight,job:text(jobValue),candidate:text(candidateValue),applicable:applicable!==false,available:available&&applicable!==false,match:score,points:available?weight*score:null,status:applicable===false?'not_required':!available?'unknown':score===1?'matched':score===0?'different':'partial',reason:reason||''};
}
function analyze(job,application){
 job=job||{};application=application||{};
 var nested=['curriculoPerfil','perfilCurriculo','curriculoOnline','dadosCurriculo','curriculo','perfilProfissional','perfil'].map(function(key){return object(application[key]);});
 var sources=[application].concat(nested),criteria=[];
 var jr=pick([job],['cargo','titulo']),cr=pick(sources,['cargoDesejado','objetivoProfissional','cargoAtual','profissao']),jw=unique(words(jr)),cw=new Set(words(cr));
 var hits=jw.filter(function(w){return cw.has(w);});
 criteria.push(criterion('role','Cargo / objetivo profissional',20,jr,cr,present(cr)&&jw.length?hits.length/jw.length:null,present(cr)&&jw.length?hits.length+' de '+jw.length+' termos do cargo encontrados. Comparação textual; confirme a função no currículo.':'Cargo da vaga ou objetivo profissional não informado.'));
 var ja=pick([job],['area','areaProfissional']),ca=pick(sources,['areaProfissional','areaAtuacao','areasAtuacao']);
 criteria.push(criterion('area','Área profissional',10,ja,ca,present(ja)&&present(ca)?(values(ca).some(function(x){return norm(x)===norm(ja);})?1:0):null,'Compara a área declarada na vaga com as áreas informadas pelo candidato.'));
 var explicitSkills=pick([job],['competencias','habilidades','skills']),js=explicitSkills||pick([job],['requisitos']),cs=pick(sources,['competencias','habilidadesProfissionais','habilidades','skills']);
 var required=unique(values(js).filter(function(x){var n=norm(x);return x.length<=120&&words(x).length>0&&!/desejavel|diferencial|opcional|nao obrigator/.test(n)&&(present(explicitSkills)||words(x).length<=4&&!/experiencia|escolaridade|ensino|superior|formacao|disponibilidade/.test(n));})),candidateWords=new Set(words(cs));
 var found=required.filter(function(item){var parts=words(item);return parts.length&&parts.every(function(w){return candidateWords.has(w);});});
 var skill=criterion('skills','Competências e requisitos declarados',20,js,cs,required.length&&present(cs)?found.length/required.length:null,required.length?found.length+' de '+required.length+' itens encontrados por correspondência textual. Não infere domínio ou proficiência.':'Sem itens estruturados suficientes; requisitos longos em texto livre precisam de conferência manual.');
 skill.found=found;skill.unmatched=required.filter(function(item){return found.indexOf(item)<0;});criteria.push(skill);
 var je=pick([job],['experiencia','tempoExperiencia','experienciaMinima']),ce=pick(sources,['tempoExperiencia','experienciaProfissional','experiencia']),jm=months(je),cm=months(ce),expOptional=notRequired(je)||norm(je)==='sem experiencia';
 criteria.push(criterion('experience','Tempo de experiência declarado',20,je,ce,!expOptional&&jm!==null&&cm!==null?(cm>=jm?1:jm?cm/jm:1):null,expOptional?'A vaga dispensa experiência.':jm!==null&&cm!==null?'Mínimo exigido: '+jm+' meses. Tempo declarado: '+cm+' meses. Não verifica experiência na função.':'Informe o tempo em meses ou anos; narrativa e datas soltas não comprovam duração.',!expOptional));
 var jf=pick([job],['escolaridade','escolaridadeMinima','formacaoAcademica']),cf=pick(sources,['escolaridade','escolaridadeProfissional','formacaoAcademica']),schoolOptional=notRequired(jf),jLevel=education(jf,true),cLevel=education(cf,false),comparable=jLevel.rank!==null&&cLevel.rank!==null&&!(jLevel.kind==='technical'&&cLevel.kind!=='technical');
 criteria.push(criterion('education','Escolaridade declarada',15,jf,cf,!schoolOptional&&comparable?(cLevel.rank>=jLevel.rank?1:0):null,schoolOptional?'A vaga não exige escolaridade mínima.':comparable?'Compara somente o nível de escolaridade. Curso específico, diploma e registro profissional exigem conferência.':'Nível ou conclusão não identificados; conferir a formação e o curso solicitado.',!schoolOptional));
 var jMode=pick([job],['modalidade','modeloTrabalho']),cMode=pick(sources,['modalidadePreferida','modalidadesPreferidas','modalidades']),modes=values(cMode).map(mode);
 criteria.push(criterion('mode','Modalidade de trabalho',10,jMode,cMode,present(jMode)&&modes.length?(modes.indexOf(mode(jMode))>=0?1:0):null,'Compara a modalidade da vaga com as preferências declaradas; a modalidade da candidatura não é usada como preferência.'));
 var jc=pick([job],['cidade']),cc=pick(sources,['cidadeProfissional','cidadesInteresse','cidade','localidade']),remote=mode(jMode)==='remoto';
 var ju=norm(pick([job],['uf','estado'])),cu=norm(pick(sources,['uf','estado']));
 criteria.push(criterion('location','Cidade informada / de interesse',5,jc,cc,!remote&&present(jc)&&present(cc)?(values(cc).some(function(x){return norm(x)===norm(jc);})&&(!ju||!cu||ju===cu)?1:0):null,remote?'Vaga remota: cidade não entra na nota.':'Compara a cidade informada ou de interesse. Cidade diferente não confirma indisponibilidade para deslocamento.',!remote));
 var available=criteria.filter(function(c){return c.available;}),weight=available.reduce(function(n,c){return n+c.weight;},0),total=criteria.filter(function(c){return c.applicable;}).reduce(function(n,c){return n+c.weight;},0),points=available.reduce(function(n,c){return n+c.points;},0);
 var enough=weight>=50&&available.length>=2&&available.some(function(c){return ['role','skills','experience','education'].indexOf(c.key)>=0;});
 return {version:VERSION,percent:enough?Math.round(points/weight*100):null,coverage:total?Math.round(weight/total*100):0,evaluatedWeight:weight,applicableWeight:total,points:points,criteria:criteria,evaluatedCount:available.length,missingCount:criteria.filter(function(c){return c.applicable&&!c.available;}).length};
}
function escape(v){return text(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function number(n){return Number(n.toFixed(2)).toLocaleString('pt-BR',{maximumFractionDigits:2});}
var labels={matched:'Correspondência encontrada',partial:'Correspondência parcial',different:'Diferença identificada',unknown:'Não foi possível avaliar',not_required:'Não entra na nota'};
function reportHTML(result,job){
 var rows=result.criteria.map(function(c){return '<tr><th scope="row" data-label="Critério">'+escape(c.label)+'</th><td data-label="Peso">'+c.weight+'</td><td data-label="Vaga pede">'+escape(c.job||'Não informado na vaga')+'</td><td data-label="Candidato informou">'+escape(c.candidate||'Não informado pelo candidato')+'</td><td data-label="Comparação"><strong class="em-ar-status">'+labels[c.status]+'</strong><p>'+escape(c.reason)+'</p>'+(c.found&&c.found.length?'<p><b>Encontrados:</b> '+escape(c.found.join(', '))+'</p>':'')+(c.unmatched&&c.unmatched.length?'<p><b>Sem correspondência textual:</b> '+escape(c.unmatched.join(', '))+'</p>':'')+'</td><td data-label="Pontos">'+(c.available?number(c.points)+' / '+c.weight:'Não avaliado')+'</td></tr>';}).join('');
 var pending=result.criteria.filter(function(c){return c.applicable&&!c.available;}).map(function(c){return c.label;});
 return '<header class="em-ar-header"><span class="em-ar-eyebrow">ANÁLISE DE ADERÊNCIA · '+escape(result.version)+'</span><h2>Como chegamos a este resultado</h2><p>'+escape(job.cargo||job.titulo||'Vaga')+'</p></header><div class="em-ar-summary"><div><span>Compatibilidade nos critérios avaliados</span><strong>'+(result.percent===null?'Dados insuficientes':result.percent+'%')+'</strong></div><div><span>Cobertura dos critérios aplicáveis</span><strong>'+result.coverage+'%</strong><small>'+result.evaluatedCount+' critérios avaliados</small></div></div><p class="em-ar-conclusion">'+(result.percent===null?'Ainda não há dados suficientes para emitir um percentual. É necessário avaliar pelo menos dois critérios que somem 50 pontos de peso, incluindo cargo, competências, experiência ou escolaridade.':'O percentual representa a correspondência entre os campos avaliáveis. '+(result.missingCount?'A análise é parcial: '+result.missingCount+' critérios ficaram sem dados suficientes.':'Todos os critérios aplicáveis puderam ser comparados.'))+'</p><div class="em-ar-table-wrap"><table class="em-ar-table"><caption>Comparação da vaga com os dados desta candidatura</caption><thead><tr><th>Critério</th><th>Peso</th><th>Vaga pede</th><th>Candidato informou</th><th>Comparação e evidência</th><th>Pontos</th></tr></thead><tbody>'+rows+'</tbody></table></div><section class="em-ar-method"><h3>Como a nota é calculada</h3><p><b>Nota = pontos encontrados ÷ peso dos critérios avaliados × 100.</b> '+number(result.points)+' pontos encontrados em '+result.evaluatedWeight+' pontos avaliados'+(result.percent===null?'; percentual ainda não emitido.':' = '+result.percent+'%.')+'</p><p>Os pesos somam 100. Campos ausentes ficam fora da nota e reduzem a cobertura; não recebem zero nem nota máxima. Critérios dispensados pela vaga e cidade em vaga remota não entram no cálculo.</p><p>Cargo e competências usam correspondência textual. Experiência, formação e preferências usam os dados declarados. Arquivos anexados não são lidos automaticamente. Esta comparação apoia a análise da empresa; não comprova qualificações, não prevê contratação e não altera a etapa do candidato.</p></section>'+(pending.length?'<section class="em-ar-pending"><h3>O que falta conferir</h3><p>'+escape(pending.join('; '))+'. Confira os campos ausentes nas linhas acima e confirme essas informações no currículo ou na entrevista.</p></section>':'');
}
var styled=false;
function styles(){if(styled)return;styled=true;var style=global.document.createElement('style');style.id='em-explainable-recruiter-adherence';style.textContent=`
@layer field-feedback{
html body #emCandidateDetails#emCandidateDetails .em-candidate-modal-body{overflow-y:auto!important;min-height:0!important;flex:1 1 auto!important}
html body #emCandidateDetails#emCandidateDetails .em-adherence-report,html body #emCandidateDetails#emCandidateDetails .em-adherence-report *{box-sizing:border-box!important;font-family:Poppins,sans-serif!important;color:#344054!important;letter-spacing:normal!important}
html body #emCandidateDetails#emCandidateDetails .em-adherence-report{padding:18px!important;background:#fff!important;border:1px solid #dfe5eb!important;border-radius:10px!important;max-height:none!important;overflow:visible!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-header h2{font-size:22px!important;line-height:1.3!important;color:#173f59!important;margin:7px 0!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-eyebrow{font-size:10px!important;font-weight:600!important;color:#667085!important}
html body #emCandidateDetails#emCandidateDetails .em-adherence-report p{font-size:12px!important;line-height:1.65!important;margin:8px 0!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-summary{display:grid!important;grid-template-columns:1fr 1fr!important;gap:16px!important;margin:16px 0!important;background:#f7f9fb!important;border:1px solid #e1e6eb!important;border-radius:9px!important;padding:16px!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-summary>div{display:flex!important;flex-direction:column!important;gap:6px!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-summary span,html body #emCandidateDetails#emCandidateDetails .em-ar-summary small{font-size:11px!important;line-height:1.5!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-summary strong{font-size:24px!important;font-weight:700!important;line-height:1.3!important;color:#173f59!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table-wrap{overflow-x:auto!important;margin:16px 0!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table{width:100%!important;border-collapse:collapse!important;table-layout:fixed!important;min-width:740px!important;background:white!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table caption{text-align:left!important;font-size:13px!important;font-weight:600!important;padding:0 0 10px!important;color:#173f59!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table th,html body #emCandidateDetails#emCandidateDetails .em-ar-table td{font-size:11px!important;line-height:1.6!important;padding:10px 8px!important;border:1px solid #e1e6eb!important;vertical-align:top!important;text-align:left!important;overflow-wrap:anywhere!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table thead th{background:#f3f5f7!important;font-weight:600!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table th:nth-child(2){width:6%!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table th:nth-child(5){width:30%!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table th:nth-child(6){width:9%!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-table p{font-size:11px!important;margin:5px 0!important}
html body #emCandidateDetails#emCandidateDetails .em-ar-method,html body #emCandidateDetails#emCandidateDetails .em-ar-pending{margin-top:16px!important;padding:14px!important;border:1px solid #e1e6eb!important;border-radius:9px!important;background:#fafbfc!important}
html body #emCandidateDetails#emCandidateDetails .em-adherence-report h3{font-size:14px!important;line-height:1.4!important;margin:0 0 9px!important;color:#173f59!important}
html body #emCandidateDetails#emCandidateDetails .em-wide-match.em-explained-match{display:block!important;padding:12px!important;background:#f5f8fb!important;border:1px solid #dfe6ed!important;border-radius:9px!important;min-width:0!important}
html body #emCandidateDetails#emCandidateDetails .em-explained-match>span{font-size:11px!important;font-weight:600!important;color:#173f59!important}
html body #emCandidateDetails#emCandidateDetails .em-explained-match>small{display:block!important;font-size:10px!important;line-height:1.6!important;color:#667085!important;margin:7px 0!important}
html body #emCandidateDetails#emCandidateDetails .em-explained-match .em-detail-criteria{min-height:36px!important;margin-top:4px!important;padding:6px 0!important;border:0!important;box-shadow:none!important;background:transparent!important;color:#125b9b!important;font-size:12px!important;font-weight:600!important;text-align:left!important;cursor:pointer!important}
@media(max-width:760px){html body #emCandidateDetails#emCandidateDetails .em-ar-summary{grid-template-columns:1fr!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table{min-width:0!important;table-layout:auto!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table thead{display:none!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table tbody,html body #emCandidateDetails#emCandidateDetails .em-ar-table tr{display:block!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table tr{border:1px solid #dfe5eb!important;border-radius:8px!important;padding:8px!important;margin-bottom:10px!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table tbody th,html body #emCandidateDetails#emCandidateDetails .em-ar-table td{display:block!important;width:100%!important;border:0!important;padding:5px!important}html body #emCandidateDetails#emCandidateDetails .em-ar-table [data-label]:before{content:attr(data-label) ': ';font-weight:600}}
}`;global.document.head.appendChild(style);}
function mount(modal,application,job,allowed){
 var match=modal.querySelector('.em-wide-match');if(!match)return;
 if(!allowed){match.hidden=true;match.style.setProperty('display','none','important');return;}
 styles();var result=analyze(job,application),panels=modal.querySelector('.em-wide-panels'),tabs=modal.querySelector('.em-wide-tabs');if(!panels||!tabs)return;
 match.hidden=false;match.classList.add('em-explained-match');
 match.innerHTML='<span>Aderência aos critérios avaliados</span><div class="em-detail-meter"><i><b style="width:'+(result.percent===null?0:result.percent)+'%"></b></i><strong>'+(result.percent===null?'—':result.percent+'%')+'</strong></div><small>'+(result.percent===null?'Dados insuficientes para emitir uma nota.':'Cobertura: '+result.coverage+'% dos critérios aplicáveis.')+'</small><button type="button" class="em-detail-criteria">Entender análise →</button>';
 var report=global.document.createElement('section');report.className='em-adherence-report';report.dataset.detailPanel='adherence';report.id='emRecruiterAdherencePanel';report.hidden=true;report.innerHTML=reportHTML(result,job);panels.appendChild(report);
 var tab=global.document.createElement('button');tab.type='button';tab.textContent='Aderência';tab.setAttribute('aria-controls',report.id);tab.setAttribute('aria-selected','false');tabs.appendChild(tab);
 function open(){modal.dataset.activeCandidateTab='adherence';panels.querySelectorAll(':scope>[data-detail-panel]').forEach(function(p){var selected=p===report;p.hidden=!selected;p.style.setProperty('display',selected?'block':'none','important');p.setAttribute('aria-hidden',String(!selected));});tabs.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b===tab);b.setAttribute('aria-selected',String(b===tab));});var body=modal.querySelector('.em-candidate-modal-body');if(body)body.scrollTop=0;tab.focus();}
 tab.onclick=open;match.querySelector('button').onclick=open;
}
var api={analyze:analyze,reportHTML:reportHTML,mount:mount,version:VERSION};global.EMRecruiterAdherence=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

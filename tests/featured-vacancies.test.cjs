'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {selectFeaturedJobs,filterFeaturedJobs,install}=require('../featured-vacancies.js');
const now='2026-10-22T12:00:00Z';
function job(id,extra={}){return {id,cargo:'Analista',empresa:'Empresa',status:'ativa',aprovacao:'aprovada',destaque:true,dataPublicacao:'2026-10-20',...extra};}

test('featured searches combine keywords and city regardless of accents, spacing or case',()=>{
 const rows=[job('logistica',{cargo:'Analista de Logística',cidade:'Betim – MG',empresa:'Mercado Livre'}),
  job('rh',{cargo:'Analista de Recursos Humanos',cidade:'Belo Horizonte – MG',descricao:'Seleção de profissionais'}),
  job('normal',{destaque:false,cargo:'Analista de Logística',cidade:'Betim – MG'})];
 const featured=selectFeaturedJobs(rows,now);
 assert.deepEqual(filterFeaturedJobs(featured,{term:'  LOGISTICA   analista ',city:'betim'}).map(j=>j.id),['logistica']);
 assert.deepEqual(filterFeaturedJobs(featured,{term:'selecao',city:'BELO HORIZONTE'}).map(j=>j.id),['rh']);
 assert.deepEqual(filterFeaturedJobs(featured,{term:'mercado livre',city:'Betim'}).map(j=>j.id),['logistica']);
 assert.deepEqual(filterFeaturedJobs(featured,{term:'logística',city:'Belo Horizonte'}),[]);
 assert.deepEqual(filterFeaturedJobs(featured,{term:'',city:''}).map(j=>j.id),['logistica','rh']);
});

test('the banner submit filters its own listing, announces empty results and restores all featured jobs',()=>{
 const elements={'pagina-vagas-destaque':{classList:{contains:()=>true}},
  emFeaturedJobsList:{children:[],replaceChildren(...children){this.children=children;},setAttribute(){}},
  emFeaturedJobsCount:{},emFeaturedJobsEmpty:{hidden:true},emFeaturedSearchForm:{},
  emFeaturedSearchTerm:{value:''},emFeaturedSearchCity:{value:''}};
 const win={document:{readyState:'complete',getElementById:id=>elements[id],querySelector:()=>null,addEventListener(){}},
  todasAsVagasPublicas:()=>[job('a',{cargo:'Logística',cidade:'Betim'}),job('b',{cargo:'Contador',cidade:'Belo Horizonte'})],
  criarCardVaga:value=>({id:value.id,querySelector:()=>null}),addEventListener(){}};
 install(win);assert.equal(elements.emFeaturedJobsList.children.length,2);
 let prevented=0;const submit=()=>elements.emFeaturedSearchForm.onsubmit({preventDefault(){prevented++;}});
 elements.emFeaturedSearchTerm.value='logistica';submit();
 assert.equal(elements.emFeaturedJobsList.children[0].id,'a');assert.equal(elements.emFeaturedJobsCount.textContent,'1 vaga em destaque');
 elements.emFeaturedSearchCity.value='Belo Horizonte';submit();
 assert.equal(elements.emFeaturedJobsList.children.length,0);assert.equal(elements.emFeaturedJobsEmpty.hidden,false);
 assert.equal(elements.emFeaturedJobsEmpty.textContent,'Nenhuma vaga em destaque encontrada para esta busca.');
 elements.emFeaturedSearchTerm.value='';elements.emFeaturedSearchCity.value='';submit();
 assert.equal(elements.emFeaturedJobsList.children.length,2);assert.equal(elements.emFeaturedJobsEmpty.hidden,true);assert.equal(prevented,3);
});

test('the existing global form loaders leave featured searches available for repeated submissions',()=>{
 const source=fs.readFileSync(require.resolve('../empregamais_lote6.js'),'utf8');
 const start=source.indexOf('(function(){\nif(window.EmpregaMaisLoadingV134)return;');
 const end=source.indexOf('\n//\n;\n//\n',start);
 assert(start>=0&&end>start);
 let submit;
 const context={window:{addEventListener(){}},document:{addEventListener(type,handler){if(type==='submit')submit=handler;}}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);
 const form={id:'emFeaturedSearchForm',checkValidity:()=>true,matches:()=>false,closest:()=>null,
  querySelector(){throw Error('A local search must not disable its button or start the global loader');}};
 submit({target:form});submit({target:form});
});

test('only explicit active and approved highlights appear, including supported flag aliases',()=>{
 const rows=[job('a'),job('b',{destaque:false,emDestaque:'true'}),job('c',{destaque:false,destacada:1}),
  job('normal',{destaque:false}),job('false',{destaque:'false'}),job('closed',{status:'encerrada'}),
  job('paused',{status:'pausada'}),job('pending',{aprovacao:'pendente'}),job('missing',{id:''})];
 assert.deepEqual(selectFeaturedJobs(rows,now).map(j=>j.id),['a','b','c']);
});
test('expired promotions and duplicate IDs are excluded and dates determine newest-first order',()=>{
 const rows=[job('old',{dataPublicacao:'2026-10-01'}),job('expired',{destaqueAte:now}),
  job('new',{dataPublicacao:'2026-10-22',destaqueAte:'2026-11-01T00:00:00Z'}),
  job('new',{dataPublicacao:'2026-10-21'}),job('undated',{dataPublicacao:''})];
 const original=rows.slice();
 assert.deepEqual(selectFeaturedJobs(rows,now).map(j=>j.id),['new','old','undated']);
 assert.deepEqual(rows,original);
 assert.deepEqual(selectFeaturedJobs(null,now),[]);
});
test('the actual router supports the dedicated URL, home return, and ordinary job details',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
 const start=html.indexOf('function irPara(\n'),end=html.indexOf('function lerRotaUrl(){',start);
 assert(start>=0&&end>start);
 const pages=[],urls=[],details=[];let featured=0,home=0;
 const context={window:{location:{pathname:'/empregamais/'}},history:{pushState:(state,title,url)=>urls.push(url)},
  mostrarPagina:name=>pages.push(name),renderizarVagasDestaque:()=>featured++,renderizarVagas:()=>home++,abrirVaga:id=>details.push(id)};
 vm.createContext(context);vm.runInContext(html.slice(start,end),context);
 context.irPara('vagas-destaque');assert.equal(urls.at(-1),'/empregamais/?pagina=vagas-destaque');
 assert.equal(pages.at(-1),'vagas-destaque');assert.equal(featured,1);
 context.irPara('home');assert.equal(urls.at(-1),'/empregamais/');assert.equal(home,1);
 context.irPara('vaga','real-job');assert.equal(urls.at(-1),'/empregamais/?pagina=vaga&id=real-job');assert.deepEqual(details,['real-job']);
});
test('background refreshes update an open listing without rebuilding unchanged cards or adding network reads',()=>{
 let active=false,catalog=[job('a'),job('ordinary',{destaque:false})],replacements=0,made=0,baseCalls=0;
 const elements={
  'pagina-vagas-destaque':{classList:{contains:()=>active}},
  emFeaturedJobsList:{replaceChildren(...children){this.children=children;replacements++;},setAttribute(){},children:[]},
  emFeaturedJobsCount:{textContent:''},emFeaturedJobsEmpty:{hidden:true}
 };
 const win={document:{readyState:'complete',getElementById:id=>elements[id],querySelector:()=>null,addEventListener(){}},
  todasAsVagasPublicas:()=>catalog,criarCardVaga:(value,featured)=>{assert.equal(featured,true);made++;return {id:value.id,querySelector:()=>null};},
  renderizarVagas:()=>{baseCalls++;return 42;},addEventListener(){},fetch(){throw Error('The listing must reuse the public catalog');}};
 install(win);assert.equal(made,0);
 active=true;win.renderizarVagasDestaque();assert.equal(made,1);assert.equal(replacements,1);assert.equal(elements.emFeaturedJobsCount.textContent,'1 vaga em destaque');
 assert.equal(win.renderizarVagas(),42);assert.equal(baseCalls,1);assert.equal(replacements,1);
 catalog=catalog.concat(job('b'));win.renderizarVagas();assert.equal(replacements,2);assert.equal(elements.emFeaturedJobsList.children.length,2);
 catalog=[];win.renderizarVagas();assert.equal(elements.emFeaturedJobsEmpty.hidden,false);assert.equal(elements.emFeaturedJobsCount.textContent,'0 vagas em destaque');
 active=false;catalog=[job('c')];win.renderizarVagas();assert.equal(replacements,3);
});
test('similar-company actions return to the public home list with the real company filter',()=>{
 let control,route='',filtered=0,scrolled=false;const field={value:''};
 const elements={'pagina-vagas-destaque':{classList:{contains:()=>true}},
 emFeaturedJobsList:{replaceChildren(){},setAttribute(){}},emFeaturedJobsCount:{},emFeaturedJobsEmpty:{},filtroPalavra:field,
 vagas:{scrollIntoView(){scrolled=true;}}};
 const win={document:{readyState:'complete',getElementById:id=>elements[id],querySelector:()=>null,addEventListener(){}},
 todasAsVagasPublicas:()=>[job('a',{empresa:'Empresa Exemplo'})],criarCardVaga(){control={};return {querySelector:()=>control};},
 irPara:page=>{route=page;},filtrarVagas:()=>filtered++,addEventListener(){}};
 install(win);control.onclick({preventDefault(){},stopPropagation(){}});
 assert.equal(route,'home');assert.equal(field.value,'Empresa Exemplo');assert.equal(filtered,1);assert.equal(scrolled,true);
});


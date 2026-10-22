'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {selectFeaturedJobs,install}=require('../featured-vacancies.js');
const now='2026-10-22T12:00:00Z';
function job(id,extra={}){return {id,cargo:'Analista',empresa:'Empresa',status:'ativa',aprovacao:'aprovada',destaque:true,dataPublicacao:'2026-10-20',...extra};}

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

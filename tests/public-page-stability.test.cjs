const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('late home restoration leaves the active page and rendered cards intact',()=>{
 const source=fs.readFileSync('empregamais_lote9.js','utf8');
 const start=source.indexOf('function restaurarHomeV109(){');
 const end=source.indexOf('\nif(document.readyState===',start);
 let navigations=0,renders=0;
 const home={classList:{contains:()=>true},style:{removeProperty(){throw Error('should retain home')}}};
 const list={querySelector:()=>({})};
 const context={URLSearchParams,location:{search:''},document:{getElementById:id=>id==='pagina-home'?home:list},window:{mostrarPagina(){navigations++},renderizarVagas(){renders++}}};
 vm.runInNewContext(source.slice(start,end)+';restaurarHomeV109();restaurarHomeV109();',context);
 assert.equal(navigations,0);assert.equal(renders,0);
});
test('unchanged refresh retains DOM while new data and filters still render',()=>{
 let renders=0,jobTitle='Vendedor',filter='';
 const list={querySelector:()=>({})};
 const home={classList:{contains:()=>true},querySelectorAll:()=>[{id:'buscaPrincipal',value:filter,checked:false}]};
 const window={renderizarVagas(){renders++},todasAsVagasPublicas:()=>[{id:1,cargo:jobTitle}]};
 const document={readyState:'complete',getElementById:id=>id==='pagina-home'?home:list};
 const source=fs.readFileSync('vagas-atualizacao.js','utf8').split('/* Keep identical background refreshes')[1];
 vm.runInNewContext('/* Keep identical background refreshes'+source,{window,document});
 window.renderizarVagas();window.renderizarVagas();assert.equal(renders,1);
 jobTitle='Analista';window.renderizarVagas();assert.equal(renders,2);
 filter='BH';window.renderizarVagas();assert.equal(renders,3);
});

test('the first public header already contains the final title and head-loaded styles',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const head=html.slice(0,html.indexOf('</head>'));
 const header=html.slice(html.indexOf("<div class='em-recent-split-header'>"),html.indexOf("<button class='btn-mobile-filtros'"));
 assert.match(head,/<link rel="stylesheet" href="recent-header\.css\?v=/);
 assert.match(header,/<header class='em-recent-title-final'><h2>Vagas recentes<\/h2>/);
 assert.doesNotMatch(header,/em-recentes-blue-band|em-recentes-centered|Vagas mais recentes/);
 const runtime=fs.readFileSync('candidato-login.js','utf8');
 assert.doesNotMatch(runtime,/function (alignRecentHeader|arrangeHeader|polishRecentPanel|finalizeRecentDesign|compactHistory)\(/);
 for(const asset of ['emporio-profissional.css','vagas-demo.css']){
  assert.equal((html.match(new RegExp('<link[^>]+rel="stylesheet"[^>]+href="'+asset.replace('.','\\.')+'\\?', 'g'))||[]).length,1);
 }
});

function readabilityPass(publicPage){
 const source=fs.readFileSync('candidato-preparacao.js','utf8');
 const start=source.indexOf('/* Legacy portal readability only;');
 const end=source.indexOf('/* Candidate account dropdown',start);
 let reads=0,writes=[];
 const el={shadowRoot:null,childNodes:[{nodeType:3,textContent:'Texto'}],
  closest(selector){return publicPage&&selector.includes('#pagina-home')?{}:null;},
  matches:()=>false,style:{setProperty:(...args)=>writes.push(args)}};
 const document={readyState:'complete',body:{querySelectorAll:()=>[el]},addEventListener(){}};
 vm.runInNewContext(source.slice(start,end),{document,window:{addEventListener(){}},WeakMap,WeakSet,
  MutationObserver:function(){this.observe=()=>{};},setTimeout:fn=>fn(),
  getComputedStyle(){reads++;return {fontSize:'12px',color:''};}});
 return {reads,writes};
}
test('background readability callbacks never resize public text',()=>{
 assert.deepEqual(readabilityPass(true),{reads:0,writes:[]});
});
test('portal readability is preserved outside the public pages',()=>{
 const result=readabilityPass(false);
 assert.equal(result.reads,1);
 assert.deepEqual(result.writes,[['font-size','13px','important']]);
});

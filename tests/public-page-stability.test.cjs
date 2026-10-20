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

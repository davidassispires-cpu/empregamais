'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const P=require('../planos-config.js');
const source=fs.readFileSync(path.join(__dirname,'..','empregamais_lote10.js'),'utf8');
function extract(text,name){
  const start=text.indexOf('function '+name+'(');assert(start>=0,name);
  const opening=text.indexOf('{',start);let depth=0,quote=null,escaped=false;
  for(let i=opening;i<text.length;i++){
    const c=text[i];
    if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;}
    else if(c==='"'||c==="'"||c==='`')quote=c;
    else if(c==='{')depth++;
    else if(c==='}'&&--depth===0)return text.slice(start,i+1);
  }
  throw Error('Unclosed function: '+name);
}
const setup=extract(source,'setupPublishExtras');
const rows=[['destaque','Destacar vaga','Adicionar destaque','Remover destaque'],['urgencia','Contratação urgente','Adicionar urgência','Remover urgência'],['confidencial','Vaga confidencial','Adicionar confidencial','Remover confidencial']];
const cards=rows.map(([key,title,add,remove])=>{
  const input={checked:false},button={attributes:{},innerHTML:'',setAttribute(k,v){this.attributes[k]=v;}};
  const card={dataset:{service:key,addLabel:add,removeLabel:remove},selected:false,input,button,
    querySelector(selector){if(selector==='input')return input;if(selector==='.publish-extra-button')return button;if(selector==='.publish-extra-title')return {textContent:title};throw Error(selector);}};
  card.classList={toggle(name,on){assert.equal(name,'selected');card.selected=on;}};
  input.closest=selector=>{assert.equal(selector,'.publish-extra-card');return card;};
  return card;
});
const totalNode={innerHTML:''};
const section={
  querySelectorAll(selector){if(selector==='.publish-extra-card')return cards;if(selector==='input:checked')return cards.filter(c=>c.input.checked).map(c=>c.input);throw Error(selector);},
  querySelector(selector){assert.equal(selector,'.publish-extras-total');return totalNode;}
};
const scope=vm.createContext({window:{},catalog:P.services,money:P.money,section,free:true,icon:()=>'',esc:s=>String(s)});
vm.runInContext(extract(setup,'serviceFor')+'\n'+extract(setup,'total'),scope);
const summary=setup.slice(setup.indexOf('window.emPublishExtrasSummary=function'),setup.lastIndexOf('\n  }'));
vm.runInContext(summary,scope);
const expected=[0,2990,1990,4980,1790,4780,3780,6770];
for(let mask=0;mask<8;mask++){
  cards.forEach((card,i)=>card.input.checked=Boolean(mask&(1<<i)));
  assert.equal(vm.runInContext('total()',scope),expected[mask]);
  const count=cards.filter(c=>c.input.checked).length;
  assert(totalNode.innerHTML.includes(count===0?'Nenhum serviço selecionado':count===1?'1 serviço selecionado':count+' serviços selecionados'));
  assert(totalNode.innerHTML.includes(P.money(expected[mask]/100)));
  cards.forEach(card=>{
    assert.equal(card.selected,card.input.checked);
    assert.equal(card.button.attributes['aria-pressed'],String(card.input.checked));
    assert.equal(card.button.attributes['aria-label'],card.input.checked?card.dataset.removeLabel:card.dataset.addLabel);
  });
  const review=scope.window.emPublishExtrasSummary();
  if(!count)assert.equal(review,'');
  else{
    assert(review.includes('Total: '+P.money(expected[mask]/100)));
    cards.forEach((card,i)=>assert.equal(review.includes(rows[i][1]),card.input.checked));
  }
}
// Removing every service restores the free publication and clears the review.
cards.forEach(c=>c.input.checked=false);
assert.equal(scope.window.emPublishExtrasSummary(),'');
assert.equal(vm.runInContext('total()',scope),0);
cards[0].input.checked=true;scope.free=false;
assert.equal(scope.window.emPublishExtrasSummary(),'');
console.log('PASS: all 8 service combinations, exact cent totals, review prices, accessible selection and free publication.');

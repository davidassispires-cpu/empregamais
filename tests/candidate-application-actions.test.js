const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// A small DOM fixture for the existing card controller; no network or real account writes.
function element(tag='div',className=''){
 const node={tagName:tag,className,children:[],dataset:{},attributes:{},hidden:false,style:{removeProperty(){}},
  appendChild(child){if(child.parentNode)child.parentNode.children=child.parentNode.children.filter(c=>c!==child);this.children.push(child);child.parentNode=this;return child;},
  prepend(child){this.appendChild(child);this.children.unshift(this.children.pop());},
  setAttribute(key,value){this.attributes[key]=String(value);},
  getAttribute(key){return this.attributes[key]??null;},
  addEventListener(){},
  querySelectorAll(selector){
   const parts=selector.split(/\s+/),first=parts.shift(),found=[];
   function walk(parent){for(const child of parent.children){if(first[0]==='.'?child.className.split(/\s+/).includes(first.slice(1)):child.tagName===first)found.push(child);walk(child);}}
   walk(this);
   return parts.length?found.flatMap(child=>child.querySelectorAll(parts.join(' '))):found;
  },
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;},
  get firstElementChild(){return this.children[0]||null;},
  set innerHTML(value){this.html=value;this.children=[];if(value.includes('<div class="cp-premium-options">'))this.appendChild(element('div','cp-premium-options'));},
  get innerHTML(){return this.html||'';}
 };
 node.classList={add(name){if(!node.className.split(/\s+/).includes(name))node.className+=' '+name;},contains:name=>node.className.split(/\s+/).includes(name)};
 return node;
}

function fixture(premium){
 const options={premium},routes=[],application={id:'own-application',vagaId:'job-1',vaga:'Assistente Administrativo',empresa:'Empresa',email:'ana@example.com',status:'Em avaliação',data:'2026-10-14'};
 const list=element(),toolbar=element(),result=element();
 const document={readyState:'loading',addEventListener(){},createElement:element,querySelector(){return null;},getElementById(id){return {listaCandidaturas:list,cpApplicationFilters:toolbar,cpApplicationResult:result}[id]||null;}};
 const context={window:{
  EmpregaMaisPremiumCandidatoV92:{ehPremium:()=>options.premium},
  EmpregaMaisPreparacao:{compatibilidade:()=>({percent:86,criteria:[]})},
  obterCandidatoAtual:()=>({}),localizarVaga:()=>({totalCandidaturas:24}),carregarCandidaturas:()=>[application],
  irPara:(...args)=>routes.push(args)
 },document,sessionStorage:{getItem:()=>application.email},location:{search:'?pagina=candidaturas'},URLSearchParams,URL};
 for(const file of ['processo-seletivo-etapas.js','candidato-candidaturas.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
 function render(){
  list.children=[];
  const card=element('div','candidatura-item'),top=element('div','candidatura-top'),info=element();
  info.appendChild(element('h3'));info.appendChild(element('p'));top.appendChild(info);top.appendChild(element('span','status-processo'));card.appendChild(top);list.appendChild(card);
  context.window.EmpregaMaisCandidaturasCandidato.atualizarLista(1);
  return card;
 }
 return {options,routes,render};
}

test('free candidates can view the job and both locked actions open the Premium plans',()=>{
 const env=fixture(false),card=env.render();
 card.querySelector('.cp-application-open').onclick();
 assert.deepEqual(env.routes.pop(),['vaga','job-1']);
 assert.ok(card.querySelector('.cp-cancel-trigger'));
 assert.equal(card.querySelectorAll('.cp-premium-option').length,2);
 for(const button of card.querySelectorAll('.cp-premium-option')){
  assert.ok(button.classList.contains('is-locked'));
  assert.equal(button.getAttribute('aria-expanded'),null);
  assert.match(button.innerHTML,/Desbloquear/);
  assert.doesNotMatch(button.innerHTML,/86%|>24<|cp-option-metric/);
  button.onclick();
  assert.deepEqual(env.routes.pop(),['premium-candidato']);
  assert.equal(card.querySelector('.cp-card-insight').hidden,true);
 }
});

test('Premium actions open the correct analysis, switch details and close on a second click',()=>{
 const env=fixture(true),card=env.render(),buttons=card.querySelectorAll('.cp-premium-option'),panel=card.querySelector('.cp-card-insight');
 buttons[0].onclick();
 assert.equal(panel.hidden,false);
 assert.match(panel.innerHTML,/86%/);
 assert.equal(buttons[0].getAttribute('aria-expanded'),'true');
 buttons[1].onclick();
 assert.match(panel.innerHTML,/>24<\/strong>/);
 assert.equal(buttons[0].getAttribute('aria-expanded'),'false');
 assert.equal(buttons[1].getAttribute('aria-expanded'),'true');
 buttons[1].onclick();
 assert.equal(panel.hidden,true);
 assert.equal(buttons[1].getAttribute('aria-expanded'),'false');
 assert.equal(env.routes.length,0);
});

test('automatic refresh preserves an open insight only while the candidate still has Premium',()=>{
 const env=fixture(true),first=env.render();
 first.querySelectorAll('.cp-premium-option')[0].onclick();
 const refreshed=env.render();
 assert.equal(refreshed.querySelector('.cp-card-insight').hidden,false);
 assert.match(refreshed.querySelector('.cp-card-insight').innerHTML,/86%/);
 env.options.premium=false;
 refreshed.querySelectorAll('.cp-premium-option')[1].onclick();
 assert.deepEqual(env.routes.pop(),['premium-candidato']);
 assert.equal(refreshed.querySelector('.cp-card-insight').hidden,true);
 const locked=env.render();
 assert.equal(locked.querySelector('.cp-card-insight').hidden,true);
 for(const button of locked.querySelectorAll('.cp-premium-option')){
  assert.match(button.innerHTML,/Desbloquear/);
  assert.doesNotMatch(button.innerHTML,/86%|>24<|cp-option-metric/);
 }
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// A small DOM fixture for the existing card controller; no network or real account writes.
function element(tag='div',className=''){
 const node={tagName:tag,className,children:[],dataset:{},attributes:{},listeners:{},hidden:false,style:{removeProperty(){}},
  appendChild(child){if(child.parentNode)child.parentNode.children=child.parentNode.children.filter(c=>c!==child);this.children.push(child);child.parentNode=this;return child;},
  prepend(child){this.appendChild(child);this.children.unshift(this.children.pop());},
  setAttribute(key,value){this.attributes[key]=String(value);},
  getAttribute(key){return this.attributes[key]??null;},
  addEventListener(type,callback){this.listeners[type]=callback;},
  contains(child){return child===this||this.children.some(item=>item.contains(child));},
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

function fixture(premium,changes={}){
 const options={premium},routes=[],application=Object.assign({id:'own-application',vagaId:'job-1',vaga:'Assistente Administrativo',empresa:'Empresa',email:'ana@example.com',status:'Em avaliação',data:'2026-10-14'},changes);
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

test('Premium opens compatibility analysis while applicant count is informational without a details action',()=>{
 const env=fixture(true),card=env.render(),buttons=card.querySelectorAll('.cp-premium-option'),panel=card.querySelector('.cp-card-insight');
 assert.equal(buttons[1].tagName,'div');
 assert.equal(buttons[1].onclick,undefined);
 assert.equal(buttons[1].getAttribute('aria-expanded'),null);
 assert.equal(buttons[1].getAttribute('aria-controls'),null);
 assert.match(buttons[1].innerHTML,/>24<\/strong>/);
 assert.doesNotMatch(buttons[1].innerHTML,/Ver análise|Ver detalhes|cp-option-cta/);
 buttons[0].onclick();
 assert.equal(panel.hidden,false);
 assert.match(panel.innerHTML,/86%/);
 assert.equal(buttons[0].getAttribute('aria-expanded'),'true');
 buttons[0].onclick();
 assert.equal(panel.hidden,true);
 assert.equal(buttons[0].getAttribute('aria-expanded'),'false');
 assert.equal(env.routes.length,0);
});

test('automatic refresh preserves an open insight only while the candidate still has Premium',()=>{
 const env=fixture(true),first=env.render();
 first.querySelectorAll('.cp-premium-option')[0].onclick();
 const refreshed=env.render();
 assert.equal(refreshed.querySelector('.cp-card-insight').hidden,false);
 assert.match(refreshed.querySelector('.cp-card-insight').innerHTML,/86%/);
 env.options.premium=false;
 refreshed.querySelectorAll('.cp-premium-option')[0].onclick();
 assert.deepEqual(env.routes.pop(),['premium-candidato']);
 assert.equal(refreshed.querySelector('.cp-card-insight').hidden,true);
 const locked=env.render();
 assert.equal(locked.querySelector('.cp-card-insight').hidden,true);
 for(const button of locked.querySelectorAll('.cp-premium-option')){
  assert.match(button.innerHTML,/Desbloquear/);
  assert.doesNotMatch(button.innerHTML,/86%|>24<|cp-option-metric/);
 }
});

test('the compact journey keeps six stages with explanations and omits the removed heading and ending row',()=>{
 const env=fixture(false,{status:'Entrevista agendada'}),card=env.render(),buttons=card.querySelectorAll('.cp-journey-step');
 assert.deepEqual(buttons.map(button=>button.dataset.cpJourneyKey),['enviada','avaliacao','contato','entrevista','aprovadas','contratadas']);
 assert.deepEqual(buttons.filter(button=>!button.disabled).map(button=>button.dataset.cpJourneyKey),['enviada','entrevista']);
 assert.equal(buttons[3].getAttribute('aria-current'),'step');
 assert.equal(card.querySelector('.cp-journey-heading'),null);
 assert.equal(card.querySelector('.cp-journey-endings'),null);
 assert.equal(buttons[1].onclick,undefined);
});

test('hover, keyboard focus and touch open the stage explanation and Escape closes it',()=>{
 const env=fixture(false,{status:'Em contato',statusAtualizadoEm:'2026-10-16T12:30:00Z',historico:[{status:'Em avaliação',data:'2026-10-15',observacao:'PRIVATE_NOTE'}]}),card=env.render(),footer=card.querySelector('.cp-journey-footer'),panel=card.querySelector('.cp-journey-explanation'),buttons=card.querySelectorAll('.cp-journey-step');
 buttons[1].onmouseenter();
 assert.equal(panel.hidden,false);
 assert.match(panel.innerHTML,/Em avaliação|analisar seu perfil/);
 assert.match(panel.innerHTML,/15\/10\/2026/);
 assert.doesNotMatch(panel.innerHTML,/PRIVATE_NOTE/);
 footer.listeners.mouseleave();
 assert.equal(panel.hidden,true);
 buttons[2].onfocus();
 assert.equal(panel.hidden,false);
 assert.match(panel.innerHTML,/Em contato/);
 assert.equal(buttons[2].getAttribute('aria-expanded'),'true');
 footer.listeners.keydown({key:'Escape',stopPropagation(){}});
 assert.equal(panel.hidden,true);
 buttons[2].onclick();
 footer.listeners.mouseleave();
 assert.equal(panel.hidden,false,'A touch/click pins the explanation until toggled or dismissed');
 buttons[2].onclick();
 assert.equal(panel.hidden,true);
 assert.equal(env.routes.length,0,'Stage explanations remain inside the same application card');
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../candidato-preparacao.js');
const candidateSource=fs.readFileSync(require.resolve('../candidato-preparacao.js'),'utf8');
const recruiterSource=fs.readFileSync(require.resolve('../empregamais_lote10.js'),'utf8');

function classes(initial=[]){const values=new Set(initial);return {contains:value=>values.has(value),add(...names){names.forEach(name=>values.add(name));},remove(...names){names.forEach(name=>values.delete(name));}};}
function node(){
 const attrs=new Map();
 return {dataset:{},listeners:{},buttons:[],writes:0,setAttribute(key,value){attrs.set(key,value);this.writes++;},getAttribute:key=>attrs.get(key)||null,hasAttribute:key=>attrs.has(key),removeAttribute(key){attrs.delete(key);this.writes++;},addEventListener(type,callback){this.listeners[type]=callback;},contains(button){return this.buttons.includes(button);},querySelectorAll(){return this.buttons;},
 set innerHTML(html){this.html=html;this.buttons=Array.from(html.matchAll(/data-cp-professional-view="([^"]+)"/g),match=>{const button=node();button.dataset.cpProfessionalView=match[1];button.closest=()=>button;return button;});},get innerHTML(){return this.html||'';}};
}
function candidate(){
 const page={classList:classes(['ativa']),querySelector:()=>({querySelector:()=>null})};
 const target={},heading={focus(){}},workspace={hidden:true,dataset:{cpView:''},querySelector:selector=>selector==='h1'?heading:target,scrollIntoView(){}};
 const toolbar={nav:null,querySelector(selector){return selector==='.cp-professional-nav'?this.nav:null;},insertBefore(nav){this.nav=nav;nav.remove=()=>{this.nav=null;};}};
 const home={click(){page.classList.add('ativa');page.classList.remove('cp-messages-active');}};
 const routes=[],mounts=[];
 const context={page,workspace,owner:'candidate-one',draftTimer:null,container:{querySelector:()=>null},currentProfile:{plano_candidato:'gratuito'},logged:'candidate-one',identity(){return context.logged;},profile(){return context.currentProfile;},premiumAccess:core.temPremium,icon:()=>'<svg></svg>',saveCurrentAnswer(){},clearTimeout(){},escape:String,jobs:()=>[],applicationRows:()=>[],demo:()=>false,
 document:{getElementById:()=>page,querySelector:selector=>selector.includes('data-route')?home:toolbar,createElement:()=>node()}};
 context.global={irPara:route=>routes.push(route),EMProfessionalTools:{mount:(target,options)=>mounts.push(options)}};
 vm.createContext(context);
 vm.runInContext(candidateSource.slice(candidateSource.indexOf(' function hasCompatibilityAccess()'),candidateSource.indexOf(' function compatibilityMarkup('))+candidateSource.slice(candidateSource.indexOf(' function closeWorkspace('),candidateSource.indexOf(' function toolStatus('))+candidateSource.slice(candidateSource.indexOf(' function mount(){'),candidateSource.indexOf(' function schedule(){')),context);
 return {context,page,workspace,toolbar,routes,mounts,home};
}

test('only candidates with active Premium see the three header shortcuts',()=>{
 const {context,toolbar}=candidate();
 context.syncProfessionalNav();assert.equal(toolbar.nav,null);
 context.currentProfile={plano_candidato:'premium',premium_valido_ate:'2999-01-01'};
 context.syncProfessionalNav();const nav=toolbar.nav;
 assert.deepEqual(nav.buttons.map(button=>button.dataset.cpProfessionalView),['tests','simulator','results']);
 assert.match(nav.innerHTML,/Testes e avaliações/);assert.match(nav.innerHTML,/Simulador de entrevistas/);
 context.syncProfessionalNav();assert.equal(toolbar.nav,nav,'Synchronizing must not create duplicate navigation');
 context.currentProfile.premium_valido_ate='2000-01-01';context.syncProfessionalNav();assert.equal(toolbar.nav,null);
 context.currentProfile={plano_candidato:'premium'};context.logged='';context.syncProfessionalNav();assert.equal(toolbar.nav,null,'A signed-out candidate must not retain the shortcuts');
});

test('all shortcuts open the candidate tools and synchronize the selected tab',()=>{
 const {context,toolbar,mounts,workspace}=candidate();context.currentProfile={plano_candidato:'premium'};context.syncProfessionalNav();
 for(const button of toolbar.nav.buttons){toolbar.nav.listeners.click({target:button,preventDefault(){}});const mounted=mounts.at(-1);assert.equal(mounted.role,'candidate');assert.equal(mounted.view,button.dataset.cpProfessionalView);assert.equal(mounted.company,undefined);assert.equal(button.getAttribute('aria-current'),'page');assert.equal(toolbar.nav.buttons.filter(item=>item.hasAttribute('aria-current')).length,1);}
 assert.equal(workspace.dataset.cpView,'professional-results');
 context.closeWorkspace(false);assert.ok(toolbar.nav.buttons.every(button=>!button.hasAttribute('aria-current')));
});

test('entering from Messages or another page opens the workspace in the candidate dashboard',()=>{
 const {context,page,mounts}=candidate();context.currentProfile={plano_candidato:'premium'};
 page.classList.add('cp-messages-active');context.openProfessional('simulator');assert.equal(page.classList.contains('cp-messages-active'),false);assert.equal(mounts.at(-1).view,'simulator');
 page.classList.remove('ativa');context.openProfessional('results');assert.equal(page.classList.contains('ativa'),true);assert.equal(mounts.at(-1).view,'results');
});

test('free or expired plans cannot open the tools and an expired open workspace closes',()=>{
 const {context,workspace,mounts,routes,toolbar}=candidate();
 for(const view of ['tests','simulator','results'])context.openProfessional(view);
 assert.equal(mounts.length,0);assert.deepEqual(routes,['premium-candidato','premium-candidato','premium-candidato']);
 context.currentProfile={plano_candidato:'premium'};context.openProfessional('tests');assert.equal(workspace.hidden,false);
 context.currentProfile.premium_valido_ate='2000-01-01';context.mount();assert.equal(workspace.hidden,true);assert.equal(toolbar.nav,null);
 context.openProfessional('simulator');assert.equal(mounts.length,1);
});

test('the recruiter toolbar and saved links cannot expose candidate professional pages',()=>{
 const context={esc:String,icon:()=>'<svg></svg>',applications:()=>[],jobs:()=>[],view:'overview',URL,location:{href:'https://example.test/?pagina=painel-empresa&abaPainel=professional-simulator'},sessionStorage:{getItem:key=>key.startsWith('emRecruiterState:')?JSON.stringify({view:'professional-tests'}):'company'}};
 vm.createContext(context);
 vm.runInContext(recruiterSource.slice(recruiterSource.indexOf('  function recruiterToolbar('),recruiterSource.indexOf('  function closeRecruiterAccount('))+recruiterSource.slice(recruiterSource.indexOf('  function panelStateKey()'),recruiterSource.indexOf('  function rememberPanelState()')),context);
 const toolbar=context.recruiterToolbar({nome:'Empresa'});
 assert.doesNotMatch(toolbar,/Testes e avaliações|Simulador de entrevistas|professional-results|recruiter-professional-nav/);
 context.restorePanelState();assert.equal(context.view,'overview');
 assert.doesNotMatch(recruiterSource,/role:'company',view:view\.replace\('professional-'/);
});

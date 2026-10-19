'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../vagas-recomendadas.js'),'utf8');
let writes=0;
function element(classes=[]){
 const set=new Set(classes),attrs=new Map();let hidden=false;
 return {classList:{contains:c=>set.has(c),add(c){set.add(c);writes++;},remove(c){set.delete(c);writes++;},toggle(c,on){on?set.add(c):set.delete(c);writes++;}},
 getAttribute:k=>attrs.get(k)||null,hasAttribute:k=>attrs.has(k),setAttribute(k,v){attrs.set(k,v);writes++;},removeAttribute(k){attrs.delete(k);writes++;},
 get hidden(){return hidden},set hidden(v){hidden=v;writes++;}};
}
const page=element(['pagina','ativa']),profile=element(['pagina']),header=element(),body=element();page.id='pagina-painel-candidato';profile.id='pagina-perfil';
const buttons=['painel-candidato','messages','perfil','recommendations'].map(route=>Object.assign(element(),{dataset:{route}}));
const ctx={page,header,body,messageTab:false,active:page,nav:{querySelectorAll:()=>buttons},window:{candidatoEstaLogado:()=>true}};
ctx.document={body,querySelector:()=>ctx.active,querySelectorAll:()=>[page,profile].filter(p=>p.classList.contains('cp-tab-content'))};
const shell=source.slice(source.indexOf('  function syncShell(){'),source.indexOf('  var shellPending=false;'));
vm.createContext(ctx);vm.runInContext(shell,ctx);
ctx.syncShell();assert(body.classList.contains('cp-shell-active'));assert.equal(buttons[0].getAttribute('aria-current'),'page');
writes=0;ctx.syncShell();assert.equal(writes,0,'An unchanged shell must not restart mutation observers');
ctx.messageTab=true;ctx.syncShell();assert(page.classList.contains('cp-messages-active'));assert.equal(buttons[1].getAttribute('aria-current'),'page');
writes=0;ctx.syncShell();assert.equal(writes,0,'Keeping Messages open must not continuously rewrite its DOM');
ctx.active=profile;ctx.syncShell();assert.equal(ctx.messageTab,false);assert(!page.classList.contains('cp-messages-active'));assert.equal(buttons[2].getAttribute('aria-current'),'page');
ctx.active=page;ctx.syncShell();assert.equal(buttons[0].getAttribute('aria-current'),'page');
ctx.window.candidatoEstaLogado=()=>false;ctx.syncShell();assert(header.hidden);assert(!body.classList.contains('cp-shell-active'));
// Mobile delegation must close the More sheet and invoke the existing handler once.
let closed=0,clicked=0,focused=0;
const routeContext={source:()=>({querySelector:s=>s.includes('perfil')?{click(){clicked++}}:null}),close(){closed++},requestAnimationFrame:fn=>fn(),document:{querySelector:()=>({querySelector:()=>({setAttribute(){},focus(){focused++}})})}};
vm.runInNewContext(source.slice(source.indexOf(' function navigate(route)'),source.indexOf(' function more(){')),routeContext);
routeContext.navigate('perfil');assert.equal(closed,1);assert.equal(clicked,1);assert.equal(focused,1);
routeContext.navigate('absent');assert.equal(clicked,1,'Missing destinations must not open the wrong function');
const css=fs.readFileSync(require.resolve('../site-fonts.css'),'utf8');
const mobile=css.slice(css.indexOf('/* Bottom navigation owns'));
assert.match(mobile,/@layer candidate-palette/);assert.match(mobile,/@media\(max-width:767px\)/);assert.match(mobile,/\.cp-navigation \{display:none!important\}/);
console.log('PASS: stable shell emits no repeated mutations, Messages/Profile/Home switch correctly, logout hides shell, mobile delegates once, phone overrides use the winning CSS layer.');

/* EMPREGAMAIS WEB PUSH V2 */
(function(){
'use strict';

const VAPID_PUBLIC_KEY='BP4lvH5GXlDe532LtjkgqHN0R9U7Vgfsduuq-on8Qk2vjLR2bVIdvTVXUuxlUsi70XbO6fGfD2y--8jiKh6QOtg';
const SUPABASE_URL='https://mkezlcewyengejdmtppl.supabase.co';
const ANON_KEY='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR4';
const PUSH_FN='/functions/v1/empregamais-push';
let pushReady=false;

function b64ToUint8(base64){
 const pad='='.repeat((4-base64.length%4)%4);
 const raw=atob((base64+pad).replace(/-/g,'+').replace(/_/g,'/'));
 return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
async function pushAuth(){
 if(typeof sbGarantirSessaoEM==='function')return await sbGarantirSessaoEM();
 return sessionStorage.getItem('empregaMaisSupabaseAccessToken')||localStorage.getItem('empregaMaisSupabaseAccessToken')||'';
}
async function pushUser(token){
 const r=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{Authorization:'Bearer '+token,apikey:ANON_KEY}});
 if(!r.ok)throw Error('Sua sessão expirou. Entre novamente para ativar as notificações.');
 const u=await r.json();
 if(!u?.id)throw Error('Não foi possível identificar sua conta.');
 return u;
}
async function pushFetch(path,opts={}){
 const token=await pushAuth();
 if(!token)throw Error('Entre na sua conta para ativar as notificações.');
 return fetch(SUPABASE_URL+path,Object.assign({},opts,{headers:Object.assign({'Authorization':'Bearer '+token,apikey:ANON_KEY},opts.headers||{})}));
}
async function respostaErro(r,padrao){
 let detalhe='';
 try{
  const t=await r.text();
  if(t){
   try{const j=JSON.parse(t);detalhe=j.message||j.error_description||j.error||j.hint||''}
   catch(_){detalhe=t}
  }
 }catch(_){}
 console.warn('[EmpregaMais] Web Push HTTP '+r.status,detalhe);
 if(r.status===401||r.status===403)return 'Sua sessão expirou. Entre novamente e tente ativar as notificações.';
 return padrao;
}
async function registroSW(){
 const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
 await navigator.serviceWorker.ready;
 return reg;
}
async function assinaturaAtual(){
 if(!('serviceWorker'in navigator)||!('PushManager'in window))return null;
 try{
  const reg=await navigator.serviceWorker.getRegistration('./')||await navigator.serviceWorker.ready;
  return await reg.pushManager.getSubscription();
 }catch(_){return null}
}
async function pushRegister(){
 if(!window.isSecureContext)throw Error('As notificações exigem uma conexão segura (HTTPS).');
 if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))throw Error('Este navegador não oferece suporte a notificações push.');

 const token=await pushAuth();
 if(!token)throw Error('Entre na sua conta para ativar as notificações.');
 const user=await pushUser(token);
 if(typeof papelAtual==='function'&&papelAtual()==='candidato')sessionStorage.setItem('candidatoSupabaseUserId',user.id);

 const reg=await registroSW();
 let permission=Notification.permission;
 if(permission!=='granted')permission=await Notification.requestPermission();
 if(permission!=='granted')throw Error('As notificações estão bloqueadas. No Chrome, abra as permissões deste site e habilite “Notificações”.');

 let sub=await reg.pushManager.getSubscription();
 if(!sub){
  sub=await reg.pushManager.subscribe({
   userVisibleOnly:true,
   applicationServerKey:b64ToUint8(VAPID_PUBLIC_KEY)
  });
 }
 const j=sub.toJSON();
 if(!j.endpoint||!j.keys?.p256dh||!j.keys?.auth)throw Error('O navegador não retornou uma assinatura de notificação válida.');

 const body={
  user_id:user.id,
  endpoint:j.endpoint,
  p256dh:j.keys.p256dh,
  auth:j.keys.auth,
  user_agent:navigator.userAgent,
  enabled:true
 };
 let r=await fetch(SUPABASE_URL+'/rest/v1/push_subscriptions?on_conflict=user_id%2Cendpoint',{
  method:'POST',
  headers:{Authorization:'Bearer '+token,apikey:ANON_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},
  body:JSON.stringify(body)
 });
 if(!r.ok)throw Error(await respostaErro(r,'Não foi possível registrar este celular. Tente novamente em alguns segundos.'));

 r=await fetch(SUPABASE_URL+'/rest/v1/push_preferences?on_conflict=user_id',{
  method:'POST',
  headers:{Authorization:'Bearer '+token,apikey:ANON_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},
  body:JSON.stringify({user_id:user.id,enabled:true,vagas_compativeis:true,processo_seletivo:true,mensagens:true})
 });
 if(!r.ok)throw Error(await respostaErro(r,'O celular foi registrado, mas não foi possível salvar suas preferências.'));

 pushReady=true;
 return true;
}
async function pushDisable(){
 const reg=await navigator.serviceWorker.getRegistration('./')||await navigator.serviceWorker.getRegistration('./sw.js');
 if(!reg)return;
 const sub=await reg.pushManager.getSubscription();
 if(!sub)return;
 const token=await pushAuth();
 if(token){
  await fetch(SUPABASE_URL+'/rest/v1/push_subscriptions?endpoint=eq.'+encodeURIComponent(sub.endpoint),{
   method:'DELETE',
   headers:{Authorization:'Bearer '+token,apikey:ANON_KEY}
  }).catch(()=>{});
 }
 await sub.unsubscribe();
 pushReady=false;
}
async function pushNotifyProcesso(id,kind='status'){
 try{
  const r=await pushFetch(PUSH_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'processo',candidatura_id:id,kind})});
  if(!r.ok)console.warn('[EmpregaMais] push processo',await r.text());
 }catch(e){console.warn('[EmpregaMais] push processo',e)}
}
async function pushNotifyNovaVaga(id){
 try{
  const r=await pushFetch(PUSH_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'nova_vaga',vaga_id:id})});
  if(!r.ok)console.warn('[EmpregaMais] push vaga',await r.text());
 }catch(e){console.warn('[EmpregaMais] push vaga',e)}
}
window.empregaMaisPush={register:pushRegister,disable:pushDisable,notifyProcesso:pushNotifyProcesso,notifyNovaVaga:pushNotifyNovaVaga};

function pushCard(){
 const page=document.getElementById('pagina-painel-candidato');
 if(!page||page.querySelector('#emPushCard'))return;
 const main=page.querySelector('.cand-main');
 if(!main)return;

 const card=document.createElement('section');
 card.id='emPushCard';
 card.className='em-push-card';
 card.innerHTML='<div class="em-push-icon" aria-hidden="true">◉</div><div class="em-push-copy"><span class="em-push-kicker">NOTIFICAÇÕES NO CELULAR</span><h3>Receba atualizações importantes</h3><p>Novas vagas compatíveis, mensagens e mudanças nos seus processos seletivos.</p><div class="em-push-actions"><button type="button" id="emPushAtivar">Ativar notificações</button><button type="button" id="emPushDesativar" class="secondary" hidden>Desativar</button></div><small id="emPushStatus"></small></div>';

 const hero=main.querySelector('.cand-dashboard-hero');
 if(hero)hero.insertAdjacentElement('afterend',card);else main.prepend(card);

 const status=card.querySelector('#emPushStatus');
 const on=card.querySelector('#emPushAtivar');
 const off=card.querySelector('#emPushDesativar');
 const setStatus=t=>{status.textContent=t||''};

 on.onclick=async()=>{
  on.disabled=true;
  setStatus('Ativando notificações…');
  try{
   await pushRegister();
   setStatus('Notificações ativas neste celular.');
   on.hidden=true;
   off.hidden=false;
  }catch(e){
   console.error('[EmpregaMais] ativação de notificações',e);
   setStatus(e.message||'Não foi possível ativar.');
   on.disabled=false;
  }
 };
 off.onclick=async()=>{
  off.disabled=true;
  setStatus('Desativando…');
  try{
   await pushDisable();
   setStatus('Notificações desativadas neste celular.');
   on.hidden=false;
   on.disabled=false;
   on.textContent='Ativar notificações';
   off.hidden=true;
  }catch(e){
   console.error('[EmpregaMais] desativação de notificações',e);
   setStatus('Não foi possível desativar.');
  }
  off.disabled=false;
 };

 (async()=>{
  if(!('Notification'in window)){on.disabled=true;setStatus('Seu navegador não oferece suporte a notificações.');return}
  if(Notification.permission==='denied'){on.disabled=true;setStatus('As notificações estão bloqueadas nas permissões deste site.');return}
  const sub=await assinaturaAtual();
  if(Notification.permission==='granted'&&sub){
   pushReady=true;
   on.hidden=true;
   off.hidden=false;
   setStatus('Notificações ativas neste celular.');
  }else if(Notification.permission==='granted'){
   setStatus('Permissão concedida. Toque em “Ativar notificações” para concluir.');
  }
 })();
}
function pushCss(){
 if(document.getElementById('emPushCss'))return;
 const s=document.createElement('style');
 s.id='emPushCss';
 s.textContent=`
 #pagina-painel-candidato .em-push-card{margin:14px 0 0;padding:15px 17px;border:1px solid #cfe6f5;border-radius:14px;background:#eef8ff;display:flex;align-items:center;gap:14px;box-shadow:0 4px 14px rgba(37,126,189,.05)}
 #pagina-painel-candidato .em-push-icon{width:42px;height:42px;min-width:42px;border-radius:12px;background:#d9efff;color:#1688d3;display:grid;place-items:center;font-size:16px}
 #pagina-painel-candidato .em-push-copy{min-width:0;flex:1}
 #pagina-painel-candidato .em-push-kicker{display:block;font-size:9px;letter-spacing:.13em;font-weight:800;color:#2189cf}
 #pagina-painel-candidato .em-push-card h3{margin:4px 0 3px;color:#123f65;font-size:16px;line-height:1.2}
 #pagina-painel-candidato .em-push-card p{margin:0;max-width:760px;color:#5f7c91;font-size:11.5px;line-height:1.45}
 #pagina-painel-candidato .em-push-actions{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
 #pagina-painel-candidato .em-push-actions button{min-height:36px;border:1px solid #2496df;border-radius:9px;padding:0 13px;background:#299be4;color:#fff;font:inherit;font-size:10.5px;font-weight:800;cursor:pointer}
 #pagina-painel-candidato .em-push-actions button:disabled{opacity:.62;cursor:wait}
 #pagina-painel-candidato .em-push-actions .secondary{background:#fff;color:#187cbf;border-color:#b9ddf3}
 #pagina-painel-candidato .em-push-card small{display:block;margin-top:7px;color:#6d8798;font-size:9.5px;line-height:1.35}
 @media(max-width:600px){
  #pagina-painel-candidato .em-push-card{margin:10px 0 0;padding:13px 14px;align-items:flex-start;gap:10px}
  #pagina-painel-candidato .em-push-icon{width:36px;height:36px;min-width:36px;border-radius:10px}
  #pagina-painel-candidato .em-push-card h3{font-size:14px}
  #pagina-painel-candidato .em-push-card p{font-size:10.5px}
  #pagina-painel-candidato .em-push-actions{margin-top:8px}
  #pagina-painel-candidato .em-push-actions button{min-height:34px;font-size:10px}
 }`;
 document.head.appendChild(s);
}
function hook(){
 if(window.__emPushHooks)return;
 window.__emPushHooks=true;
 if(typeof window.mudarEtapaCandidato==='function'){
  const old=window.mudarEtapaCandidato;
  window.mudarEtapaCandidato=async function(id,status){
   const r=await old.apply(this,arguments);
   setTimeout(()=>pushNotifyProcesso(id,'status'),250);
   return r;
  };
 }
 if(typeof window.salvarEntrevista==='function'){
  const old=window.salvarEntrevista;
  window.salvarEntrevista=async function(e){
   const id=document.getElementById('entrevistaCandidaturaId')?.value;
   const r=await old.apply(this,arguments);
   if(id)setTimeout(()=>pushNotifyProcesso(id,'entrevista'),250);
   return r;
  };
 }
 if(typeof window.adminAtualizarStatusSupabase==='function'){
  const old=window.adminAtualizarStatusSupabase;
  window.adminAtualizarStatusSupabase=async function(id,status,motivo){
   const r=await old.apply(this,arguments);
   if(status==='aprovada')setTimeout(()=>pushNotifyNovaVaga(id),350);
   return r;
  };
 }
}
function init(){
 pushCss();
 hook();
 if(typeof papelAtual==='function'&&papelAtual()==='candidato')pushCard();
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(init,300));
window.addEventListener('popstate',()=>setTimeout(init,200));
window.addEventListener('pageshow',()=>setTimeout(init,200));
setInterval(()=>{try{hook();if(typeof papelAtual==='function'&&papelAtual()==='candidato')pushCard()}catch(_){}},3000);
})();
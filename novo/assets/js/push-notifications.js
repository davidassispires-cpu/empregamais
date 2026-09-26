/* EMPREGAMAIS WEB PUSH V1 */
(function(){
'use strict';
const VAPID_PUBLIC_KEY='BP4lvH5GXlDe532LtjkgqHN0R9U7Vgfsduuq-on8Qk2vjLR2bVIdvTVXUuxlUsi70XbO6fGfD2y--8jiKh6QOtg';
const SUPABASE_URL='https://mkezlcewyengejdmtppl.supabase.co';
const ANON_KEY='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR4';
const PUSH_FN='/functions/v1/empregamais-push';
let pushReady=false;
function b64ToUint8(base64){const pad='='.repeat((4-base64.length%4)%4),raw=atob((base64+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0))}
async function pushAuth(){if(typeof sbGarantirSessaoEM==='function')return await sbGarantirSessaoEM();return sessionStorage.getItem('empregaMaisSupabaseAccessToken')||localStorage.getItem('empregaMaisSupabaseAccessToken')||''}
async function pushFetch(path,opts={}){const token=await pushAuth();if(!token)throw Error('Entre na sua conta para ativar as notificações.');return fetch(SUPABASE_URL+path,Object.assign({},opts,{headers:Object.assign({'Authorization':'Bearer '+token,apikey:ANON_KEY},opts.headers||{})}))}
async function pushRegister(){
 if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))throw Error('Este navegador não oferece suporte a notificações push.');
 const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'});await navigator.serviceWorker.ready;
 let permission=Notification.permission;if(permission!=='granted')permission=await Notification.requestPermission();
 if(permission!=='granted')throw Error('As notificações foram bloqueadas no navegador. Ative-as nas configurações do navegador.');
 let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToUint8(VAPID_PUBLIC_KEY)});
 const j=sub.toJSON(),uid=sessionStorage.getItem('candidatoSupabaseUserId')||sessionStorage.getItem('empresaSupabaseAuthUserId')||'';if(!uid)throw Error('Não foi possível identificar sua conta.');
 const body={user_id:uid,endpoint:j.endpoint,p256dh:j.keys?.p256dh,auth:j.keys?.auth,user_agent:navigator.userAgent,enabled:true};
 let r=await pushFetch('/rest/v1/push_subscriptions?on_conflict=endpoint',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});if(!r.ok)throw Error('Não foi possível registrar este celular.');
 r=await pushFetch('/rest/v1/push_preferences?on_conflict=user_id',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:uid,enabled:true,vagas_compativeis:true,processo_seletivo:true,mensagens:true})});if(!r.ok)throw Error('Não foi possível salvar suas preferências.');
 pushReady=true;return true;
}
async function pushDisable(){const reg=await navigator.serviceWorker.getRegistration('./sw.js');if(!reg)return;const sub=await reg.pushManager.getSubscription();if(!sub)return;const token=await pushAuth();if(token)await fetch(SUPABASE_URL+'/rest/v1/push_subscriptions?endpoint=eq.'+encodeURIComponent(sub.endpoint),{method:'DELETE',headers:{Authorization:'Bearer '+token,apikey:ANON_KEY}});await sub.unsubscribe();pushReady=false}
async function pushNotifyProcesso(id,kind='status'){try{const r=await pushFetch(PUSH_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'processo',candidatura_id:id,kind})});if(!r.ok)console.warn('[EmpregaMais] push processo',await r.text())}catch(e){console.warn('[EmpregaMais] push processo',e)}}
async function pushNotifyNovaVaga(id){try{const r=await pushFetch(PUSH_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'nova_vaga',vaga_id:id})});if(!r.ok)console.warn('[EmpregaMais] push vaga',await r.text())}catch(e){console.warn('[EmpregaMais] push vaga',e)}}
window.empregaMaisPush={register:pushRegister,disable:pushDisable,notifyProcesso:pushNotifyProcesso,notifyNovaVaga:pushNotifyNovaVaga};
function pushCard(){
 const page=document.getElementById('pagina-painel-candidato');if(!page||page.querySelector('#emPushCard'))return;
 const card=document.createElement('section');card.id='emPushCard';card.className='em-push-card';
 card.innerHTML='<div class="em-push-copy"><span class="em-push-kicker">NOTIFICAÇÕES NO CELULAR</span><h3>Não perca nenhuma atualização</h3><p>Receba novas vagas compatíveis e mudanças no seu processo seletivo, mesmo quando o EmpregaMais não estiver aberto.</p><div class="em-push-actions"><button type="button" id="emPushAtivar">Ativar notificações</button><button type="button" id="emPushDesativar" class="secondary" hidden>Desativar</button></div><small id="emPushStatus"></small></div><div class="em-push-bell" aria-hidden="true">●</div>';
 page.prepend(card);
 const status=card.querySelector('#emPushStatus'),on=card.querySelector('#emPushAtivar'),off=card.querySelector('#emPushDesativar'),setStatus=t=>status.textContent=t;
 on.onclick=async()=>{on.disabled=true;setStatus('Ativando…');try{await pushRegister();setStatus('Notificações ativas neste celular.');on.hidden=true;off.hidden=false}catch(e){setStatus(e.message||'Não foi possível ativar.');on.disabled=false}};
 off.onclick=async()=>{off.disabled=true;try{await pushDisable();setStatus('Notificações desativadas neste celular.');on.hidden=false;off.hidden=true}catch(e){setStatus('Não foi possível desativar.')}off.disabled=false};
 if(Notification.permission==='granted'){on.textContent='Notificações ativas';on.disabled=true;off.hidden=false;setStatus('Este navegador já autorizou notificações.')}
}
function pushCss(){if(document.getElementById('emPushCss'))return;const s=document.createElement('style');s.id='emPushCss';s.textContent='.em-push-card{margin:0 0 22px;padding:20px 22px;border:1px solid #d8e7ed;border-radius:16px;background:linear-gradient(135deg,#f5fbfc,#fff);display:flex;align-items:center;justify-content:space-between;gap:22px;box-shadow:0 6px 18px rgba(18,55,83,.06)}.em-push-kicker{font-size:10px;letter-spacing:1.5px;font-weight:800;color:#087789}.em-push-card h3{margin:5px 0;color:#123b54;font-size:19px}.em-push-card p{margin:0;max-width:720px;color:#60798b;font-size:13px;line-height:1.55}.em-push-actions{display:flex;gap:8px;margin-top:13px;flex-wrap:wrap}.em-push-actions button{border:0;border-radius:9px;padding:10px 14px;background:#087789;color:#fff;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.em-push-actions .secondary{background:#fff;color:#087789;border:1px solid #b9d0dc}.em-push-card small{display:block;margin-top:8px;color:#708797;font-size:11px}.em-push-bell{width:48px;height:48px;border-radius:50%;background:#e5f5f7;color:#087789;display:grid;place-items:center;font-size:24px}@media(max-width:600px){.em-push-card{align-items:flex-start}.em-push-bell{display:none}}';document.head.appendChild(s)}
function hook(){
 if(window.__emPushHooks)return;window.__emPushHooks=true;
 if(typeof window.mudarEtapaCandidato==='function'){const old=window.mudarEtapaCandidato;window.mudarEtapaCandidato=async function(id,status){const r=await old.apply(this,arguments);setTimeout(()=>pushNotifyProcesso(id,'status'),250);return r}}
 if(typeof window.salvarEntrevista==='function'){const old=window.salvarEntrevista;window.salvarEntrevista=async function(e){const id=document.getElementById('entrevistaCandidaturaId')?.value,r=await old.apply(this,arguments);if(id)setTimeout(()=>pushNotifyProcesso(id,'entrevista'),250);return r}}
 if(typeof window.adminAtualizarStatusSupabase==='function'){const old=window.adminAtualizarStatusSupabase;window.adminAtualizarStatusSupabase=async function(id,status,motivo){const r=await old.apply(this,arguments);if(status==='aprovada')setTimeout(()=>pushNotifyNovaVaga(id),350);return r}}
}
function init(){pushCss();hook();if(typeof papelAtual==='function'&&papelAtual()==='candidato')pushCard()}
document.addEventListener('DOMContentLoaded',()=>setTimeout(init,300));window.addEventListener('popstate',()=>setTimeout(init,200));window.addEventListener('pageshow',()=>setTimeout(init,200));setInterval(()=>{try{hook();if(typeof papelAtual==='function'&&papelAtual()==='candidato')pushCard()}catch(_){ }},3000);
})();
/* +Empregos: participant-scoped conversations, read receipts and live inbox notifications. */
(function(global){
'use strict';
function threadKey(m){return JSON.stringify([m.empresa_id,m.job_ref,m.candidate_uid||String(m.candidate_email||'').toLowerCase()]);}
function incoming(m,role){return m.sender_role!==role;}
function groupEvents(events,role){
 var map=new Map();
 events.forEach(function(m){
  var id=threadKey(m),t=map.get(id);
  if(!t){t={id:id,first:m,last:m,messages:[],unread:0};map.set(id,t);}
  t.messages.push(m);
  if(incoming(m,role)&&!m.read_at)t.unread++;
  if(Date.parse(m.created_at)>Date.parse(t.last.created_at))t.last=m;
 });
 return Array.from(map.values()).map(function(t){t.messages.sort(function(a,b){return Date.parse(a.created_at)-Date.parse(b.created_at)||a.event_id.localeCompare(b.event_id);});return t;}).sort(function(a,b){return Date.parse(b.last.created_at)-Date.parse(a.last.created_at)||a.id.localeCompare(b.id);});
}
var core={threadKey:threadKey,incoming:incoming,groupEvents:groupEvents};
if(typeof module!=='undefined'&&module.exports)module.exports=core;
if(typeof document==='undefined')return;
var base='https://mkezlcewyengejdmtppl.supabase.co',publicKey='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
var context=null,generation=0,events=[],selected='',search='',drafts={},unread=0,loaded=false,loading=false,hasMore=false,take=200,lastLoad=0,error='',root=null,companyOptions=null;
var socket=null,socketToken='',joined=false,heartbeat=null,reconnect=null,retry=0,reference=0,reloadTimer=null,scheduled=false,reading=false,sending=false,lastSignature='',lastPreview='',toast=null,toastTimer=null;
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var uuid=function(){return global.crypto.randomUUID();};
function stamp(v){var d=new Date(v);return isNaN(d)?'':d.toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}
function token(){return sessionStorage.getItem('empregaMaisSupabaseAccessToken')||'';}
function jwtUser(value){try{var part=value.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(atob(part)).sub||'';}catch(ignore){return '';}}
function company(){try{var current=global.obterEmpresaAtual&&global.obterEmpresaAtual();if(current&&current.cnpj)return current;return JSON.parse(sessionStorage.getItem('empresaLogada')||'null')||companyOptions&&companyOptions.company||{};}catch(ignore){return {};}}
function currentContext(){
 var page=new URLSearchParams(location.search).get('pagina'),demo=page==='demo-candidato'||page==='demo-recrutador';
 var role=page==='demo-candidato'?'candidate':page==='demo-recrutador'?'company':({candidato:'candidate',empresa:'company'})[sessionStorage.getItem('empregaMaisPapel')];
 var uid=demo?'demo-'+role:jwtUser(token()),e=role==='company'?company():{},cnpj=String(e.cnpj||sessionStorage.getItem('empresaCnpj')||'').replace(/\D/g,'');
 if(!role||!uid||!demo&&!token())return null;
 return {key:[demo?'demo':'real',role,uid,cnpj].join(':'),role:role,uid:uid,demo:demo,cnpj:cnpj,companyId:/^[a-f0-9-]{36}$/i.test(e.id||'')?e.id:'',companyName:e.nomeFantasia||e.nome_fantasia||e.nome||'Sua empresa'};
}
function draftKey(){return 'emInboxDraftsV1:'+context.key;}
function saveDrafts(){if(context)try{sessionStorage.setItem(draftKey(),JSON.stringify(drafts));}catch(ignore){}}
function reset(next){
 generation++;closeSocket();clearTimeout(reloadTimer);context=next;events=[];selected='';search='';drafts={};unread=0;loaded=false;loading=false;reading=false;sending=false;take=200;hasMore=false;lastLoad=0;error='';lastSignature='';lastPreview='';dismissToast();
 if(next)try{drafts=JSON.parse(sessionStorage.getItem(draftKey())||'{}');}catch(ignore){}
 if(root)render(true);paintCounters();
}
async function request(path,options){
 options=options||{};var auth=token();if(!auth)throw Error('Sua sessão expirou. Entre novamente para abrir as mensagens.');
 var controller=new AbortController(),timeout=setTimeout(function(){controller.abort();},20000);
 try{
  var response=await fetch(base+'/rest/v1/'+path,Object.assign({},options,{signal:controller.signal,headers:Object.assign({apikey:publicKey,Authorization:'Bearer '+auth,'Content-Type':'application/json',Prefer:'return=representation'},options.headers||{})}));
  var data=options.method==='HEAD'?null:await response.json().catch(function(){return null;});
  if(!response.ok){var failure=Error(response.status===401?'Sua sessão expirou. Entre novamente.':data&&data.message||'Não foi possível atualizar a conversa. Tente novamente.');failure.code=data&&data.code;throw failure;}
  var count=Number((response.headers.get('content-range')||'').split('/')[1]);return {data:data==null?[]:data,count:Number.isFinite(count)?count:null};
 }catch(failure){if(failure.name==='AbortError')throw Error('A conexão demorou a responder. Tente atualizar as mensagens.');throw failure;}finally{clearTimeout(timeout);}
}
async function api(path,options){return (await request(path,options)).data;}
async function ensureCompany(c){
 if(c.role!=='company'||c.demo||c.companyId)return;
 if(!c.cnpj)throw Error('Entre na conta da empresa para abrir as conversas.');
 var formatted=c.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,'$1.$2.$3/$4-$5');
 var result=await api('empresas?select=id&or='+encodeURIComponent('(cnpj.eq.'+c.cnpj+',cnpj.eq.'+formatted+')')+'&limit=1');
 if(!result.length)throw Error('Não foi possível identificar a empresa desta conta.');
 c.companyId=result[0].id;
}
function scope(c){return c.role==='candidate'?'candidate_uid=eq.'+encodeURIComponent(c.uid):'empresa_id=eq.'+encodeURIComponent(c.companyId);}
function demoEvents(c){
 var key='emInboxDemoV1:'+c.role,saved;try{saved=JSON.parse(sessionStorage.getItem(key)||'null');}catch(ignore){}
 if(Array.isArray(saved))return saved;
 var common={empresa_id:'demo-company',candidate_uid:'demo-candidate',candidate_email:'ana@example.com',company_name:'Empresa Demonstração',job_ref:'demo-1',job_title:'Assistente Administrativo'};
 var time=Date.now();
 saved=[Object.assign({},common,{event_id:'m:demo-message-1',record_id:'demo-message-1',message_id:'demo-message-1',sender_role:'company',body:'Olá! Recebemos sua candidatura. Você tem disponibilidade para uma entrevista?',created_at:new Date(time-3600000).toISOString(),read_at:null})];
 if(c.role==='company')saved.push(Object.assign({},common,{event_id:'r:demo-reply-1',record_id:'demo-reply-1',message_id:'demo-message-1',sender_role:'candidate',body:'Olá! Tenho disponibilidade. Poderiam me informar o horário da entrevista?',created_at:new Date(time-1800000).toISOString(),read_at:null}));
 else saved.push(Object.assign({},common,{empresa_id:'demo-retail',company_name:'Varejo Demonstração',job_ref:'demo-4',job_title:'Vendedor de Loja',event_id:'m:demo-message-2',record_id:'demo-message-2',message_id:'demo-message-2',sender_role:'company',body:'Obrigado pelo interesse na vaga. As próximas orientações serão enviadas por esta conversa.',created_at:new Date(time-7200000).toISOString(),read_at:null}));
 sessionStorage.setItem(key,JSON.stringify(saved));return saved;
}
function addDemoMessage(row){var c=currentContext();if(!c||!c.demo)return;sync();events=demoEvents(c).filter(function(m){return m.record_id!==row.id;});events.push({empresa_id:'demo-company',candidate_uid:'demo-'+row.candidate_email,candidate_email:row.candidate_email,company_name:'Empresa Demonstração',job_ref:row.job_ref,job_title:row.job_title,event_id:'m:'+row.id,record_id:row.id,message_id:row.id,sender_role:'company',body:row.body,created_at:row.created_at,read_at:null});saveDemo();loaded=true;render();}
function saveDemo(){sessionStorage.setItem('emInboxDemoV1:'+context.role,JSON.stringify(events));}
function candidateName(t){
 try{var rows=global.carregarCandidaturas&&global.carregarCandidaturas()||[],m=t.first;
  var c=rows.find(function(a){return String(a.email||a.candidato_email||a.candidatoEmail||'').toLowerCase()===String(m.candidate_email).toLowerCase()&&String(a.vagaId||a.vaga_id||a.idVaga)===String(m.job_ref);});
  if(c)return c.nome||c.candidatoNome||c.nomeCandidato||m.candidate_email;
 }catch(ignore){}
 return context&&context.demo?'Candidato Demonstração':t.first.candidate_email;
}
function displayName(t){return context.role==='company'?candidateName(t):t.first.company_name;}
function job(ref){try{return (global.todasAsVagasPublicas?global.todasAsVagasPublicas():[]).find(function(v){return String(v.id)===String(ref);})||{};}catch(ignore){return {};}}
function historyHtml(t){
 return t.messages.map(function(m){
  var mine=m.sender_role===context.role,name=mine?'Você':displayName(t);
  // Sender identity stays the same in both inboxes, independent of the viewer's palette.
  var sender=m.sender_role==='company'?'company':'candidate',ink=sender==='company'?'#175b94':'#6941a8',textStyle=' style="color:'+ink+'!important"';
  return '<article data-sender-role="'+sender+'" class="em-chat-bubble '+(mine?'is-mine':'')+'"><small'+textStyle+'>'+esc(name)+'</small><p'+textStyle+'>'+esc(m.body)+'</p><time'+textStyle+' datetime="'+esc(m.created_at)+'">'+esc(stamp(m.created_at))+'</time>'+(mine?'<span'+textStyle+' class="em-chat-sent">'+(m.read_at?'Lida':'Enviada')+'</span>':'')+'</article>';
 }).join('');
}
function details(t){
 var v=job(t.first.job_ref),companyRole=context.role==='company';
 return '<aside class="em-chat-details"><span class="em-chat-avatar" aria-hidden="true">'+esc(displayName(t).slice(0,2).toUpperCase())+'</span><h2>'+esc(t.first.job_title)+'</h2><p>'+esc(displayName(t))+'</p><dl>'+(companyRole?'<dt>E-mail do candidato</dt><dd>'+esc(t.first.candidate_email)+'</dd>':'')+'<dt>Local</dt><dd>'+esc([v.cidade,v.uf].filter(Boolean).join(' – ')||'Consulte a vaga')+'</dd><dt>Tipo de contrato</dt><dd>'+esc(v.contrato||'Consulte a vaga')+'</dd><dt>Modalidade</dt><dd>'+esc(v.modalidade||'Consulte a vaga')+'</dd></dl><a href="?pagina=vaga&amp;id='+encodeURIComponent(t.first.job_ref)+'">Ver descrição completa da vaga</a></aside>';
}
function render(force){
 if(!root||!root.isConnected)return;
 if(!context){root.innerHTML='<p class="em-chat-note" role="status">Entre na sua conta para abrir as mensagens.</p>';return;}
 var threads=groupEvents(events,context.role),active=threads.find(function(t){return t.id===selected;}),term=search.toLocaleLowerCase('pt-BR');
 var visible=threads.filter(function(t){return (displayName(t)+' '+t.first.job_title).toLocaleLowerCase('pt-BR').includes(term);});
 var signature=JSON.stringify([generation,selected,search,error,loaded,hasMore,events]);
 if(!force&&signature===lastSignature)return;
 lastSignature=signature;
 var oldHistory=root.querySelector('.em-chat-history'),oldTop=oldHistory?oldHistory.scrollTop:0,atBottom=!oldHistory||oldHistory.scrollHeight-oldTop-oldHistory.clientHeight<50;
 var focused=root.getRootNode().activeElement||document.activeElement,focusId=focused&&root.contains(focused)?focused.id:'',focusSearch=focused&&focused.matches('[data-chat-search]')&&root.contains(focused),start=focused&&focused.selectionStart,end=focused&&focused.selectionEnd;
 var feedback=error||(!loaded?'Carregando conversas…':context.demo?'Conversas de demonstração':'Conversas dos seus processos seletivos');
 root.innerHTML='<aside class="em-chat-list"><header><h1>Mensagens</h1><button type="button" data-chat-refresh aria-label="Atualizar conversas">Atualizar</button></header><label class="em-chat-search">Buscar conversa<input type="search" value="'+esc(search)+'" placeholder="'+(context.role==='company'?'Candidato ou cargo':'Empresa ou cargo')+'" data-chat-search></label><p class="em-chat-note" role="status">'+esc(feedback)+'</p><nav aria-label="Conversas">'+(visible.length?visible.map(function(t){
  var name=displayName(t);
  return '<button type="button" class="'+(t.unread?'is-unread':'')+'" data-chat-select="'+esc(t.id)+'" aria-pressed="'+(selected===t.id)+'" aria-label="'+esc(name+', '+t.first.job_title+(t.unread?', '+t.unread+' não lida'+(t.unread===1?'':'s'):''))+'"><span class="em-chat-avatar" aria-hidden="true">'+esc(name.slice(0,2).toUpperCase())+'</span><span class="em-chat-preview"><strong>'+esc(name)+'</strong><span>'+esc(t.first.job_title)+'</span><small>'+(t.last.sender_role===context.role?'Você: ':'')+esc(t.last.body)+'</small></span>'+(t.unread?'<span class="em-chat-unread" aria-hidden="true">'+(t.unread>99?'99+':t.unread)+'</span>':'')+'</button>';
 }).join(''):'<p class="em-chat-note">'+(loaded?'Nenhuma conversa encontrada.':'Aguarde o carregamento das conversas.')+'</p>')+'</nav>'+(hasMore?'<button type="button" class="em-chat-more" data-chat-more>Carregar conversas anteriores</button>':'')+'</aside><section class="em-chat-conversation" aria-label="Conversa">'+(active?
 '<header><div><strong>'+esc(displayName(active))+'</strong><p>'+esc(active.first.job_title)+'</p></div><a href="?pagina=vaga&amp;id='+encodeURIComponent(active.first.job_ref)+'">Ver vaga</a></header><div class="em-chat-history" tabindex="0" aria-label="Histórico de mensagens">'+historyHtml(active)+'</div><form class="em-chat-compose"><label for="emChatBody">Sua mensagem</label><textarea id="emChatBody" name="body" maxlength="10000" rows="3" required placeholder="Escreva sua mensagem…" '+(sending?'disabled':'')+'>'+esc(drafts[selected]&&drafts[selected].text||'')+'</textarea><footer><small>'+(context.demo?'Demonstração: nenhuma mensagem será enviada.':'Conversa vinculada a esta oportunidade.')+'</small><button type="submit" '+(sending?'disabled':'')+'>'+(sending?'Enviando…':'Enviar')+'</button></footer><p class="em-chat-status" role="status"></p></form>':
 '<div class="em-chat-welcome"><span aria-hidden="true">↔</span><h2>Suas conversas em um só lugar</h2><p>Selecione uma conversa para ver o histórico e responder.</p><small>'+(context.role==='company'?'As mensagens enviadas aos candidatos aparecerão aqui.':'As empresas podem entrar em contato sobre suas candidaturas.')+'</small>'+(context.role==='company'?'<button type="button" class="em-chat-empty-action" data-chat-candidates>Abrir candidaturas</button>':'')+'</div>')+'</section>'+(active?details(active):'');
 var history=root.querySelector('.em-chat-history');if(history){history.scrollTop=atBottom||force?history.scrollHeight:oldTop;history.addEventListener('scroll',function(){if(history.scrollHeight-history.scrollTop-history.clientHeight<50)markRead();},{passive:true});}
 var next=focusSearch?root.querySelector('[data-chat-search]'):focusId?root.querySelector('#'+focusId):null;
 if(next&&!next.disabled){next.focus({preventScroll:true});if(typeof start==='number'&&next.setSelectionRange)next.setSelectionRange(start,end);}
 if(active&&atBottom)markRead();
}
function viewVisible(){if(!root||!root.isConnected||document.visibilityState!=='visible')return false;var p=context&&context.role==='candidate'?document.getElementById('pagina-painel-candidato'):document.getElementById(new URLSearchParams(location.search).get('pagina')==='demo-recrutador'?'pagina-demo-recrutador':'pagina-painel-empresa');return !!(p&&p.classList.contains('ativa')&&(context.role!=='candidate'||p.classList.contains('cp-messages-active'))&&root.getClientRects().length);}
async function markRead(){
 if(reading||!context||!viewVisible())return;
 var history=root.querySelector('.em-chat-history');if(history&&history.scrollHeight-history.scrollTop-history.clientHeight>50)return;
 var t=groupEvents(events,context.role).find(function(x){return x.id===selected;});if(!t)return;
 var pending=t.messages.filter(function(m){return incoming(m,context.role)&&!m.read_at;});if(!pending.length)return;
 reading=true;var owner=generation,c=context,when=new Date().toISOString();
 try{
  var confirmed;
  if(c.demo){confirmed=pending.map(function(m){return {id:m.record_id};});}
  else{var companyRole=c.role==='company',column=companyRole?'company_read_at':'candidate_read_at',table=companyRole?'em_candidate_message_replies':'em_candidate_messages';
   var body={};body[column]=when;
   confirmed=await api(table+'?id=in.('+pending.map(function(m){return m.record_id;}).join(',')+')&'+column+'=is.null',{method:'PATCH',body:JSON.stringify(body)});
  }
  if(owner!==generation)return;
  var ids=new Set(confirmed.map(function(m){return m.id;}));events.forEach(function(m){if(ids.has(m.record_id)&&incoming(m,c.role))m.read_at=when;});
  if(c.demo)saveDemo();
  unread=Math.max(0,unread-ids.size);paintCounters();render(false);scheduleLoad(500);
 }catch(ignore){/* A failed acknowledgement stays unread and is retried on the next refresh. */}
 finally{if(owner===generation)reading=false;}
}
async function load(force){
 if(!context||loading||!force&&Date.now()-lastLoad<1500)return;
 loading=true;var owner=generation,c=context,oldLatest=events.reduce(function(n,m){return incoming(m,c.role)?Math.max(n,Date.parse(m.created_at)||0):n;},0),wasLoaded=loaded,oldUnread=unread;
 try{
  var next,count;
  if(c.demo){next=demoEvents(c);count=next.filter(function(m){return incoming(m,c.role)&&!m.read_at;}).length;hasMore=false;}
  else{
   await ensureCompany(c);if(owner!==generation)return;
   var query=scope(c),result=await Promise.all([api('em_conversation_events?select=*&'+query+'&order=created_at.desc,event_id.desc&limit='+(take+1)),request('em_conversation_events?select=event_id&'+query+'&sender_role=neq.'+c.role+'&read_at=is.null',{method:'HEAD',headers:{Prefer:'count=exact'}})]);
   next=result[0];hasMore=next.length>take;next=next.slice(0,take);count=result[1].count;if(count==null)count=next.filter(function(m){return incoming(m,c.role)&&!m.read_at;}).length;
  }
  if(owner!==generation)return;
  events=next;unread=count;loaded=true;error='';lastLoad=Date.now();
  paintCounters();render(false);connectSocket();
  var recent=next.filter(function(m){return incoming(m,c.role)&&!m.read_at&&(!wasLoaded||Date.parse(m.created_at)>oldLatest);}).sort(function(a,b){return Date.parse(b.created_at)-Date.parse(a.created_at);})[0];
  if(recent&&(!wasLoaded||count>oldUnread||Date.parse(recent.created_at)>oldLatest)&&!(viewVisible()&&selected===threadKey(recent)))showToast(recent,wasLoaded?0:count);
 }catch(failure){if(owner===generation){error=failure.message;lastLoad=Date.now();render(false);}}
 finally{if(owner===generation)loading=false;}
}
function scheduleLoad(delay){clearTimeout(reloadTimer);reloadTimer=setTimeout(function(){if(document.visibilityState==='visible')load(true);},delay==null?300:delay);}
async function send(form){
 if(sending||!context)return;
 var t=groupEvents(events,context.role).find(function(x){return x.id===selected;}),area=form.elements.body,text=area.value.trim();if(!t||!text)return;
 var owner=generation,c=context,id=selected,draft=drafts[id]||{};
 if(draft.pendingText!==text){draft.pendingId=uuid();draft.pendingText=text;}draft.text=text;drafts[id]=draft;saveDrafts();sending=true;
 var status=form.querySelector('[role=status]');status.textContent='Enviando…';form.querySelector('button').disabled=true;area.disabled=true;
 try{
  if(c.demo){
   events.push(Object.assign({},t.first,{event_id:(c.role==='company'?'m:':'r:')+draft.pendingId,record_id:draft.pendingId,message_id:c.role==='company'?draft.pendingId:t.first.message_id,sender_role:c.role,body:text,created_at:new Date().toISOString(),read_at:null}));saveDemo();
  }else if(c.role==='company'){
   await api('rpc/em_write_candidate_message',{method:'POST',body:JSON.stringify({p_id:draft.pendingId,p_company_cnpj:c.cnpj,p_email:t.first.candidate_email,p_job_ref:t.first.job_ref,p_job_title:t.first.job_title,p_body:text,p_send:true})});
  }else{
   try{await api('em_candidate_message_replies',{method:'POST',body:JSON.stringify({id:draft.pendingId,message_id:t.first.message_id,body:text})});}
   catch(failure){if(failure.code!=='23505')throw failure;var existing=await api('em_candidate_message_replies?id=eq.'+draft.pendingId+'&select=id,body,message_id');if(!existing[0]||existing[0].body!==text||existing[0].message_id!==t.first.message_id)throw failure;}
  }
  if(owner!==generation)return;
  delete drafts[id];saveDrafts();sending=false;await load(true);render(true);
 }catch(failure){if(owner===generation){sending=false;status.textContent=failure.message;form.querySelector('button').disabled=false;area.disabled=false;area.focus();}}
 finally{if(owner===generation)sending=false;}
}
function paintCounters(){
 var candidate=context&&context.role==='candidate'?unread:0,companyCount=context&&context.role==='company'?unread:0;
 document.querySelectorAll('.cp-message-count').forEach(function(b){var value=candidate>99?'99+':String(candidate);if(b.textContent!==value)b.textContent=value;b.hidden=candidate<1;b.setAttribute('aria-label',candidate+' mensagens não lidas');});
 document.querySelectorAll('[data-home-message-count]').forEach(function(b){if(b.textContent!==String(candidate))b.textContent=String(candidate);});
 var bell=document.querySelector('#cpCandidateHeader .cp-notifications');if(bell){var dot=bell.querySelector('.cp-notification-dot');if(dot)dot.hidden=candidate<1;bell.setAttribute('aria-label',candidate?'Abrir mensagens: '+candidate+' não lidas':'Abrir mensagens');}
 var host=document.getElementById('emRecruiterPanel'),shadow=host&&host.shadowRoot;
 if(shadow)shadow.querySelectorAll('[data-em-message-count]').forEach(function(b){var value=companyCount>99?'99+':String(companyCount);if(b.textContent!==value)b.textContent=value;b.hidden=companyCount<1;var parent=b.closest('button');if(parent)parent.setAttribute('aria-label','Mensagens'+(companyCount?': '+companyCount+' não lidas':''));});
}
function dismissToast(){clearTimeout(toastTimer);if(toast){toast.remove();toast=null;}}
function showToast(event,count){
 if(document.visibilityState!=='visible')return;dismissToast();
 if(context&&context.role==='company'){try{if(JSON.parse(localStorage.getItem('emRecruiterPreferences:'+context.cnpj)||'{}').messageToast===false)return;}catch(ignore){}}
 toast=document.createElement('aside');toast.className='em-message-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
 var label=document.createElement('span');label.textContent=count?'Você tem '+count+' mensagem'+(count===1?' não lida.':'s não lidas.'):'Nova mensagem '+(context.role==='candidate'?'de '+event.company_name:'de um candidato')+'.';
 var open=document.createElement('button');open.type='button';open.textContent='Ver mensagem';var thread=threadKey(event);open.onclick=function(){openInbox(thread);dismissToast();};
 var close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Fechar aviso');close.onclick=dismissToast;
 toast.append(label,open,close);document.body.appendChild(toast);toastTimer=setTimeout(dismissToast,12000);
}
function openInbox(thread){
 if(thread)selected=thread;
 if(context&&context.role==='company'){if(global.abrirMensagensEmpresaEM)global.abrirMensagensEmpresaEM();}
 else{var button=document.querySelector('#cpCandidateHeader [data-route="messages"]');if(button)button.click();}
 schedule();if(root)render(true);
}
function post(event,payload,topic,ref){if(socket&&socket.readyState===1)socket.send(JSON.stringify({topic:topic||'realtime:em-inbox',event:event,payload:payload||{},ref:ref||String(++reference),join_ref:topic==='phoenix'?null:'1'}));}
function closeSocket(){
 clearInterval(heartbeat);clearTimeout(reconnect);heartbeat=null;reconnect=null;joined=false;socketToken='';
 if(socket){var old=socket;socket=null;old.onclose=null;old.close();}
}
function connectSocket(){
 if(!context||context.demo||!global.WebSocket)return;
 var auth=token();if(reconnect&&socketToken===auth)return;if(socket&&socketToken===auth&&socket.readyState<2)return;
 closeSocket();socketToken=auth;var owner=generation,c=context,subscriptions=[{event:'*',schema:'public',table:'em_candidate_messages',filter:c.role==='candidate'?'candidate_uid=eq.'+c.uid:'empresa_id=eq.'+c.companyId},{event:'*',schema:'public',table:'em_candidate_message_replies'}];
 if(c.role==='candidate')subscriptions[1].filter='candidate_uid=eq.'+c.uid;
 var ws;try{ws=new WebSocket('wss://mkezlcewyengejdmtppl.supabase.co/realtime/v1/websocket?apikey='+encodeURIComponent(publicKey)+'&vsn=1.0.0');}catch(ignore){return;}
 socket=ws;
 ws.onopen=function(){if(owner!==generation)return;reference=1;post('phx_join',{config:{broadcast:{ack:false,self:false},presence:{enabled:false},postgres_changes:subscriptions,private:false},access_token:auth},null,'1');heartbeat=setInterval(function(){post('heartbeat',{},'phoenix');if(token()!==socketToken){socketToken=token();post('access_token',{access_token:socketToken});}},20000);};
 ws.onmessage=function(event){
  if(owner!==generation)return;var message;try{message=JSON.parse(event.data);}catch(ignore){return;}
  if(message.event==='phx_reply'&&message.ref==='1'){if(message.payload.status==='ok'){joined=true;retry=0;scheduleLoad(0);}else ws.close();}
  if(message.event==='postgres_changes')scheduleLoad();
  if(message.event==='phx_error'||message.event==='phx_close')ws.close();
  if(message.event==='system'&&message.payload&&message.payload.status==='error')ws.close();
 };
 ws.onerror=function(){ws.close();};
 ws.onclose=function(){if(owner!==generation||socket!==ws)return;clearInterval(heartbeat);heartbeat=null;socket=null;joined=false;var delay=Math.min(60000,[1000,2000,5000,10000,30000][Math.min(retry++,4)]);reconnect=setTimeout(function(){reconnect=null;connectSocket();},delay);};
}
function installRoot(container){
 if(root&&root.isConnected&&root.parentElement===container)return;
 if(root)root.remove();root=document.createElement('section');root.className='em-chat';root.setAttribute('aria-label','Central de mensagens');container.appendChild(root);lastSignature='';render(true);
 root.addEventListener('click',function(event){
  var item=event.target.closest('[data-chat-select]');
  if(item){selected=item.dataset.chatSelect;render(true);markRead();}
  if(event.target.closest('[data-chat-refresh]'))load(true);
  if(event.target.closest('[data-chat-more]')){take+=200;load(true);}
  if(event.target.closest('[data-chat-candidates]')){var host=document.getElementById('emRecruiterPanel'),button=host&&host.shadowRoot&&host.shadowRoot.querySelector('[data-action="nav"][data-view="candidates"]');if(button)button.click();}
 });
 root.addEventListener('input',function(event){if(event.target.id==='emChatBody'){var draft=drafts[selected]||{};draft.text=event.target.value;drafts[selected]=draft;saveDrafts();}if(event.target.matches('[data-chat-search]')){search=event.target.value;render(true);}});
 root.addEventListener('submit',function(event){if(event.target.matches('.em-chat-compose')){event.preventDefault();send(event.target);}});
}
function sync(){
 var next=currentContext();if((next&&next.key)!==(context&&context.key))reset(next);
 if(!context)return;
 if(context.role==='candidate'){
  var page=document.getElementById('pagina-painel-candidato'),container=page&&page.querySelector('.container-dashboard');
  if(container&&page.classList.contains('cp-messages-active'))installRoot(container);
 }else{
  var host=document.getElementById('emRecruiterPanel'),shadow=host&&host.shadowRoot,container=shadow&&shadow.getElementById('emRecruiterMessages');
  if(shadow&&!shadow.getElementById('emInboxStyles')){var style=document.createElement('style');style.id='emInboxStyles';style.textContent=CSS;shadow.appendChild(style);}
  if(container)installRoot(container);
 }
 paintCounters();if(!loaded&&!loading&&Date.now()-lastLoad>15000)load(true);else if(loaded)connectSocket();
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;sync();});}
global.EMMessages={addDemoMessage:addDemoMessage,
 sync:schedule,refresh:function(){scheduleLoad(0);},open:openInbox,
 unread:function(role){return context&&(!role||role===context.role)?unread:0;},
 mountCompany:function(container,options){companyOptions=options||null;sync();if(container&&context&&context.role==='company')installRoot(container);}
};
function start(){
 var style=document.createElement('style');style.id='emInboxStyles';style.textContent=CSS;document.head.appendChild(style);
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){schedule();scheduleLoad(0);markRead();}});
 global.addEventListener('focus',function(){schedule();scheduleLoad(0);});
 global.addEventListener('online',function(){schedule();scheduleLoad(0);connectSocket();});
 global.addEventListener('pagehide',closeSocket);
 global.addEventListener('pageshow',schedule);
 document.addEventListener('empregamais:painel-recrutador',schedule);
 document.addEventListener('empregamais:mensagem-enviada',function(){schedule();scheduleLoad(0);});
 setInterval(function(){sync();if(document.visibilityState==='visible'&&context&&Date.now()-lastLoad>(joined?60000:15000))load(false);},5000);
 schedule();
}
function companyPanel(){var modal=document.getElementById('emCandidateDetails');if(!modal||modal.querySelector('.em-chat-company-replies'))return;var stage=modal.querySelector('[data-gc27-stage]');if(!stage)return;var apps=window.carregarCandidaturas?window.carregarCandidaturas():[],application=apps.find(function(a){return String(a.id)===String(stage.dataset.gc27Stage);});if(!application)return;var email=application.email||application.candidato_email||application.candidatoEmail,ref=application.vagaId||application.vaga_id||application.idVaga;if(!email||!ref)return;var pane=modal.querySelector('[data-detail-panel="messages"],.em-candidate-message');if(!pane)return;var box=document.createElement('section');box.className='em-chat-company-replies';box.innerHTML='<h3>Respostas do candidato</h3><button type="button">Atualizar respostas</button><div role="status"></div>';pane.appendChild(box);async function refresh(){var status=box.querySelector('[role=status]');status.textContent='Carregando respostas…';try{if(currentContext()&&currentContext().demo){var result=demoEvents(currentContext()).filter(function(m){return m.sender_role==='candidate'&&String(m.job_ref)===String(ref)&&m.candidate_email.toLowerCase()===email.toLowerCase();});status.innerHTML=result.length?result.map(function(r){return '<article><small>'+esc(stamp(r.created_at))+'</small><p>'+esc(r.body)+'</p></article>';}).join(''):'Nenhuma resposta recebida nesta demonstração.';return;}var messages=await api('em_candidate_messages?select=id&state=eq.sent&job_ref=eq.'+encodeURIComponent(ref)+'&candidate_email=eq.'+encodeURIComponent(email.toLowerCase())+'&limit=500');var ids=messages.map(function(m){return m.id;});if(!ids.length){status.textContent='Nenhuma resposta recebida.';return;}var result=await api('em_candidate_message_replies?select=body,created_at&message_id=in.('+ids.join(',')+')&order=created_at.asc&limit=500');status.innerHTML=result.length?result.map(function(r){return '<article><small>'+esc(stamp(r.created_at))+'</small><p>'+esc(r.body)+'</p></article>';}).join(''):'Nenhuma resposta recebida.';}catch(e){status.textContent=e.message;}}box.querySelector('button').onclick=refresh;refresh();}

var companyPending=false;
function refreshCompanyDetails(){if(companyPending)return;companyPending=true;requestAnimationFrame(function(){companyPending=false;companyPanel();});}
var CSS="@layer site-typography{html body #pagina-painel-candidato#pagina-painel-candidato#pagina-painel-candidato#pagina-painel-candidato.cp-messages-active>.container-dashboard>:not(.em-chat):not(.cp-demo-plans){display:none!important}\nhtml body #pagina-painel-candidato.cp-messages-active>.container-dashboard>.em-chat.em-chat{display:grid!important}\nhtml body #pagina-painel-candidato.cp-messages-active .em-candidate-inbox,html body #pagina-painel-candidato.cp-messages-active .cp-message-empty{display:none!important}\nhtml body #pagina-painel-candidato:not(.cp-messages-active) .em-chat{display:none!important}\n.em-chat{grid-template-columns:270px minmax(0,1fr) 230px!important;width:100%!important;height:650px!important;max-height:80dvh!important;min-height:470px!important;margin:0!important;border:1px solid #dfe5ec!important;border-radius:14px!important;overflow:hidden!important;background:white!important;color:#303b4b!important;font:13px/1.5 Poppins,sans-serif!important;box-sizing:border-box!important}\n.em-chat *{box-sizing:border-box!important}\n.em-chat h1{font-size:20px!important;margin:0!important}\n.em-chat h2{font-size:17px!important;margin:12px 0!important}\n.em-chat button,.em-chat textarea,.em-chat input{font:inherit!important}\n.em-chat button{cursor:pointer!important}\n.em-chat a{color:#0080c9!important;text-decoration:none!important;font-size:12px!important}\n.em-chat p{margin:0!important}\n.em-chat-list{border-right:1px solid #e6ebf1!important;overflow:auto!important}\n.em-chat-list>header{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:20px 16px 12px!important}\n.em-chat-list>header button{background:white!important;border:1px solid #dce4ec!important;border-radius:7px!important;padding:5px 8px!important;color:#536174!important;font-size:11px!important}\n.em-chat-search{display:block!important;padding:0 16px!important;font-size:11px!important;color:#64748b!important}\n.em-chat-search input{display:block!important;width:100%!important;margin-top:5px!important;padding:10px!important;border:1px solid #dfe5ec!important;border-radius:8px!important;color:#303b4b!important}\n.em-chat-note{padding:12px 16px!important;color:#738195!important;font-size:11px!important}\n.em-chat-list nav>button{display:flex!important;gap:10px!important;text-align:left!important;width:100%!important;padding:15px!important;border:0!important;border-top:1px solid #f0f3f6!important;background:white!important;color:#3c4859!important}\n.em-chat-list nav>button[aria-pressed=true]{background:#edf6fc!important;box-shadow:inset 3px 0 #0080c9!important}\n.em-chat-avatar{display:grid!important;place-items:center!important;width:38px!important;height:40px!important;flex:none!important;background:#eaf3fa!important;color:#007ab9!important;border-radius:9px!important;font-weight:700!important;font-size:12px!important}\n.em-chat-preview{display:flex!important;flex-direction:column!important;gap:3px!important;min-width:0!important}\n.em-chat-preview strong,.em-chat-preview small,.em-chat-preview>span{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}\n.em-chat-preview strong{font-size:12px!important}\n.em-chat-preview>span{font-size:11px!important;color:#64748b!important}\n.em-chat-preview small{font-size:11px!important;color:#7b8796!important}\n.em-chat-conversation{display:flex!important;flex-direction:column!important;min-width:0!important;min-height:0!important}\n.em-chat-conversation>header{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:12px!important;padding:18px 20px!important;border-bottom:1px solid #e6ebf1!important}\n.em-chat-conversation>header p{color:#718096!important;font-size:12px!important;margin-top:3px!important}\n.em-chat-history{flex:1!important;min-height:0!important;overflow:auto!important;padding:20px!important;display:flex!important;flex-direction:column!important;gap:14px!important;background:#fcfdfe!important}\n.em-chat-bubble{max-width:88%!important;align-self:flex-start!important;padding:12px 15px!important;border:1px solid #e6ebf1!important;border-radius:12px 12px 12px 3px!important;background:white!important}\n.em-chat-bubble.is-mine{align-self:flex-end!important;background:#edf6fc!important;border-color:#dcecf7!important;border-radius:12px 12px 3px 12px!important}\n.em-chat-bubble p{white-space:pre-wrap!important;overflow-wrap:anywhere!important;margin:5px 0!important;font-size:13px!important}\n.em-chat-bubble small,.em-chat-bubble time{font-size:10px!important;color:#788697!important}\n.em-chat-compose{padding:14px 18px!important;border-top:1px solid #e6ebf1!important}\n.em-chat-compose label{font-size:11px!important;color:#64748b!important}\n.em-chat-compose textarea{resize:vertical!important;display:block!important;width:100%!important;min-height:70px!important;max-height:150px!important;border:1px solid #dce5ed!important;border-radius:9px!important;padding:10px!important;margin:5px 0 10px!important;color:#303b4b!important}\n.em-chat-compose footer{background:#fff!important;background-image:none!important;padding:0!important;margin:0!important;border:0!important;min-height:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}\n.em-chat-compose small{font-size:10px!important;color:#788697!important}\n.em-chat-compose button{border:0!important;border-radius:8px!important;padding:9px 22px!important;background:#0080c9!important;color:white!important;font-weight:600!important}\n.em-chat-compose button:disabled{opacity:.5!important}\n.em-chat-status{font-size:11px!important;color:#9f3333!important;margin-top:8px!important}\n.em-chat-details{border-left:1px solid #e6ebf1!important;padding:22px 18px!important;overflow:auto!important}\n.em-chat-details>p{font-size:12px!important;color:#64748b!important}\n.em-chat-details dl{border-top:1px solid #e6ebf1!important;margin:20px 0!important;padding-top:15px!important}\n.em-chat-details dt{font-size:11px!important;font-weight:600!important;margin-top:13px!important}\n.em-chat-details dd{margin:4px 0!important;font-size:12px!important;color:#64748b!important;overflow-wrap:anywhere!important}\n.em-chat-welcome{display:flex!important;flex:1!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:28px!important;grid-column:2/-1!important}\n.em-chat:not(:has(.em-chat-details)){grid-template-columns:270px minmax(0,1fr)!important}\n.em-chat-welcome>span{display:grid!important;place-items:center!important;width:76px!important;height:76px!important;border-radius:22px!important;background:#edf6fc!important;color:#0080c9!important;font-size:36px!important;margin-bottom:12px!important}\n.em-chat-welcome p{color:#64748b!important}\n.em-chat-welcome small{color:#8a96a5!important;font-size:11px!important;margin-top:10px!important}\nhtml body .em-chat-company-replies{border-top:1px solid #e5ebf1!important;padding-top:15px!important;margin-top:20px!important}\nhtml body .em-chat-company-replies article{padding:12px!important;background:#f4f8fc!important;border-radius:8px!important;margin:10px 0!important}\nhtml body .em-chat-company-replies p{white-space:pre-wrap!important;overflow-wrap:anywhere!important}\nhtml body .em-chat-company-replies small{color:#738195!important}\n@media(max-width:1150px){.em-chat{grid-template-columns:230px minmax(0,1fr)!important}\n.em-chat-details{display:none!important}\n.em-chat:not(:has(.em-chat-details)){grid-template-columns:230px minmax(0,1fr)!important}}\n@media(max-width:700px){.em-chat,.em-chat:not(:has(.em-chat-details)){grid-template-columns:minmax(0,1fr)!important;height:auto!important;max-height:none!important;min-height:600px!important}\n.em-chat-list{max-height:230px!important;border-right:0!important;border-bottom:1px solid #e6ebf1!important}\n.em-chat-list>header{padding:12px 14px!important}\n.em-chat-list nav>button{padding:10px 14px!important}\n.em-chat-conversation{min-height:460px!important;max-height:650px!important}\n.em-chat-history{max-height:360px!important}\n.em-chat-welcome{grid-column:auto!important}\n.em-chat-compose footer{align-items:flex-end!important}\n.em-chat-compose small{max-width:70%!important}}}\n.em-chat{display:grid!important;min-width:0!important;max-width:100%!important}.em-chat [hidden],.em-message-badge[hidden]{display:none!important}.em-chat-preview{flex:1!important}.em-chat-unread,.em-message-badge{display:inline-flex;align-items:center;justify-content:center;min-width:21px;height:21px;flex:none;padding:0 5px;box-sizing:border-box;border-radius:6px;background:#d84a32;color:#fff;font-size:11px;font-weight:700;line-height:1}.em-chat-list nav>button.is-unread .em-chat-preview strong{font-weight:750!important;color:#173f59!important}.em-chat-list nav>button:focus-visible,.em-chat button:focus-visible,.em-message-toast button:focus-visible{outline:3px solid #86b5dc!important;outline-offset:-3px!important}.em-chat-compose textarea:focus{outline:2px solid #75a9d2!important;outline-offset:1px!important}.em-chat-more{margin:10px 15px!important;padding:9px 10px!important;border:1px solid #dce4ec!important;border-radius:7px!important;background:#fff!important;color:#31546c!important;font-size:11px!important}.em-chat-sent{display:block!important;margin-top:4px!important;font-size:10px!important;color:#567866!important}.em-chat-empty-action{margin-top:18px!important;padding:10px 16px!important;border:1px solid #c7d9e6!important;border-radius:8px!important;background:#f4f8fc!important;color:#173f59!important}.em-message-toast{position:fixed!important;right:22px!important;bottom:22px!important;z-index:2147483000!important;display:flex!important;align-items:center!important;gap:12px!important;max-width:min(420px,calc(100vw - 28px))!important;padding:14px 16px!important;border:1px solid #d9e3ed!important;border-left:4px solid #0080c9!important;border-radius:12px!important;background:#fff!important;color:#173f59!important;box-shadow:0 12px 38px #173f5926!important;font:500 13px/1.5 Poppins,sans-serif!important}.em-message-toast button{flex:none!important;min-height:40px!important;padding:8px 12px!important;border:0!important;border-radius:7px!important;background:#0080c9!important;color:#fff!important;cursor:pointer!important;font:600 12px Poppins,sans-serif!important}.em-message-toast button:last-child{min-width:32px!important;padding:6px!important;background:#f1f5f9!important;color:#64748b!important}.em-message-badge{margin-left:auto;position:static}.recruiter-messages-alert{position:relative;display:grid;place-items:center;width:40px;height:40px;border:1px solid #dce5ed;border-radius:9px;background:#fff;color:#173f59;cursor:pointer}.recruiter-messages-alert>svg{width:21px;height:21px}.recruiter-messages-alert .em-message-badge{position:absolute;right:-4px;top:-5px;min-width:18px;height:18px;font-size:10px}.nav .em-message-badge{margin-left:auto}";
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){start();new MutationObserver(refreshCompanyDetails).observe(document.body,{childList:true,subtree:true});refreshCompanyDetails();},{once:true});
else{start();new MutationObserver(refreshCompanyDetails).observe(document.body,{childList:true,subtree:true});refreshCompanyDetails();}
})(typeof window!=='undefined'?window:globalThis);

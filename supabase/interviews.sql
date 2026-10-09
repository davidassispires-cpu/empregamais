-- Private interview scheduling and one-to-one WebRTC signaling.
-- Media never passes through or is recorded in this database.
create table public.em_interviews (
 id uuid primary key default gen_random_uuid(),
 empresa_id uuid not null references public.empresas(id),
 recruiter_uid uuid not null references auth.users(id),
 candidate_uid uuid not null references auth.users(id),
 application_ref text not null check(length(application_ref) between 1 and 200),
 job_ref text not null check(length(job_ref) between 1 and 200),
 job_title text not null check(length(job_title) between 1 and 300),
 company_name text not null,
 candidate_name text not null check(length(candidate_name) between 1 and 150),
 scheduled_at timestamptz not null,
 duration_minutes integer not null check(duration_minutes between 15 and 120),
 state text not null default 'invited' check(state in ('invited','confirmed','reschedule_requested','cancelled','completed')),
 instructions text not null default '' check(length(instructions)<=2000),
 candidate_reply text not null default '' check(length(candidate_reply)<=1000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check(recruiter_uid<>candidate_uid)
);
create index em_interviews_candidate on public.em_interviews(candidate_uid,scheduled_at);
create index em_interviews_company on public.em_interviews(empresa_id,application_ref,scheduled_at);
create table public.em_interview_notes (
 interview_id uuid primary key references public.em_interviews(id) on delete cascade,
 note text not null default '' check(length(note)<=4000),
 updated_at timestamptz not null default now()
);
create table public.em_interview_events (
 id bigint generated always as identity primary key,
 interview_id uuid not null references public.em_interviews(id) on delete cascade,
 actor_uid uuid not null references auth.users(id),
 action text not null,
 created_at timestamptz not null default now()
);
create table private.em_interview_sessions (
 interview_id uuid primary key references public.em_interviews(id) on delete cascade,
 generation uuid not null default gen_random_uuid(),
 recruiter_client uuid,
 candidate_client uuid,
 recruiter_seen timestamptz,
 candidate_seen timestamptz
);
create table private.em_interview_signals (
 id bigint generated always as identity primary key,
 interview_id uuid not null references private.em_interview_sessions(interview_id) on delete cascade,
 generation uuid not null,
 sender_uid uuid not null,
 recipient_client uuid not null,
 payload jsonb not null check(length(payload::text)<=100000),
 created_at timestamptz not null default now()
);
create index em_interview_signals_delivery on private.em_interview_signals(interview_id,generation,recipient_client,id);
alter table public.em_interviews enable row level security;
alter table public.em_interview_notes enable row level security;
alter table public.em_interview_events enable row level security;
alter table private.em_interview_sessions enable row level security;
alter table private.em_interview_signals enable row level security;
revoke all on public.em_interviews,public.em_interview_notes,public.em_interview_events from public,anon,authenticated;
revoke all on private.em_interview_sessions,private.em_interview_signals from public,anon,authenticated;
grant select on public.em_interviews,public.em_interview_notes,public.em_interview_events to authenticated;
create policy interview_candidate_read on public.em_interviews for select to authenticated using(candidate_uid=(select auth.uid()));
create policy interview_company_read on public.em_interviews for select to authenticated using(private.usuario_pertence_empresa(empresa_id));
create policy interview_notes_company on public.em_interview_notes for select to authenticated using(exists(select 1 from public.em_interviews i where i.id=interview_id and private.usuario_pertence_empresa(i.empresa_id)));
create policy interview_events_participants on public.em_interview_events for select to authenticated using(exists(select 1 from public.em_interviews i where i.id=interview_id and (i.candidate_uid=(select auth.uid()) or private.usuario_pertence_empresa(i.empresa_id))));

create function private.em_manage_interview(p_action text,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare i public.em_interviews%rowtype; e public.empresas%rowtype; recipient uuid; uid uuid:=auth.uid(); starts timestamptz; minutes integer;
begin
 if uid is null then raise exception 'Entre novamente na sua conta.' using errcode='42501'; end if;
 if p_action='schedule' then
  select * into e from public.empresas where regexp_replace(cnpj,'[^0-9]','','g')=regexp_replace(p_data->>'company_cnpj','[^0-9]','','g') and private.usuario_pertence_empresa(id) limit 1;
  if e.id is null or coalesce(e.suspensa_admin,false) then raise exception 'Empresa sem autorização para agendar.' using errcode='42501'; end if;
  -- Resolve the invited identity from confirmed Auth email, never from editable JWT metadata.
  select id into recipient from auth.users where lower(email)=lower(trim(p_data->>'candidate_email')) and email_confirmed_at is not null and deleted_at is null;
  if recipient is null then raise exception 'O candidato precisa entrar e confirmar seu e-mail no portal para receber a entrevista.'; end if;
  if recipient=uid then raise exception 'A entrevista precisa de uma conta de candidato diferente da empresa.'; end if;
  starts:=(p_data->>'scheduled_at')::timestamptz; minutes:=(p_data->>'duration_minutes')::integer;
  if starts is null or starts<now()+interval '1 minute' or starts>now()+interval '1 year' or minutes is null or minutes not between 15 and 120 then raise exception 'Escolha uma data futura e duração entre 15 e 120 minutos.'; end if;
  -- The caller is authorized to invite a candidate. Legacy application references are not auth credentials.
  insert into public.em_interviews(empresa_id,recruiter_uid,candidate_uid,application_ref,job_ref,job_title,company_name,candidate_name,scheduled_at,duration_minutes,instructions)
  values(e.id,uid,recipient,trim(p_data->>'application_ref'),trim(p_data->>'job_ref'),trim(p_data->>'job_title'),coalesce(nullif(e.nome_fantasia,''),nullif(e.nome,''),e.razao_social,'Empresa'),trim(p_data->>'candidate_name'),starts,minutes,coalesce(trim(p_data->>'instructions'),'')) returning * into i;
 else
  select * into i from public.em_interviews where id=(p_data->>'id')::uuid for update;
  if i.id is null then raise exception 'Entrevista não encontrada.'; end if;
  if p_action in ('confirm','reschedule') then
   if i.candidate_uid<>uid then raise exception 'Convite pertence a outro candidato.' using errcode='42501'; end if;
   if i.state not in ('invited','confirmed','reschedule_requested') or i.scheduled_at+make_interval(mins=>i.duration_minutes)<now() then raise exception 'Este convite não aceita mais respostas.'; end if;
   update public.em_interviews set state=case when p_action='confirm' then 'confirmed' else 'reschedule_requested' end,candidate_reply=coalesce(trim(p_data->>'reply'),''),updated_at=now() where id=i.id;
   if p_action='reschedule' then delete from private.em_interview_sessions where interview_id=i.id; end if;
  else
   if not private.usuario_pertence_empresa(i.empresa_id) then raise exception 'Entrevista pertence a outra empresa.' using errcode='42501'; end if;
   if p_action='note' then
    insert into public.em_interview_notes(interview_id,note) values(i.id,coalesce(p_data->>'note','')) on conflict(interview_id) do update set note=excluded.note,updated_at=now();
   elsif p_action in ('cancel','complete') then
    if i.state in ('cancelled','completed') then raise exception 'Esta entrevista já foi finalizada.'; end if;
    if p_action='complete' and now()<i.scheduled_at-interval '30 minutes' then raise exception 'A entrevista ainda não começou.'; end if;
    update public.em_interviews set state=case when p_action='cancel' then 'cancelled' else 'completed' end,updated_at=now() where id=i.id;
    delete from private.em_interview_sessions where interview_id=i.id;
   elsif p_action='reschedule_company' then
    if i.state in ('cancelled','completed') then raise exception 'Esta entrevista já foi finalizada.'; end if;
    starts:=(p_data->>'scheduled_at')::timestamptz; minutes:=(p_data->>'duration_minutes')::integer;
    if starts is null or starts<now()+interval '1 minute' or starts>now()+interval '1 year' or minutes is null or minutes not between 15 and 120 then raise exception 'Informe uma data futura e duração válida.'; end if;
    update public.em_interviews set scheduled_at=starts,duration_minutes=minutes,state='invited',candidate_reply='',instructions=coalesce(trim(p_data->>'instructions'),''),updated_at=now() where id=i.id;
    delete from private.em_interview_sessions where interview_id=i.id;
   else raise exception 'Ação não reconhecida.'; end if;
  end if;
 end if;
 insert into public.em_interview_events(interview_id,actor_uid,action) values(i.id,uid,p_action);
 return i.id;
end $$;

create function private.em_interview_poll(p_id uuid,p_client uuid,p_join boolean,p_after bigint default 0) returns jsonb
language plpgsql security definer set search_path='' as $$
declare i public.em_interviews%rowtype; s private.em_interview_sessions%rowtype; uid uuid:=auth.uid(); host boolean; own_client uuid; own_seen timestamptz; peer_client uuid; peer_seen timestamptz; msgs jsonb;
begin
 if uid is null or p_client is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 select * into i from public.em_interviews where id=p_id for update;
 if i.id is null or uid not in(i.recruiter_uid,i.candidate_uid) then raise exception 'Sala restrita ao entrevistador e ao candidato convidados.' using errcode='42501'; end if;
 if i.state<>'confirmed' then raise exception 'A entrevista precisa estar confirmada e ativa.'; end if;
 if now()<i.scheduled_at-interval '30 minutes' or now()>i.scheduled_at+make_interval(mins=>i.duration_minutes)+interval '60 minutes' then raise exception 'A sala abre 30 minutos antes e fecha 1 hora após o horário previsto de término.'; end if;
 if exists(select 1 from public.empresas where id=i.empresa_id and coalesce(suspensa_admin,false)) then raise exception 'Sala indisponível.' using errcode='42501'; end if;
 host:=uid=i.recruiter_uid;
 insert into private.em_interview_sessions(interview_id) values(p_id) on conflict do nothing;
 select * into s from private.em_interview_sessions where interview_id=p_id for update;
 own_client:=case when host then s.recruiter_client else s.candidate_client end;own_seen:=case when host then s.recruiter_seen else s.candidate_seen end;
 if p_join then
  if own_client is not null and own_client<>p_client and own_seen>now()-interval '30 seconds' then raise exception 'Esta entrevista já está aberta em outra aba. Feche a outra sala ou aguarde 30 segundos.'; end if;
  if own_client is distinct from p_client then
   s.generation:=gen_random_uuid();delete from private.em_interview_signals where interview_id=p_id;
  end if;
 else
  if own_client is distinct from p_client then raise exception 'Sua sessão da chamada terminou. Entre novamente.'; end if;
 end if;
 if host then s.recruiter_client:=p_client;s.recruiter_seen:=now();else s.candidate_client:=p_client;s.candidate_seen:=now();end if;
 update private.em_interview_sessions set generation=s.generation,recruiter_client=s.recruiter_client,candidate_client=s.candidate_client,recruiter_seen=s.recruiter_seen,candidate_seen=s.candidate_seen where interview_id=p_id;
 peer_client:=case when host then s.candidate_client else s.recruiter_client end;peer_seen:=case when host then s.candidate_seen else s.recruiter_seen end;
 select coalesce(jsonb_agg(jsonb_build_object('id',t.id,'payload',t.payload) order by t.id),'[]') into msgs from (select id,payload from private.em_interview_signals where interview_id=p_id and generation=s.generation and recipient_client=p_client and sender_uid<>uid and id>greatest(p_after,0) and created_at>now()-interval '5 minutes' order by id limit 100) t;
 delete from private.em_interview_signals where interview_id=p_id and created_at<now()-interval '5 minutes';
 return jsonb_build_object('generation',s.generation,'role',case when host then 'recruiter' else 'candidate' end,'peer_client',peer_client,'peer_online',coalesce(peer_seen>now()-interval '15 seconds',false),'signals',msgs);
end $$;

create function private.em_interview_signal(p_id uuid,p_client uuid,p_generation uuid,p_payload jsonb,p_leave boolean default false) returns void
language plpgsql security definer set search_path='' as $$
declare i public.em_interviews%rowtype;s private.em_interview_sessions%rowtype;uid uuid:=auth.uid();host boolean;peer uuid;
begin
 if uid is null then raise exception 'Autenticação necessária.' using errcode='42501';end if;
 select * into i from public.em_interviews where id=p_id for update;
 if i.id is null or uid not in(i.recruiter_uid,i.candidate_uid) then raise exception 'Sala não autorizada.' using errcode='42501';end if;
 select * into s from private.em_interview_sessions where interview_id=p_id for update;
 host:=uid=i.recruiter_uid;
 if s.interview_id is null or s.generation<>p_generation or p_client is distinct from(case when host then s.recruiter_client else s.candidate_client end) then raise exception 'Sessão da chamada desatualizada.';end if;
 if p_leave then
  if host then update private.em_interview_sessions set recruiter_client=null,recruiter_seen=null,generation=gen_random_uuid() where interview_id=p_id;
  else update private.em_interview_sessions set candidate_client=null,candidate_seen=null,generation=gen_random_uuid() where interview_id=p_id;end if;
  delete from private.em_interview_signals where interview_id=p_id;return;
 end if;
 if i.state<>'confirmed' or now()<i.scheduled_at-interval '30 minutes' or now()>i.scheduled_at+make_interval(mins=>i.duration_minutes)+interval '60 minutes' then raise exception 'Sala indisponível.';end if;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or coalesce(p_payload->>'type','') not in('offer','answer','ice') or length(p_payload::text)>100000 then raise exception 'Sinal inválido.';end if;
 if (p_payload->>'type'='offer' and not host) or(p_payload->>'type'='answer' and host) then raise exception 'Sinal não autorizado.';end if;
 if (select count(*) from private.em_interview_signals where interview_id=p_id and sender_uid=uid and created_at>now()-interval '1 minute')>250 then raise exception 'Aguarde antes de tentar novamente.';end if;
 peer:=case when host then s.candidate_client else s.recruiter_client end;
 if peer is null then raise exception 'A outra pessoa ainda não entrou na sala.';end if;
 insert into private.em_interview_signals(interview_id,generation,sender_uid,recipient_client,payload) values(p_id,p_generation,uid,peer,p_payload);
end $$;

-- Invoker wrappers expose only checked private functions, never privileged tables.
create function public.em_manage_interview(p_action text,p_data jsonb) returns uuid language sql security invoker set search_path='' as $$ select private.em_manage_interview(p_action,p_data); $$;
create function public.em_interview_poll(p_id uuid,p_client uuid,p_join boolean,p_after bigint default 0) returns jsonb language sql security invoker set search_path='' as $$ select private.em_interview_poll(p_id,p_client,p_join,p_after); $$;
create function public.em_interview_signal(p_id uuid,p_client uuid,p_generation uuid,p_payload jsonb,p_leave boolean default false) returns void language sql security invoker set search_path='' as $$ select private.em_interview_signal(p_id,p_client,p_generation,p_payload,p_leave); $$;
revoke all on function private.em_manage_interview(text,jsonb),private.em_interview_poll(uuid,uuid,boolean,bigint),private.em_interview_signal(uuid,uuid,uuid,jsonb,boolean),public.em_manage_interview(text,jsonb),public.em_interview_poll(uuid,uuid,boolean,bigint),public.em_interview_signal(uuid,uuid,uuid,jsonb,boolean) from public,anon;
grant execute on function private.em_manage_interview(text,jsonb),private.em_interview_poll(uuid,uuid,boolean,bigint),private.em_interview_signal(uuid,uuid,uuid,jsonb,boolean),public.em_manage_interview(text,jsonb),public.em_interview_poll(uuid,uuid,boolean,bigint),public.em_interview_signal(uuid,uuid,uuid,jsonb,boolean) to authenticated;
notify pgrst,'reload schema';

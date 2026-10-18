-- Recruiter Premium: shared interview scorecards and opt-in stage messages.
-- Existing conversations and notifications use em_candidate_messages.
begin;

create table public.em_interview_scorecards (
  interview_id uuid primary key references public.em_interviews(id) on delete cascade,
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  reviewer_uid uuid not null references auth.users(id),
  technical_score smallint not null check (technical_score between 1 and 5),
  experience_score smallint not null check (experience_score between 1 and 5),
  communication_score smallint not null check (communication_score between 1 and 5),
  problem_solving_score smallint not null check (problem_solving_score between 1 and 5),
  recommendation text not null check (recommendation in ('avancar','manter','nao_avancar')),
  evidence text not null default '' check (char_length(evidence)<=4000),
  updated_at timestamptz not null default now()
);
create index em_interview_scorecards_company on public.em_interview_scorecards(empresa_id);
create index em_interview_scorecards_reviewer on public.em_interview_scorecards(reviewer_uid);
alter table public.em_interview_scorecards enable row level security;
revoke all on public.em_interview_scorecards from public,anon,authenticated;
grant select on public.em_interview_scorecards to authenticated;
create policy scorecards_company_read on public.em_interview_scorecards
  for select to authenticated using (private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id));

create table public.em_recruiter_message_rules (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  job_ref text not null default '' check (char_length(job_ref)<=200),
  stage_key text not null check (stage_key in ('contato','entrevista','aprovadas','contratadas','reprovadas')),
  template text not null check (char_length(trim(template)) between 1 and 4000),
  enabled boolean not null default false,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (empresa_id,job_ref,stage_key)
);
create index em_recruiter_message_rules_editor on public.em_recruiter_message_rules(updated_by);
alter table public.em_recruiter_message_rules enable row level security;
revoke all on public.em_recruiter_message_rules from public,anon,authenticated;
grant select on public.em_recruiter_message_rules to authenticated;
create policy message_rules_company_read on public.em_recruiter_message_rules
  for select to authenticated using (private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id));

-- Dedupe is scoped to company + application + destination stage, across both
-- the native application table and the legacy recruiter-state synchronizer.
create table private.em_recruiter_message_deliveries (
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  application_ref text not null,
  stage_key text not null,
  rule_id uuid references public.em_recruiter_message_rules(id) on delete set null,
  message_id uuid references public.em_candidate_messages(id) on delete set null,
  sent_at timestamptz not null default now(),
  primary key (empresa_id,application_ref,stage_key)
);
create index em_recruiter_deliveries_rule on private.em_recruiter_message_deliveries(rule_id);
create index em_recruiter_deliveries_message on private.em_recruiter_message_deliveries(message_id);
alter table private.em_recruiter_message_deliveries enable row level security;
revoke all on private.em_recruiter_message_deliveries from public,anon,authenticated;

create function private.em_save_interview_scorecard(
  p_interview_id uuid,p_scores jsonb,p_recommendation text,p_evidence text,
  p_expected_updated_at timestamptz default null
) returns public.em_interview_scorecards language plpgsql security definer set search_path='' as $$
declare i public.em_interviews%rowtype; previous public.em_interview_scorecards%rowtype;
  result public.em_interview_scorecards; k text;
begin
  if auth.uid() is null then raise exception 'Entre novamente na conta da empresa.' using errcode='42501'; end if;
  select * into i from public.em_interviews where id=p_interview_id for update;
  if i.id is null or not private.usuario_pertence_empresa(i.empresa_id) or not private.em_paid_company(i.empresa_id) then
    raise exception 'A ficha exige acesso à entrevista e um plano Premium ativo.' using errcode='42501';
  end if;
  if i.state='cancelled' or i.scheduled_at>now() then raise exception 'Avalie a entrevista a partir do horário agendado.'; end if;
  if jsonb_typeof(p_scores) is distinct from 'object'
    or (select count(*) from jsonb_object_keys(p_scores))<>4
    or exists(select 1 from jsonb_object_keys(p_scores) key_name where key_name not in ('technical','experience','communication','problem_solving')) then
    raise exception 'Preencha os quatro critérios de avaliação.';
  end if;
  foreach k in array array['technical','experience','communication','problem_solving'] loop
    if jsonb_typeof(p_scores->k) is distinct from 'number' or (p_scores->>k) not in ('1','2','3','4','5') then
      raise exception 'Use notas inteiras de 1 a 5 em todos os critérios.';
    end if;
  end loop;
  if p_recommendation is null or p_recommendation not in ('avancar','manter','nao_avancar') or char_length(coalesce(p_evidence,''))>4000 then
    raise exception 'Confira a recomendação e o limite de 4.000 caracteres.';
  end if;
  select * into previous from public.em_interview_scorecards where interview_id=i.id;
  if previous.interview_id is not null and previous.updated_at is distinct from p_expected_updated_at then
    raise exception 'A ficha foi alterada por outro recrutador. Reabra para carregar a versão atual.' using errcode='40001';
  end if;
  insert into public.em_interview_scorecards(interview_id,empresa_id,reviewer_uid,technical_score,experience_score,communication_score,problem_solving_score,recommendation,evidence)
    values(i.id,i.empresa_id,auth.uid(),(p_scores->>'technical')::smallint,(p_scores->>'experience')::smallint,
      (p_scores->>'communication')::smallint,(p_scores->>'problem_solving')::smallint,p_recommendation,trim(coalesce(p_evidence,'')))
    on conflict(interview_id) do update set reviewer_uid=excluded.reviewer_uid,technical_score=excluded.technical_score,
      experience_score=excluded.experience_score,communication_score=excluded.communication_score,
      problem_solving_score=excluded.problem_solving_score,recommendation=excluded.recommendation,evidence=excluded.evidence,updated_at=clock_timestamp()
    returning * into result;
  return result;
end $$;
create function public.em_save_interview_scorecard(
  p_interview_id uuid,p_scores jsonb,p_recommendation text,p_evidence text,p_expected_updated_at timestamptz default null
) returns public.em_interview_scorecards language sql security invoker set search_path='' as $$
  select private.em_save_interview_scorecard(p_interview_id,p_scores,p_recommendation,p_evidence,p_expected_updated_at);
$$;
revoke all on function private.em_save_interview_scorecard(uuid,jsonb,text,text,timestamptz) from public,anon;
revoke all on function public.em_save_interview_scorecard(uuid,jsonb,text,text,timestamptz) from public,anon;
grant execute on function private.em_save_interview_scorecard(uuid,jsonb,text,text,timestamptz) to authenticated;
grant execute on function public.em_save_interview_scorecard(uuid,jsonb,text,text,timestamptz) to authenticated;

create function private.em_save_recruiter_message_rule(
  p_empresa_id uuid,p_job_ref text,p_stage_key text,p_template text,p_enabled boolean,
  p_expected_updated_at timestamptz default null
) returns public.em_recruiter_message_rules language plpgsql security definer set search_path='' as $$
declare result public.em_recruiter_message_rules; previous public.em_recruiter_message_rules; stripped text;
begin
  if auth.uid() is null or not private.usuario_pertence_empresa(p_empresa_id) or not private.em_paid_company(p_empresa_id) then
    raise exception 'As mensagens automáticas exigem um plano Premium ativo e acesso à empresa.' using errcode='42501';
  end if;
  p_job_ref:=trim(coalesce(p_job_ref,'')); p_template:=trim(coalesce(p_template,''));
  if char_length(p_job_ref)>200 or p_stage_key is null or p_stage_key not in ('contato','entrevista','aprovadas','contratadas','reprovadas')
    or char_length(p_template) not between 1 and 4000 or p_enabled is null then raise exception 'Regra de mensagem inválida.'; end if;
  if p_job_ref<>'' and not exists(select 1 from public.vagas v where v.empresa_id=p_empresa_id
    and (v.id::text=p_job_ref or v.dados_publicacao->>'id'=p_job_ref)) then
    raise exception 'Selecione uma vaga desta empresa.' using errcode='42501';
  end if;
  stripped:=replace(replace(replace(replace(p_template,'{candidato}',''),'{vaga}',''),'{empresa}',''),'{etapa}','');
  if stripped like '%{%' or stripped like '%}%' then raise exception 'Use apenas {candidato}, {vaga}, {empresa} e {etapa}.'; end if;
  -- Serialize first saves too, so two editors cannot silently overwrite a rule.
  perform pg_advisory_xact_lock(hashtextextended(p_empresa_id::text||'|'||p_job_ref||'|'||p_stage_key,0));
  select * into previous from public.em_recruiter_message_rules
    where empresa_id=p_empresa_id and job_ref=p_job_ref and stage_key=p_stage_key for update;
  if previous.id is not null and previous.updated_at is distinct from p_expected_updated_at then
    raise exception 'A regra foi alterada por outro recrutador. Atualize as regras antes de salvar.' using errcode='40001';
  end if;
  insert into public.em_recruiter_message_rules(empresa_id,job_ref,stage_key,template,enabled,updated_by)
    values(p_empresa_id,p_job_ref,p_stage_key,p_template,p_enabled,auth.uid())
    on conflict(empresa_id,job_ref,stage_key) do update set template=excluded.template,enabled=excluded.enabled,
      updated_by=excluded.updated_by,updated_at=clock_timestamp()
    returning * into result;
  return result;
end $$;
create function public.em_save_recruiter_message_rule(
  p_empresa_id uuid,p_job_ref text,p_stage_key text,p_template text,p_enabled boolean,p_expected_updated_at timestamptz default null
) returns public.em_recruiter_message_rules language sql security invoker set search_path='' as $$
  select private.em_save_recruiter_message_rule(p_empresa_id,p_job_ref,p_stage_key,p_template,p_enabled,p_expected_updated_at);
$$;
revoke all on function private.em_save_recruiter_message_rule(uuid,text,text,text,boolean,timestamptz) from public,anon;
revoke all on function public.em_save_recruiter_message_rule(uuid,text,text,text,boolean,timestamptz) from public,anon;
grant execute on function private.em_save_recruiter_message_rule(uuid,text,text,text,boolean,timestamptz) to authenticated;
grant execute on function public.em_save_recruiter_message_rule(uuid,text,text,text,boolean,timestamptz) to authenticated;

create function private.em_recruiter_stage_key(p_status text) returns text
language sql immutable set search_path='' as $$
  select case lower(trim(p_status))
    when 'em contato' then 'contato' when 'entrevista agendada' then 'entrevista'
    when 'aprovado' then 'aprovadas' when 'contratado' then 'contratadas'
    when 'reprovado' then 'reprovadas' else null end;
$$;
revoke all on function private.em_recruiter_stage_key(text) from public,anon,authenticated;

create function private.em_send_recruiter_stage_message(
  p_empresa_id uuid,p_application_ref text,p_job_ref text,p_candidate_uid uuid,p_title text,p_status text
) returns void language plpgsql security definer set search_path='' as $$
declare e public.empresas%rowtype; rule public.em_recruiter_message_rules%rowtype;
  destination text:=private.em_recruiter_stage_key(p_status); recipient_email text; recipient_name text;
  company_name text; job_name text; message_body text; claimed boolean; message_uuid uuid:=gen_random_uuid();
begin
  if destination is null or auth.uid() is null or p_candidate_uid is null or p_candidate_uid=auth.uid()
    or not private.usuario_pertence_empresa(p_empresa_id) or not private.em_paid_company(p_empresa_id) then return; end if;
  select * into e from public.empresas where id=p_empresa_id;
  -- A job-specific disabled rule explicitly overrides the general rule.
  select * into rule from public.em_recruiter_message_rules where empresa_id=e.id
    and stage_key=destination and job_ref in ('',p_job_ref) order by (job_ref=p_job_ref) desc limit 1;
  if rule.id is null or not rule.enabled then return; end if;
  select u.email,coalesce(nullif(c.nome,''),'Candidato') into recipient_email,recipient_name
    from auth.users u join public.candidatos c on c.user_id=u.id where u.id=p_candidate_uid and u.deleted_at is null limit 1;
  if recipient_email is null then return; end if;
  company_name:=left(coalesce(nullif(e.nome_fantasia,''),nullif(e.nome,''),e.razao_social,'Empresa'),160);
  select left(cargo,160) into job_name from public.vagas v where empresa_id=e.id
    and (v.id::text=p_job_ref or v.dados_publicacao->>'id'=p_job_ref) limit 1;
  job_name:=coalesce(nullif(job_name,''),nullif(left(p_title,160),''),'Processo seletivo');
  message_body:=left(replace(replace(replace(replace(rule.template,'{candidato}',left(recipient_name,150)),
    '{vaga}',job_name),'{empresa}',company_name),'{etapa}',p_status),10000);
  insert into private.em_recruiter_message_deliveries(empresa_id,application_ref,stage_key,rule_id)
    values(e.id,p_application_ref,destination,rule.id) on conflict(empresa_id,application_ref,stage_key) do nothing
    returning true into claimed;
  if not coalesce(claimed,false) then return; end if;
  insert into public.em_candidate_messages(id,empresa_id,sender_uid,candidate_uid,candidate_email,company_name,job_ref,job_title,body,state,sent_at)
    values(message_uuid,e.id,auth.uid(),p_candidate_uid,lower(recipient_email),company_name,p_job_ref,job_name,message_body,'sent',now());
  update private.em_recruiter_message_deliveries set message_id=message_uuid
    where empresa_id=e.id and application_ref=p_application_ref and stage_key=destination;
end $$;
revoke all on function private.em_send_recruiter_stage_message(uuid,text,text,uuid,text,text) from public,anon,authenticated;

create function private.em_recruiter_message_on_stage() returns trigger
language plpgsql security definer set search_path='' as $$
declare company_id uuid;
begin
  if tg_table_name='em_recruiter_state' then
    if private.em_recruiter_stage_key(old.state->>'status') is not distinct from private.em_recruiter_stage_key(new.state->>'status') then return new; end if;
    perform private.em_send_recruiter_stage_message(new.empresa_id,new.application_ref,new.job_ref,new.candidate_uid,new.job_title,new.state->>'status');
  else
    if private.em_recruiter_stage_key(old.status) is not distinct from private.em_recruiter_stage_key(new.status) then return new; end if;
    select id into company_id from public.empresas where user_id=new.empresa_user_id limit 1;
    if company_id is not null then
      perform private.em_send_recruiter_stage_message(company_id,new.id,new.vaga_id,new.candidato_user_id,'',new.status);
    end if;
  end if;
  return new;
end $$;
revoke all on function private.em_recruiter_message_on_stage() from public,anon,authenticated;
-- Updates only: importing older candidaturas or opening a panel sends nothing.
create trigger em_premium_application_stage_message after update of status on public.candidaturas
  for each row execute function private.em_recruiter_message_on_stage();
create trigger em_premium_recruiter_stage_message after update of state on public.em_recruiter_state
  for each row execute function private.em_recruiter_message_on_stage();

commit;

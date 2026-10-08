
create table public.em_job_screening (
 job_id text primary key check(length(job_id) between 1 and 160),
 empresa_id uuid not null references public.empresas(id) on delete cascade,
 questions jsonb not null default '[]' check(jsonb_typeof(questions)='array' and jsonb_array_length(questions)<=10),
 published boolean not null default false,
 updated_at timestamptz not null default now()
);
create index em_job_screening_company on public.em_job_screening(empresa_id);
create function private.em_paid_company(eid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.empresas e where e.id=eid and not e.suspensa_admin and e.plano_id in ('mensal','trimestral','semestral','anual') and e.plano_valido_ate>now())
$$;
revoke all on function private.em_paid_company(uuid) from public;
grant execute on function private.em_paid_company(uuid) to anon,authenticated;
alter table public.em_job_screening enable row level security;
revoke all on public.em_job_screening from anon,authenticated;
grant select on public.em_job_screening to anon,authenticated;
grant insert,update,delete on public.em_job_screening to authenticated;
create policy screening_public on public.em_job_screening for select to anon,authenticated using(published and private.em_paid_company(empresa_id));
create policy screening_company_read on public.em_job_screening for select to authenticated using(private.usuario_pertence_empresa(empresa_id));
create policy screening_company_insert on public.em_job_screening for insert to authenticated with check(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id));
create policy screening_company_update on public.em_job_screening for update to authenticated using(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id)) with check(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id));
create policy screening_company_delete on public.em_job_screening for delete to authenticated using(private.usuario_pertence_empresa(empresa_id));

create table public.em_application_screening(
 job_id text not null references public.em_job_screening(job_id) on delete cascade,
 candidate_uid uuid not null references auth.users(id) on delete cascade,
 answers jsonb not null default '[]',
 consent boolean not null default false,
 submitted boolean not null default false,
 profile jsonb not null default '{}',
 created_at timestamptz not null default now(),
 primary key(job_id,candidate_uid)
);
create index em_application_screening_candidate on public.em_application_screening(candidate_uid);
alter table public.em_application_screening enable row level security;
revoke all on public.em_application_screening from anon,authenticated;
grant select,delete on public.em_application_screening to authenticated;
create policy screening_answers_candidate on public.em_application_screening for select to authenticated using(candidate_uid=(select auth.uid()));
create policy screening_answers_company on public.em_application_screening for select to authenticated using(submitted and exists(select 1 from public.em_job_screening j where j.job_id=em_application_screening.job_id and private.usuario_pertence_empresa(j.empresa_id) and private.em_paid_company(j.empresa_id)));
create policy screening_answers_remove on public.em_application_screening for delete to authenticated using(candidate_uid=(select auth.uid()));

create table public.em_company_talent(
 empresa_id uuid not null references public.empresas(id) on delete cascade,
 candidate_uid uuid not null,
 job_id text not null,
 labels text not null default '' check(length(labels)<=300),
 note text not null default '' check(length(note)<=4000),
 saved_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '12 months',
 primary key(empresa_id,candidate_uid),
 foreign key(job_id,candidate_uid) references public.em_application_screening(job_id,candidate_uid) on delete cascade
);
create index em_company_talent_consent on public.em_company_talent(job_id,candidate_uid);
alter table public.em_company_talent enable row level security;
revoke all on public.em_company_talent from anon,authenticated;
grant select,insert,update,delete on public.em_company_talent to authenticated;
create policy talent_read on public.em_company_talent for select to authenticated using(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id) and expires_at>now() and exists(select 1 from public.em_application_screening a join public.em_job_screening j using(job_id) where a.job_id=em_company_talent.job_id and a.candidate_uid=em_company_talent.candidate_uid and j.empresa_id=em_company_talent.empresa_id and a.consent and a.submitted));
create policy talent_insert on public.em_company_talent for insert to authenticated with check(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id) and expires_at<=now()+interval '12 months' and exists(select 1 from public.em_application_screening a join public.em_job_screening j using(job_id) where a.job_id=em_company_talent.job_id and a.candidate_uid=em_company_talent.candidate_uid and j.empresa_id=em_company_talent.empresa_id and a.consent and a.submitted));
create policy talent_update on public.em_company_talent for update to authenticated using(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id)) with check(private.usuario_pertence_empresa(empresa_id) and private.em_paid_company(empresa_id) and expires_at<=now()+interval '12 months' and exists(select 1 from public.em_application_screening a join public.em_job_screening j using(job_id) where a.job_id=em_company_talent.job_id and a.candidate_uid=em_company_talent.candidate_uid and j.empresa_id=em_company_talent.empresa_id and a.consent and a.submitted));
create policy talent_delete on public.em_company_talent for delete to authenticated using(private.usuario_pertence_empresa(empresa_id));

create function public.em_save_screening(p_job text,p_answers jsonb,p_consent boolean) returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); qs jsonb; q jsonb; a jsonb; val jsonb; snapshot jsonb;
begin
 if uid is null then raise exception 'Entre na sua conta de candidato.' using errcode='42501'; end if;
 select j.questions into qs from public.em_job_screening j where j.job_id=p_job and j.published and private.em_paid_company(j.empresa_id);
 if qs is null then raise exception 'Questionário indisponível.'; end if;
 if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)>10 or length(p_answers::text)>25000 then raise exception 'Respostas inválidas.'; end if;
 for q in select value from jsonb_array_elements(qs) loop
  select value into a from jsonb_array_elements(p_answers) where value->>'id'=q->>'id';
  val:=a->'value';
  if coalesce((q->>'required')::boolean,false) and (val is null or val='null'::jsonb or val='""'::jsonb or val='[]'::jsonb) then raise exception 'Responda às perguntas obrigatórias.'; end if;
  if val is not null and val<>'null'::jsonb then
   if q->>'type'='text' and (jsonb_typeof(val)<>'string' or length(val#>>'{}')>2000) then raise exception 'Resposta de texto inválida.'; end if;
   if q->>'type'='single' and val<>'""'::jsonb and not (q->'options' @> jsonb_build_array(val)) then raise exception 'Selecione uma opção válida.'; end if;
   if q->>'type'='multiple' and (jsonb_typeof(val)<>'array' or not(q->'options' @> val)) then raise exception 'Opções inválidas.'; end if;
  end if;
 end loop;
 select jsonb_build_object('nome',c.nome,'email',c.email,'telefone',c.telefone,'cidade',c.cidade,'curriculo',c.curriculo_online) into snapshot from public.candidatos c where c.user_id=uid;
 if snapshot is null then raise exception 'Complete seu perfil de candidato.'; end if;
 insert into public.em_application_screening(job_id,candidate_uid,answers,consent,profile) values(p_job,uid,p_answers,p_consent,snapshot)
 on conflict(job_id,candidate_uid) do update set answers=excluded.answers,consent=excluded.consent,profile=excluded.profile;
end $$;

create function public.em_confirm_screening(p_job text) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 update public.em_application_screening set submitted=true where job_id=p_job and candidate_uid=auth.uid();
 if not found then raise exception 'Respostas não encontradas.'; end if;
end $$;
create function public.em_revoke_talent(p_company uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 delete from public.em_company_talent where empresa_id=p_company and candidate_uid=auth.uid();
 update public.em_application_screening a set consent=false from public.em_job_screening j where a.job_id=j.job_id and j.empresa_id=p_company and a.candidate_uid=auth.uid();
end $$;
revoke all on function public.em_save_screening(text,jsonb,boolean),public.em_confirm_screening(text),public.em_revoke_talent(uuid) from public,anon;
grant execute on function public.em_save_screening(text,jsonb,boolean),public.em_confirm_screening(text),public.em_revoke_talent(uuid) to authenticated;
notify pgrst,'reload schema';



alter function public.em_save_screening(text,jsonb,boolean) set schema private;
alter function public.em_confirm_screening(text) set schema private;
alter function public.em_revoke_talent(uuid) set schema private;
create function public.em_save_screening(p_job text,p_answers jsonb,p_consent boolean) returns void language sql security invoker set search_path='' as $$ select private.em_save_screening(p_job,p_answers,p_consent) $$;
create function public.em_confirm_screening(p_job text) returns void language sql security invoker set search_path='' as $$ select private.em_confirm_screening(p_job) $$;
create function public.em_revoke_talent(p_company uuid) returns void language sql security invoker set search_path='' as $$ select private.em_revoke_talent(p_company) $$;
create function private.em_my_talent_consents() returns table(empresa_id uuid,company_name text,job_id text) language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 return query select j.empresa_id,coalesce(e.nome_fantasia,e.nome,'Empresa'),a.job_id from public.em_application_screening a join public.em_job_screening j on j.job_id=a.job_id join public.empresas e on e.id=j.empresa_id where a.candidate_uid=auth.uid() and a.consent and a.submitted;
end $$;
create function public.em_my_talent_consents() returns table(empresa_id uuid,company_name text,job_id text) language sql security invoker set search_path='' as $$ select * from private.em_my_talent_consents() $$;
revoke all on function private.em_my_talent_consents(),public.em_my_talent_consents(),public.em_save_screening(text,jsonb,boolean),public.em_confirm_screening(text),public.em_revoke_talent(uuid) from public,anon;
grant execute on function private.em_my_talent_consents(),public.em_my_talent_consents(),public.em_save_screening(text,jsonb,boolean),public.em_confirm_screening(text),public.em_revoke_talent(uuid) to authenticated;
notify pgrst,'reload schema';

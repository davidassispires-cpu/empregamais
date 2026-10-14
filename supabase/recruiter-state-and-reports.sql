-- Internal recruiter state is isolated from candidate-visible application records.
create table public.em_recruiter_state (
 empresa_id uuid not null references public.empresas(id) on delete cascade,
 application_ref text not null check(length(application_ref) between 1 and 200),
 job_ref text not null check(length(job_ref) between 1 and 200),
 state jsonb not null default '{}' check(jsonb_typeof(state)='object' and octet_length(state::text)<20000),
 updated_at timestamptz not null default now(),
 primary key(empresa_id,application_ref)
);
alter table public.em_recruiter_state enable row level security;
revoke all on public.em_recruiter_state from anon,authenticated;
grant select on public.em_recruiter_state to authenticated;
create policy "company reads internal selection state" on public.em_recruiter_state for select to authenticated
 using(private.usuario_pertence_empresa(empresa_id));
-- Associate legacy application references with the candidate's authenticated account.
-- Recruiter notes and favorites remain company-only.
alter table public.em_recruiter_state add column if not exists candidate_uid uuid references auth.users(id) on delete set null;
alter table public.em_recruiter_state add column if not exists job_title text not null default '' check(length(job_title)<=300);
alter table public.em_recruiter_state add column if not exists status_updated_at timestamptz;
create index if not exists em_recruiter_state_candidate on public.em_recruiter_state(candidate_uid,updated_at desc) where candidate_uid is not null;
create or replace function private.em_sync_recruiter_state(p_company_cnpj text,p_changes jsonb default '[]')
returns setof public.em_recruiter_state language plpgsql security definer set search_path='' as $$
declare company uuid; change jsonb; patch jsonb; recipient uuid; candidate_email text; title text;
begin
 if auth.uid() is null then raise exception 'Entre novamente na sua conta.'; end if;
 select id into company from public.empresas
 where regexp_replace(cnpj,'[^0-9]','','g')=regexp_replace(p_company_cnpj,'[^0-9]','','g')
 and private.usuario_pertence_empresa(id) and not coalesce(suspensa_admin,false) limit 1;
 if company is null or length(regexp_replace(p_company_cnpj,'[^0-9]','','g'))<>14 then raise exception 'Empresa sem autorização para sincronizar candidaturas.'; end if;
 if jsonb_typeof(p_changes) is distinct from 'array' or jsonb_array_length(p_changes)>100 then raise exception 'Lote inválido.'; end if;
 for change in select value from jsonb_array_elements(p_changes) loop
  patch=coalesce(change->'state','{}');
  if jsonb_typeof(patch) is distinct from 'object' or
   exists(select 1 from jsonb_object_keys(patch) k where k not in ('status','favoritoRecrutador','observacaoRecrutador','statusAtualizadoEm','contratadoEm')) or
   (patch ? 'status' and (jsonb_typeof(patch->'status')<>'string' or patch->>'status' not in ('Em avaliação','Em contato','Entrevista agendada','Aprovado','Contratado','Reprovado'))) or
   (patch ? 'favoritoRecrutador' and jsonb_typeof(patch->'favoritoRecrutador')<>'boolean') or
   (patch ? 'observacaoRecrutador' and (jsonb_typeof(patch->'observacaoRecrutador')<>'string' or length(patch->>'observacaoRecrutador')>10000)) or
   octet_length(patch::text)>=20000 then raise exception 'Alteração inválida.'; end if;
  candidate_email=lower(trim(coalesce(change->>'candidate_email','')));
  title=trim(coalesce(change->>'job_title',''));
  if length(candidate_email)>320 or length(title)>300 then raise exception 'Dados da candidatura inválidos.'; end if;
  recipient=null;
  if candidate_email<>'' then
   select u.id into recipient from auth.users u join public.candidatos c on c.user_id=u.id
   where lower(u.email)=candidate_email limit 1;
  end if;
  insert into public.em_recruiter_state(empresa_id,application_ref,job_ref,state,candidate_uid,job_title,status_updated_at)
  values(company,change->>'application_ref',change->>'job_ref',patch,recipient,title,case when patch ? 'status' then now() end)
  on conflict(empresa_id,application_ref) do update set
  state=public.em_recruiter_state.state || excluded.state,updated_at=now(),
  candidate_uid=coalesce(public.em_recruiter_state.candidate_uid,excluded.candidate_uid),
  job_title=coalesce(nullif(excluded.job_title,''),public.em_recruiter_state.job_title),
  status_updated_at=case when patch ? 'status' and public.em_recruiter_state.state->>'status' is distinct from patch->>'status'
   then now() else coalesce(public.em_recruiter_state.status_updated_at,excluded.status_updated_at) end
  where public.em_recruiter_state.job_ref=excluded.job_ref and
   (excluded.candidate_uid is null or public.em_recruiter_state.candidate_uid is null or public.em_recruiter_state.candidate_uid=excluded.candidate_uid);
  if not found then raise exception 'A candidatura pertence a outra vaga ou candidato.'; end if;
 end loop;
 return query select * from public.em_recruiter_state where empresa_id=company;
end $$;
revoke all on function private.em_sync_recruiter_state(text,jsonb) from public,anon;
grant execute on function private.em_sync_recruiter_state(text,jsonb) to authenticated;
create or replace function public.em_sync_recruiter_state(p_company_cnpj text,p_changes jsonb default '[]')
returns setof public.em_recruiter_state language sql security invoker set search_path='' as $$
 select * from private.em_sync_recruiter_state(p_company_cnpj,p_changes);
$$;
revoke all on function public.em_sync_recruiter_state(text,jsonb) from public,anon;
grant execute on function public.em_sync_recruiter_state(text,jsonb) to authenticated;

-- The candidate endpoint exposes only their own public application stage.
-- It deliberately never returns the internal state JSON, notes or favorites.
create or replace function private.em_candidate_application_stages()
returns table(application_ref text,job_ref text,status text,status_updated_at timestamptz,job_title text,company_name text)
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Entre novamente na sua conta.' using errcode='42501'; end if;
 return query
 select c.id,c.vaga_id,coalesce(nullif(r.state->>'status',''),c.status),coalesce(r.status_updated_at,c.atualizado_em,c.criado_em),
  coalesce(nullif(v.cargo,''),r.job_title,''),
  case when coalesce(v.confidencial,false) then 'Empresa confidencial' else coalesce(nullif(v.empresa,''),'Empresa') end
 from public.candidaturas c
 left join public.vagas v on v.id::text=c.vaga_id and v.user_id=c.empresa_user_id
 left join public.em_recruiter_state r on r.application_ref=c.id and r.job_ref=c.vaga_id and r.empresa_id=v.empresa_id and r.candidate_uid=c.candidato_user_id
 where c.candidato_user_id=auth.uid()
 union all
 select r.application_ref,r.job_ref,r.state->>'status',coalesce(r.status_updated_at,r.updated_at),r.job_title,'Empresa'::text
 from public.em_recruiter_state r
 where r.candidate_uid=auth.uid() and r.state ? 'status' and not exists
  (select 1 from public.candidaturas c where c.id=r.application_ref and c.vaga_id=r.job_ref and c.candidato_user_id=auth.uid());
end $$;
revoke all on function private.em_candidate_application_stages() from public,anon;
grant execute on function private.em_candidate_application_stages() to authenticated;
create or replace function public.em_candidate_application_stages()
returns table(application_ref text,job_ref text,status text,status_updated_at timestamptz,job_title text,company_name text)
language sql security invoker set search_path='' as $$
 select * from private.em_candidate_application_stages();
$$;
revoke all on function public.em_candidate_application_stages() from public,anon;
grant execute on function public.em_candidate_application_stages() to authenticated;

-- Old portal job references remain reportable while the legacy feed is in use.
alter table public.denuncias_vagas alter column vaga_id drop not null;
alter table public.denuncias_vagas add column job_ref text;
alter table public.denuncias_vagas add column evidencia jsonb;
alter table public.denuncias_vagas add constraint denuncia_reference_valid check(vaga_id is not null or (job_ref is not null and length(job_ref) between 1 and 200));
alter table public.denuncias_vagas add constraint denuncia_content_valid check(length(motivo) between 1 and 200 and length(detalhes) between 1 and 3000);
alter table public.denuncias_vagas add constraint denuncia_evidence_valid check(evidencia is null or
 coalesce((jsonb_typeof(evidencia)='object' and octet_length(evidencia::text)<=2850000 and
 evidencia->>'mime' in ('image/jpeg','image/png','application/pdf') and
 length(evidencia->>'name') between 1 and 255 and length(evidencia->>'data') between 1 and 2800000),false));
drop policy enviar_denuncia_publica on public.denuncias_vagas;
create policy enviar_denuncia_publica on public.denuncias_vagas for insert to anon,authenticated with check
 (status='pendente' and user_id is not distinct from auth.uid() and
 ((vaga_id is null and length(job_ref) between 1 and 200) or exists(select 1 from public.vagas v
 where v.id=denuncias_vagas.vaga_id and v.status='aprovada' and (v.data_encerramento is null or v.data_encerramento>=current_date))));
grant insert(vaga_id,job_ref,motivo,detalhes,evidencia) on public.denuncias_vagas to anon,authenticated;
grant update(status,acao,resolvida_em) on public.denuncias_vagas to authenticated;

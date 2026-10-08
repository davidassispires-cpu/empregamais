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
create function private.em_sync_recruiter_state(p_company_cnpj text,p_changes jsonb default '[]')
returns setof public.em_recruiter_state language plpgsql security definer set search_path='' as $$
declare company uuid; change jsonb; patch jsonb;
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
  insert into public.em_recruiter_state(empresa_id,application_ref,job_ref,state)
  values(company,change->>'application_ref',change->>'job_ref',patch)
  on conflict(empresa_id,application_ref) do update set
  state=public.em_recruiter_state.state || excluded.state,updated_at=now()
  where public.em_recruiter_state.job_ref=excluded.job_ref;
  if not found then raise exception 'A candidatura pertence a outra vaga.'; end if;
 end loop;
 return query select * from public.em_recruiter_state where empresa_id=company;
end $$;
revoke all on function private.em_sync_recruiter_state(text,jsonb) from public,anon;
grant execute on function private.em_sync_recruiter_state(text,jsonb) to authenticated;
create function public.em_sync_recruiter_state(p_company_cnpj text,p_changes jsonb default '[]')
returns setof public.em_recruiter_state language sql security invoker set search_path='' as $$
 select * from private.em_sync_recruiter_state(p_company_cnpj,p_changes);
$$;
revoke all on function public.em_sync_recruiter_state(text,jsonb) from public,anon;
grant execute on function public.em_sync_recruiter_state(text,jsonb) to authenticated;

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

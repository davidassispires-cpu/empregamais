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
   exists(select 1 from jsonb_object_keys(patch) k where k not in ('status','favoritoRecrutador','observacaoRecrutador','statusAtualizadoEm','contratadoEm','visualizada')) or
   (patch ? 'status' and (jsonb_typeof(patch->'status')<>'string' or patch->>'status' not in ('Em avaliação','Em contato','Entrevista agendada','Aprovado','Contratado','Reprovado'))) or
   (patch ? 'visualizada' and patch->'visualizada' is distinct from 'true'::jsonb) or
   (patch ? 'favoritoRecrutador' and jsonb_typeof(patch->'favoritoRecrutador')<>'boolean') or
   (patch ? 'observacaoRecrutador' and (jsonb_typeof(patch->'observacaoRecrutador')<>'string' or length(patch->>'observacaoRecrutador')>10000)) or
   octet_length(patch::text)>=20000 then raise exception 'Alteração inválida.'; end if;
  if patch ? 'visualizada' then patch=patch || jsonb_build_object('visualizadoEm',now()); end if;
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
  state=(public.em_recruiter_state.state || excluded.state) || case when public.em_recruiter_state.state ? 'visualizadoEm' then jsonb_build_object('visualizadoEm',public.em_recruiter_state.state->'visualizadoEm') else '{}'::jsonb end,updated_at=now(),
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

create or replace function private.em_candidate_application_stages_v2()
returns table(application_ref text,job_ref text,status text,status_updated_at timestamptz,job_title text,company_name text,first_viewed_at timestamptz)
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Entre novamente na sua conta.' using errcode='42501'; end if;
 return query
 select c.id,c.vaga_id,coalesce(nullif(r.state->>'status',''),c.status),coalesce(r.status_updated_at,c.atualizado_em,c.criado_em),
  coalesce(nullif(v.cargo,''),r.job_title,''),
  case when coalesce(v.confidencial,false) then 'Empresa confidencial' else coalesce(nullif(v.empresa,''),'Empresa') end, (r.state->>'visualizadoEm')::timestamptz
 from public.candidaturas c
 left join public.vagas v on v.id::text=c.vaga_id and v.user_id=c.empresa_user_id
 left join public.em_recruiter_state r on r.application_ref=c.id and r.job_ref=c.vaga_id and r.empresa_id=v.empresa_id and r.candidate_uid=c.candidato_user_id
 where c.candidato_user_id=auth.uid()
 union all
 select r.application_ref,r.job_ref,coalesce(r.state->>'status','Em avaliação'),r.status_updated_at,r.job_title,'Empresa'::text,(r.state->>'visualizadoEm')::timestamptz
 from public.em_recruiter_state r
 where r.candidate_uid=auth.uid() and (r.state ? 'status' or r.state ? 'visualizadoEm') and not exists
  (select 1 from public.candidaturas c where c.id=r.application_ref and c.vaga_id=r.job_ref and c.candidato_user_id=auth.uid());
end $$;
revoke all on function private.em_candidate_application_stages_v2() from public,anon;
grant execute on function private.em_candidate_application_stages_v2() to authenticated;
create or replace function public.em_candidate_application_stages_v2()
returns table(application_ref text,job_ref text,status text,status_updated_at timestamptz,job_title text,company_name text,first_viewed_at timestamptz)
language sql security invoker set search_path='' as $$
 select * from private.em_candidate_application_stages_v2();
$$;
revoke all on function public.em_candidate_application_stages_v2() from public,anon;
grant execute on function public.em_candidate_application_stages_v2() to authenticated;


notify pgrst, 'reload schema';

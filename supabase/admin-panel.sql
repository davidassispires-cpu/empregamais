-- Administrative changes keep existing RLS and commit the audit entry atomically.
create or replace function public.admin_painel_operar(
 p_tipo text, p_id uuid, p_acao text, p_motivo text default null, p_dias integer default 30
) returns void language plpgsql security invoker set search_path='' as $$
declare
 job public.vagas;
 candidate_id uuid;
 company_id uuid;
begin
 if auth.uid() is null or not coalesce(public.is_admin(),false) then
  raise exception 'Acesso administrativo necessário.' using errcode='42501';
 end if;
 if p_id is null then raise exception 'Registro inválido.'; end if;
 if p_tipo='vaga' then
  select * into job from public.vagas where id=p_id for update;
  if not found then raise exception 'Vaga não encontrada.'; end if;
  if p_acao in ('approve','resume') and job.data_encerramento is not null and job.data_encerramento<current_date then
   raise exception 'Esta vaga já encerrou o prazo.';
  end if;
  if p_acao in ('approve','reject') and job.status<>'pendente' then
   raise exception 'Esta vaga já foi analisada. Atualize o painel.';
  end if;
  if p_acao='approve' then
   update public.vagas set status='aprovada',motivo_reprovacao=null,editado_em=now() where id=p_id;
  elsif p_acao='reject' then
   if length(trim(coalesce(p_motivo,''))) not between 1 and 2000 then raise exception 'Informe o motivo da reprovação.'; end if;
   update public.vagas set status='reprovada',motivo_reprovacao=trim(p_motivo),editado_em=now() where id=p_id;
  elsif p_acao='pause' and job.status='aprovada' then
   update public.vagas set status='suspensa',editado_em=now() where id=p_id;
  elsif p_acao='resume' and job.status='suspensa' then
   update public.vagas set status='aprovada',editado_em=now() where id=p_id;
  else raise exception 'Ação inválida para o status desta vaga.';
  end if;
 elsif p_tipo='empresa' then
  if p_acao not in ('suspend','restore') then raise exception 'Ação administrativa inválida.'; end if;
  update public.empresas set suspensa_admin=(p_acao='suspend'),atualizado_em=now()
   where id=p_id returning id into company_id;
  if company_id is null then raise exception 'Empresa não encontrada.'; end if;
 elsif p_tipo='candidato' then
  if p_acao not in ('premium','removePremium') then raise exception 'Ação administrativa inválida.'; end if;
  if p_acao='premium' and (p_dias is null or p_dias not between 1 and 730) then raise exception 'Duração inválida.'; end if;
  update public.candidatos set premium=(p_acao='premium'),premium_cortesia_admin=(p_acao='premium'),
   premium_ativado_em=case when p_acao='premium' then now() else premium_ativado_em end,
   premium_valido_ate=case when p_acao='premium' then now()+make_interval(days=>p_dias) else null end,
   atualizado_em=now() where id=p_id returning id into candidate_id;
  if candidate_id is null then raise exception 'Candidato não encontrado.'; end if;
 else raise exception 'Tipo de registro inválido.';
 end if;
 insert into public.historico_administrativo(admin_user_id,acao,detalhe)
 values(auth.uid(),case p_acao
  when 'approve' then 'Vaga aprovada' when 'reject' then 'Vaga reprovada'
  when 'pause' then 'Vaga suspensa' when 'resume' then 'Vaga reativada'
  when 'suspend' then 'Empresa suspensa' when 'restore' then 'Empresa reativada'
  when 'premium' then 'Premium concedido' else 'Premium removido' end,
  p_tipo||' · '||p_id::text||case when p_motivo is not null then ' · '||left(p_motivo,2000) else '' end);
end $$;
revoke all on function public.admin_painel_operar(text,uuid,text,text,integer) from public,anon;
grant execute on function public.admin_painel_operar(text,uuid,text,text,integer) to authenticated;

-- Preserve the legacy RPC contract while enforcing authorization and existing RLS.
create or replace function public.admin_aprovar_vaga(p_vaga_id uuid)
returns public.vagas language plpgsql security invoker set search_path='' as $$
declare row public.vagas;
begin
 if auth.uid() is null or not coalesce(public.is_admin(),false) then
  raise exception 'Acesso administrativo necessário.' using errcode='42501';
 end if;
 update public.vagas set status='aprovada',motivo_reprovacao=null where id=p_vaga_id returning * into row;
 if row.id is null then raise exception 'Vaga não encontrada.'; end if;
 insert into public.historico_administrativo(admin_user_id,acao,detalhe) values(auth.uid(),'Vaga aprovada',p_vaga_id::text);
 return row;
end $$;
create or replace function public.admin_reprovar_vaga(p_vaga_id uuid,p_motivo text default null)
returns public.vagas language plpgsql security invoker set search_path='' as $$
declare row public.vagas;
begin
 if auth.uid() is null or not coalesce(public.is_admin(),false) then
  raise exception 'Acesso administrativo necessário.' using errcode='42501';
 end if;
 update public.vagas set status='reprovada',motivo_reprovacao=p_motivo where id=p_vaga_id returning * into row;
 if row.id is null then raise exception 'Vaga não encontrada.'; end if;
 insert into public.historico_administrativo(admin_user_id,acao,detalhe) values(auth.uid(),'Vaga reprovada',p_vaga_id::text);
 return row;
end $$;
revoke all on function public.admin_aprovar_vaga(uuid),public.admin_reprovar_vaga(uuid,text) from public,anon;
grant execute on function public.admin_aprovar_vaga(uuid),public.admin_reprovar_vaga(uuid,text) to authenticated;
notify pgrst,'reload schema';

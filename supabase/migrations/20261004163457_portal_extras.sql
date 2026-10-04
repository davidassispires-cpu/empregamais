-- Extras are real requests. Only an administrator can confirm and activate them.
create table public.solicitacoes_extras (
 id uuid primary key default gen_random_uuid(),
 vaga_id uuid not null references public.vagas(id),
 empresa_id uuid not null references public.empresas(id),
 user_id uuid not null references auth.users(id),
 tipo text not null check(tipo in ('destaque','urgencia')),
 valor numeric(10,2) not null,
 dias integer,
 status text not null default 'aguardando_pagamento' check(status in ('aguardando_pagamento','ativo','cancelado')),
 criado_em timestamptz not null default now(), ativado_em timestamptz, cancelado_em timestamptz
);
alter table public.solicitacoes_extras enable row level security;
revoke all on public.solicitacoes_extras from anon,authenticated;
grant select on public.solicitacoes_extras to authenticated;
grant insert(vaga_id,tipo) on public.solicitacoes_extras to authenticated;
grant update(status,ativado_em,cancelado_em) on public.solicitacoes_extras to authenticated;
create unique index extras_pedido_pendente_unico on public.solicitacoes_extras(vaga_id,tipo) where status='aguardando_pagamento';
create index extras_empresa on public.solicitacoes_extras(empresa_id,criado_em desc);
create index extras_user on public.solicitacoes_extras(user_id);
create policy extras_leitura on public.solicitacoes_extras for select to authenticated
 using((select public.is_admin()) or private.usuario_pertence_empresa(empresa_id));
create policy extras_solicitar on public.solicitacoes_extras for insert to authenticated
 with check(user_id=(select auth.uid()) and private.usuario_pertence_empresa(empresa_id) and status='aguardando_pagamento');
create policy extras_admin on public.solicitacoes_extras for update to authenticated
 using((select public.is_admin())) with check((select public.is_admin()));
create function private.preparar_solicitacao_extra()
returns trigger language plpgsql security invoker set search_path='' as $$
declare job public.vagas; suspended boolean;
begin
 select * into job from public.vagas where id=new.vaga_id;
 if not found or job.empresa_id is null then raise exception 'Vaga não encontrada.'; end if;
 if current_user in ('anon','authenticated') and not private.usuario_pertence_empresa(job.empresa_id) then raise exception 'Esta vaga não pertence à sua empresa.' using errcode='42501'; end if;
 select suspensa_admin into suspended from public.empresas where id=job.empresa_id;
 if suspended or job.status not in ('pendente','aprovada') or (job.data_encerramento is not null and job.data_encerramento<current_date) then raise exception 'A vaga precisa estar em análise ou publicada e dentro do prazo.'; end if;
 if new.tipo='destaque' and job.destaque and (job.destaque_ate is null or job.destaque_ate>now()) then raise exception 'Esta vaga já possui destaque ativo.'; end if;
 if new.tipo='urgencia' and job.urgente then raise exception 'Esta vaga já possui urgência ativa.'; end if;
 new.empresa_id:=job.empresa_id;new.user_id:=coalesce(auth.uid(),job.user_id);
 new.valor:=case new.tipo when 'destaque' then 19.90 when 'urgencia' then 9.90 end;
 new.dias:=case when new.tipo='destaque' then 7 end;
 new.status:='aguardando_pagamento';new.criado_em:=now();new.ativado_em:=null;new.cancelado_em:=null;
 return new;
end $$;
revoke all on function private.preparar_solicitacao_extra() from public;
create trigger preparar_extra before insert on public.solicitacoes_extras for each row execute function private.preparar_solicitacao_extra();
-- Internal trigger makes job creation and its optional requests one transaction.
create function private.criar_extras_publicacao()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.destaque_solicitado and not new.destaque and (tg_op='INSERT' or not coalesce(old.destaque_solicitado,false)) then
  insert into public.solicitacoes_extras(vaga_id,tipo) values(new.id,'destaque') on conflict do nothing;
 end if;
 if new.urgencia_solicitada and not new.urgente and (tg_op='INSERT' or not coalesce(old.urgencia_solicitada,false)) then
  insert into public.solicitacoes_extras(vaga_id,tipo) values(new.id,'urgencia') on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function private.criar_extras_publicacao() from public;
create trigger criar_extras_publicacao after insert or update of destaque_solicitado,urgencia_solicitada on public.vagas for each row execute function private.criar_extras_publicacao();
create function public.admin_analisar_extra_portal(p_id uuid,p_acao text)
returns void language plpgsql security invoker set search_path='' as $$
declare request public.solicitacoes_extras; job public.vagas;
begin
 if not public.is_admin() then raise exception 'Acesso administrativo necessário.' using errcode='42501'; end if;
 if p_acao not in ('ativar','cancelar') then raise exception 'Ação inválida.'; end if;
 select * into request from public.solicitacoes_extras where id=p_id for update;
 if not found then raise exception 'Solicitação não encontrada.'; end if;
 if request.status<>'aguardando_pagamento' then raise exception 'Esta solicitação já foi analisada.'; end if;
 select * into job from public.vagas where id=request.vaga_id for update;
 if p_acao='ativar' then
  if job.id is null or job.status<>'aprovada' or (job.data_encerramento is not null and job.data_encerramento<current_date) then raise exception 'A vaga precisa estar aprovada e dentro do prazo.'; end if;
  if exists(select 1 from public.empresas where id=request.empresa_id and suspensa_admin) then raise exception 'A empresa está suspensa.'; end if;
  if request.tipo='destaque' then
   update public.vagas set destaque=true,destaque_ate=greatest(coalesce(destaque_ate,now()),now())+make_interval(days=>request.dias),destaque_solicitado=false where id=request.vaga_id;
  else update public.vagas set urgente=true,urgencia_solicitada=false where id=request.vaga_id; end if;
  update public.solicitacoes_extras set status='ativo',ativado_em=now() where id=p_id;
 else
  update public.solicitacoes_extras set status='cancelado',cancelado_em=now() where id=p_id;
  if request.tipo='destaque' then update public.vagas set destaque_solicitado=false where id=request.vaga_id;
  else update public.vagas set urgencia_solicitada=false where id=request.vaga_id; end if;
 end if;
 insert into public.historico_administrativo(acao,detalhe) values('Extra '||p_acao,p_id::text||' · '||request.tipo||' · vaga '||request.vaga_id::text);
end $$;
revoke all on function public.admin_analisar_extra_portal(uuid,text) from public,anon;
grant execute on function public.admin_analisar_extra_portal(uuid,text) to authenticated;

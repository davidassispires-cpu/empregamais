-- Reports remain private; public visitors can submit only the report content.
create table public.denuncias_vagas (
 id uuid primary key default gen_random_uuid(),
 vaga_id uuid not null references public.vagas(id),
 user_id uuid default auth.uid() references auth.users(id),
 motivo text not null check (motivo in ('Informações falsas ou enganosas','Suspeita de fraude ou golpe','Conteúdo discriminatório','Solicitação de pagamento ao candidato','Dados de contato inadequados','Vaga duplicada','Outro motivo')),
 detalhes text not null default '' check (length(detalhes)<=700),
 status text not null default 'pendente' check(status in ('pendente','resolvida','descartada')),
 acao text, criado_em timestamptz not null default now(), resolvida_em timestamptz
);
alter table public.denuncias_vagas enable row level security;
revoke all on public.denuncias_vagas from anon,authenticated;
grant insert(vaga_id,motivo,detalhes) on public.denuncias_vagas to anon,authenticated;
grant select on public.denuncias_vagas to authenticated;
grant update(status,acao,resolvida_em) on public.denuncias_vagas to authenticated;
create index denuncias_vagas_pendentes on public.denuncias_vagas(status,criado_em desc);
create index denuncias_vagas_vaga on public.denuncias_vagas(vaga_id);
create index denuncias_vagas_user on public.denuncias_vagas(user_id);
create policy enviar_denuncia_publica on public.denuncias_vagas for insert to anon,authenticated
 with check (status='pendente' and user_id is not distinct from auth.uid() and exists(select 1 from public.vagas v where v.id=vaga_id and v.status='aprovada' and (v.data_encerramento is null or v.data_encerramento>=current_date)));
create policy admin_ler_denuncias on public.denuncias_vagas for select to authenticated using ((select public.is_admin()));
create policy admin_resolver_denuncias on public.denuncias_vagas for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create function public.admin_resolver_denuncia_portal(p_id uuid,p_acao text)
returns void language plpgsql security invoker set search_path='' as $$
declare report public.denuncias_vagas; changed uuid;
begin
 if not public.is_admin() then raise exception 'Acesso administrativo necessário.' using errcode='42501'; end if;
 if p_acao not in ('descartar','resolver','suspender') then raise exception 'Ação inválida.'; end if;
 select * into report from public.denuncias_vagas where id=p_id for update;
 if not found then raise exception 'Denúncia não encontrada.'; end if;
 if report.status<>'pendente' then raise exception 'Esta denúncia já foi analisada.'; end if;
 if p_acao='suspender' then
  update public.vagas set status='suspensa' where id=report.vaga_id returning id into changed;
  if changed is null then raise exception 'A suspensão não foi confirmada.'; end if;
 end if;
 update public.denuncias_vagas set status=case when p_acao='descartar' then 'descartada' else 'resolvida' end,acao=p_acao,resolvida_em=now() where id=p_id;
 insert into public.historico_administrativo(acao,detalhe) values('Denúncia analisada',p_id::text||' · '||p_acao||' · vaga '||report.vaga_id::text);
end $$;
revoke all on function public.admin_resolver_denuncia_portal(uuid,text) from public,anon;
grant execute on function public.admin_resolver_denuncia_portal(uuid,text) to authenticated;

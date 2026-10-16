-- Catálogo comercial aprovado: vagas por período e ativações por mês da assinatura.
create or replace function private.em_plan_limits(p_plan text)
returns jsonb language sql immutable security invoker set search_path='' as $$
 select case p_plan
  when 'mensal' then '{"vagas":8,"destaque":0,"urgente":0,"confidencial":0,"preco":49.90,"meses":1}'::jsonb
  when 'trimestral' then '{"vagas":30,"destaque":2,"urgente":2,"confidencial":1,"preco":129.90,"meses":3}'::jsonb
  when 'semestral' then '{"vagas":70,"destaque":4,"urgente":4,"confidencial":2,"preco":239.90,"meses":6}'::jsonb
  when 'anual' then '{"vagas":150,"destaque":6,"urgente":6,"confidencial":3,"preco":399.90,"meses":12}'::jsonb
  else '{"vagas":3,"destaque":0,"urgente":0,"confidencial":0,"preco":0,"meses":0}'::jsonb end
$$;
revoke all on function private.em_plan_limits(text) from public,anon;
grant execute on function private.em_plan_limits(text) to authenticated;

create or replace function private.em_plan_cycle(p_start timestamptz,p_at timestamptz)
returns timestamptz language plpgsql immutable security invoker set search_path='' set timezone='UTC' as $$
declare n integer; result timestamptz;
begin
 if p_start is null then return date_trunc('month',p_at); end if;
 n:=greatest(0,(extract(year from p_at)::integer-extract(year from p_start)::integer)*12+extract(month from p_at)::integer-extract(month from p_start)::integer);
 result:=p_start+make_interval(months=>n);
 if result>p_at and n>0 then result:=p_start+make_interval(months=>n-1); end if;
 return result;
end $$;
revoke all on function private.em_plan_cycle(timestamptz,timestamptz) from public,anon;
grant execute on function private.em_plan_cycle(timestamptz,timestamptz) to authenticated;

alter table public.vagas add column if not exists urgente_ate timestamptz;
alter table public.vagas add column if not exists confidencial_ate timestamptz;
create table if not exists private.em_service_activations (
 id bigint generated always as identity primary key,
 empresa_id uuid not null references public.empresas(id),
 vaga_id uuid not null references public.vagas(id) deferrable initially deferred,
 service text not null check(service in ('destaque','urgente','confidencial')),
 activated_at timestamptz not null default now(),
 expires_at timestamptz not null,
 source text not null default 'plan' check(source in ('plan','legacy'))
);
alter table private.em_service_activations enable row level security;
revoke all on private.em_service_activations from public,anon,authenticated;
create index if not exists em_service_activations_quota on private.em_service_activations(empresa_id,service,activated_at);
create index if not exists vagas_empresa_publicacoes on public.vagas(empresa_id,criado_em);

-- Preserva ativações existentes e inclui seu uso na contagem, sem alterar dados de candidatos.
insert into private.em_service_activations(empresa_id,vaga_id,service,activated_at,expires_at,source)
select v.empresa_id,v.id,s.key,v.criado_em,
 case s.key when 'destaque' then coalesce(v.destaque_ate,v.criado_em+interval '15 days')
 when 'urgente' then coalesce(v.urgente_ate,v.criado_em+interval '7 days')
 else coalesce(v.confidencial_ate,v.criado_em+interval '15 days') end,'legacy'
from public.vagas v cross join lateral (values('destaque',v.destaque),('urgente',v.urgente),('confidencial',v.confidencial)) s(key,enabled)
where s.enabled and v.empresa_id is not null and not coalesce(v.conecta_managed,false)
and not exists(select 1 from private.em_service_activations a where a.vaga_id=v.id and a.service=s.key);

create or replace function private.proteger_cotas_publicacao()
returns trigger language plpgsql security definer set search_path='' set timezone='UTC' as $$
declare e public.empresas; plan text; limits jsonb; start_date timestamptz; month_start timestamptz;
 limit_jobs integer; limit_feature integer; used integer; feature text; state jsonb; previous jsonb;
 ending timestamptz; previous_end timestamptz; enabled boolean; was_enabled boolean; activating boolean;
 meta jsonb; extra_key text; days integer;
begin
 if auth.uid() is null or public.is_admin() then return new; end if;
 select * into e from public.empresas where id=new.empresa_id for update;
 if e.id is null or not(e.user_id=auth.uid() or private.usuario_pertence_empresa(e.id)) or e.suspensa_admin then
  raise exception 'Publicação indisponível para esta empresa.' using errcode='42501'; end if;
 plan:=case when e.plano_valido_ate>now() then coalesce(e.plano_id,e.plano,'basico') else 'basico' end;
 limits:=private.em_plan_limits(plan);
 start_date:=case when plan='basico' then date_trunc('month',now()) else coalesce(e.plano_inicio,e.plano_liberado_em,e.criado_em) end;
 month_start:=case when plan='basico' then start_date else private.em_plan_cycle(start_date,now()) end;
 limit_jobs:=(limits->>'vagas')::integer+greatest(0,coalesce((e.recursos_admin->>'vagas')::integer,0));
 if tg_op='INSERT' then
  select count(*) into used from public.vagas where empresa_id=e.id and criado_em>=start_date;
  if used>=limit_jobs then raise exception 'Limite de publicações do período atingido.' using errcode='42501'; end if;
  new.criado_em:=now();
 end if;
 state:=to_jsonb(new);meta:=coalesce(new.dados_publicacao,'{}'::jsonb);
 if tg_op='UPDATE' then previous:=to_jsonb(old); end if;
 foreach feature in array array['destaque','urgente','confidencial'] loop
  enabled:=coalesce((state->>feature)::boolean,false);
  was_enabled:=coalesce((previous->>feature)::boolean,false);
  previous_end:=(previous->>(feature||'_ate'))::timestamptz;
  days:=case when feature='urgente' then 7 else 15 end;
  activating:=enabled and (tg_op='INSERT' or not was_enabled or previous_end<=now());
  ending:=previous_end;
  if activating then
   extra_key:=case feature when 'destaque' then 'destaques' when 'urgente' then 'urgentes' else 'confidenciais' end;
   limit_feature:=(limits->>feature)::integer+greatest(0,coalesce((e.recursos_admin->>extra_key)::integer,0));
   select count(*) into used from private.em_service_activations a where a.empresa_id=e.id and a.service=feature and a.activated_at>=month_start;
   if used>=limit_feature then raise exception 'Saldo mensal de % esgotado. A contratação avulsa custa R$ %.',feature,case feature when 'destaque' then '29,90' when 'urgente' then '19,90' else '17,90' end using errcode='42501'; end if;
   ending:=now()+make_interval(days=>days);
   insert into private.em_service_activations(empresa_id,vaga_id,service,activated_at,expires_at) values(e.id,new.id,feature,now(),ending);
  elsif enabled and ending is null then
   ending:=coalesce(old.criado_em,now())+make_interval(days=>days);
  end if;
  state:=jsonb_set(state,array[feature||'_ate'],coalesce(to_jsonb(ending),'null'::jsonb));
  meta:=jsonb_set(meta,array[feature],to_jsonb(enabled));
  meta:=jsonb_set(meta,array[feature||'Ate'],coalesce(to_jsonb(ending),'null'::jsonb));
  if feature='urgente' then meta:=jsonb_set(meta,'{contratacaoUrgente}',to_jsonb(enabled)); end if;
 end loop;
 state:=jsonb_set(state,'{dados_publicacao}',meta);
 new:=jsonb_populate_record(new,state);
 return new;
end $$;
revoke all on function private.proteger_cotas_publicacao() from public,anon,authenticated;

create or replace function private.em_plan_balance()
returns jsonb language plpgsql security definer set search_path='' set timezone='UTC' as $$
declare e public.empresas; plan text; limits jsonb; start_date timestamptz; month_start timestamptz;
 used integer; result jsonb; v_service text; cap integer; extra_key text;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 select * into e from public.empresas where user_id=auth.uid() or private.usuario_pertence_empresa(id) order by (user_id=auth.uid()) desc,criado_em limit 1;
 if e.id is null or e.suspensa_admin then raise exception 'Empresa indisponível.' using errcode='42501'; end if;
 plan:=case when e.plano_valido_ate>now() then coalesce(e.plano_id,e.plano,'basico') else 'basico' end;limits:=private.em_plan_limits(plan);
 start_date:=case when plan='basico' then date_trunc('month',now()) else coalesce(e.plano_inicio,e.plano_liberado_em,e.criado_em) end;
 month_start:=case when plan='basico' then start_date else private.em_plan_cycle(start_date,now()) end;
 select count(*) into used from public.vagas where empresa_id=e.id and criado_em>=start_date;
 cap:=(limits->>'vagas')::integer+greatest(0,coalesce((e.recursos_admin->>'vagas')::integer,0));
 result:=jsonb_build_object('empresa_id',e.id,'plano',plan,'inicio_periodo',start_date,'inicio_mes',month_start,'vagas',jsonb_build_object('limite',cap,'usadas',used,'disponiveis',greatest(0,cap-used)),'servicos','{}'::jsonb);
 foreach v_service in array array['destaque','urgente','confidencial'] loop
  extra_key:=case v_service when 'destaque' then 'destaques' when 'urgente' then 'urgentes' else 'confidenciais' end;
  cap:=(limits->>v_service)::integer+greatest(0,coalesce((e.recursos_admin->>extra_key)::integer,0));
  select count(*) into used from private.em_service_activations a where a.empresa_id=e.id and a.service=v_service and a.activated_at>=month_start;
  result:=jsonb_set(result,array['servicos',v_service],jsonb_build_object('limite',cap,'usadas',used,'disponiveis',greatest(0,cap-used)));
 end loop;
 return result;
end $$;
revoke all on function private.em_plan_balance() from public,anon;
grant execute on function private.em_plan_balance() to authenticated;
create or replace function public.em_plan_balance()
returns jsonb language sql security invoker set search_path='' as $$ select private.em_plan_balance() $$;
revoke all on function public.em_plan_balance() from public,anon;
grant execute on function public.em_plan_balance() to authenticated;

alter table public.solicitacoes_extras drop constraint solicitacoes_extras_tipo_check;
alter table public.solicitacoes_extras add constraint solicitacoes_extras_tipo_check check(tipo in ('destaque','urgencia','confidencial'));
create or replace function private.solicitar_servico_vaga(p_vaga_id uuid,p_servico text)
returns public.solicitacoes_extras language plpgsql security definer set search_path='' as $$
declare v public.vagas; result public.solicitacoes_extras; service text; duration integer; amount numeric;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 service:=case when p_servico='urgente' then 'urgencia' else p_servico end;
 if service not in ('destaque','urgencia','confidencial') then raise exception 'Serviço inválido.'; end if;
 select * into v from public.vagas where id=p_vaga_id for update;
 if v.id is null or not(v.user_id=auth.uid() or private.usuario_pertence_empresa(v.empresa_id)) then raise exception 'Esta vaga não pertence à empresa.' using errcode='42501'; end if;
 if v.status='encerrada' then raise exception 'A vaga está encerrada.' using errcode='42501'; end if;
 duration:=case when service='urgencia' then 7 else 15 end;
 amount:=case service when 'destaque' then 29.90 when 'urgencia' then 19.90 else 17.90 end;
 select * into result from public.solicitacoes_extras where vaga_id=v.id and tipo=service and status='aguardando_pagamento' order by criado_em desc limit 1;
 if result.id is not null then return result; end if;
 insert into public.solicitacoes_extras(vaga_id,empresa_id,user_id,tipo,valor,dias,status) values(v.id,v.empresa_id,auth.uid(),service,amount,duration,'aguardando_pagamento') returning * into result;
 return result;
end $$;
revoke all on function private.solicitar_servico_vaga(uuid,text) from public,anon;
grant execute on function private.solicitar_servico_vaga(uuid,text) to authenticated;
create or replace function public.solicitar_servico_vaga(p_vaga_id uuid,p_servico text)
returns public.solicitacoes_extras language sql security invoker set search_path='' as $$ select private.solicitar_servico_vaga(p_vaga_id,p_servico) $$;
revoke all on function public.solicitar_servico_vaga(uuid,text) from public,anon;
grant execute on function public.solicitar_servico_vaga(uuid,text) to authenticated;

CREATE OR REPLACE FUNCTION public.solicitar_plano(p_tipo text, p_plano text, p_forma text DEFAULT 'pix'::text)
 RETURNS solicitacoes_planos
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare owner_id uuid:=auth.uid(); company_id uuid; amount numeric; result public.solicitacoes_planos;
begin
 if owner_id is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 if p_forma not in ('pix','cartao') then raise exception 'Forma de pagamento inválida.'; end if;
 if p_tipo='empresa' then
  select id into company_id from public.empresas where user_id=owner_id limit 1;
  if company_id is null then raise exception 'Apenas o responsável da empresa pode solicitar um plano.' using errcode='42501'; end if;
  amount:=case p_plano when 'mensal' then 49.90 when 'trimestral' then 129.90 when 'semestral' then 239.90 when 'anual' then 399.90 else null end;
 elsif p_tipo='candidato' then
  if not exists(select 1 from public.candidatos where user_id=owner_id) then raise exception 'Perfil de candidato necessário.' using errcode='42501'; end if;
  amount:=case p_plano when 'mensal' then 29.90 when 'trimestral' then 79.90 when 'semestral' then 149.90 else null end;
 else raise exception 'Tipo de plano inválido.'; end if;
 if amount is null then raise exception 'Plano inválido.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||p_tipo,0));
 select * into result from public.solicitacoes_planos where user_id=owner_id and tipo=p_tipo and plano=p_plano and status='aguardando_atendimento' and valor=amount order by criado_em desc limit 1;
 if result.id is not null then return result; end if;
 insert into public.solicitacoes_planos(user_id,empresa_id,tipo,plano,valor,forma_pagamento) values(owner_id,company_id,p_tipo,p_plano,amount,p_forma) returning * into result;
 return result;
end $function$


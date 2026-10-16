-- Integration check: all fixture changes are rolled back.
begin;
do $$
declare uid uuid; eid uuid; fixture uuid; ids uuid[]; plan text; limits jsonb; cap integer; i integer; service text; enabled_key text;
 balance jsonb; req public.solicitacoes_extras; repeated public.solicitacoes_extras; quote public.solicitacoes_planos; denied boolean;
begin
 select u.id into uid from auth.users u where not exists(select 1 from public.admins a where a.user_id=u.id)
 and not exists(select 1 from public.empresas e where e.user_id=u.id) order by u.created_at limit 1;
 if uid is null then raise exception 'No independent non-admin account available for transactional tests.'; end if;
 select id into eid from public.empresas order by criado_em limit 1;
 perform set_config('request.jwt.claim.sub','',true);
 update public.empresas set user_id=uid,suspensa_admin=false,recursos_admin='{}' where id=eid;
 foreach plan in array array['mensal','trimestral','semestral','anual'] loop
  perform set_config('request.jwt.claim.sub','',true);
  update public.empresas set plano_id=plan,plano=plan,plano_inicio=now(),plano_valido_ate=now()+interval '12 months' where id=eid;
  perform set_config('request.jwt.claim.sub',uid::text,true);
  limits:=private.em_plan_limits(plan);cap:=(limits->>'vagas')::integer;ids:=array[]::uuid[];
  for i in 1..cap loop
   insert into public.vagas(user_id,empresa_id,cargo,status) values(uid,eid,'__TEST_PLAN_ROLLBACK__','pendente') returning id into fixture;
   ids:=array_append(ids,fixture);
  end loop;
  balance:=public.em_plan_balance();assert (balance->'vagas'->>'usadas')::integer=cap,'period publication count';
  denied:=false;
  begin insert into public.vagas(user_id,empresa_id,cargo,status) values(uid,eid,'__TEST_PLAN_ROLLBACK__','pendente');
  exception when insufficient_privilege then denied:=true; end;
  assert denied,'publication limit must reject one extra job';
  foreach service in array array['destaque','urgente','confidencial'] loop
   for i in 1..(limits->>service)::integer loop
    execute format('update public.vagas set %I=true where id=$1',service) using ids[i];
   end loop;
   balance:=public.em_plan_balance();assert (balance->'servicos'->service->>'disponiveis')::integer=0,'monthly benefit exhaustion';
   if (limits->>service)::integer>0 then
    execute format('update public.vagas set %I=false where id=$1',service) using ids[1];
   end if;
   denied:=false;
   begin execute format('update public.vagas set %I=true where id=$1',service) using ids[1];
   exception when insufficient_privilege then denied:=true; end;
   assert denied,'turning off a benefit must not refund a monthly activation';
  end loop;
  req:=public.solicitar_servico_vaga(ids[cap],'confidencial');repeated:=public.solicitar_servico_vaga(ids[cap],'confidencial');
  assert req.id=repeated.id,'duplicate clicks must reuse the same pending request';
  assert req.valor=17.90 and req.dias=15 and req.status='aguardando_pagamento','confidential purchase terms';
  assert not(select confidencial from public.vagas where id=ids[cap]),'unpaid requests cannot activate a feature';
  quote:=public.solicitar_plano('empresa',plan,'pix');assert quote.valor=(limits->>'preco')::numeric,'approved plan price';
  delete from public.solicitacoes_extras where vaga_id=any(ids);
  delete from private.em_service_activations where vaga_id=any(ids);
  delete from public.vagas where id=any(ids);
 end loop;
 perform set_config('request.jwt.claim.sub','',true);denied:=false;
 begin perform public.em_plan_balance();exception when insufficient_privilege then denied:=true;end;
 assert denied,'signed-out requests must be rejected';
end $$;
rollback;

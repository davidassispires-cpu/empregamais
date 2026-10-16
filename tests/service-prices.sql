-- All fixtures and purchase requests are rolled back. No payment is created.
begin;
do $$
declare owner_id uuid; company_id uuid; fixture uuid; service text; expected numeric;
 request public.solicitacoes_extras; repeated public.solicitacoes_extras; denied boolean;
begin
 select e.id,e.user_id into company_id,owner_id from public.empresas e
 where e.user_id is not null and not coalesce(e.suspensa_admin,false)
 and not exists(select 1 from public.admins a where a.user_id=e.user_id)
 order by e.criado_em limit 1;
 if owner_id is null then raise exception 'No company account available for transactional pricing checks.'; end if;
 perform set_config('request.jwt.claim.sub','',true);
 insert into public.vagas(user_id,empresa_id,cargo,status)
 values(owner_id,company_id,'__SERVICE_PRICE_ROLLBACK__','pendente') returning id into fixture;
 perform set_config('request.jwt.claim.sub',owner_id::text,true);
 insert into public.solicitacoes_extras(vaga_id,tipo,valor,dias,status)
 values(fixture,'destaque',0.01,1,'aguardando_pagamento') returning * into request;
 assert request.valor=29.90 and request.dias=15,'trigger rejects browser-provided prices and duration';
 foreach service in array array['destaque','urgente','confidencial'] loop
  expected:=case service when 'destaque' then 29.90 when 'urgente' then 19.90 else 17.90 end;
  request:=public.solicitar_servico_vaga(fixture,service);
  repeated:=public.solicitar_servico_vaga(fixture,service);
  assert request.valor=expected,'canonical service price';
  assert request.dias=case service when 'urgente' then 7 else 15 end,'service duration';
  assert request.id=repeated.id,'duplicate requests remain idempotent';
  assert request.status='aguardando_pagamento','request awaits confirmation';
  assert request.user_id=owner_id and request.empresa_id=company_id,'request ownership';
 end loop;
 request:=public.solicitar_servico_vaga(fixture,'urgencia');
 assert request.valor=19.90,'urgency alias uses the same price';
 assert (select count(*)=3 from public.solicitacoes_extras where vaga_id=fixture),'alias reuses the pending request';
 -- Existing pending quotes retain their agreed price and must not collide with the unique index.
 update public.solicitacoes_extras set valor=9.90 where vaga_id=fixture and tipo='destaque';
 request:=public.solicitar_servico_vaga(fixture,'destaque');
 assert request.valor=9.90,'previous pending quotes are preserved';
 assert (select count(*)=3 from public.solicitacoes_extras where vaga_id=fixture),'old quote does not create duplicates';
 assert not exists(select 1 from public.vagas where id=fixture and (destaque or urgente or confidencial)),'requests do not activate unpaid services';
 perform set_config('request.jwt.claim.sub','',true);denied:=false;
 begin perform public.solicitar_servico_vaga(fixture,'destaque');exception when insufficient_privilege then denied:=true;end;
 assert denied,'signed-out requests remain blocked';
end $$;
rollback;
select 'PASS: prices, durations, idempotency, ownership, server price enforcement and payment gating.' as result;

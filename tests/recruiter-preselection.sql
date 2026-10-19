-- Private preselection integration checks. Every fixture is rolled back.
begin;
do $$
declare company public.empresas%rowtype; outsider uuid; reference text='__QA_PRIVATE_PRESELECTION_ROLLBACK__'; row_data public.em_recruiter_state%rowtype; denied boolean;
begin
 select * into company from public.empresas where user_id is not null and not coalesce(suspensa_admin,false)
  and length(regexp_replace(cnpj,'[^0-9]','','g'))=14 order by criado_em limit 1;
 select c.user_id into outsider from public.candidatos c where c.user_id<>company.user_id order by c.criado_em limit 1;
 assert company.id is not null and outsider is not null,'Independent recruiter and candidate accounts required';
 assert not exists(select 1 from public.em_recruiter_state where empresa_id=company.id and application_ref=reference),'Fixture reference must be unused';
 insert into public.em_recruiter_state(empresa_id,application_ref,job_ref,state,status_updated_at)
 values(company.id,reference,'__QA_JOB__',jsonb_build_object('status','Em avaliação','favoritoRecrutador',true,'observacaoRecrutador','PRIVATE_QA_NOTE'),'2020-01-01T00:00:00Z');
 execute 'set local role authenticated';
 perform set_config('request.jwt.claim.sub',company.user_id::text,true);
 perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object('application_ref',reference,'job_ref','__QA_JOB__','state',jsonb_build_object('preSelecionadoRecrutador',true))));
 select * into row_data from public.em_recruiter_state where application_ref=reference;
 assert row_data.state->'preSelecionadoRecrutador'='true'::jsonb,'The company can persist private preselection';
 assert row_data.state->>'status'='Em avaliação' and row_data.status_updated_at='2020-01-01T00:00:00Z'::timestamptz,'Preselection cannot change the public stage or its date';
 assert row_data.state->'favoritoRecrutador'='true'::jsonb and row_data.state->>'observacaoRecrutador'='PRIVATE_QA_NOTE','Other private state is preserved';
 perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object('application_ref',reference,'job_ref','__QA_JOB__','state',jsonb_build_object('preSelecionadoRecrutador',false))));
 select * into row_data from public.em_recruiter_state where application_ref=reference;
 assert row_data.state->'preSelecionadoRecrutador'='false'::jsonb,'The company can remove preselection';
 denied=false;
 begin
  perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object('application_ref',reference,'job_ref','__QA_JOB__','state',jsonb_build_object('preSelecionadoRecrutador','true'))));
 exception when others then denied=true; end;
 assert denied,'The flag must be a JSON boolean';
 denied=false;
 begin
  perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object('application_ref',reference,'job_ref','__WRONG_JOB__','state',jsonb_build_object('preSelecionadoRecrutador',true))));
 exception when others then denied=true; end;
 assert denied,'An application cannot be marked through another job';
 perform set_config('request.jwt.claim.sub',outsider::text,true);
 assert not exists(select 1 from public.em_recruiter_state where application_ref=reference),'Candidates cannot read the internal state';
 assert not exists(select 1 from public.em_candidate_application_stages_v2() r where to_jsonb(r) ? 'preSelecionadoRecrutador' or to_jsonb(r) ? 'state'),'The candidate endpoint never returns private preselection';
 denied=false;
 begin perform public.em_sync_recruiter_state(company.cnpj,'[]');exception when others then denied=true;end;
 assert denied,'A different account cannot access company preselection';
 assert not has_function_privilege('anon','public.em_sync_recruiter_state(text,jsonb)','execute'),'Anonymous recruiter-state access stays revoked';
 execute 'reset role';
end $$;
rollback;
select 'PASS: private selection saves and clears, public stage is preserved, invalid values and cross-account reads are denied; fixtures rolled back' as result;

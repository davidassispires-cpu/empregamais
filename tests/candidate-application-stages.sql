-- Integration check. All test changes, including recruiter state, are rolled back.
begin;
do $$
declare company public.empresas%rowtype; candidate uuid; candidate_email text; outsider uuid;
 reference text='__TEST_CANDIDATE_STAGE_ROLLBACK__'; stage text; row_data jsonb; denied boolean;
begin
 select c.user_id,u.email into candidate,candidate_email from public.candidatos c join auth.users u on u.id=c.user_id order by c.criado_em limit 1;
 select * into company from public.empresas where user_id is not null and user_id<>candidate
  and not coalesce(suspensa_admin,false) and length(regexp_replace(cnpj,'[^0-9]','','g'))=14 order by criado_em limit 1;
 select id into outsider from auth.users where id<>candidate and id<>company.user_id order by created_at limit 1;
 outsider=coalesce(outsider,company.user_id);
 assert candidate is not null and company.id is not null,'Independent company and candidate accounts required';
 execute 'set local role authenticated';
 perform set_config('request.jwt.claim.sub',company.user_id::text,true);
 foreach stage in array array['Em avaliação','Em contato','Entrevista agendada','Aprovado','Contratado','Reprovado'] loop
  perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object(
   'application_ref',reference,'job_ref','__TEST_JOB__','candidate_email',candidate_email,'job_title','Vaga de teste',
   'state',jsonb_build_object('status',stage,'observacaoRecrutador','INTERNAL_TEST_NOTE','favoritoRecrutador',true))));
  perform set_config('request.jwt.claim.sub',candidate::text,true);
  select to_jsonb(r) into row_data from public.em_candidate_application_stages() r where application_ref=reference;
  assert row_data->>'status'=stage,'Candidate must receive the exact saved recruiter stage';
  assert row_data->>'job_title'='Vaga de teste','Remote application title';
  assert not(row_data ? 'state' or row_data ? 'observacaoRecrutador' or row_data ? 'favoritoRecrutador'),'Internal recruiter data must not be exposed';
  perform set_config('request.jwt.claim.sub',company.user_id::text,true);
 end loop;
 denied=false;
 begin
  perform public.em_sync_recruiter_state(company.cnpj,jsonb_build_array(jsonb_build_object('application_ref',reference,'job_ref','__WRONG_JOB__','candidate_email',candidate_email,'state',jsonb_build_object('status','Aprovado'))));
 exception when others then denied=true; end;
 assert denied,'An existing application cannot be moved to another job';
 perform set_config('request.jwt.claim.sub',outsider::text,true);
 assert not exists(select 1 from public.em_candidate_application_stages() where application_ref=reference),'Another account cannot read the candidate stage';
 perform set_config('request.jwt.claim.sub','',true);denied=false;
 begin perform public.em_candidate_application_stages();exception when insufficient_privilege then denied=true;end;
 assert denied,'Signed-out stage reads must fail';
 assert not has_function_privilege('anon','public.em_candidate_application_stages()','execute'),'Anonymous RPC access must be revoked';
 assert not has_function_privilege('anon','private.em_candidate_application_stages()','execute'),'Anonymous internal function access must be revoked';
 execute 'reset role';
end $$;
rollback;

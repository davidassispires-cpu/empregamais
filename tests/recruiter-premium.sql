-- Transactional integration checks. Nothing is delivered or persisted.
begin;
do $test$
<<fixtures>>
declare
  owner_uid uuid:=gen_random_uuid(); candidate_uid uuid:=gen_random_uuid(); outsider_uid uuid:=gen_random_uuid();
  company_id uuid:=gen_random_uuid(); other_company uuid:=gen_random_uuid();
  job_id uuid:=gen_random_uuid(); other_job uuid:=gen_random_uuid();
  interview_id uuid:=gen_random_uuid(); future_interview uuid:=gen_random_uuid();
  cancelled_interview uuid:=gen_random_uuid();
  app_ref text:='premium-verification-'||gen_random_uuid()::text;
  company_cnpj text; other_cnpj text;
  rule public.em_recruiter_message_rules; saved public.em_interview_scorecards;
  specific public.em_recruiter_message_rules; current_time timestamptz;
  msg public.em_candidate_messages; n integer; total integer:=0; blocked boolean;
  ratings jsonb:='{"technical":4,"experience":3,"communication":5,"problem_solving":2}';
begin
  insert into auth.users(id,email,role,aud,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
    select uid,'premium-check-'||uid::text||'@example.test','authenticated','authenticated',now(),'{}','{}',now(),now()
    from unnest(array[owner_uid,candidate_uid,outsider_uid]) uid;
  insert into public.candidatos(user_id,nome,email)
    values(candidate_uid,'Candidato de verificação','premium-check-'||candidate_uid::text||'@example.test');
  company_cnpj:=lpad(floor(random()*99999999999999)::bigint::text,14,'0');
  other_cnpj:=lpad(floor(random()*99999999999999)::bigint::text,14,'0');
  insert into public.empresas(id,user_id,cnpj,nome,plano,plano_id,plano_valido_ate)
    values(company_id,owner_uid,company_cnpj,'Verificação Premium','anual','anual',now()+interval '30 days'),
      (other_company,outsider_uid,other_cnpj,'Outra empresa de verificação','anual','anual',now()+interval '30 days');
  insert into public.vagas(id,user_id,empresa_id,cargo,status)
    values(job_id,owner_uid,company_id,'Vaga de verificação','aprovada'),
      (other_job,outsider_uid,other_company,'Outra vaga','aprovada');
  insert into public.candidaturas(id,vaga_id,candidato_user_id,empresa_user_id,candidato_nome,candidato_email)
    values(app_ref,job_id::text,candidate_uid,owner_uid,'Nome na candidatura','verification@example.test');
  insert into public.em_recruiter_state(empresa_id,application_ref,job_ref,state,candidate_uid,job_title)
    values(company_id,app_ref,job_id::text,'{"status":"Em avaliação"}',candidate_uid,'Vaga de verificação');
  insert into public.em_interviews(id,empresa_id,recruiter_uid,candidate_uid,application_ref,job_ref,job_title,company_name,candidate_name,scheduled_at,duration_minutes,state)
    values(interview_id,company_id,owner_uid,candidate_uid,app_ref,job_id::text,'Vaga de verificação','Verificação Premium','Candidato de verificação',now()-interval '2 hours',30,'completed'),
      (future_interview,company_id,owner_uid,candidate_uid,app_ref,job_id::text,'Vaga de verificação','Verificação Premium','Candidato de verificação',now()+interval '2 hours',30,'invited'),
      (cancelled_interview,company_id,owner_uid,candidate_uid,app_ref,job_id::text,'Vaga de verificação','Verificação Premium','Candidato de verificação',now()-interval '2 hours',30,'cancelled');

  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  execute 'set local role authenticated';
  select * into rule from public.em_save_recruiter_message_rule(company_id,'','contato','Olá {candidato}! {empresa}: {vaga} · {etapa}',false,null);
  if rule.enabled or rule.empresa_id<>company_id then raise exception 'Default disabled rule failed'; end if;total:=total+1;
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em contato"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>0 then raise exception 'Disabled rule sent a message'; end if;total:=total+1;

  select * into rule from public.em_save_recruiter_message_rule(company_id,'','contato',rule.template,true,rule.updated_at);
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>0 then raise exception 'Saving a rule sent retroactive messages'; end if;total:=total+1;
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em avaliação"}'::jsonb)));
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em contato"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>1 then raise exception 'Legacy stage transition failed'; end if;total:=total+1;
  select * into msg from public.em_candidate_messages where empresa_id=company_id;
  if msg.candidate_uid<>candidate_uid or msg.job_ref<>job_id::text or msg.body like '%{%' or msg.candidate_read_at is not null or msg.state<>'sent' then raise exception 'Message identity, template or notification invalid'; end if;total:=total+1;
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"observacaoRecrutador":"Somente uma observação"}'::jsonb)));
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em avaliação"}'::jsonb)));
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em contato"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>1 then raise exception 'Duplicate stage notification'; end if;total:=total+1;
  update public.candidaturas set status='Em contato' where id=app_ref;
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>1 then raise exception 'Native and legacy paths duplicated a message'; end if;total:=total+1;

  perform public.em_save_recruiter_message_rule(company_id,'','aprovadas','Geral {vaga}',true,null);
  select * into specific from public.em_save_recruiter_message_rule(company_id,job_id::text,'aprovadas','Específica {vaga}',false,null);
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Aprovado"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>1 then raise exception 'Disabled job-specific override ignored'; end if;total:=total+1;
  select * into specific from public.em_save_recruiter_message_rule(company_id,job_id::text,'aprovadas',specific.template,true,specific.updated_at);
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Em avaliação"}'::jsonb)));
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Aprovado"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id and body='Específica Vaga de verificação';
  if n<>1 then raise exception 'Job-specific override failed'; end if;total:=total+1;
  perform public.em_save_recruiter_message_rule(company_id,'','reprovadas','Agradecemos sua participação, {candidato}.',true,null);

  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,other_job::text,'entrevista','Mensagem',true,null);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Foreign job accepted'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(other_company,'','contato','Mensagem',true,null);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Foreign company accepted'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,'','contato','Sobrescrever',true,null);
  exception when serialization_failure then blocked:=true;end;
  if not blocked then raise exception 'Rule lost-update protection failed'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,'','entrevista','Olá {email}',true,null);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Invalid template accepted'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,'','canceladas','Olá',true,null);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Withdrawal used as a recruiting message stage'; end if;total:=total+1;

  select * into saved from public.em_save_interview_scorecard(interview_id,ratings,'avancar','Exemplos observados na entrevista.',null);
  if saved.reviewer_uid<>owner_uid or saved.empresa_id<>company_id or saved.technical_score<>4 or saved.problem_solving_score<>2 then raise exception 'Scorecard write failed'; end if;total:=total+1;
  select count(*) into n from public.em_interview_scorecards where empresa_id=company_id;
  if n<>1 then raise exception 'Company cannot read own scorecard'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(interview_id,ratings,'avancar','Sobrescrever',null);
  exception when serialization_failure then blocked:=true;end;
  if not blocked then raise exception 'Scorecard lost-update protection failed'; end if;total:=total+1;
  select * into saved from public.em_save_interview_scorecard(interview_id,ratings,'manter','Nova evidência.',saved.updated_at);
  if saved.recommendation<>'manter' or saved.evidence<>'Nova evidência.' then raise exception 'Scorecard update failed'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(interview_id,ratings||'{"technical":6}','avancar','',saved.updated_at);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Out-of-range score accepted'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(interview_id,'{"technical":3}','avancar','',saved.updated_at);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Incomplete scorecard accepted'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(future_interview,ratings,'avancar','',null);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Future interview scored'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(cancelled_interview,ratings,'avancar','',null);
  exception when raise_exception then blocked:=true;end;
  if not blocked then raise exception 'Cancelled interview scored'; end if;total:=total+1;
  blocked:=false;begin
    update public.em_interview_scorecards sc set technical_score=5 where sc.interview_id=fixtures.interview_id;
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Direct scorecard write accepted'; end if;total:=total+1;

  execute 'reset role';
  update public.empresas set plano_valido_ate=now()-interval '1 second' where id=company_id;
  execute 'set local role authenticated';
  perform 1 from public.em_sync_recruiter_state(company_cnpj,jsonb_build_array(jsonb_build_object('application_ref',app_ref,'job_ref',job_id::text,'candidate_email','premium-check-'||candidate_uid::text||'@example.test','job_title','Vaga de verificação','state','{"status":"Reprovado"}'::jsonb)));
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>2 then raise exception 'Expired Premium sent an automatic message'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(interview_id,ratings,'avancar','',saved.updated_at);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Expired Premium saved a scorecard'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,'','entrevista','Olá',true,null);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Expired Premium saved a message rule'; end if;total:=total+1;
  execute 'reset role';
  update public.empresas set plano_valido_ate=now()+interval '30 days' where id=company_id;

  perform set_config('request.jwt.claim.sub',candidate_uid::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.em_interview_scorecards where empresa_id=company_id;
  if n<>0 then raise exception 'Candidate reads internal scorecard'; end if;total:=total+1;
  select count(*) into n from public.em_recruiter_message_rules where empresa_id=company_id;
  if n<>0 then raise exception 'Candidate reads private rules'; end if;total:=total+1;
  select count(*) into n from public.em_conversation_events ev where ev.empresa_id=company_id and ev.candidate_uid=fixtures.candidate_uid;
  if n<>2 then raise exception 'Candidate inbox did not receive automatic messages'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_interview_scorecard(interview_id,ratings,'avancar','',saved.updated_at);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Candidate writes internal scorecard'; end if;total:=total+1;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub',outsider_uid::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.em_candidate_messages where empresa_id=company_id;
  if n<>0 then raise exception 'Outsider reads automatic messages'; end if;total:=total+1;
  blocked:=false;begin
    perform public.em_save_recruiter_message_rule(company_id,'','contato','Olá',true,null);
  exception when insufficient_privilege then blocked:=true;end;
  if not blocked then raise exception 'Outsider writes rules'; end if;total:=total+1;
  execute 'reset role';
  insert into public.empresa_usuarios(empresa_id,user_id,nome,email,papel,ativo)
    values(company_id,outsider_uid,'Recrutador de verificação','verification@example.test','recrutador',true);
  execute 'set local role authenticated';
  select count(*) into n from public.em_interview_scorecards where empresa_id=company_id;
  if n<>1 then raise exception 'Active company team member cannot read scorecard'; end if;total:=total+1;
  select * into saved from public.em_save_interview_scorecard(interview_id,ratings,'avancar','Análise da equipe.',saved.updated_at);
  if saved.reviewer_uid<>outsider_uid then raise exception 'Team scorecard write not attributed'; end if;total:=total+1;
  execute 'reset role';
  update public.empresa_usuarios set ativo=false where empresa_id=company_id and user_id=outsider_uid;
  execute 'set local role authenticated';
  select count(*) into n from public.em_interview_scorecards where empresa_id=company_id;
  if n<>0 then raise exception 'Inactive team member reads scorecard'; end if;total:=total+1;
  execute 'reset role';

  if has_table_privilege('anon','public.em_interview_scorecards','select')
    or has_function_privilege('anon','public.em_save_interview_scorecard(uuid,jsonb,text,text,timestamptz)','execute')
    or has_function_privilege('authenticated','private.em_send_recruiter_stage_message(uuid,text,text,uuid,text,text)','execute') then
    raise exception 'Anonymous or privileged helper access leaked';
  end if;total:=total+1;
  if total<>36 then raise exception 'Expected 36 checks, got %',total;end if;
end $test$;
rollback;
select '36 Premium database checks passed. All fixtures and messages were rolled back.' as validation;

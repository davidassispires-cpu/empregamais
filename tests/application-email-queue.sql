begin;
do $test$
declare j public.vagas%rowtype; candidate uuid; ref text:='__email_test__'||gen_random_uuid()::text; n integer;
begin
 select * into j from public.vagas where empresa_id is not null and user_id is not null order by criado_em desc limit 1;
 select user_id into candidate from public.candidatos where user_id is not null limit 1;
 if j.id is null or candidate is null then raise exception 'Missing test fixtures'; end if;
 insert into public.candidaturas(id,vaga_id,candidato_user_id,empresa_user_id,candidato_nome,candidato_email,status,curriculo)
 values(ref,j.id::text,candidate,j.user_id,'Teste de infraestrutura','teste@example.invalid','Em avaliação','{}');
 select count(*) into n from private.em_application_email_outbox where application_id=ref and state='blocked_setup' and attempts=0 and sent_at is null;
 if n<>1 then raise exception 'Event was not blocked exactly once'; end if;
 update public.candidaturas set atualizado_em=now() where id=ref;
 select count(*) into n from private.em_application_email_outbox where application_id=ref;
 if n<>1 then raise exception 'Duplicate event'; end if;
 if has_table_privilege('anon','private.em_application_email_outbox','SELECT') or has_table_privilege('authenticated','private.em_application_email_outbox','SELECT') then raise exception 'Outbox exposed'; end if;
end $test$;
select 'passed: blocked queue, one event, no email, private access; transaction rolled back' result;
rollback;
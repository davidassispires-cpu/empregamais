alter table public.candidaturas drop constraint candidaturas_status_check;
alter table public.candidaturas add constraint candidaturas_status_check check(status in ('Em avaliação','Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado','Reprovado','Cancelada pelo candidato'));
create or replace function private.em_preserve_withdrawal() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_table_name='candidaturas' then
  if old.status='Cancelada pelo candidato' then new.status=old.status; end if;
 else
  if old.state->>'status'='Cancelada pelo candidato' then new.state=new.state||jsonb_build_object('status','Cancelada pelo candidato'); end if;
 end if;
 return new;
end $$;
create trigger em_preserve_withdrawal before update on public.candidaturas for each row execute function private.em_preserve_withdrawal();
create trigger em_preserve_withdrawal before update on public.em_recruiter_state for each row execute function private.em_preserve_withdrawal();
create or replace function private.em_cancel_candidate_application(p_application_ref text,p_job_ref text) returns jsonb language plpgsql security definer set search_path='' as $$
declare c public.candidaturas; r public.em_recruiter_state; current_status text; found_c boolean;
begin
 if auth.uid() is null then raise exception 'Entre novamente na sua conta.' using errcode='42501'; end if;
 select * into c from public.candidaturas where id=p_application_ref and vaga_id=p_job_ref and candidato_user_id=auth.uid() for update;
 found_c=found;
 select * into r from public.em_recruiter_state where application_ref=p_application_ref and job_ref=p_job_ref and candidate_uid=auth.uid() for update;
 if not found_c and not found then raise exception 'Candidatura não encontrada para sua conta.' using errcode='42501'; end if;
 current_status=coalesce(r.state->>'status',c.status);
 if current_status='Cancelada pelo candidato' then return jsonb_build_object('status',current_status); end if;
 if current_status in ('Contratado','Reprovado') then raise exception 'Este processo já foi encerrado.'; end if;
 update public.candidaturas set status='Cancelada pelo candidato',atualizado_em=now(),historico=coalesce(historico,'[]'::jsonb)||jsonb_build_array(jsonb_build_object('status','Cancelada pelo candidato','data',now())) where id=p_application_ref and vaga_id=p_job_ref and candidato_user_id=auth.uid();
 update public.em_recruiter_state set state=state||jsonb_build_object('status','Cancelada pelo candidato','canceladoEm',now()),updated_at=now(),status_updated_at=now() where application_ref=p_application_ref and job_ref=p_job_ref and candidate_uid=auth.uid();
 update public.em_interviews set state='cancelled',candidate_reply='Candidatura cancelada pelo candidato.',updated_at=now() where application_ref=p_application_ref and job_ref=p_job_ref and candidate_uid=auth.uid() and state in ('invited','confirmed','reschedule_requested');
 return jsonb_build_object('status','Cancelada pelo candidato','canceladoEm',now());
end $$;
revoke all on function private.em_cancel_candidate_application(text,text) from public,anon;
grant execute on function private.em_cancel_candidate_application(text,text) to authenticated;
create or replace function public.em_cancel_candidate_application(p_application_ref text,p_job_ref text) returns jsonb language sql security invoker set search_path='' as $$ select private.em_cancel_candidate_application(p_application_ref,p_job_ref); $$;
revoke all on function public.em_cancel_candidate_application(text,text) from public,anon;
grant execute on function public.em_cancel_candidate_application(text,text) to authenticated;
notify pgrst,'reload schema';

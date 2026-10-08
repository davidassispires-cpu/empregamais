
create table public.em_candidate_messages (
 id uuid primary key,
 empresa_id uuid not null references public.empresas(id) on delete cascade,
 sender_uid uuid not null references auth.users(id),
 candidate_uid uuid references auth.users(id),
 candidate_email text not null,
 company_name text not null,
 job_ref text not null,
 job_title text not null,
 body text not null check (char_length(body) between 1 and 10000),
 state text not null check(state in ('draft','sent')),
 created_at timestamptz not null default now(),
 sent_at timestamptz,
 check ((state='draft' and sent_at is null) or (state='sent' and candidate_uid is not null and sent_at is not null))
);
create index em_candidate_messages_recipient on public.em_candidate_messages(candidate_uid,sent_at desc) where state='sent';
create index em_candidate_messages_sender on public.em_candidate_messages(sender_uid,job_ref,candidate_email);
alter table public.em_candidate_messages enable row level security;
revoke all on public.em_candidate_messages from anon,authenticated;
grant select on public.em_candidate_messages to authenticated;
create policy "recipient reads delivered messages" on public.em_candidate_messages for select to authenticated using(state='sent' and candidate_uid=(select auth.uid()));
create policy "company reads its messages" on public.em_candidate_messages for select to authenticated using(private.usuario_pertence_empresa(empresa_id) and (state='sent' or sender_uid=(select auth.uid())));
create function private.em_write_candidate_message(p_id uuid,p_company_cnpj text,p_email text,p_job_ref text,p_job_title text,p_body text,p_send boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare e public.empresas%rowtype; recipient uuid; existing public.em_candidate_messages%rowtype;
begin
 if auth.uid() is null then raise exception 'Entre novamente na sua conta.'; end if;
 select * into e from public.empresas where regexp_replace(cnpj,'[^0-9]','','g')=regexp_replace(p_company_cnpj,'[^0-9]','','g') and private.usuario_pertence_empresa(id) limit 1;
 if e.id is null or coalesce(e.suspensa_admin,false) then raise exception 'Empresa sem autorização para enviar mensagens.'; end if;
 if p_id is null or length(trim(coalesce(p_body,''))) not between 1 and 10000 or length(coalesce(p_job_ref,'')) not between 1 and 200 or length(coalesce(p_job_title,''))>300 or length(coalesce(p_email,'')) not between 3 and 320 then raise exception 'Preencha uma mensagem válida de até 10.000 caracteres.'; end if;
 select user_id into recipient from public.candidatos where lower(email)=lower(trim(p_email)) and user_id is not null limit 1;
 if p_send and recipient is null then raise exception 'O candidato precisa ter uma conta no EmpregaMais para receber mensagens internas. O texto pode ser salvo como rascunho.'; end if;
 select * into existing from public.em_candidate_messages where id=p_id for update;
 if existing.id is not null then
   if existing.sender_uid<>auth.uid() or existing.empresa_id<>e.id or existing.candidate_email<>lower(trim(p_email)) or existing.job_ref<>p_job_ref then raise exception 'Mensagem pertence a outro processo.'; end if;
   if existing.state='sent' then
     if p_send and existing.body=trim(p_body) then return existing.id; end if;
     raise exception 'Uma mensagem enviada não pode ser alterada.';
   end if;
   update public.em_candidate_messages set body=trim(p_body),state=case when p_send then 'sent' else 'draft' end,candidate_uid=recipient,sent_at=case when p_send then now() else null end where id=p_id;
 else
   insert into public.em_candidate_messages(id,empresa_id,sender_uid,candidate_uid,candidate_email,company_name,job_ref,job_title,body,state,sent_at)
   values(p_id,e.id,auth.uid(),recipient,lower(trim(p_email)),coalesce(nullif(e.nome_fantasia,''),nullif(e.nome,''),e.razao_social,'Empresa'),p_job_ref,p_job_title,trim(p_body),case when p_send then 'sent' else 'draft' end,case when p_send then now() else null end);
 end if;
 return p_id;
end $$;
revoke all on function private.em_write_candidate_message(uuid,text,text,text,text,text,boolean) from public,anon;
grant execute on function private.em_write_candidate_message(uuid,text,text,text,text,text,boolean) to authenticated;
create function public.em_write_candidate_message(p_id uuid,p_company_cnpj text,p_email text,p_job_ref text,p_job_title text,p_body text,p_send boolean)
returns uuid language sql security invoker set search_path='' as $$
 select private.em_write_candidate_message(p_id,p_company_cnpj,p_email,p_job_ref,p_job_title,p_body,p_send);
$$;
revoke all on function public.em_write_candidate_message(uuid,text,text,text,text,text,boolean) from public,anon;
grant execute on function public.em_write_candidate_message(uuid,text,text,text,text,text,boolean) to authenticated;

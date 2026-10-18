-- Read receipts are the only client-editable attributes of delivered messages.
alter table public.em_candidate_messages add column if not exists candidate_read_at timestamptz;
alter table public.em_candidate_message_replies add column if not exists company_read_at timestamptz;

grant update(candidate_read_at) on public.em_candidate_messages to authenticated;
grant update(company_read_at) on public.em_candidate_message_replies to authenticated;
grant insert(id) on public.em_candidate_message_replies to authenticated;

create policy "candidate marks received messages read"
on public.em_candidate_messages for update to authenticated
using (state='sent' and candidate_uid=(select auth.uid()))
with check (state='sent' and candidate_uid=(select auth.uid()));

create policy "company marks received replies read"
on public.em_candidate_message_replies for update to authenticated
using (exists (
 select 1 from public.em_candidate_messages m
 where m.id=message_id and m.state='sent' and private.usuario_pertence_empresa(m.empresa_id)
))
with check (exists (
 select 1 from public.em_candidate_messages m
 where m.id=message_id and m.state='sent' and private.usuario_pertence_empresa(m.empresa_id)
));

create index if not exists em_candidate_messages_unread
on public.em_candidate_messages(candidate_uid,sent_at desc)
where state='sent' and candidate_read_at is null;
create index if not exists em_candidate_messages_company_sent
on public.em_candidate_messages(empresa_id,sent_at desc) where state='sent';
create index if not exists em_candidate_replies_unread
on public.em_candidate_message_replies(message_id,created_at desc)
where company_read_at is null;

-- Invoker security preserves the existing participant policies on both base tables.
create or replace view public.em_conversation_events with (security_invoker=true) as
select 'm:'||m.id::text as event_id, m.id as record_id, m.id as message_id,
 'company'::text as sender_role, m.candidate_uid, m.empresa_id,
 m.candidate_email, m.company_name, m.job_ref, m.job_title,
 m.body, m.sent_at as created_at, m.candidate_read_at as read_at
from public.em_candidate_messages m where m.state='sent'
union all
select 'r:'||r.id::text, r.id, m.id, 'candidate'::text, m.candidate_uid, m.empresa_id,
 m.candidate_email, m.company_name, m.job_ref, m.job_title,
 r.body, r.created_at, r.company_read_at
from public.em_candidate_message_replies r
join public.em_candidate_messages m on m.id=r.message_id where m.state='sent';
revoke all on public.em_conversation_events from public,anon;
grant select on public.em_conversation_events to authenticated;

do $$
begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='em_candidate_messages') then
   alter publication supabase_realtime add table public.em_candidate_messages;
  end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='em_candidate_message_replies') then
   alter publication supabase_realtime add table public.em_candidate_message_replies;
  end if;
 end if;
end $$;
notify pgrst,'reload schema';

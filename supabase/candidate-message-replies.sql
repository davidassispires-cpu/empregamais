create table public.em_candidate_message_replies(
 id uuid primary key default gen_random_uuid(),
 message_id uuid not null references public.em_candidate_messages(id) on delete cascade,
 candidate_uid uuid not null default auth.uid() references auth.users(id),
 body text not null check(char_length(trim(body)) between 1 and 10000),
 created_at timestamptz not null default now()
);
create index em_candidate_message_replies_thread on public.em_candidate_message_replies(message_id,created_at);
create index em_candidate_message_replies_owner on public.em_candidate_message_replies(candidate_uid);
alter table public.em_candidate_message_replies enable row level security;
revoke all on public.em_candidate_message_replies from anon,authenticated;
grant select on public.em_candidate_message_replies to authenticated;
grant insert(message_id,body) on public.em_candidate_message_replies to authenticated;
create policy "candidate replies to received messages" on public.em_candidate_message_replies for insert to authenticated with check(
 candidate_uid=(select auth.uid()) and exists(select 1 from public.em_candidate_messages m where m.id=message_id and m.state='sent' and m.candidate_uid=(select auth.uid()))
);
create policy "conversation participants read replies" on public.em_candidate_message_replies for select to authenticated using(
 exists(select 1 from public.em_candidate_messages m where m.id=message_id and m.state='sent' and (m.candidate_uid=(select auth.uid()) or private.usuario_pertence_empresa(m.empresa_id)))
);
notify pgrst,'reload schema';
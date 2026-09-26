-- EmpregaMais Web Push
create table if not exists public.push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 endpoint text not null,p256dh text not null,auth text not null,user_agent text,
 enabled boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.push_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled boolean not null default true,vagas_compativeis boolean not null default true,
 processo_seletivo boolean not null default true,mensagens boolean not null default true,updated_at timestamptz not null default now()
);
create unique index if not exists push_subscriptions_user_endpoint_uidx on public.push_subscriptions(user_id,endpoint);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
alter table public.push_subscriptions enable row level security;
alter table public.push_preferences enable row level security;
drop policy if exists "push subscriptions own rows" on public.push_subscriptions;
create policy "push subscriptions own rows" on public.push_subscriptions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "push preferences own rows" on public.push_preferences;
create policy "push preferences own rows" on public.push_preferences for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create or replace function public.push_touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists push_subscriptions_touch on public.push_subscriptions;
create trigger push_subscriptions_touch before update on public.push_subscriptions for each row execute function public.push_touch_updated_at();
drop trigger if exists push_preferences_touch on public.push_preferences;
create trigger push_preferences_touch before update on public.push_preferences for each row execute function public.push_touch_updated_at();
-- KeyDate — feature demand signals
-- Run once in the Supabase SQL editor. Lets the app record "I want this feature"
-- votes (e.g. real bank sync) so build decisions are driven by measured demand
-- instead of guesswork. Idempotent.

create table if not exists public.feature_interest (
  id         uuid primary key default gen_random_uuid(),
  feature    text not null,
  user_id    uuid references auth.users(id) on delete set null,
  device_id  text,
  note       text,
  created_at timestamptz not null default now()
);

-- One vote per person (or per device for guests) per feature.
create unique index if not exists feature_interest_user_key
  on public.feature_interest (feature, user_id) where user_id is not null;
create unique index if not exists feature_interest_device_key
  on public.feature_interest (feature, device_id) where user_id is null;

alter table public.feature_interest enable row level security;

-- Anyone using the app may register interest; nobody can read the raw list.
drop policy if exists "interest_insert" on public.feature_interest;
create policy "interest_insert" on public.feature_interest for insert to anon, authenticated
  with check (char_length(feature) between 1 and 64);

-- Admin-only read of the raw rows.
-- ► Change the email if you use a different admin address.
drop policy if exists "interest_admin_read" on public.feature_interest;
create policy "interest_admin_read" on public.feature_interest for select to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

-- Public tally so the admin console (and the app, if wanted) can show counts
-- without exposing who voted.
create or replace function public.feature_interest_counts()
returns json language sql security definer stable set search_path = public as $$
  select coalesce(json_object_agg(feature, n), '{}'::json)
  from (select feature, count(*)::int as n from public.feature_interest group by feature) t;
$$;
grant execute on function public.feature_interest_counts() to anon, authenticated;

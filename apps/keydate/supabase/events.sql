-- KeyDate — product analytics events
-- Run once in the Supabase SQL editor. Idempotent.
--
-- Why this exists: the app's promise is a date that moves as you save, which
-- only works if people come back and log. Without funnel data you cannot tell
-- "nobody finished onboarding" from "everyone finished and never returned" —
-- and those need opposite fixes. Events not captured during the beta are gone
-- for good, so this goes in before the doors open, not after.
--
-- Deliberately not a general tracker: a fixed vocabulary of product events, no
-- free-form payloads, no PII, no third party. Rows are write-only from the
-- browser and readable only by the admin.

create table if not exists public.events (
  id         bigserial primary key,
  name       text not null,
  device_id  uuid not null,
  user_id    uuid references auth.users(id) on delete set null,
  -- Small, bounded context (e.g. which lesson, which screen). Never PII.
  detail     text,
  created_at timestamptz not null default now()
);

-- A closed vocabulary. An unknown name is a bug in the client, and failing the
-- insert surfaces it instead of silently polluting the funnel.
alter table public.events drop constraint if exists events_name_known;
alter table public.events add constraint events_name_known check (name in (
  'app_opened',
  'onboarding_started',
  'plan_created',
  'contribution_logged',
  'lesson_completed',
  'rentbuy_viewed',
  'forum_viewed',
  'feedback_sent',
  'bank_connect_clicked'
));
alter table public.events drop constraint if exists events_detail_len;
alter table public.events add constraint events_detail_len
  check (detail is null or char_length(detail) <= 60);

create index if not exists events_name_created_idx on public.events (name, created_at desc);
create index if not exists events_device_idx on public.events (device_id);

alter table public.events enable row level security;

-- Anyone using the app can append an event...
drop policy if exists "events_insert" on public.events;
create policy "events_insert" on public.events for insert to anon, authenticated
  with check (true);

-- ...and only the admin can read them back.
-- ► Change the email if you use a different admin address.
drop policy if exists "events_admin_read" on public.events;
create policy "events_admin_read" on public.events for select to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

-- Activation funnel: distinct devices reaching each step. Public (counts only,
-- no identities) so the admin console can show it before signing in.
create or replace function public.funnel_counts()
returns jsonb language sql security definer stable set search_path = public
as $$
  select coalesce(jsonb_object_agg(name, devices), '{}'::jsonb)
  from (select name, count(distinct device_id) as devices from public.events group by name) t
$$;
grant execute on function public.funnel_counts() to anon, authenticated;

-- The north-star from ROADMAP.md: share of planners who logged a deposit in at
-- least three distinct calendar months. Returns the numerator and denominator
-- rather than a percentage, so a tiny beta reads honestly ("2 of 7") instead of
-- as a flattering rate.
create or replace function public.northstar()
returns jsonb language sql security definer stable set search_path = public
as $$
  with planners as (
    select distinct device_id from public.events where name = 'plan_created'
  ),
  months as (
    select device_id, count(distinct date_trunc('month', created_at)) as m
    from public.events where name = 'contribution_logged' group by device_id
  )
  select jsonb_build_object(
    'planners',  (select count(*) from planners),
    'returning', (select count(*) from months where m >= 3),
    'logged_once', (select count(*) from months where m >= 1)
  )
$$;
grant execute on function public.northstar() to anon, authenticated;

-- KeyDate — beta waitlist (global, live)
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query →
-- paste → Run). It creates the shared table every visitor writes to and locks it
-- down so the public can ONLY add their own email, while only you can read the
-- roster. Safe to re-run (idempotent).

-- 1. The table every landing-page signup lands in ------------------------------
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text default 'landing',
  created_at timestamptz not null default now()
);

-- One row per email (case-insensitive), so refreshes/re-submits don't duplicate.
create unique index if not exists waitlist_email_key
  on public.waitlist (lower(email));

-- 2. Row-Level Security: public may INSERT only; nobody may read via the anon key
alter table public.waitlist enable row level security;

-- Anyone (even signed-out visitors) may add a well-formed email — and nothing else.
drop policy if exists "public can join waitlist" on public.waitlist;
create policy "public can join waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(email) <= 254
  );

-- Only YOU (signed in with your admin email) may read the list of who joined.
-- ► Change the email below if you want a different admin address.
drop policy if exists "admin can read waitlist" on public.waitlist;
create policy "admin can read waitlist"
  on public.waitlist for select
  to authenticated
  using ( auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com' );

-- 3. Public live COUNT (no emails exposed) -------------------------------------
-- Lets the admin console (and the landing page, if you want a "join N others"
-- line) show the running total in real time without leaking anyone's email.
create or replace function public.waitlist_count()
returns integer
language sql
security definer
stable
set search_path = public
as $$ select count(*)::int from public.waitlist $$;

grant execute on function public.waitlist_count() to anon, authenticated;

-- 4. Realtime: push new signups to the admin roster the instant they happen -----
-- Realtime still honors RLS, so only your authenticated admin session receives
-- the rows — other clients get nothing.
alter publication supabase_realtime add table public.waitlist;

-- KeyDate — app-wide flags
-- Run once in the Supabase SQL editor. Idempotent.
--
-- Why a server-side flag rather than a constant in the code: the beta is meant
-- to open for everyone at the same moment. A flag the admin can flip from the
-- console makes that one click, instead of a code change plus a CI deploy that
-- lands minutes later.

create table if not exists public.app_flags (
  key        text primary key,
  enabled    boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Starts CLOSED. Signups are collected; nobody is let in until this is flipped.
insert into public.app_flags (key, enabled) values ('beta_open', false)
  on conflict (key) do nothing;

alter table public.app_flags enable row level security;

-- Direct table access is admin-only. Everyone else goes through the functions.
-- ► Change the email if you use a different admin address.
drop policy if exists "app_flags_admin_all" on public.app_flags;
create policy "app_flags_admin_all" on public.app_flags for all to authenticated
  using      (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com')
  with check (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

-- Public read of the single flag the app needs. Returns false when the row is
-- missing, so a half-run migration keeps the door shut rather than opening it.
create or replace function public.beta_open()
returns boolean language sql security definer stable set search_path = public
as $$ select coalesce((select enabled from public.app_flags where key = 'beta_open'), false) $$;
grant execute on function public.beta_open() to anon, authenticated;

-- Admin flip. Re-checks the caller's email inside the function so the privilege
-- can't be reached with the publishable key alone.
create or replace function public.set_beta_open(open boolean)
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'jasonmwong603@gmail.com' then
    raise exception 'not authorized';
  end if;
  insert into public.app_flags (key, enabled, updated_at)
    values ('beta_open', open, now())
    on conflict (key) do update set enabled = excluded.enabled, updated_at = now();
  return open;
end $$;
grant execute on function public.set_beta_open(boolean) to authenticated;

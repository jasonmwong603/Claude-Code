-- KeyDate — app backbone (accounts + sync + user metrics)
-- Run this once in the Supabase SQL editor, alongside waitlist.sql. It sets up
-- cross-device sync, the anonymous device metric, and the registered-user ledger
-- that powers the Registered / Active / Inactive tiles in the admin console.
-- Safe to re-run (idempotent).

-- 1. Cloud sync: one private JSON blob per user -------------------------------
create table if not exists public.keydate_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.keydate_state enable row level security;
drop policy if exists "own_read"   on public.keydate_state;
drop policy if exists "own_insert" on public.keydate_state;
drop policy if exists "own_update" on public.keydate_state;
create policy "own_read"   on public.keydate_state for select using (auth.uid() = user_id);
create policy "own_insert" on public.keydate_state for insert with check (auth.uid() = user_id);
create policy "own_update" on public.keydate_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. Anonymous usage metric: one row per device (guests + signed-in) ----------
create table if not exists public.keydate_devices (
  device_id  uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  signed_in  boolean not null default false
);
alter table public.keydate_devices enable row level security;   -- no policies: table stays locked
create or replace function public.track_device(p_device uuid, p_signed_in boolean)
returns void language sql security definer set search_path = public as $$
  insert into public.keydate_devices (device_id, signed_in) values (p_device, p_signed_in)
  on conflict (device_id) do update
    set last_seen = now(), signed_in = keydate_devices.signed_in or excluded.signed_in;
$$;
grant execute on function public.track_device(uuid, boolean) to anon, authenticated;

-- 3. Registered-users ledger: one permanent row per account -------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  avatar_url text,
  created_at timestamptz not null default now(),
  last_seen  timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles_own_read"   on public.profiles;
drop policy if exists "profiles_own_insert" on public.profiles;
drop policy if exists "profiles_own_update" on public.profiles;
create policy "profiles_own_read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles_own_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_own_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Guarantee a profile row the instant someone signs up (even if the client never runs).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Reading your numbers -----------------------------------------------------
-- A convenience view for the SQL editor (registered / active-30d / inactive).
create or replace view public.user_stats as
select count(*)                                                        as registered_total,
       count(*) filter (where last_seen > now() - interval '30 days')  as active_30d,
       count(*) filter (where last_seen <= now() - interval '30 days') as inactive_30d
from public.profiles;

-- Admin console feed: aggregate counts (no PII), readable ONLY by the admin
-- email after magic-link sign-in. Lights up the greyed tiles in keydate.ca/admin.
-- ► Change the email below if you use a different admin address.
create or replace function public.keydate_admin_stats()
returns json language plpgsql security definer stable set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'email','') <> 'jasonmwong603@gmail.com' then
    return null;   -- not the admin: reveal nothing
  end if;
  return json_build_object(
    'registered', (select count(*) from public.profiles),
    'active30',   (select count(*) from public.profiles where last_seen >  now() - interval '30 days'),
    'inactive',   (select count(*) from public.profiles where last_seen <= now() - interval '30 days'),
    'guests',     (select count(*) from public.keydate_devices)
  );
end; $$;
grant execute on function public.keydate_admin_stats() to authenticated;

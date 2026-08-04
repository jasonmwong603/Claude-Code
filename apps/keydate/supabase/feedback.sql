-- KeyDate — user feedback
-- Run once in the Supabase SQL editor. Stores in-app feedback so beta reports
-- are never lost and live in one place. Idempotent.

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,
  message    text not null,
  email      text,
  user_id    uuid references auth.users(id) on delete set null,
  path       text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.feedback drop constraint if exists feedback_len;
alter table public.feedback add constraint feedback_len
  check (char_length(message) between 1 and 5000);

alter table public.feedback enable row level security;

-- Anyone using the app (guest or signed in) can send feedback...
drop policy if exists "feedback_insert" on public.feedback;
create policy "feedback_insert" on public.feedback for insert to anon, authenticated
  with check (true);

-- ...but only the admin can read or manage it.
-- ► Change the email if you use a different admin address.
drop policy if exists "feedback_admin_read" on public.feedback;
create policy "feedback_admin_read" on public.feedback for select to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');
drop policy if exists "feedback_admin_update" on public.feedback;
create policy "feedback_admin_update" on public.feedback for update to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

create index if not exists feedback_created_idx on public.feedback (created_at desc);

-- Public count so the admin console can show a "new feedback" tile.
create or replace function public.feedback_count()
returns integer language sql security definer stable set search_path = public
as $$ select count(*)::int from public.feedback where not handled $$;
grant execute on function public.feedback_count() to anon, authenticated;

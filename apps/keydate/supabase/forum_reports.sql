-- KeyDate — content moderation (reports)
-- Run once in the Supabase SQL editor, after forum.sql. Idempotent.

create table if not exists public.forum_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('post','reply')),
  target_id   uuid not null,
  reason      text,
  created_at  timestamptz not null default now()
);
alter table public.forum_reports enable row level security;

-- Signed-in users may file a report (as themselves). They can't read the queue.
drop policy if exists "reports_insert_own" on public.forum_reports;
create policy "reports_insert_own" on public.forum_reports for insert to authenticated
  with check (reporter_id = auth.uid());

-- Only the admin email may read the report queue.
-- ► Change the email if you use a different admin address.
drop policy if exists "reports_admin_read" on public.forum_reports;
create policy "reports_admin_read" on public.forum_reports for select to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

create index if not exists forum_reports_created_idx on public.forum_reports (created_at desc);

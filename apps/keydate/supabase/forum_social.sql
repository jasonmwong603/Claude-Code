-- KeyDate — forum social layer (follows + saved posts)
-- Run once in the Supabase SQL editor, after forum.sql. Idempotent.

-- 1. Follows: who follows whom -----------------------------------------------
create table if not exists public.forum_follows (
  follower_id  uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id <> following_id)
);
alter table public.forum_follows enable row level security;
-- You can see and manage only your OWN follow list.
drop policy if exists "follows_read_own"   on public.forum_follows;
drop policy if exists "follows_insert_own" on public.forum_follows;
drop policy if exists "follows_delete_own" on public.forum_follows;
create policy "follows_read_own"   on public.forum_follows for select to authenticated using (follower_id = auth.uid());
create policy "follows_insert_own" on public.forum_follows for insert to authenticated with check (follower_id = auth.uid());
create policy "follows_delete_own" on public.forum_follows for delete to authenticated using (follower_id = auth.uid());

-- 2. Saved posts: a private bookmark list ------------------------------------
create table if not exists public.forum_saves (
  user_id    uuid not null references auth.users(id) on delete cascade,
  post_id    uuid not null references public.forum_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table public.forum_saves enable row level security;
-- Your saves are private to you.
drop policy if exists "saves_read_own"   on public.forum_saves;
drop policy if exists "saves_insert_own" on public.forum_saves;
drop policy if exists "saves_delete_own" on public.forum_saves;
create policy "saves_read_own"   on public.forum_saves for select to authenticated using (user_id = auth.uid());
create policy "saves_insert_own" on public.forum_saves for insert to authenticated with check (user_id = auth.uid());
create policy "saves_delete_own" on public.forum_saves for delete to authenticated using (user_id = auth.uid());

create index if not exists forum_saves_user_idx on public.forum_saves (user_id, created_at desc);

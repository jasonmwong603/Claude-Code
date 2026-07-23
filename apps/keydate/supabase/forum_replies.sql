-- KeyDate — forum reply threads
-- Run once in the Supabase SQL editor, after forum.sql. Idempotent.

-- 1. Replies ------------------------------------------------------------------
create table if not exists public.forum_replies (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.forum_posts(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  author_name text not null,
  avatar      text not null default '🔑',
  body        text not null,
  created_at  timestamptz not null default now()
);
alter table public.forum_replies drop constraint if exists reply_len;
alter table public.forum_replies add constraint reply_len
  check (char_length(body) between 1 and 2000);

alter table public.forum_replies enable row level security;
-- Anyone can read replies (public thread).
drop policy if exists "reply_read" on public.forum_replies;
create policy "reply_read" on public.forum_replies for select to anon, authenticated using (true);
-- Signed-in users reply only as themselves; may delete their own.
drop policy if exists "reply_insert_own" on public.forum_replies;
create policy "reply_insert_own" on public.forum_replies for insert to authenticated
  with check (author_id = auth.uid());
drop policy if exists "reply_delete_own" on public.forum_replies;
create policy "reply_delete_own" on public.forum_replies for delete to authenticated
  using (author_id = auth.uid());

create index if not exists forum_replies_post_idx on public.forum_replies (post_id, created_at);

-- 2. Keep a reply_count on each post so cards can show "💬 N" -----------------
alter table public.forum_posts add column if not exists reply_count int not null default 0;

create or replace function public.forum_reply_count_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_posts set reply_count = reply_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.forum_posts set reply_count = greatest(0, reply_count - 1) where id = old.post_id;
  end if;
  return null;
end; $$;
drop trigger if exists forum_reply_count on public.forum_replies;
create trigger forum_reply_count after insert or delete on public.forum_replies
  for each row execute function public.forum_reply_count_sync();

-- 3. Realtime: new replies push into open threads -----------------------------
do $$ begin
  alter publication supabase_realtime add table public.forum_replies;
exception when duplicate_object then null; end $$;

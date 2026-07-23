-- KeyDate — shared community forum (posts + likes, live)
-- Run once in the Supabase SQL editor. Turns the on-device forum preview into a
-- real, shared, cross-user feed. Idempotent.

-- 1. Posts --------------------------------------------------------------------
create table if not exists public.forum_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references auth.users(id) on delete set null,   -- null = KeyDate starter post
  author_name text not null,
  avatar      text not null default '🔑',
  location    text,
  category    text not null check (category in ('milestone','firsthome','advice','question')),
  title       text not null,
  body        text not null,
  like_count  int  not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.forum_posts drop constraint if exists forum_len;
alter table public.forum_posts add constraint forum_len
  check (char_length(title) between 1 and 140 and char_length(body) between 1 and 4000);

alter table public.forum_posts enable row level security;
-- Anyone can read the feed (guests included).
drop policy if exists "forum_read" on public.forum_posts;
create policy "forum_read" on public.forum_posts for select to anon, authenticated using (true);
-- Signed-in users may post only as themselves.
drop policy if exists "forum_insert_own" on public.forum_posts;
create policy "forum_insert_own" on public.forum_posts for insert to authenticated
  with check (author_id = auth.uid());
-- Authors may delete their own posts.
drop policy if exists "forum_delete_own" on public.forum_posts;
create policy "forum_delete_own" on public.forum_posts for delete to authenticated
  using (author_id = auth.uid());

create index if not exists forum_posts_created_idx on public.forum_posts (created_at desc);

-- 2. Likes (one per user per post) --------------------------------------------
create table if not exists public.forum_likes (
  post_id    uuid not null references public.forum_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.forum_likes enable row level security;
-- A user can see (and manage) only their own likes.
drop policy if exists "likes_read_own"   on public.forum_likes;
drop policy if exists "likes_insert_own" on public.forum_likes;
drop policy if exists "likes_delete_own" on public.forum_likes;
create policy "likes_read_own"   on public.forum_likes for select to authenticated using (user_id = auth.uid());
create policy "likes_insert_own" on public.forum_likes for insert to authenticated with check (user_id = auth.uid());
create policy "likes_delete_own" on public.forum_likes for delete to authenticated using (user_id = auth.uid());

-- Keep forum_posts.like_count in sync so the public feed shows totals without
-- exposing who liked what.
create or replace function public.forum_like_count_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_posts set like_count = like_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.forum_posts set like_count = greatest(0, like_count - 1) where id = old.post_id;
  end if;
  return null;
end; $$;
drop trigger if exists forum_like_count on public.forum_likes;
create trigger forum_like_count after insert or delete on public.forum_likes
  for each row execute function public.forum_like_count_sync();

-- 3. Realtime: new posts + like-count changes push to every open feed ---------
do $$ begin
  alter publication supabase_realtime add table public.forum_posts;
exception when duplicate_object then null; end $$;

-- 4. Starter posts so the feed isn't empty on day one -------------------------
-- Fixed ids → re-running never duplicates. author_id null = KeyDate post.
insert into public.forum_posts (id, author_id, author_name, avatar, location, category, title, body, like_count, created_at) values
  ('11111111-1111-4111-8111-000000000001', null, 'KeyDate Team', '🔑', null, 'firsthome',
   'Welcome to the KeyDate community 👋',
   'This is the place to share your first-home journey — milestones, wins, questions, and honest advice. Introduce yourself and tell us your target city!', 7, now() - interval '6 days'),
  ('11111111-1111-4111-8111-000000000002', null, 'Priya', '🌷', 'Mississauga, ON', 'milestone',
   'Hit 25% of my down payment!',
   'Started at basically zero 14 months ago. Automating $600/mo into my FHSA was the single biggest thing. Slow but it adds up.', 12, now() - interval '4 days'),
  ('11111111-1111-4111-8111-000000000003', null, 'Marc', '🧭', 'Laval, QC', 'advice',
   'FHSA vs RRSP for the HBP — what I wish I knew',
   'Short version: the FHSA gives you the deduction AND tax-free withdrawal, no repayment. I fill the FHSA first, then use the HBP on top if I need more. Ask me anything.', 15, now() - interval '3 days'),
  ('11111111-1111-4111-8111-000000000004', null, 'Sam', '🌻', 'Calgary, AB', 'question',
   'How much did closing costs actually run you?',
   'Trying to budget realistically. I keep hearing "1.5–4% of the price" but would love real numbers from people who just bought.', 4, now() - interval '2 days'),
  ('11111111-1111-4111-8111-000000000005', null, 'Amelia', '🏡', 'Halifax, NS', 'firsthome',
   'Got the keys last week 🔑🎉',
   'Two years of saving, one very patient realtor, and a lot of lessons in this app. To everyone still grinding: your date is real. Keep going.', 21, now() - interval '1 day')
on conflict (id) do nothing;

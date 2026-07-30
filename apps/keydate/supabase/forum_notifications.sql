-- KeyDate — activity notifications (replies, likes, follows)
-- Run once in the Supabase SQL editor, after forum.sql / forum_social.sql /
-- forum_replies.sql. Idempotent.

create table if not exists public.forum_notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,  -- recipient
  actor_id   uuid references auth.users(id) on delete set null,
  actor_name text,
  type       text not null check (type in ('reply','like','follow')),
  post_id    uuid,
  post_title text,
  excerpt    text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.forum_notifications enable row level security;

-- Recipients read and update (mark-read) only their own notifications.
-- No INSERT policy: rows are created only by the security-definer triggers below.
drop policy if exists "notif_read_own"   on public.forum_notifications;
drop policy if exists "notif_update_own" on public.forum_notifications;
create policy "notif_read_own"   on public.forum_notifications for select to authenticated using (user_id = auth.uid());
create policy "notif_update_own" on public.forum_notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists forum_notifications_user_idx
  on public.forum_notifications (user_id, created_at desc);

-- New reply on your post ------------------------------------------------------
create or replace function public.notify_on_reply()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_author uuid; v_title text;
begin
  select author_id, title into v_author, v_title from public.forum_posts where id = new.post_id;
  if v_author is not null and v_author <> new.author_id then
    insert into public.forum_notifications (user_id, actor_id, actor_name, type, post_id, post_title, excerpt)
    values (v_author, new.author_id, new.author_name, 'reply', new.post_id, v_title, left(new.body, 140));
  end if;
  return null;
end; $$;
drop trigger if exists notify_reply on public.forum_replies;
create trigger notify_reply after insert on public.forum_replies
  for each row execute function public.notify_on_reply();

-- New like on your post -------------------------------------------------------
create or replace function public.notify_on_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_author uuid; v_title text; v_name text;
begin
  select author_id, title into v_author, v_title from public.forum_posts where id = new.post_id;
  if v_author is not null and v_author <> new.user_id then
    select name into v_name from public.profiles where id = new.user_id;
    insert into public.forum_notifications (user_id, actor_id, actor_name, type, post_id, post_title)
    values (v_author, new.user_id, coalesce(v_name, 'Someone'), 'like', new.post_id, v_title);
  end if;
  return null;
end; $$;
drop trigger if exists notify_like on public.forum_likes;
create trigger notify_like after insert on public.forum_likes
  for each row execute function public.notify_on_like();

-- Someone followed you --------------------------------------------------------
create or replace function public.notify_on_follow()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_name text;
begin
  select name into v_name from public.profiles where id = new.follower_id;
  insert into public.forum_notifications (user_id, actor_id, actor_name, type)
  values (new.following_id, new.follower_id, coalesce(v_name, 'Someone'), 'follow');
  return null;
end; $$;
drop trigger if exists notify_follow on public.forum_follows;
create trigger notify_follow after insert on public.forum_follows
  for each row execute function public.notify_on_follow();

-- Realtime so the bell updates the instant something happens.
do $$ begin
  alter publication supabase_realtime add table public.forum_notifications;
exception when duplicate_object then null; end $$;

-- KeyDate — shared forum media (photos + videos via Supabase Storage)
-- Run once in the Supabase SQL editor, after forum.sql. Idempotent.
-- (If the storage.* statements error on permissions, create the bucket in the
--  dashboard instead: Storage → New bucket → name "forum-media" → Public, then
--  re-run just the "alter table" lines at the bottom.)

-- 1. Public bucket for forum uploads -----------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'forum-media', 'forum-media', true,
  52428800,  -- 50 MB per file
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage access rules ----------------------------------------------------
-- Anyone can VIEW forum media (public feed, cross-device).
drop policy if exists "forum_media_read" on storage.objects;
create policy "forum_media_read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'forum-media');

-- Signed-in users upload only into their OWN folder (name = "<uid>/...").
drop policy if exists "forum_media_insert" on storage.objects;
create policy "forum_media_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'forum-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- ...and may delete only their own files.
drop policy if exists "forum_media_delete" on storage.objects;
create policy "forum_media_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'forum-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Post columns that hold the media URL ------------------------------------
alter table public.forum_posts add column if not exists media_url  text;
alter table public.forum_posts add column if not exists media_kind text;
alter table public.forum_posts drop constraint if exists forum_media_kind;
alter table public.forum_posts add constraint forum_media_kind
  check (media_kind is null or media_kind in ('image','video'));

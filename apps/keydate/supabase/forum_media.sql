-- KeyDate — shared forum media (photos + videos via Supabase Storage)
-- Run in the Supabase SQL editor, after forum.sql. Idempotent.
--
-- IMPORTANT: run this in TWO parts, because some projects don't allow creating
-- storage policies from the SQL editor (it errors and rolls back the rest).
--
--   PART 1 (always works) — the post columns below.
--   PART 2 (storage) — try the SQL; if it errors on permissions, use the
--     dashboard instead: Storage → New bucket → name "forum-media" → Public.
--     Then add ONE policy (Storage → Policies → forum-media → New policy →
--     "Allow insert for authenticated users").

-- ─────────────────────────── PART 1: post columns ───────────────────────────
alter table public.forum_posts add column if not exists media_url  text;
alter table public.forum_posts add column if not exists media_kind text;

-- ─────────────────────────── PART 2: storage bucket ─────────────────────────
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

-- Anyone can VIEW forum media (a public bucket already allows this; harmless).
drop policy if exists "forum_media_read" on storage.objects;
create policy "forum_media_read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'forum-media');

-- Signed-in users may upload to this bucket.
drop policy if exists "forum_media_insert" on storage.objects;
create policy "forum_media_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'forum-media');

-- ...and delete only files in their own "<uid>/..." folder.
drop policy if exists "forum_media_delete" on storage.objects;
create policy "forum_media_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'forum-media' and (storage.foldername(name))[1] = auth.uid()::text);

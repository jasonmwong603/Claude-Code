-- KeyDate — shared forum media (photos + videos via Supabase Storage)
-- Run once in the Supabase SQL editor, after forum.sql. Idempotent.
-- Safe to paste whole: the post columns always apply, and the storage setup is
-- best-effort — if this project forbids storage changes from the SQL editor it
-- prints a NOTICE and skips them (create the bucket in the dashboard instead:
-- Storage → New bucket → "forum-media" → Public).

-- 1. Post columns that hold the media URL (always applies) --------------------
alter table public.forum_posts add column if not exists media_url  text;
alter table public.forum_posts add column if not exists media_kind text;

-- 2. Storage bucket + access rules (best-effort) -----------------------------
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('forum-media','forum-media', true, 52428800,
    array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
  on conflict (id) do update
    set public = excluded.public,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

  -- Anyone can view (a public bucket allows this anyway); signed-in users upload;
  -- users delete only files in their own "<uid>/..." folder.
  execute 'drop policy if exists "forum_media_read" on storage.objects';
  execute 'create policy "forum_media_read" on storage.objects for select to anon, authenticated using (bucket_id = ''forum-media'')';
  execute 'drop policy if exists "forum_media_insert" on storage.objects';
  execute 'create policy "forum_media_insert" on storage.objects for insert to authenticated with check (bucket_id = ''forum-media'')';
  execute 'drop policy if exists "forum_media_delete" on storage.objects';
  execute 'create policy "forum_media_delete" on storage.objects for delete to authenticated using (bucket_id = ''forum-media'' and (storage.foldername(name))[1] = auth.uid()::text)';

  raise notice 'forum-media storage configured ✔';
exception when others then
  raise notice 'Storage step skipped (%). Create it in the dashboard: Storage → New bucket → forum-media → Public, then add a policy allowing INSERT for authenticated users.', sqlerrm;
end $$;

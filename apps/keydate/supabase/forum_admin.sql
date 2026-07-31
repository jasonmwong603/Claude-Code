-- KeyDate — admin moderation powers
-- Run once in the Supabase SQL editor, after forum.sql / forum_replies.sql /
-- forum_reports.sql. Lets the admin email remove any reported post/reply and
-- clear handled reports (policies are OR'd with the author-delete ones).
-- ► Change the email if you use a different admin address.

drop policy if exists "admin_delete_posts" on public.forum_posts;
create policy "admin_delete_posts" on public.forum_posts for delete to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

drop policy if exists "admin_delete_replies" on public.forum_replies;
create policy "admin_delete_replies" on public.forum_replies for delete to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

drop policy if exists "admin_delete_reports" on public.forum_reports;
create policy "admin_delete_reports" on public.forum_reports for delete to authenticated
  using (auth.jwt() ->> 'email' = 'jasonmwong603@gmail.com');

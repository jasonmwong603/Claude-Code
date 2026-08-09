-- KeyDate — reset the activation funnel
--
-- Clears public.events so the funnel and north-star start from zero. Run this
-- immediately before opening the beta, so the cohort's numbers are theirs and
-- not yours.
--
-- Everything in the table up to launch is your own: development testing, and
-- demos given through /prelaunchdemo/, which is the same build at a second path
-- and so was firing the same events. (The client now skips tracking on that
-- path, so future demos stay out of the funnel — but rows already written have
-- to be deleted here. Device ids are anonymous by design, which is exactly why
-- demo rows cannot be picked out after the fact.)
--
-- Safe to run more than once. Touches nothing but public.events — the waitlist,
-- feedback, and the beta_open flag are separate tables and are not affected.

-- ── Look first (optional) ───────────────────────────────────────────────────
-- Run this on its own to see what is about to go.
--
--   select name,
--          count(*)                   as rows,
--          count(distinct device_id)  as devices,
--          min(created_at)            as first_seen,
--          max(created_at)            as last_seen
--   from public.events
--   group by name
--   order by name;

-- ── The reset ───────────────────────────────────────────────────────────────
-- One statement, so the SQL editor shows its result: what was deleted.
with before as (
  select count(*) as rows, count(distinct device_id) as devices from public.events
),
removed as (
  delete from public.events returning 1
)
select (select rows    from before) as rows_deleted,
       (select devices from before) as devices_cleared,
       (select count(*) from removed) as confirmed,
       (select count(*) from public.events) as remaining;   -- expect 0

-- Ids keep counting up from where they left off, which is harmless but means
-- the first real beta event is not id 1. Uncomment to start the numbering over.
-- alter sequence public.events_id_seq restart with 1;

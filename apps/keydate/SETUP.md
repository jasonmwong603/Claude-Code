# KeyDate — Go-Live Checklist

Everything in the app is built to run **free and offline today** (guest mode) and
switch on the paid/hosted pieces later without code changes. This is the ordered
checklist for that switch-on — do it once, when you're ready (e.g. after funding).
Each item notes cost so you can sequence spend.

Times are rough; none require touching the app source — just dashboards, SQL, and
a couple of config values.

---

## 1. Accounts, sync & user tracking — Supabase  ·  free tier
Turns on Google/Facebook sign-in, cross-device sync, and your registered-user /
active-user counts.

The Supabase project already exists (it powers the waitlist). This step turns on
sign-in, sync, and metrics **inside the app** (`keydate.ca/prelaunchdemo`).

1. **Run the app SQL** — Supabase SQL editor → paste all of
   `apps/keydate/supabase/app.sql` → Run. Creates the sync table, device metric,
   `profiles` ledger + signup trigger, the `user_stats` view, and the secure
   `keydate_admin_stats()` that lights up the admin console's user tiles. Idempotent.
2. **Google OAuth app** — Google Cloud Console → APIs & Services → Credentials →
   *Create OAuth client ID* (Web). Add authorized redirect URI:
   `https://ksnlqrcbdumhvqdgjlqs.supabase.co/auth/v1/callback`. Copy the client id + secret.
3. **Facebook OAuth app** — [developers.facebook.com](https://developers.facebook.com)
   → create app → *Facebook Login* → Settings. Add the same Supabase callback as a
   valid OAuth redirect URI. Copy the app id + secret.
4. **Enable providers in Supabase** — Authentication → Providers → turn on Google
   and Facebook, paste the ids/secrets from steps 2–3.
5. **Allow the app URLs** — Authentication → URL Configuration → confirm the redirect
   list includes `https://keydate.ca/prelaunchdemo/`, `https://keydate.ca/admin/`, and
   `http://localhost:5173` (Site URL `https://keydate.ca`).
6. **Add the keys to the deploy** — GitHub repo → Settings → Secrets and variables
   → Actions → **Variables** → add `VITE_SUPABASE_URL` =
   `https://ksnlqrcbdumhvqdgjlqs.supabase.co` and `VITE_SUPABASE_ANON_KEY` = your
   publishable key (both public/safe). Re-run the deploy. Sign-in, sync, and counts
   are now live in the app.

**Reading your numbers:** the admin console tiles populate automatically once you're
signed in there; or query `select * from public.user_stats;` in the SQL editor.

---

## 1b. Community forum — shared & live  ·  free
Turns the on-device forum preview into a real cross-user feed.

1. **Run the SQL** — Supabase SQL editor → paste all of
   `apps/keydate/supabase/forum.sql` → Run. Creates `forum_posts` + `forum_likes`
   with RLS (public read, signed-in users post/like as themselves), a like-count
   trigger, Realtime, and a few KeyDate starter posts. Idempotent.
2. That's it — no extra keys. The app already reads/writes the forum through the
   same Supabase client from step 1. Once accounts are on (section 1), signed-in
   users post live and everyone sees new posts appear in real time; guests can read
   but are prompted to sign in to post.

*Note.* Photo/video attachments stay device-only for now; shared media (via Supabase
Storage, also free tier) is the next increment.

**Follows + saved posts:** run `apps/keydate/supabase/forum_social.sql` too (SQL editor,
one paste). Adds `forum_follows` + `forum_saves` with private RLS, powering the
Following feed and the personal 🔖 Saved list in the Community tab.

**Reply threads:** run `apps/keydate/supabase/forum_replies.sql` (SQL editor, one paste).
Adds `forum_replies` (public read, sign-in to reply/delete own), a `reply_count` on
posts, and Realtime so replies appear live in an open thread.

**Moderation (report/hide):** run `apps/keydate/supabase/forum_reports.sql` (SQL editor).
Adds `forum_reports` (signed-in users file reports; only the admin email can read the
queue). Reporting also hides the item instantly on the reporter's device.

**Rich demo seed (optional):** run `apps/keydate/supabase/forum_seed_rich.sql` to fill
the live forum with realistic posts (some with images), replies, and likes for a demo.

**Shared photos + videos:** run `apps/keydate/supabase/forum_media.sql` (SQL editor).
Creates a public `forum-media` Storage bucket (50 MB/file, images + video), access
rules (anyone can view; users upload/delete only their own files), and `media_url` /
`media_kind` columns on posts. Uploads then show on every device. If the `storage.*`
lines error on permissions, create the bucket in the dashboard (Storage → New bucket
→ `forum-media` → Public) and re-run just the `alter table` lines.

---

## 2. Waitlist — global & live via Supabase  ·  DONE (free)
The waitlist is wired to the Supabase project. Signups from **any** visitor's
browser land in one shared table (`public.waitlist`), and the passcode-gated admin
console (`keydate.ca/admin`) shows the running total to anyone who unlocks it, plus
the full roster of *who joined* (email + time, live) to you after you sign in.

**What's already set up**
- `apps/keydate/supabase/waitlist.sql` was run in the Supabase SQL editor: it creates
  the table, locks it with Row-Level Security (public may **insert only**; only the
  admin email may **read**/delete), adds `waitlist_count()` for the public total, and
  enables Realtime so new signups push to the roster instantly.
- `landing.html` inserts each signup into Supabase (public key, insert-only) with a
  localStorage mirror as a safety net.
- `admin.html` holds the Supabase URL + **publishable** key (both public/safe) and the
  `ADMIN_EMAIL` allowed to read the roster.

**One setting to finish the roster login** — so the magic-link sign-in redirects back
to your console:
1. Supabase Dashboard → **Authentication → URL Configuration**.
2. Set **Site URL** to `https://keydate.ca` and add these to **Redirect URLs**:
   `https://keydate.ca/admin/` and `https://keydate.ca/prelaunchdemo/`.
3. Save. Now open `keydate.ca/admin`, enter the passcode, click **Email me a magic
   link**, open the link on the same device — the live roster appears.

*Notes.* The built-in Supabase email sender is rate-limited on the free tier (a few
per hour) — fine for your own admin login; add a custom SMTP later if you enable user
sign-in at scale. To change the **admin email** who can read the roster, edit the two
policies in `waitlist.sql`, re-run it, and update `ADMIN_EMAIL` in `admin.html`. To
change the **admin passcode**, replace `ADMIN_HASH` in `admin.html` with the output of
`printf '%s' 'NEWCODE' | sha256sum`. Registered / active / inactive user tiles stay
blank until cloud sign-in (section 1) is enabled.

---

## 3. Live bank balances — real Plaid  ·  paid, do when it earns its keep
The bank screen is a Plaid-*shaped* prototype today (read-only sandbox, no real
login). To go live you need a small backend to hold the Plaid secret:

1. Get Plaid API keys (Plaid dashboard) — request **balance** product only.
2. Stand up three routes behind `src/lib/plaid.ts`'s documented seams:
   `createLinkToken`, `exchangePublicToken`, `getBalances` (a Supabase Edge Function
   works well here). Add the Plaid Link SDK on the client. Delete the sandbox mock.
   Scope stays read-only — never payments or transfers.

---

## 4. Polish that signals seriousness  ·  cheap
- **Custom domain** (e.g. `keydate.app`, ~$10–20/yr) → point it at GitHub Pages
  and set it in the repo's Pages settings + the app's `base`.
- **App stores** — Apple Developer ($99/yr) + Google Play ($25 once) when you're
  ready to ship the Capacitor builds (see `README.md → Ship it to the App Store`).

---

## 5. Before public launch / monetization  ·  legal spend
- **Privacy policy + terms** (required by the app stores and once you touch bank
  data via Plaid).
- **Canadian fintech + real-estate compliance review** of the professional-directory
  model and all educational content — Alberta RECA referral-disclosure and
  law-society fee-sharing rules shaped the flat-fee design. Keep everything
  educational, with disclaimers; no personalized advice.

---

### Order of spend (recommended)
Free beta on guest mode → **(1) Supabase** (activates accounts + your metrics, the
big credibility unlock) → **(2) waitlist endpoint** → domain → **(3) Plaid** and
**(5) compliance** once there's traction and funding behind them.

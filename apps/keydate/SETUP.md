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

1. **Create a project** at [supabase.com](https://supabase.com) (free tier). Note
   the **Project URL** and the **anon public key** (Settings → API).
2. **Google OAuth app** — Google Cloud Console → APIs & Services → Credentials →
   *Create OAuth client ID* (Web). Add authorized redirect URI:
   `https://<project>.supabase.co/auth/v1/callback`. Copy the client id + secret.
3. **Facebook OAuth app** — [developers.facebook.com](https://developers.facebook.com)
   → create app → *Facebook Login* → Settings. Add the same Supabase callback as a
   valid OAuth redirect URI. Copy the app id + secret.
4. **Enable providers in Supabase** — Authentication → Providers → turn on Google
   and Facebook, paste the ids/secrets from steps 2–3.
5. **Allow the app URLs** — Authentication → URL Configuration → add the deployed
   site (`https://keydate.ca/app/`) and `http://localhost:5173`.
6. **Run the SQL** — open the Supabase SQL editor and paste the three blocks from
   `README.md → Accounts & sign-in → One-time database setup` (state sync table,
   device metric + `track_device`, and the `profiles` ledger + signup trigger).
7. **Add the keys to the deploy** — GitHub repo → Settings → Secrets and variables
   → Actions → **Variables** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   (both are public/safe). Re-run the deploy. Sign-in, sync, and counts are now live.

**Reading your numbers** (Supabase SQL editor): see `README.md → Reading your user
numbers` — total registered, active (30-day), inactive, and reach incl. guests.

---

## 2. Waitlist emails — pick a free form endpoint  ·  free tier
The landing page (`landing.html`, served at the site root) already captures emails;
by default it just stores them in the browser so demos work. To collect them for
real:

1. Create a free form endpoint — e.g. a **Formspree** form (free tier) or a **Google
   Apps Script** web app posting to a Google Sheet (free).
2. Paste its URL into `WAITLIST_ENDPOINT` near the bottom of `landing.html`, commit.
   Submissions now flow to your inbox / sheet.

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

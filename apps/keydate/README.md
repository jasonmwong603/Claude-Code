# KeyDate

**Owning a home isn't impossible. It has a date.**

KeyDate turns a person's income, savings, and target market into a concrete
"keys date" for buying their first home, then keeps them motivated with a
gamified savings tracker (XP, levels, a house that builds itself, a keyring of
badges) and a plain-language education curriculum that unlocks as they save.

This is the production scaffold of the single-file prototype (`keydatev5.jsx`),
split into modules and built as a **real app that ships to the web _and_ the App
Store / Play Store from one codebase** (Vite + React + TypeScript, wrapped with
[Capacitor](https://capacitorjs.com/) for native iOS/Android).

The home screen is laid out as a **house cross-section** — the keys date sits in
the attic under a roofline, "floor" rooms hold your target / progress /
this-month actions / next lesson, and a brick foundation holds your keyring —
echoing the level-up house that builds itself as you save. The location field
**autocompletes** from 160+ built-in communities, you can aim your plan at the
**area's typical price** or a **specific listing / budget**, and the whole plan
is **editable any time** ("Edit my plan") without losing your saved progress.
There's also a **Community** tab: an
achievement feed where users share milestones, first-home stories, and advice —
with **photos or video** attached if they like. Every player builds a **2D pixel character** in a Mii-style creator (24×32
layered sprites) — body type, skin tone, eye shape & colour, hairstyle & colour,
**facial hair, eyewear, masks, headwear, tops, bottoms, a handheld item, and a
background** — shown **head-only on the calling card** and **full-body (with a
ground shadow) on the profile**. The editor keeps a **sticky live preview** in
view while you scroll the options. Core identity is free; the rest, plus the
calling-card **frame / banner / title**, **unlock as you level up**. The avatar
engine (`src/lib/avatar.ts`) is a layered sprite system: adding an option is just
another array entry / sprite map.

> Educational content only — not financial, legal, or tax advice. The financial
> rules shown (FHSA, HBP, stress test, down-payment tiers) reflect current
> federal programs and can change. See the compliance note below before launch.

## Run it locally (web)

```bash
cd apps/keydate
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

Data is stored on-device in `localStorage` under `keydate-state-v1` — no
account, no server. (Swap `src/lib/storage.ts` for a backend client when
accounts/sync arrive; the rest of the app only calls `loadState` / `saveState` /
`clearState`.)

## Accounts & sign-in (optional, Google / Facebook)

Sign-in is **optional and off by default** — the app is fully usable as a guest.
When you supply Supabase credentials, a "Save your progress" card appears on the
profile with **Continue with Google / Facebook**; `src/lib/auth.ts` is the only
seam. To turn it on:

1. **Create a Supabase project** (free tier) at supabase.com.
2. **Enable providers** — in *Authentication → Providers*, turn on **Google** and
   **Facebook** and paste in the OAuth client id/secret from:
   - Google: *Google Cloud Console → APIs & Services → Credentials → OAuth client*
   - Facebook: *developers.facebook.com → your app → Facebook Login*
   In each provider's console, add Supabase's callback
   (`https://<project>.supabase.co/auth/v1/callback`) as an authorized redirect URI.
3. **Allow the app URL** — in Supabase *Authentication → URL Configuration*, add the
   deployed site (e.g. `https://<user>.github.io/<repo>/keydate/`) and your local
   `http://localhost:5173` to the redirect allow-list.
4. **Provide the keys** — locally copy `.env.example` to `.env.local`; for the
   deployed build set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as GitHub
   Actions **variables** (both are public/safe to expose). The deploy workflow
   already reads them.

Identity only for now (name + avatar from the social profile prefill the
character). Cloud sync of the saved plan/progress is the natural next step: reuse
the exported `supabase` client with a per-user `jsonb` row under row-level
security.

## Ship it to the App Store / Play Store

The same web build is wrapped natively with Capacitor. You need macOS + Xcode
for iOS and Android Studio + a JDK for Android.

```bash
npm run build          # (re)build the web app into dist/
npx cap add ios        # one-time: create the native iOS project
npx cap add android    # one-time: create the native Android project
npx cap sync           # copy the latest web build into the native shells
npx cap open ios       # opens Xcode  → run / archive / submit
npx cap open android   # opens Android Studio → run / build bundle / submit
```

Set your own `appId` in `capacitor.config.ts` before publishing (it must match
the bundle ID you register with Apple and the application ID with Google).

### App icons & splash

The brand mark (gold key on spruce) is committed under `public/` (web/PWA) and
`resources/icon.png` (1024px source). To regenerate every native icon and splash
size from the source:

```bash
npm run assets:generate       # uses npx @capacitor/assets (needs network)
```

To re-draw the mark itself, edit and run `scripts/gen-icons.py` (needs
`pip install pillow`).

## Install as a web app (PWA)

The build ships a web manifest and icons, so on a phone visitors can use
**Share → Add to Home Screen** to install it like an app without the stores.

## Project layout

```
src/
  App.tsx                 orchestrator: screens, state, XP/badge awarding, persistence
  theme.ts                "prairie dawn" design tokens
  types.ts                shared domain types
  data/curriculum.ts      the 12 lessons + 4 stages
  lib/
    config.ts             financial constants (rate, GDS, FHSA…) with LAST_REVIEWED
    math.ts               down payment, mortgage, affordability, formatting
    locations.ts          built-in market prices + live-lookup hook (see below)
    gamification.ts        badges, streaks, XP levels
    storage.ts            localStorage persistence (web + Capacitor)
  components/             atoms, SavingsPlanBuilder, LessonViewer
  screens/                Onboarding, Dashboard, Learn
```

## Notes carried over from the prototype

- **Live price lookup is a stub.** The prototype called the Anthropic API from
  the browser, which only worked inside a Claude.ai artifact. That call is
  removed; `lookupPrices()` in `src/lib/locations.ts` is a documented hook for
  your own backend. Until it's wired, unknown locations fall back to **manual
  price entry**, so the app is fully usable standalone.
- **Bank view is a Plaid-shaped prototype (read-only).** `src/lib/plaid.ts`
  simulates the Plaid flow with sandbox data (no real bank, no login, no
  credentials) because a real connection needs a backend to hold the Plaid
  secret and exchange tokens. Its types mirror Plaid's `/accounts/balance/get`,
  and the three real-integration points — `createLinkToken`,
  `exchangePublicToken`, `getBalances` — are stubbed with the exact backend
  routes to implement. To go live: add a small backend with your Plaid
  client_id/secret + those three routes, add the Plaid Link SDK on the client,
  and delete the mocks. Scope stays read-only (products `balance`) — never
  payments or transfers.
- **The Community forum is an on-device preview.** Posts and likes are stored in
  `localStorage` (seeded example stories in `src/data/forumSeed.ts`), so it ships
  on static hosting with no accounts. `src/lib/forum.ts` exposes `loadFeed` /
  `addPost` / `toggleLike` / `deletePost` as the single seam to swap for a real
  shared backend (e.g. Supabase: a `posts`/`likes` table + anon auth + RLS) when
  you want cross-user posting. The screen calls nothing else, so the UI is
  unchanged by that upgrade. Add basic moderation before a public launch.
- **Post photos/videos** are held as blobs in IndexedDB (`src/lib/media.ts`);
  the post only stores a short id. When the backend lands, replace
  `putMedia`/`getMedia` with a real upload that returns a URL and set it on the
  post's `media.url` (seeded posts already render via `url`). 30 MB per-file cap.
- **Achievements are anti-cheat.** Money/goal keys ($ milestones and
  "fully funded") are evaluated against a *verified* saved amount — the real
  connected-bank balance when a bank is linked, otherwise the self-reported
  total — and "fully funded" also requires the goal to clear a floor
  (`GOAL_FLOOR` in `src/lib/gamification.ts`). So lowering the goal or editing
  the plan can't fake a savings achievement.
- **Financial constants are centralized** in `src/lib/config.ts` with a
  `LAST_REVIEWED` date — update them there when programs/rates change.
- **Built-in market prices** are a hand-maintained illustrative table; the
  roadmap replaces it with a generated CMHC/StatCan-sourced dataset and a real
  geocoder for disambiguation.

## Before launch (compliance)

Monetization (freemium + a vetted professional directory on flat placement fees)
and all educational content need a legal/compliance review — Alberta RECA
referral-disclosure and law-society fee-sharing rules informed the flat-fee
model. Keep all content educational with disclaimers; no personalized advice.

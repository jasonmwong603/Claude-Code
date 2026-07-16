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
the attic under a roofline, "floor" rooms hold your progress / this-month
actions / next lesson, and a brick foundation holds your keyring — echoing the
level-up house that builds itself as you save. There's also a **Community** tab:
an achievement feed where users share milestones, first-home stories, and advice.

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
- **The Community forum is an on-device preview.** Posts and likes are stored in
  `localStorage` (seeded example stories in `src/data/forumSeed.ts`), so it ships
  on static hosting with no accounts. `src/lib/forum.ts` exposes `loadFeed` /
  `addPost` / `toggleLike` / `deletePost` as the single seam to swap for a real
  shared backend (e.g. Supabase: a `posts`/`likes` table + anon auth + RLS) when
  you want cross-user posting. The screen calls nothing else, so the UI is
  unchanged by that upgrade. Add basic moderation before a public launch.
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

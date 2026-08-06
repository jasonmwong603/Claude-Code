# KeyDate — context handoff

Paste this into a fresh chat to continue **planning, business, and design** work.
The coding session keeps the repo; this document carries everything that isn't code.

Last updated: 6 August 2026.

---

## What KeyDate is

A mobile-first planner for Canadian first-time home buyers. You enter household
income, savings, and what you can put away monthly; it returns **a real month**
you could have keys, built on the actual Canadian rules (FHSA, Home Buyers'
Plan, the mortgage stress test, tiered minimum down payments). Every dollar
logged builds a house on screen.

**Tagline:** *Owning a home isn't impossible. It has a date.*

**The reframe that defines it:** every other tool asks "what can you afford
today?" — today the answer is no, so people close the tab and stop saving.
KeyDate asks **when**.

---

## Where things actually stand

| | |
| --- | --- |
| **Waitlist** | **37 signups** (was 2 before the recruitment message went out) |
| **Beta access** | **CLOSED** — collecting signups, nobody admitted yet |
| **Funnel data** | Empty, *by design* — the door is shut, so nobody reaches the app |
| **Feedback received** | 0 |
| **Revenue** | $0 |
| **Team** | Solo founder |

### Live surfaces (all returning 200)

| URL | What it is |
| --- | --- |
| `keydate.ca` | Marketing + waitlist landing page |
| `keydate.ca/app/` | The beta — behind the email gate and the launch switch |
| `keydate.ca/admin` | Private metrics console (passcode + magic-link admin sign-in) |
| `keydate.ca/prelaunchdemo` | Passcode-gated demo, bypasses the beta gate — for live demos |
| `keydate.ca/privacy`, `/terms` | Legal pages |

### The launch switch

Beta access is governed by a server-side `beta_open` flag, flipped from the top
of the admin console. Everyone on the waitlist gets in **at the same moment** —
deliberately, so the cohort experiences the same build and their feedback is
comparable. It **fails closed**: an unreachable server or a missing flag means
"not yet", never "let everyone in".

---

## Decisions already made — and why

Recorded so they don't get re-argued from scratch.

**Business model: freemium, never lead generation.** The obvious way to monetise
is selling users to mortgage brokers — people who just disclosed their income,
savings, and exactly when they'll need a mortgage. The privacy policy commits, in
writing, that we never will. The reasoning is load-bearing: the moment the
company is paid to push someone toward a house, it can no longer tell them the
truth. This is why the rent-vs-buy tool is allowed to say *don't buy*.

**Incorporated in Alberta, not federally.** ~$508 all-in versus higher federal
cost plus extra-provincial registration, for national name protection not yet
needed. An Alberta corporation can serve users Canada-wide.

**Sole proprietor → incorporated before opening the beta.** Incorporation is not
retroactive; anything happening beforehand stays personally liable. Friends-of-
friends are strangers, so the trigger fired.

**Trademark: file `KEYDATE` (word mark, standard characters), classes 9 + 42.**
Applicant is the corporation, and the mark is `KEYDATE` — *not* "KeyDate Inc.";
the suffix is corporate form, not brand. Canadian applications cannot be
broadened after filing, so adding class 36 later costs a **full new application**
($491) rather than the additional-class rate ($149). Class 36 was considered and
declined; that trade-off is known.

**No Plaid before the beta.** Manual logging is a better behavioural signal than
an automated balance read, and production Plaid access costs money and needs a
backend. Demand is being measured instead via a "notify me" capture.

**Calendar reminder over push or email for the return loop.** Push needs a
server, VAPID keys, and on iOS the app installed first — which would miss most
of a link-opened beta cohort. A calendar entry survives cleared data and new
phones, costs nothing, and sits next to payday.

**Supabase over Google Apps Script** for the backend, chosen early.

**Honesty features are product, not decoration.** Range-based dates rather than
false precision; a stress-test warning that tells users they likely wouldn't
qualify; rent-vs-buy that recommends renting when the maths says so. These are
the differentiator, not a compliance afterthought.

---

## Business / legal status

| Item | Status |
| --- | --- |
| Alberta incorporation | **Filed**, awaiting certificate (~$508: $99 service + $300 government + $50 NUANS + $59 minute book) |
| CRA Business Number + RC0001 | **To do** after certificate — free, ~15 min, don't pay a registry agent for it |
| Business bank account | To do after certificate |
| Share issuance in minute book | To do — starts the Lifetime Capital Gains Exemption clock |
| CIPO trademark | **To file** once incorporated. `KEYDATE`, classes 9 + 42, **$640.10** |
| Trademark search | Done — clear across `KEYDATE`, `KEY DATE`, `KEYDATE*` with the Trademark field set |
| Privacy policy + terms | **Live**, Alberta-governed, PIPA + PIPEDA named |
| Legal entity in legal pages | **To do** once the certificate names it |
| Insurance (tech E&O / cyber) | **Not started** — get quotes before signups scale |
| WCB | Not required — no employees; directors are optional coverage |
| GST registration | Not required under $30K revenue; skip until charging |

**Known risk, flagged and unresolved:** "key date" is an ordinary English phrase,
which invites a *descriptiveness* objection under s.12(1)(b). Independent of
whether anyone else registered it. The ~7–9 month examination queue works in your
favour: file now, and by the time an examiner looks you'll have months of
demonstrable use to answer with.

---

## Infrastructure

- **Supabase** project `ksnlqrcbdumhvqdgjlqs`. Publishable key is public by
  design; the service-role key and DB password must never be shared.
- **GitHub Pages** via Actions, custom domain `keydate.ca`.
- Two passcode gates (admin console, prelaunch demo) — client-side SHA-256,
  **obfuscation not security**. Real protection is Row-Level Security: the
  publishable key can insert but never read waitlist emails, feedback, or events.
- 14 SQL migrations in `apps/keydate/supabase/`. All run.

---

## Open — planning / business track

*This is what the new chat is for.*

1. **Launch the beta.** 37 people are waiting. Flip the switch, then email them.
   The first two joined under older copy promising immediate access — worth a
   personal note rather than a mass email.
2. **Post-certificate paperwork** — BN, bank account, shares, legal-page entity
   name, then the CIPO filing.
3. **Insurance quotes.**
4. **Recruitment beyond the first 37** — Edmonton and the Greater Edmonton Area
   first; `BETA-RECRUITMENT.md` in the repo has the plan.
5. **Non-dilutive funding** — Futurpreneur, regional innovation programs, SR&ED,
   student competitions. Nothing applied for yet.
6. **Business email** — `hello@keydate.ca` doesn't exist; everything currently
   points at `keydateadmin@gmail.com`.
7. **The unanswered judge questions** — team/bus-factor risk, and why-you-why-now.
8. **Design** — the app icon is set; there is no brand guide, no marketing site
   beyond the landing page, no App Store presence.

## Open — coding track

*Stays in the coding session.*

- Email reminders (needs a provider account + `pg_cron` — a decision, not just code)
- Plaid production integration, when justified
- Replacing seeded forum content with real posts
- Cohort/retention reporting once funnel data exists
- Regenerating deck screenshots after UI changes

---

## Numbers worth having to hand

- Average Canadian home **2006: $276,974** (CREA, a record year) → **today: ~$696,078**. **2.5×**.
- Edmonton benchmark prices **+104%** over 20 years vs **CPI +54%** — and Edmonton is the *affordable* market.
- Edmonton median family income 2023: **$105,200**.
- 467 Canadian municipalities in the app.
- **Do not quote a national household-income figure.** The comparable series
  doesn't line up cleanly against 2006; the Edmonton housing-vs-inflation pair is
  the defensible version of the same argument.

## Repo landmarks

`STRATEGY.md` · `ROADMAP.md` (1/3/5-year plan) · `BETA-RECRUITMENT.md` ·
`SETUP.md` · `apps/keydate/pitch/` (deck, script, slide images) ·
`apps/keydate/supabase/` (migrations).

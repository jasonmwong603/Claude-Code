# KeyDate — Strategy & Investor Answers

This is the honest answer sheet to the hard questions a competition judge or
investor will ask. It complements the product (which now includes a stress-test
qualification check, a range-based date, and a rent-vs-buy tool — i.e. the app
itself no longer over-promises). The remaining gaps below are business, not code.

---

## 1. Revenue model — how KeyDate makes money
Direct subscriptions from cash-poor first-time buyers is the weakest option, so
it is **not** the primary plan. Sequenced by defensibility:

1. **B2B2C distribution (primary bet).** Banks, credit unions, and FHSA/mortgage
   providers pay handsomely to reach *pre-mortgage* young Canadians — the exact
   top of their funnel. License KeyDate as a white-label engagement layer, or
   per-qualified-referral. This also solves reach: we get scale we can't buy
   direct. Target first partner: a mid-size credit union or a challenger bank.
2. **Transparent, disclosed referral fees** for FHSA/investment accounts and
   mortgage pre-approval — *shown to the user as a disclosed incentive* (see §3).
3. **Premium tier later** (advanced scenarios, document vault, advisor Q&A) —
   only once there's a base that will pay; not the wedge.

**Unit economics to prove (not assert):** partner deal value per activated user,
referral payout per funded FHSA/mortgage, and blended CAC via community/organic.
The waitlist is not revenue evidence; a signed LOI from one partner is.

## 2. The churn paradox & lifetime value
The product "succeeds" when the user buys and leaves — capping LTV at the 1–5yr
journey. **Fix: extend the lifecycle.** Reposition from *pre-purchase tool* to
*housing-money for life*: after purchase → mortgage renewal reminders, HELOC,
renovation/next-home savings, and (long tail) helping the next generation. The
multi-year "dreamer" runway is also longer than people think — monetize the
journey, not just the transaction.

## 3. The trust / conflict-of-interest lane
You cannot be a neutral advisor **and** a hidden commissioned salesperson —
users see through it and it's the fintech death trap. **Chosen lane:** stay
demonstrably on the user's side. Revenue via **B2B licensing** (aligned: the
partner wants the user to succeed too) and **fully-disclosed** referrals where
the user sees "KeyDate may earn a fee — here's why we still recommend it, and
here are alternatives." The rent-vs-buy tool that tells people *not* to buy is a
deliberate, load-bearing trust signal, not a gimmick.

## 4. Moat — today it's thin; here's how we build one
Honest assessment: a calculator + content + a forum is cloneable. Real moats,
in priority:
1. **Proprietary behavioural data flywheel.** Aggregate, anonymized saving
   behaviour → better date predictions, city/cohort benchmarks ("you're saving
   faster than 78% of Calgary buyers"), and content nobody else can produce.
   Every user makes the product smarter. This is the durable one.
2. **Exclusive distribution.** A bank/employer/credit-union deal that locks a
   channel competitors can't cheaply replicate.
3. **Community density in a niche** (Canadian FTHBs) — network effects the big
   dry incumbents (Ratehub, bank calculators) don't have.

## 5. Wedge vs. incumbents (one line each)
- **Ratehub / WOWA / bank calculators:** dry, transactional, one-shot. KeyDate
  is the *only* one that turns the goal into an ongoing, gamified, social journey
  that changes saving behaviour.
- **Wealthsimple / KOHO / Borrowell:** great accounts/credit, but none own the
  *"when do I get my first home"* emotional journey end-to-end for Canadians.
- Our wedge is **engagement & behaviour change on the first-home journey**,
  precisely where incumbents are weakest.

## 6. Market (TAM) — real but bounded, so be honest
~hundreds of thousands of Canadian first-time buyers *transact* per year; the
*aspiring* pool (the real KeyDate audience) is several million. Canada-only is a
regulatory moat but a scale ceiling. **Scale paths:** (a) B2B channel multiplies
reach per user; (b) international expansion to markets with equivalent first-home
programs (UK LISA, Australia FHSS) reuses the engine. Frame it as a wedge into a
lifelong personal-finance relationship, not a one-time calculator TAM.

## 7. Metrics — kill the vanity, instrument the truth
- **Stop leading with waitlist / registered counts.** They're discounted to zero
  by anyone serious, and (until now) weren't even bot-protected — a honeypot was
  just added; email-verified signups are next.
- **North-star:** *% of activated users who log a real deposit in 3+ distinct
  months* (proof of behaviour change). Report weekly cohort **retention curves**,
  activation rate, and — once partners exist — referral conversion.
- One honest retention curve beats 10,000 unverified emails.

## 8. Regulatory & compliance (do before public launch, not after)
Operating near mortgage, real-estate, and securities-adjacent territory in
Canada. The "educational only" disclaimer is necessary but **not sufficient** if
the product effectively advises or steers. Required:
- A real compliance review; proper licensing where referral/brokering applies
  (provincial mortgage-broker rules; RECA in AB; law-society fee-sharing).
- **PIPEDA** privacy compliance for the PII already collected (emails, plan data)
  and, once Plaid is live, the emerging **consumer-driven (open) banking** rules.
- UX designed to stay on the right side of the advice line (the tools present
  ranges + disclosed assumptions, never guarantees).

## 9. Use of funds (the raise)
The bootstrapped "build free, switch on paid at funding" posture is a feature —
show the runway is de-risked. The raise buys: (1) a **compliance + licensing**
foundation, (2) **live data** (CREA/board feed + geocoder) to replace estimates,
(3) real **bank data via Plaid** + a small backend, and (4) **one BD hire** to
land the first distribution partner. Milestones, not vibes.

---

### What's already been de-risked in-product (judge-facing)
- **False-precision date → fixed.** Range-based, appreciation-aware, and it flags
  when a rising price outruns the saver.
- **"A date isn't an approval" → fixed.** Stress-tested GDS qualification tells
  users when they wouldn't qualify and what income/target would.
- **Only-cheerleads-buying → fixed.** The rent-vs-buy tool recommends renting when
  the math says so.
- **Price data → partly fixed.** Top ~35 markets calibrated to mid-2026 CREA /
  board data; the rest are clearly labelled estimates the user can override.
- **Bot-inflated waitlist → mitigated.** Honeypot added; email verification next.
- **Community liability → partly mitigated.** Guidelines + report flow shipped;
  an admin review queue is the next build.

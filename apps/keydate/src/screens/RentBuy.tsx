import { useEffect, useMemo, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { track } from '../lib/analytics'
import { MoneyInput } from '../components/atoms'
import { fmt, fmtShort, minDownPayment } from '../lib/math'
import { rentVsBuy } from '../lib/rentbuy'
import type { AppState } from '../types'

/* An honest rent-vs-buy comparison. Buying isn't always the win — this shows the
 * renter-who-invests path side by side and says so plainly. */
export function RentBuy({ state, onBack }: { state: AppState; onBack: () => void }) {
  useEffect(() => track('rentbuy_viewed', undefined, { once: true }), [])

  const { plan } = state
  const savedNow = plan.startingSavings + state.contributions.reduce((a, c) => a + c.amount, 0)
  const minDown = minDownPayment(plan.target, plan.homeType)

  const [rent, setRent] = useState(Math.round((plan.target * 0.0042) / 25) * 25) // ~price-to-rent estimate
  const [years, setYears] = useState(5)
  const [down, setDown] = useState(Math.round(Math.max(minDown, Math.min(savedNow, plan.target)) / 500) * 500)

  const r = useMemo(
    () =>
      rentVsBuy({
        price: plan.target,
        downPayment: Math.max(minDown, down),
        monthlyRent: rent,
        years,
        appreciation: 0.03,
        investReturn: 0.05,
        rentInflation: 0.03,
      }),
    [plan.target, plan.homeType, down, rent, years, minDown],
  )

  const buyWins = r.winner === 'buy'
  const tie = r.winner === 'tie'

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: BODY_FONT, color: C.spruce, padding: '4px 0 8px' }}
      >
        ← Back
      </button>
      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '4px 0 4px' }}>Rent vs. buy</h2>
      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5, margin: '0 0 16px' }}>
        Buying isn’t always the better money move. Here’s an honest {years}-year comparison for a{' '}
        {fmtShort(plan.target)} place vs. renting and investing the difference.
      </p>

      {/* Verdict */}
      <div
        style={{
          background: tie ? C.goldSoft : buyWins ? C.sproutSoft : '#EAF4FB',
          border: `1.5px solid ${tie ? C.gold : buyWins ? C.sprout : '#7db2d9'}`,
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 18,
        }}
      >
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
          {tie ? '≈ It’s roughly a wash' : buyWins ? '🏠 Buying comes out ahead' : '📈 Renting + investing wins'}
        </div>
        <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>
          {tie ? (
            <>Over {years} years the two paths land within ~{fmtShort(r.gap)} of each other — close enough that lifestyle, flexibility, and job security should decide it, not the spreadsheet.</>
          ) : buyWins ? (
            <>Over {years} years, owning leaves you about <b>{fmtShort(r.gap)}</b> better off — mostly from equity and appreciation. Worth it <i>if</i> you can carry {fmt(r.buyMonthlyCost)}/mo and stay put the whole time.</>
          ) : (
            <>Over {years} years, renting and investing the difference leaves you about <b>{fmtShort(r.gap)}</b> better off. At this rent and price, tying up cash in this home isn’t the stronger money move — renting longer (or targeting a cheaper place) may be smarter.</>
          )}
        </div>
      </div>

      {/* Side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.spruce }}>🏠 Buy</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', fontVariantNumeric: 'tabular-nums' }}>{fmtShort(r.buyNetWorth)}</div>
          <div style={{ fontSize: 11.5, color: C.sub }}>net worth in {years} yrs</div>
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 8, lineHeight: 1.5 }}>
            ~{fmt(r.buyMonthlyCost)}/mo to carry · home worth {fmtShort(r.homeValueEnd)}
          </div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#2b6ea8' }}>📈 Rent + invest</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', fontVariantNumeric: 'tabular-nums' }}>{fmtShort(r.rentNetWorth)}</div>
          <div style={{ fontSize: 11.5, color: C.sub }}>portfolio in {years} yrs</div>
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 8, lineHeight: 1.5 }}>
            {fmt(rent)}/mo rent · invests the down payment + monthly savings
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Tune it to your situation</div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: C.sub }}>Your monthly rent (or what you’d pay)</label>
        <div style={{ margin: '6px 0 14px' }}>
          <MoneyInput value={rent} onChange={(v) => setRent(v === '' ? 0 : v)} step={50} />
        </div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: C.sub }}>Down payment you’d put in</label>
        <div style={{ margin: '6px 0 14px' }}>
          <MoneyInput value={down} onChange={(v) => setDown(v === '' ? 0 : v)} step={500} />
        </div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: C.sub }}>
          How long you’d stay: <b style={{ color: C.ink }}>{years} years</b>
        </label>
        <input
          type="range"
          min={2}
          max={15}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.sprout, marginTop: 6 }}
        />
      </div>

      <p style={{ fontSize: 11, color: C.sub, lineHeight: 1.55, marginTop: 14 }}>
        Assumes ~3%/yr home appreciation, ~5%/yr investment return, ~3%/yr rent growth, ~2.4%/yr carrying
        costs (tax, maintenance, insurance) and ~5% selling costs. Estimates for comparison only — not
        financial advice. Real results depend on your market, rates, and choices.
      </p>
    </>
  )
}

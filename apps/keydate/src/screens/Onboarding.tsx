import { useState } from 'react'
import { C, DISPLAY_FONT } from '../theme'
import { Field, MoneyInput, Pills, bigBtn, inputStyle } from '../components/atoms'
import { HOME_TYPES, matchBuiltIn } from '../lib/locations'
import { fmtShort } from '../lib/math'
import type { HomeTypeKey, ResolvedLocation } from '../types'

export interface OnboardingResult {
  resolved: ResolvedLocation
  homeType: HomeTypeKey
  income: number
  savings: number
  monthly: number
}

export function Onboarding({ onSubmit }: { onSubmit: (r: OnboardingResult) => void }) {
  const [locQuery, setLocQuery] = useState('')
  const [resolved, setResolved] = useState<ResolvedLocation | null>(null)
  const [manualPrice, setManualPrice] = useState(0)
  const [homeType, setHomeType] = useState<HomeTypeKey>('apartment')
  const [income, setIncome] = useState(72000)
  const [savings, setSavings] = useState(8000)
  const [monthly, setMonthly] = useState(600)

  const handleLocationChange = (v: string) => {
    setLocQuery(v)
    setManualPrice(0)
    setResolved(matchBuiltIn(v))
  }

  const useManualPrice = (price: number) => {
    setManualPrice(price)
    const name = locQuery.trim()
    setResolved(price > 0 && name ? { name, base: price, source: 'you entered' } : null)
  }

  // Offer manual entry once the user has typed a plausible place we don't know.
  const showManual = !matchBuiltIn(locQuery) && locQuery.trim().length > 2

  return (
    <>
      <h1
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.12,
          margin: '18px 0 8px',
        }}
      >
        Owning a home isn’t impossible.
        <br />
        <span style={{ color: C.sprout }}>It has a date.</span>
      </h1>
      <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.55, margin: '0 0 28px' }}>
        Answer five things and we’ll build your plan.
      </p>

      <Field
        label="Where do you want to buy?"
        hint="160+ Canadian communities are built in. Anywhere else, just tell us the average price."
      >
        <input
          type="text"
          placeholder="Type a city or town"
          value={locQuery}
          onChange={(e) => handleLocationChange(e.target.value)}
          style={inputStyle}
        />
        {resolved && (
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: C.spruce,
              background: C.sproutSoft,
              borderRadius: 10,
              padding: '9px 12px',
            }}
          >
            📍 <strong>{resolved.name}</strong> — avg home ≈ {fmtShort(resolved.base)}{' '}
            <span style={{ color: C.sub }}>({resolved.source})</span>
          </div>
        )}
        {showManual && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 6, lineHeight: 1.45 }}>
              We don’t have “{locQuery.trim()}” built in. What’s a typical home price there? (A
              quick web search for “average home price {locQuery.trim()}” gives a good number.)
            </div>
            <MoneyInput value={manualPrice} onChange={useManualPrice} step={10000} />
          </div>
        )}
      </Field>

      <Field label="What kind of place?">
        <Pills options={HOME_TYPES} value={homeType} onChange={setHomeType} />
      </Field>
      <Field label="Household income (before tax, per year)">
        <MoneyInput value={income} onChange={setIncome} />
      </Field>
      <Field label="Saved so far">
        <MoneyInput value={savings} onChange={setSavings} step={500} />
      </Field>
      <Field label="What you can put away each month">
        <MoneyInput value={monthly} onChange={setMonthly} step={50} />
      </Field>

      <button
        type="button"
        onClick={() => resolved && onSubmit({ resolved, homeType, income, savings, monthly })}
        disabled={!resolved}
        style={bigBtn(!!resolved)}
      >
        {resolved ? 'Build my plan →' : 'Add a location first'}
      </button>
    </>
  )
}

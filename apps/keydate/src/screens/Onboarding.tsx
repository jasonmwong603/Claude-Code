import { useState } from 'react'
import { C, DISPLAY_FONT } from '../theme'
import { Field, MoneyInput, Pills, bigBtn, inputStyle } from '../components/atoms'
import { HOME_TYPES, matchBuiltIn } from '../lib/locations'
import { fmtShort } from '../lib/math'
import type { HomeTypeKey, ResolvedLocation, TargetSource } from '../types'

export interface OnboardingResult {
  resolved: ResolvedLocation
  homeType: HomeTypeKey
  income: number
  savings: number
  monthly: number
  targetSource: TargetSource
  customPrice: number
  targetLabel: string
  listingUrl: string
}

const TARGET_MODES: { key: TargetSource; label: string }[] = [
  { key: 'area', label: 'Typical for this area' },
  { key: 'custom', label: 'A listing or budget' },
]

export function Onboarding({ onSubmit }: { onSubmit: (r: OnboardingResult) => void }) {
  const [locQuery, setLocQuery] = useState('')
  const [resolved, setResolved] = useState<ResolvedLocation | null>(null)
  const [manualPrice, setManualPrice] = useState(0)
  const [homeType, setHomeType] = useState<HomeTypeKey>('apartment')
  const [income, setIncome] = useState(72000)
  const [savings, setSavings] = useState(8000)
  const [monthly, setMonthly] = useState(600)
  const [targetSource, setTargetSource] = useState<TargetSource>('area')
  const [customPrice, setCustomPrice] = useState(0)
  const [targetLabel, setTargetLabel] = useState('')
  const [listingUrl, setListingUrl] = useState('')

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
  const canBuild = !!resolved && (targetSource === 'area' || customPrice > 0)

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
        Answer a few things and we’ll build your plan.
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

      <Field
        label="What are you aiming at?"
        hint={
          targetSource === 'area'
            ? "We'll use a typical price for your area and home type."
            : 'Found a listing or have a number in mind? Aim straight at it.'
        }
      >
        <Pills options={TARGET_MODES} value={targetSource} onChange={setTargetSource} />
        {targetSource === 'custom' && (
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Target price</div>
              <MoneyInput value={customPrice} onChange={setCustomPrice} step={5000} />
            </div>
            <input
              type="text"
              placeholder="Name it — e.g. 123 Elm St, or “My budget”"
              value={targetLabel}
              onChange={(e) => setTargetLabel(e.target.value)}
              style={inputStyle}
            />
            <input
              type="url"
              inputMode="url"
              placeholder="Listing link (optional)"
              value={listingUrl}
              onChange={(e) => setListingUrl(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}
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
        onClick={() =>
          canBuild &&
          resolved &&
          onSubmit({ resolved, homeType, income, savings, monthly, targetSource, customPrice, targetLabel, listingUrl })
        }
        disabled={!canBuild}
        style={bigBtn(canBuild)}
      >
        {!resolved
          ? 'Add a location first'
          : targetSource === 'custom' && customPrice <= 0
            ? 'Enter your target price'
            : 'Build my plan →'}
      </button>
    </>
  )
}

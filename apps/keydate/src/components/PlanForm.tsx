import { useState } from 'react'
import { C } from '../theme'
import { Field, MoneyInput, Pills, bigBtn, inputStyle } from './atoms'
import { HOME_TYPES, matchBuiltIn, suggestLocations } from '../lib/locations'
import { fmtShort } from '../lib/math'
import type { HomeTypeKey, ResolvedLocation, TargetSource } from '../types'

/** Everything a plan needs from the user. Shared by onboarding and editing. */
export interface PlanFormValues {
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

export interface PlanFormInitial
  extends Omit<PlanFormValues, 'resolved' | 'income' | 'savings' | 'monthly'> {
  locationText: string
  resolved: ResolvedLocation | null
  /** '' means "not entered yet" — distinct from a deliberate 0. */
  income: number | ''
  savings: number | ''
  monthly: number | ''
}

const TARGET_MODES: { key: TargetSource; label: string }[] = [
  { key: 'area', label: 'Typical for this area' },
  { key: 'custom', label: 'A listing or budget' },
]

export function PlanForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: PlanFormInitial
  submitLabel: string
  onSubmit: (v: PlanFormValues) => void
  onCancel?: () => void
}) {
  const [locQuery, setLocQuery] = useState(initial.locationText)
  const [resolved, setResolved] = useState<ResolvedLocation | null>(initial.resolved)
  const [manualPrice, setManualPrice] = useState(0)
  const [locFocused, setLocFocused] = useState(false)
  const [homeType, setHomeType] = useState<HomeTypeKey>(initial.homeType)
  const [income, setIncome] = useState<number | ''>(initial.income)
  const [savings, setSavings] = useState<number | ''>(initial.savings)
  const [monthly, setMonthly] = useState<number | ''>(initial.monthly)
  const [targetSource, setTargetSource] = useState<TargetSource>(initial.targetSource)
  const [customPrice, setCustomPrice] = useState(initial.customPrice)
  const [targetLabel, setTargetLabel] = useState(initial.targetLabel)
  const [listingUrl, setListingUrl] = useState(initial.listingUrl)

  const suggestions = suggestLocations(locQuery)
  const showDropdown = locFocused && suggestions.length > 0

  const handleLocationChange = (v: string) => {
    setLocQuery(v)
    setManualPrice(0)
    setResolved(matchBuiltIn(v))
    setLocFocused(true)
  }

  const pickSuggestion = (s: ResolvedLocation) => {
    setLocQuery(s.name)
    setResolved(s)
    setManualPrice(0)
    setLocFocused(false)
  }

  const useManualPrice = (price: number) => {
    setManualPrice(price)
    const name = locQuery.trim()
    setResolved(price > 0 && name ? { name, base: price, source: 'you entered' } : null)
  }

  // Only offer manual entry when we truly have nothing to suggest.
  const showManual = suggestions.length === 0 && !resolved && locQuery.trim().length > 2
  // Every money field must be answered — a blank is "unanswered", while a typed
  // 0 is a real answer (no savings yet / nothing to put away right now).
  const filled = (v: number | '') => v !== '' && !Number.isNaN(v)
  const canSubmit =
    !!resolved &&
    (targetSource === 'area' || customPrice > 0) &&
    filled(income) &&
    filled(savings) &&
    filled(monthly)

  const submit = () => {
    if (!canSubmit || !resolved) return
    onSubmit({
      resolved,
      homeType,
      income: Number(income),
      savings: Number(savings),
      monthly: Number(monthly),
      targetSource,
      customPrice,
      targetLabel,
      listingUrl,
    })
  }

  return (
    <>
      <Field
        label="Where do you want to buy?"
        hint="Start typing and tap a match. Anywhere not listed, just tell us the average price."
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Type a city or town"
            value={locQuery}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setLocFocused(true)}
            onBlur={() => setTimeout(() => setLocFocused(false), 120)}
            autoComplete="off"
            style={inputStyle}
          />
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                zIndex: 20,
                background: '#fff',
                border: `1.5px solid ${C.line}`,
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(23,48,42,0.14)',
                overflow: 'hidden',
                maxHeight: 260,
                overflowY: 'auto',
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  // onMouseDown fires before the input's onBlur hides the list.
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pickSuggestion(s)
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    padding: '11px 14px',
                    background: '#fff',
                    border: 'none',
                    borderTop: i === 0 ? 'none' : `1px solid ${C.line}`,
                    cursor: 'pointer',
                    fontSize: 14.5,
                    color: C.ink,
                  }}
                >
                  <span>📍 {s.name}</span>
                  <span style={{ fontSize: 12.5, color: C.sub }}>≈ {fmtShort(s.base)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
              We don’t have “{locQuery.trim()}” built in. What’s a typical home price there? (A quick
              web search for “average home price {locQuery.trim()}” gives a good number.)
            </div>
            <MoneyInput value={manualPrice} onChange={(v) => useManualPrice(v === '' ? 0 : v)} step={10000} />
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
              <MoneyInput value={customPrice} onChange={(v) => setCustomPrice(v === '' ? 0 : v)} step={5000} />
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

      <div style={{ display: 'flex', gap: 10 }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: 15,
              fontWeight: 600,
              color: C.sub,
              background: '#fff',
              border: `1.5px solid ${C.line}`,
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          style={{ ...bigBtn(canSubmit), flex: onCancel ? 2 : undefined }}
        >
          {/* Say exactly what's still missing, in the order the fields appear. */}
          {!resolved
            ? 'Add a location first'
            : targetSource === 'custom' && customPrice <= 0
              ? 'Enter your target price'
              : !filled(income)
                ? 'Enter your household income'
                : !filled(savings)
                  ? 'Enter how much you’ve saved (0 is fine)'
                  : !filled(monthly)
                    ? 'Enter what you can save monthly (0 is fine)'
                    : submitLabel}
        </button>
      </div>
    </>
  )
}

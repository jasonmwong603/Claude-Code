import { C } from '../theme'
import { card } from './atoms'
import { fmt } from '../lib/math'
import { FHSA_ANNUAL_CAP, ILLUSTRATIVE_REFUND_RATE } from '../lib/config'

/** FHSA-first savings split with an illustrative refund estimate. */
export function SavingsPlanBuilder({ monthly }: { monthly: number }) {
  const fhsaMonthlyCap = FHSA_ANNUAL_CAP / 12
  const toFhsa = Math.min(monthly, fhsaMonthlyCap)
  const toTfsa = Math.max(0, monthly - toFhsa)
  const annualFhsa = toFhsa * 12
  const refund = annualFhsa * ILLUSTRATIVE_REFUND_RATE

  return (
    <div style={{ ...card, background: C.sproutSoft, border: 'none' }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
        📋 Your suggested savings split ({fmt(monthly)}/mo)
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <span>
            <strong>1. FHSA first</strong> — tax deduction + tax-free withdrawal
          </span>
          <strong>{fmt(toFhsa)}/mo</strong>
        </div>
        {toTfsa > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>
              <strong>2. TFSA next</strong> — flexible, tax-free growth
            </span>
            <strong>{fmt(toTfsa)}/mo</strong>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
          <span>Est. tax refund from FHSA (at ~30% rate)</span>
          <strong style={{ color: C.spruce }}>≈ {fmt(refund)}/yr</strong>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.sub, marginTop: 10, lineHeight: 1.5 }}>
        Recycle the refund into next year’s FHSA to compound the advantage. Already have an RRSP? The
        Home Buyers’ Plan lets you withdraw up to $60K for a first home too. Your actual refund
        depends on your tax bracket.
      </div>
    </div>
  )
}

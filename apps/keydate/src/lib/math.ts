import { AMORT_MONTHS, CLOSING_RATE, GDS_SHARE, RATE } from './config'
import type { HomeTypeKey } from '../types'

/** Minimum down payment in Canada, with the tiered 5% / 10% / 20% rules and a
 *  35% floor for vacant land. */
export function minDownPayment(price: number, homeType: HomeTypeKey): number {
  if (homeType === 'land') return price * 0.35
  if (price >= 1500000) return price * 0.2
  if (price <= 500000) return price * 0.05
  return 500000 * 0.05 + (price - 500000) * 0.1
}

/** Monthly mortgage payment for a given principal at RATE over AMORT_MONTHS. */
export function mortgagePayment(principal: number): number {
  const r = RATE / 12
  return (principal * r) / (1 - Math.pow(1 + r, -AMORT_MONTHS))
}

/** Largest price supportable at GDS_SHARE of income, converged against the
 *  down payment (a bigger price needs a bigger down payment). */
export function maxAffordablePrice(annualIncome: number, homeType: HomeTypeKey): number {
  const capacity = (annualIncome / 12) * GDS_SHARE
  const r = RATE / 12
  const maxMortgage = (capacity * (1 - Math.pow(1 + r, -AMORT_MONTHS))) / r
  let price = maxMortgage
  for (let i = 0; i < 6; i++) price = maxMortgage + minDownPayment(price, homeType)
  return price
}

/** Total up-front cash goal: down payment + closing costs. */
export function savingsGoal(target: number, homeType: HomeTypeKey): number {
  return minDownPayment(target, homeType) + target * CLOSING_RATE
}

export const fmt = (n: number): string => '$' + Math.round(n).toLocaleString('en-CA')

export const fmtShort = (n: number): string =>
  n >= 1000000
    ? '$' + (n / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M'
    : '$' + Math.round(n / 1000) + 'K'

/** Human keys date, `months` from now (clamped at 0). */
export function keysDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + Math.max(0, Math.ceil(months)))
  return d.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
}

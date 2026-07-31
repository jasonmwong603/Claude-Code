/* Realistic keys-date projection.
 *
 * The old model was `remaining ÷ monthly` — a straight line that ignored the two
 * things that move the date by years: the home price rising while you save (a
 * moving goalpost), and interest earned on what you've saved. It also gave a
 * single over-confident date. This module simulates month-by-month with price
 * appreciation + a savings return, returns a RANGE across scenarios, and checks
 * whether the buyer could actually QUALIFY (stress-tested), not just save enough. */
import { AMORT_MONTHS, GDS_SHARE, RATE } from './config'
import { minDownPayment, savingsGoal } from './math'
import type { HomeTypeKey, Plan } from '../types'

export interface Scenario {
  key: 'optimistic' | 'likely' | 'tougher'
  label: string
  /** Annual home-price appreciation. */
  appreciation: number
  /** Annual return on money already saved (HISA/FHSA/investments). */
  savingsReturn: number
  /** Annual household-income growth (affects qualification). */
  incomeGrowth: number
}

/** Illustrative scenario assumptions (not advice; see the in-app disclosure). */
export const SCENARIOS: Record<Scenario['key'], Scenario> = {
  optimistic: { key: 'optimistic', label: 'If prices cool', appreciation: 0.01, savingsReturn: 0.04, incomeGrowth: 0.03 },
  likely: { key: 'likely', label: 'Likely', appreciation: 0.03, savingsReturn: 0.03, incomeGrowth: 0.025 },
  tougher: { key: 'tougher', label: 'If prices run hot', appreciation: 0.05, savingsReturn: 0.02, incomeGrowth: 0.02 },
}

const CAP_MONTHS = 480 // 40 years — beyond this we call it "not on this path"

/** Months until saved cash ≥ the (rising) up-front goal. Infinity if the goalpost
 *  outruns the saver on this path. */
export function monthsToKeys(o: {
  target: number
  homeType: HomeTypeKey
  saved: number
  monthly: number
  appreciation: number
  savingsReturn: number
}): number {
  let target = o.target
  let saved = o.saved
  const mAppr = Math.pow(1 + o.appreciation, 1 / 12) - 1
  const mRet = Math.pow(1 + o.savingsReturn, 1 / 12) - 1
  for (let m = 0; m <= CAP_MONTHS; m++) {
    if (saved >= savingsGoal(target, o.homeType)) return m
    if (o.monthly <= 0 && mRet <= mAppr) return Infinity // never catches a rising goal
    saved = saved * (1 + mRet) + o.monthly
    target = target * (1 + mAppr)
  }
  return Infinity
}

/* ————— Mortgage qualification (stress-tested) ————— */

/** The federal minimum qualifying ("stress test") rate. */
export function qualifyingRate(contractRate = RATE): number {
  return Math.max(contractRate + 0.02, 0.0525)
}

/** Largest price a household can be APPROVED for at the stress rate, given other
 *  monthly debt, converged against the required down payment. */
export function maxQualifiedPrice(annualIncome: number, homeType: HomeTypeKey, otherMonthlyDebt = 0): number {
  const capacity = (annualIncome / 12) * GDS_SHARE - otherMonthlyDebt
  if (capacity <= 0) return 0
  const r = qualifyingRate() / 12
  const maxMortgage = (capacity * (1 - Math.pow(1 + r, -AMORT_MONTHS))) / r
  let price = maxMortgage
  for (let i = 0; i < 8; i++) price = maxMortgage + minDownPayment(price, homeType)
  return price
}

export interface KeysProjection {
  likelyMonths: number
  earliestMonths: number
  latestMonths: number
  /** Can they qualify TODAY at this income for this price (stress-tested)? */
  qualifiesNow: boolean
  /** Income the household needs to qualify for the target now. */
  incomeToQualify: number
  /** Biggest single lever on the likely date, as a short human string. */
  topLever: string
}

/** Full projection for a plan + current saved cash + effective monthly saving. */
export function projectKeys(plan: Plan, saved: number, monthly: number): KeysProjection {
  const base = { target: plan.target, homeType: plan.homeType, saved, monthly }
  const s = SCENARIOS
  const likelyMonths = monthsToKeys({ ...base, appreciation: s.likely.appreciation, savingsReturn: s.likely.savingsReturn })
  const earliestMonths = monthsToKeys({ ...base, appreciation: s.optimistic.appreciation, savingsReturn: s.optimistic.savingsReturn })
  const latestMonths = monthsToKeys({ ...base, appreciation: s.tougher.appreciation, savingsReturn: s.tougher.savingsReturn })

  const maxQ = maxQualifiedPrice(plan.income, plan.homeType)
  const qualifiesNow = maxQ >= plan.target
  // Invert GDS to find the income that qualifies for this exact target.
  const down = minDownPayment(plan.target, plan.homeType)
  const r = qualifyingRate() / 12
  const pmt = ((plan.target - down) * r) / (1 - Math.pow(1 + r, -AMORT_MONTHS))
  const incomeToQualify = (pmt / GDS_SHARE) * 12

  // Sensitivity: which single change moves the likely date the most?
  const plus200 = monthsToKeys({ ...base, monthly: monthly + 200, appreciation: s.likely.appreciation, savingsReturn: s.likely.savingsReturn })
  const coolPrices = monthsToKeys({ ...base, appreciation: s.optimistic.appreciation, savingsReturn: s.likely.savingsReturn })
  const saveDelta = isFinite(likelyMonths) && isFinite(plus200) ? likelyMonths - plus200 : 0
  const priceDelta = isFinite(likelyMonths) && isFinite(coolPrices) ? likelyMonths - coolPrices : 0
  let topLever = 'Saving more each month moves your date the most.'
  if (priceDelta > saveDelta && priceDelta >= 3) topLever = 'Home-price changes swing your date more than your saving does — a cooler market pulls it in by ' + Math.round(priceDelta) + ' months.'
  else if (saveDelta >= 3) topLever = 'Saving +$200/mo pulls your date in by about ' + Math.round(saveDelta) + ' months — your strongest lever.'

  return { likelyMonths, earliestMonths, latestMonths, qualifiesNow, incomeToQualify, topLever }
}

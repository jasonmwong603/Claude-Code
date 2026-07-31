/* Rent-vs-buy honesty check.
 *
 * KeyDate shouldn't only cheerlead buying. This compares, over a chosen horizon,
 * the net worth from BUYING (equity built, minus selling costs) against RENTING
 * and investing the money you didn't tie up (the down payment + closing, plus
 * the monthly difference between owning and renting). For plenty of people +
 * markets, renting-and-investing wins — and saying so is what makes the app
 * trustworthy. Illustrative model with disclosed assumptions; not advice. */
import { mortgagePayment } from './math'
import { RATE, CLOSING_RATE } from './config'

export interface RentBuyInput {
  price: number
  downPayment: number
  monthlyRent: number
  years: number
  /** Annual home-price appreciation. */
  appreciation: number
  /** Annual return on invested money (the renter's portfolio). */
  investReturn: number
  /** Annual rent inflation. */
  rentInflation: number
}

export interface RentBuyResult {
  buyNetWorth: number
  rentNetWorth: number
  buyMonthlyCost: number
  homeValueEnd: number
  equityEnd: number
  winner: 'buy' | 'rent' | 'tie'
  gap: number
}

/** Annual carrying cost as a share of home value: property tax + maintenance +
 *  insurance (rough, all-in). */
const CARRY_RATE = 0.024

export function rentVsBuy(i: RentBuyInput): RentBuyResult {
  const months = Math.round(i.years * 12)
  const principal = Math.max(0, i.price - i.downPayment)
  const rMo = RATE / 12
  const pay = mortgagePayment(principal)
  const upfront = i.downPayment + i.price * CLOSING_RATE

  // Amortise to the remaining balance after `months` payments.
  let bal = principal
  for (let m = 0; m < months; m++) {
    bal = bal + bal * rMo - pay
    if (bal < 0) bal = 0
  }

  const homeEnd = i.price * Math.pow(1 + i.appreciation, i.years)
  const equityEnd = homeEnd - bal
  const buyNetWorth = equityEnd - homeEnd * 0.05 // net of ~5% selling costs
  const buyMonthly = pay + (i.price * CARRY_RATE) / 12

  // Renter invests the upfront cash + each month's owning-vs-renting difference.
  let port = upfront
  let rent = i.monthlyRent
  const rInv = i.investReturn / 12
  const rentInflMo = Math.pow(1 + i.rentInflation, 1 / 12) - 1
  for (let m = 0; m < months; m++) {
    port = port * (1 + rInv) + Math.max(0, buyMonthly - rent)
    rent = rent * (1 + rentInflMo)
  }

  const gap = buyNetWorth - port
  const winner = Math.abs(gap) < homeEnd * 0.015 ? 'tie' : gap > 0 ? 'buy' : 'rent'
  return { buyNetWorth, rentNetWorth: port, buyMonthlyCost: buyMonthly, homeValueEnd: homeEnd, equityEnd, winner, gap: Math.abs(gap) }
}

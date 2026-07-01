import type { Transaction } from './types'

/** Generate a reasonably-unique id without extra dependencies. */
export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

/** A month key in the form "YYYY-MM". */
export function monthKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** The month key for the first day of the current month. */
export function currentMonthKey(): string {
  return monthKey(new Date())
}

/** Extract "YYYY-MM" from an ISO date string like "2026-07-14". */
export function monthOf(isoDate: string): string {
  return isoDate.slice(0, 7)
}

/** Human-friendly month label, e.g. "July 2026". */
export function formatMonth(key: string): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

/** Move a "YYYY-MM" key forward or backward by a number of months. */
export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return monthKey(d)
}

export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    // Fall back gracefully if an unknown currency code is stored.
    return value.toFixed(2)
  }
}

/** Today's date as an ISO "YYYY-MM-DD" string in local time. */
export function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Sum the amounts of the given transactions. */
export function sumAmounts(transactions: Transaction[]): number {
  return transactions.reduce((total, t) => total + t.amount, 0)
}

export function formatDay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

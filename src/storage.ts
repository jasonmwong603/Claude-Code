import type { BudgetState, Category } from './types'
import { uid } from './utils'

const STORAGE_KEY = 'monthly-budget:v1'

const DEFAULT_CATEGORIES: Category[] = [
  { id: uid(), name: 'Salary', type: 'income', budget: 4000, color: '#22c55e' },
  { id: uid(), name: 'Rent', type: 'expense', budget: 1500, color: '#ef4444' },
  { id: uid(), name: 'Groceries', type: 'expense', budget: 500, color: '#f97316' },
  { id: uid(), name: 'Transport', type: 'expense', budget: 150, color: '#3b82f6' },
  { id: uid(), name: 'Dining', type: 'expense', budget: 200, color: '#a855f7' },
  { id: uid(), name: 'Utilities', type: 'expense', budget: 250, color: '#14b8a6' },
  { id: uid(), name: 'Fun', type: 'expense', budget: 150, color: '#ec4899' },
  { id: uid(), name: 'Savings', type: 'expense', budget: 400, color: '#0ea5e9' },
]

export function defaultState(): BudgetState {
  return {
    categories: DEFAULT_CATEGORIES,
    transactions: [],
    currency: 'USD',
  }
}

/** Basic runtime validation so a corrupt/partial payload can't crash the app. */
function isValidState(value: unknown): value is BudgetState {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<BudgetState>
  return (
    Array.isArray(v.categories) &&
    Array.isArray(v.transactions) &&
    typeof v.currency === 'string'
  )
}

export function loadState(): BudgetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    if (!isValidState(parsed)) return defaultState()
    return parsed
  } catch {
    return defaultState()
  }
}

export function saveState(state: BudgetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode / quota). Fail silently;
    // the in-memory state still works for the current session.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: CategoryType
  /** Planned amount for a typical month, in the app's currency. */
  budget: number
  /** Hex color used for the category's accents and charts. */
  color: string
}

export interface Transaction {
  id: string
  categoryId: string
  /** Positive number. The sign is inferred from the category type. */
  amount: number
  /** ISO date string, e.g. "2026-07-01". */
  date: string
  note: string
}

export interface BudgetState {
  categories: Category[]
  transactions: Transaction[]
  /** ISO currency code used for formatting, e.g. "USD". */
  currency: string
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BudgetState, Category, Transaction } from '../types'
import { clearState, defaultState, loadState, saveState } from '../storage'
import { monthOf, sumAmounts, uid } from '../utils'

export interface CategorySummary {
  category: Category
  actual: number
  budget: number
  remaining: number
  /** 0..1 (may exceed 1 when over budget) share of budget spent. */
  ratio: number
  transactionCount: number
}

export interface MonthSummary {
  income: number
  plannedIncome: number
  expenses: number
  plannedExpenses: number
  net: number
  plannedNet: number
  categories: CategorySummary[]
}

export function useBudget() {
  const [state, setState] = useState<BudgetState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    setState((s) => ({
      ...s,
      categories: [...s.categories, { ...category, id: uid() }],
    }))
  }, [])

  const updateCategory = useCallback(
    (id: string, patch: Partial<Omit<Category, 'id'>>) => {
      setState((s) => ({
        ...s,
        categories: s.categories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }))
    },
    [],
  )

  const deleteCategory = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== id),
      // Remove orphaned transactions so totals stay correct.
      transactions: s.transactions.filter((t) => t.categoryId !== id),
    }))
  }, [])

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    setState((s) => ({
      ...s,
      transactions: [...s.transactions, { ...tx, id: uid() }],
    }))
  }, [])

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
      setState((s) => ({
        ...s,
        transactions: s.transactions.map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      }))
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      transactions: s.transactions.filter((t) => t.id !== id),
    }))
  }, [])

  const setCurrency = useCallback((currency: string) => {
    setState((s) => ({ ...s, currency }))
  }, [])

  const replaceState = useCallback((next: BudgetState) => {
    setState(next)
  }, [])

  const resetAll = useCallback(() => {
    clearState()
    setState(defaultState())
  }, [])

  /** Transactions for a given "YYYY-MM" month, newest first. */
  const transactionsForMonth = useCallback(
    (month: string): Transaction[] =>
      state.transactions
        .filter((t) => monthOf(t.date) === month)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.transactions],
  )

  const summarize = useCallback(
    (month: string): MonthSummary => {
      const monthTx = state.transactions.filter(
        (t) => monthOf(t.date) === month,
      )

      const categories: CategorySummary[] = state.categories.map((category) => {
        const txs = monthTx.filter((t) => t.categoryId === category.id)
        const actual = sumAmounts(txs)
        const budget = category.budget
        return {
          category,
          actual,
          budget,
          remaining: budget - actual,
          ratio: budget > 0 ? actual / budget : actual > 0 ? 1 : 0,
          transactionCount: txs.length,
        }
      })

      const income = categories
        .filter((c) => c.category.type === 'income')
        .reduce((sum, c) => sum + c.actual, 0)
      const expenses = categories
        .filter((c) => c.category.type === 'expense')
        .reduce((sum, c) => sum + c.actual, 0)
      const plannedIncome = state.categories
        .filter((c) => c.type === 'income')
        .reduce((sum, c) => sum + c.budget, 0)
      const plannedExpenses = state.categories
        .filter((c) => c.type === 'expense')
        .reduce((sum, c) => sum + c.budget, 0)

      return {
        income,
        plannedIncome,
        expenses,
        plannedExpenses,
        net: income - expenses,
        plannedNet: plannedIncome - plannedExpenses,
        categories,
      }
    },
    [state.categories, state.transactions],
  )

  const categoriesById = useMemo(() => {
    const map = new Map<string, Category>()
    for (const c of state.categories) map.set(c.id, c)
    return map
  }, [state.categories])

  return {
    state,
    categoriesById,
    addCategory,
    updateCategory,
    deleteCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setCurrency,
    replaceState,
    resetAll,
    transactionsForMonth,
    summarize,
  }
}

export type UseBudget = ReturnType<typeof useBudget>

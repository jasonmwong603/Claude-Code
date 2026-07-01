import { useEffect, useState } from 'react'
import type { Category, Transaction } from '../types'
import { todayIso } from '../utils'

interface Props {
  categories: Category[]
  /** Pre-selected category id (e.g. from a quick-add button). */
  defaultCategoryId?: string
  /** When set, the form edits an existing transaction. */
  editing?: Transaction
  onSubmit: (tx: Omit<Transaction, 'id'>) => void
  onCancel: () => void
}

export function TransactionForm({
  categories,
  defaultCategoryId,
  editing,
  onSubmit,
  onCancel,
}: Props) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(todayIso())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setAmount(String(editing.amount))
      setCategoryId(editing.categoryId)
      setDate(editing.date)
      setNote(editing.note)
    } else {
      setAmount('')
      setCategoryId(defaultCategoryId ?? categories[0]?.id ?? '')
      setDate(todayIso())
      setNote('')
    }
    setError('')
  }, [editing, defaultCategoryId, categories])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!categoryId) {
      setError('Pick a category first.')
      return
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    onSubmit({
      amount: Math.round(value * 100) / 100,
      categoryId,
      date,
      note: note.trim(),
    })
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <h2 className="section-title">
        {editing ? 'Edit transaction' : 'Add transaction'}
      </h2>

      <label className="field">
        <span>Amount</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </label>

      <label className="field">
        <span>Category</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          <optgroup label="Expenses">
            {categories
              .filter((c) => c.type === 'expense')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Income">
            {categories
              .filter((c) => c.type === 'income')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </optgroup>
        </select>
      </label>

      <label className="field">
        <span>Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Note (optional)</span>
        <input
          type="text"
          placeholder="e.g. Weekly shop"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="tx-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {editing ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  )
}

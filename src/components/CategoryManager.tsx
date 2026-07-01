import { useState } from 'react'
import type { Category, CategoryType } from '../types'
import { formatCurrency } from '../utils'

const PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6', '#a855f7', '#ec4899', '#64748b',
]

interface Props {
  categories: Category[]
  currency: string
  onAdd: (category: Omit<Category, 'id'>) => void
  onUpdate: (id: string, patch: Partial<Omit<Category, 'id'>>) => void
  onDelete: (id: string) => void
}

export function CategoryManager({
  categories,
  currency,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('expense')
  const [budget, setBudget] = useState('')
  const [color, setColor] = useState(PALETTE[0])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    const value = Number(budget)
    if (!trimmed || !Number.isFinite(value) || value < 0) return
    onAdd({ name: trimmed, type, budget: Math.round(value * 100) / 100, color })
    setName('')
    setBudget('')
  }

  return (
    <div className="card">
      <h2 className="section-title">Categories &amp; budgets</h2>

      <ul className="cat-list">
        {categories.map((c) => (
          <CategoryRow
            key={c.id}
            category={c}
            currency={currency}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>

      <form className="cat-add" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="cat-add__row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CategoryType)}
            aria-label="Category type"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            aria-label="Monthly budget"
          />
        </div>
        <div className="swatches">
          {PALETTE.map((p) => (
            <button
              type="button"
              key={p}
              className={`swatch ${p === color ? 'swatch--active' : ''}`}
              style={{ backgroundColor: p }}
              aria-label={`Use color ${p}`}
              onClick={() => setColor(p)}
            />
          ))}
        </div>
        <button type="submit" className="btn btn--primary btn--block">
          Add category
        </button>
      </form>
    </div>
  )
}

function CategoryRow({
  category,
  currency,
  onUpdate,
  onDelete,
}: {
  category: Category
  currency: string
  onUpdate: (id: string, patch: Partial<Omit<Category, 'id'>>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [budget, setBudget] = useState(String(category.budget))

  function commit() {
    const value = Number(budget)
    if (Number.isFinite(value) && value >= 0) {
      onUpdate(category.id, { budget: Math.round(value * 100) / 100 })
    } else {
      setBudget(String(category.budget))
    }
    setEditing(false)
  }

  return (
    <li className="cat-row">
      <span className="dot" style={{ backgroundColor: category.color }} aria-hidden />
      <span className="cat-row__name">
        {category.name}
        <span className={`tag tag--${category.type}`}>{category.type}</span>
      </span>
      {editing ? (
        <input
          className="cat-row__input"
          type="number"
          min="0"
          step="0.01"
          value={budget}
          autoFocus
          onChange={(e) => setBudget(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setBudget(String(category.budget))
              setEditing(false)
            }
          }}
        />
      ) : (
        <button
          className="cat-row__budget link-btn"
          onClick={() => setEditing(true)}
          title="Click to edit budget"
        >
          {formatCurrency(category.budget, currency)}
        </button>
      )}
      <button
        className="icon-btn icon-btn--sm"
        aria-label={`Delete ${category.name}`}
        onClick={() => {
          if (
            confirm(
              `Delete "${category.name}"? Its transactions will be removed too.`,
            )
          ) {
            onDelete(category.id)
          }
        }}
      >
        ✕
      </button>
    </li>
  )
}

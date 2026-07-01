import type { Category, Transaction } from '../types'
import { formatCurrency, formatDay } from '../utils'

interface Props {
  transactions: Transaction[]
  categoriesById: Map<string, Category>
  currency: string
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({
  transactions,
  categoriesById,
  currency,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="card">
      <h2 className="section-title">
        Transactions
        <span className="muted"> · {transactions.length}</span>
      </h2>

      {transactions.length === 0 ? (
        <div className="empty">
          No transactions this month yet. Add one to see it here.
        </div>
      ) : (
        <ul className="tx-list">
          {transactions.map((tx) => {
            const category = categoriesById.get(tx.categoryId)
            const isIncome = category?.type === 'income'
            return (
              <li key={tx.id} className="tx-item">
                <span
                  className="dot"
                  style={{ backgroundColor: category?.color ?? '#94a3b8' }}
                  aria-hidden
                />
                <div className="tx-item__main">
                  <span className="tx-item__title">
                    {category?.name ?? 'Uncategorized'}
                  </span>
                  <span className="muted tx-item__sub">
                    {formatDay(tx.date)}
                    {tx.note ? ` · ${tx.note}` : ''}
                  </span>
                </div>
                <span
                  className={`tx-item__amount ${isIncome ? 'income' : 'expense'}`}
                >
                  {isIncome ? '+' : '−'}
                  {formatCurrency(tx.amount, currency)}
                </span>
                <div className="tx-item__actions">
                  <button
                    className="icon-btn icon-btn--sm"
                    aria-label="Edit transaction"
                    onClick={() => onEdit(tx)}
                  >
                    ✎
                  </button>
                  <button
                    className="icon-btn icon-btn--sm"
                    aria-label="Delete transaction"
                    onClick={() => onDelete(tx.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

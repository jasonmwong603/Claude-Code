import type { CategorySummary } from '../hooks/useBudget'
import { formatCurrency } from '../utils'

interface Props {
  summaries: CategorySummary[]
  currency: string
  onQuickAdd: (categoryId: string) => void
}

export function CategoryProgress({ summaries, currency, onQuickAdd }: Props) {
  const expenses = summaries.filter((s) => s.category.type === 'expense')
  const income = summaries.filter((s) => s.category.type === 'income')

  if (summaries.length === 0) {
    return (
      <div className="card empty">
        No categories yet. Add one from the sidebar to get started.
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="section-title">Spending by category</h2>
      <div className="progress-list">
        {expenses.map((s) => (
          <ProgressRow
            key={s.category.id}
            summary={s}
            currency={currency}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>

      {income.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: 24 }}>
            Income sources
          </h2>
          <div className="progress-list">
            {income.map((s) => (
              <ProgressRow
                key={s.category.id}
                summary={s}
                currency={currency}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ProgressRow({
  summary,
  currency,
  onQuickAdd,
}: {
  summary: CategorySummary
  currency: string
  onQuickAdd: (categoryId: string) => void
}) {
  const { category, actual, budget, remaining, ratio } = summary
  const over = category.type === 'expense' && actual > budget && budget > 0
  const pct = Math.min(ratio, 1) * 100

  return (
    <div className="progress-row">
      <div className="progress-row__head">
        <span className="progress-row__name">
          <span
            className="dot"
            style={{ backgroundColor: category.color }}
            aria-hidden
          />
          {category.name}
        </span>
        <span className="progress-row__amounts">
          <strong>{formatCurrency(actual, currency)}</strong>
          <span className="muted"> / {formatCurrency(budget, currency)}</span>
        </span>
      </div>
      <div className="bar">
        <div
          className={`bar__fill ${over ? 'bar__fill--over' : ''}`}
          style={{
            width: `${pct}%`,
            backgroundColor: over ? undefined : category.color,
          }}
        />
      </div>
      <div className="progress-row__foot">
        <span className={`muted ${over ? 'expense' : ''}`}>
          {category.type === 'expense'
            ? over
              ? `${formatCurrency(-remaining, currency)} over budget`
              : `${formatCurrency(remaining, currency)} left`
            : `${formatCurrency(remaining, currency)} to goal`}
        </span>
        <button
          className="link-btn"
          onClick={() => onQuickAdd(category.id)}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

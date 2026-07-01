import type { MonthSummary } from '../hooks/useBudget'
import { formatCurrency } from '../utils'

interface Props {
  summary: MonthSummary
  currency: string
}

export function SummaryCards({ summary, currency }: Props) {
  const { income, expenses, net, plannedExpenses } = summary
  const spentRatio = plannedExpenses > 0 ? expenses / plannedExpenses : 0
  const netPositive = net >= 0

  return (
    <div className="summary">
      <div className="card summary__card">
        <span className="summary__label">Income</span>
        <span className="summary__value income">
          {formatCurrency(income, currency)}
        </span>
        <span className="summary__hint">
          planned {formatCurrency(summary.plannedIncome, currency)}
        </span>
      </div>

      <div className="card summary__card">
        <span className="summary__label">Expenses</span>
        <span className="summary__value expense">
          {formatCurrency(expenses, currency)}
        </span>
        <span className="summary__hint">
          planned {formatCurrency(plannedExpenses, currency)}
        </span>
      </div>

      <div className="card summary__card">
        <span className="summary__label">
          {netPositive ? 'Left over' : 'Over budget'}
        </span>
        <span className={`summary__value ${netPositive ? 'income' : 'expense'}`}>
          {formatCurrency(net, currency)}
        </span>
        <span className="summary__hint">
          {Math.round(spentRatio * 100)}% of planned spending used
        </span>
      </div>
    </div>
  )
}

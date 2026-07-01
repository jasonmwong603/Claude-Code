import { currentMonthKey, formatMonth, shiftMonth } from '../utils'

interface Props {
  month: string
  onChange: (month: string) => void
}

export function MonthNavigator({ month, onChange }: Props) {
  const isCurrent = month === currentMonthKey()
  return (
    <div className="month-nav">
      <button
        className="icon-btn"
        aria-label="Previous month"
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        ‹
      </button>
      <div className="month-nav__label">
        <span>{formatMonth(month)}</span>
        {!isCurrent && (
          <button
            className="link-btn"
            onClick={() => onChange(currentMonthKey())}
          >
            Jump to today
          </button>
        )}
      </div>
      <button
        className="icon-btn"
        aria-label="Next month"
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        ›
      </button>
    </div>
  )
}

import { useRef } from 'react'
import type { BudgetState } from '../types'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CNY', 'BRL', 'MXN']

interface Props {
  state: BudgetState
  onCurrencyChange: (currency: string) => void
  onImport: (state: BudgetState) => void
  onReset: () => void
}

export function DataPanel({
  state,
  onCurrencyChange,
  onImport,
  onReset,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (
          parsed &&
          Array.isArray(parsed.categories) &&
          Array.isArray(parsed.transactions)
        ) {
          onImport({ currency: 'USD', ...parsed })
        } else {
          alert('That file does not look like a budget backup.')
        }
      } catch {
        alert('Could not read that file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="card">
      <h2 className="section-title">Settings &amp; data</h2>

      <label className="field">
        <span>Currency</span>
        <select
          value={state.currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="data-actions">
        <button className="btn btn--ghost" onClick={handleExport}>
          Export backup
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => fileInput.current?.click()}
        >
          Import backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          hidden
          onChange={handleImportFile}
        />
      </div>

      <button
        className="btn btn--danger btn--block"
        onClick={() => {
          if (
            confirm(
              'Reset everything back to the starter categories? This clears all transactions.',
            )
          ) {
            onReset()
          }
        }}
      >
        Reset all data
      </button>

      <p className="privacy-note">
        Your data never leaves this browser — it is stored locally on your
        device. Use “Export backup” to keep a copy.
      </p>
    </div>
  )
}

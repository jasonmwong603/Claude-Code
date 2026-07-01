import { useMemo, useState } from 'react'
import type { Transaction } from './types'
import { useBudget } from './hooks/useBudget'
import { currentMonthKey } from './utils'
import { MonthNavigator } from './components/MonthNavigator'
import { SummaryCards } from './components/SummaryCards'
import { CategoryProgress } from './components/CategoryProgress'
import { TransactionList } from './components/TransactionList'
import { TransactionForm } from './components/TransactionForm'
import { CategoryManager } from './components/CategoryManager'
import { DataPanel } from './components/DataPanel'

type Tab = 'overview' | 'manage'

interface FormState {
  editing?: Transaction
  categoryId?: string
}

export default function App() {
  const budget = useBudget()
  const [month, setMonth] = useState(currentMonthKey())
  const [tab, setTab] = useState<Tab>('overview')
  const [form, setForm] = useState<FormState | null>(null)

  const summary = useMemo(() => budget.summarize(month), [budget, month])
  const monthTx = useMemo(
    () => budget.transactionsForMonth(month),
    [budget, month],
  )

  function closeForm() {
    setForm(null)
  }

  function handleSubmit(tx: Omit<Transaction, 'id'>) {
    if (form?.editing) {
      budget.updateTransaction(form.editing.id, tx)
    } else {
      budget.addTransaction(tx)
    }
    closeForm()
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__mark">◍</span>
          <h1>Monthly Budget</h1>
        </div>
        <MonthNavigator month={month} onChange={setMonth} />
        <button
          className="btn btn--primary"
          onClick={() => setForm({})}
        >
          + Transaction
        </button>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${tab === 'overview' ? 'tab--active' : ''}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${tab === 'manage' ? 'tab--active' : ''}`}
          onClick={() => setTab('manage')}
        >
          Manage
        </button>
      </nav>

      <main className="app__main">
        {tab === 'overview' ? (
          <>
            <SummaryCards summary={summary} currency={budget.state.currency} />
            <div className="grid">
              <CategoryProgress
                summaries={summary.categories}
                currency={budget.state.currency}
                onQuickAdd={(categoryId) => setForm({ categoryId })}
              />
              <TransactionList
                transactions={monthTx}
                categoriesById={budget.categoriesById}
                currency={budget.state.currency}
                onEdit={(tx) => setForm({ editing: tx })}
                onDelete={budget.deleteTransaction}
              />
            </div>
          </>
        ) : (
          <div className="grid">
            <CategoryManager
              categories={budget.state.categories}
              currency={budget.state.currency}
              onAdd={budget.addCategory}
              onUpdate={budget.updateCategory}
              onDelete={budget.deleteCategory}
            />
            <DataPanel
              state={budget.state}
              onCurrencyChange={budget.setCurrency}
              onImport={budget.replaceState}
              onReset={budget.resetAll}
            />
          </div>
        )}
      </main>

      {form && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={closeForm} />
          <div className="modal__panel card">
            <TransactionForm
              categories={budget.state.categories}
              defaultCategoryId={form.categoryId}
              editing={form.editing}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      <footer className="app__footer">
        Private &amp; offline · your data stays in this browser
      </footer>
    </div>
  )
}

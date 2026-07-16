import type { PlaidAccount, PlaidItem } from '../types'
import { SANDBOX_INSTITUTIONS, sampleAccounts } from '../data/plaidSandbox'

/* ============================================================================
   Bank view — PLAID-SHAPED PROTOTYPE (read-only, sandbox/simulated).

   KeyDate is a static, on-device app today, so there is no server to hold a
   Plaid secret or exchange tokens — a real Plaid connection is impossible from
   the browser alone. This module SIMULATES the Plaid flow with sample sandbox
   data so the UX and data shapes are real. Nothing here touches a real bank,
   and no credentials are ever collected.

   ── Going live with real Plaid (read-only) later ──────────────────────────
   You add a small backend with your Plaid client_id + secret and three routes,
   then replace the three functions marked "REAL PLAID SEAM" below:

     1. createLinkToken()      → POST your-api/plaid/link-token
                                  server calls /link/token/create
                                  (products: ['balance'] or ['transactions'],
                                   country_codes: ['CA'], language: 'en')
     2. exchangePublicToken(t) → POST your-api/plaid/exchange { public_token }
                                  server calls /item/public_token/exchange,
                                  stores the access_token server-side (never in
                                  the app)
     3. getBalances()          → POST your-api/plaid/balances
                                  server calls /accounts/balance/get and returns
                                  accounts in the shape below (PlaidAccount[])

   On the client you also add the Plaid Link SDK (Plaid hosts the secure bank
   login — KeyDate never sees the user's credentials):
     const { link_token } = await createLinkToken()
     Plaid.create({ token: link_token, onSuccess: (public_token) =>
       exchangePublicToken(public_token) }).open()

   The Bank screen only calls loadItems / connectSandbox / refreshBalances /
   toggleCountToward / disconnect(All) / bankSummary — so wiring real Plaid in
   is contained to this file. Scope stays read-only: no payments, no transfers.
   ========================================================================== */

const KEY = 'keydate-bank-v1'

function read(): PlaidItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PlaidItem[]) : []
  } catch {
    return []
  }
}

function write(items: PlaidItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // storage unavailable — the session copy still works
  }
}

export function loadItems(): PlaidItem[] {
  return read()
}

export function isLinked(): boolean {
  return read().length > 0
}

/** Simulate linking an institution (stands in for Plaid Link + token exchange
 *  + the first balance fetch). */
export function connectSandbox(institutionId: string): PlaidItem {
  const inst = SANDBOX_INSTITUTIONS.find((i) => i.id === institutionId) ?? SANDBOX_INSTITUTIONS[0]
  const now = new Date().toISOString()
  const item: PlaidItem = {
    item_id: `sandbox-${Date.now()}`,
    institution_id: inst.id,
    institution_name: inst.name,
    emoji: inst.emoji,
    accounts: sampleAccounts(),
    linkedAt: now,
    lastRefreshed: now,
  }
  write([...read(), item])
  return item
}

/** Simulate a fresh /accounts/balance/get: nudge balances a little (interest,
 *  spending) and stamp the refresh time — the "near-real-time" behaviour. */
export function refreshBalances(): PlaidItem[] {
  const now = new Date().toISOString()
  const items = read().map((item) => ({
    ...item,
    lastRefreshed: now,
    accounts: item.accounts.map((a) => {
      const drift = (Math.random() - 0.4) * (a.subtype === 'checking' ? 120 : 40)
      const current = Math.max(0, Math.round((a.balances.current + drift) * 100) / 100)
      return { ...a, balances: { ...a.balances, current, available: current } }
    }),
  }))
  write(items)
  return items
}

export function toggleCountToward(itemId: string, accountId: string): PlaidItem[] {
  const items = read().map((item) =>
    item.item_id !== itemId
      ? item
      : {
          ...item,
          accounts: item.accounts.map((a) =>
            a.account_id === accountId ? { ...a, countTowardGoal: !a.countTowardGoal } : a,
          ),
        },
  )
  write(items)
  return items
}

export function disconnect(itemId: string): PlaidItem[] {
  const items = read().filter((i) => i.item_id !== itemId)
  write(items)
  return items
}

export function disconnectAll(): void {
  write([])
}

/** Sum of balances across accounts the user marked as counting toward the fund. */
export function fundTotal(items: PlaidItem[] = read()): number {
  return items
    .flatMap((i) => i.accounts)
    .filter((a) => a.countTowardGoal)
    .reduce((sum, a) => sum + (a.balances.current || 0), 0)
}

export interface BankSummary {
  linked: boolean
  institutions: number
  accounts: number
  fundTotal: number
  lastRefreshed?: string
}

export function bankSummary(): BankSummary {
  const items = read()
  const accounts = items.reduce((n, i) => n + i.accounts.length, 0)
  const lastRefreshed = items
    .map((i) => i.lastRefreshed)
    .sort()
    .pop()
  return { linked: items.length > 0, institutions: items.length, accounts, fundTotal: fundTotal(items), lastRefreshed }
}

export function refreshedAgo(iso?: string): string {
  if (!iso) return ''
  const s = Math.floor((Date.now() - +new Date(iso)) / 1000)
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/* ── REAL PLAID SEAMS (unused by the prototype; wire these to your backend) ──
   Kept as typed stubs so the production integration has an obvious home. */

/** REAL PLAID SEAM 1 — get a Link token from your backend. */
export async function createLinkToken(): Promise<string> {
  throw new Error('PLAID_BACKEND_NOT_CONFIGURED')
}

/** REAL PLAID SEAM 2 — exchange the Link public_token via your backend. */
export async function exchangePublicToken(_publicToken: string): Promise<void> {
  throw new Error('PLAID_BACKEND_NOT_CONFIGURED')
}

/** REAL PLAID SEAM 3 — fetch live balances via your backend. */
export async function getBalances(): Promise<PlaidAccount[]> {
  throw new Error('PLAID_BACKEND_NOT_CONFIGURED')
}

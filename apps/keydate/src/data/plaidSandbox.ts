import type { PlaidAccount } from '../types'

/* Plaid's real sandbox institutions (ids match Plaid's sandbox) so the prototype
   feels authentic and maps 1:1 to a real integration later. */
export const SANDBOX_INSTITUTIONS: { id: string; name: string; emoji: string }[] = [
  { id: 'ins_109508', name: 'First Platypus Bank', emoji: '🦫' },
  { id: 'ins_109511', name: 'Tartan Bank', emoji: '🧣' },
  { id: 'ins_109510', name: 'Houndstooth Bank', emoji: '🐾' },
  { id: 'ins_109512', name: 'Tattersall Federal Credit Union', emoji: '🏦' },
  { id: 'ins_109509', name: 'First Gingham Credit Union', emoji: '🧵' },
]

const rid = () => Math.random().toString(36).slice(2, 10)
const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 100) / 100

/** Build a realistic set of read-only accounts for a freshly linked bank.
 *  A chequing account, a high-interest savings, and an FHSA — with the savings
 *  accounts pre-marked as counting toward the home fund. */
export function sampleAccounts(): PlaidAccount[] {
  return [
    {
      account_id: rid(),
      name: 'Everyday Chequing',
      mask: '0000',
      type: 'depository',
      subtype: 'checking',
      balances: { available: jitter(2400, 600), current: jitter(2450, 600), iso_currency_code: 'CAD' },
      countTowardGoal: false,
    },
    {
      account_id: rid(),
      name: 'High-Interest Savings',
      mask: '1111',
      type: 'depository',
      subtype: 'savings',
      balances: { available: jitter(14200, 1500), current: jitter(14200, 1500), iso_currency_code: 'CAD' },
      countTowardGoal: true,
    },
    {
      account_id: rid(),
      name: 'FHSA — First Home',
      mask: '2222',
      type: 'depository',
      subtype: 'savings',
      balances: { available: jitter(6800, 900), current: jitter(6800, 900), iso_currency_code: 'CAD' },
      countTowardGoal: true,
    },
  ]
}

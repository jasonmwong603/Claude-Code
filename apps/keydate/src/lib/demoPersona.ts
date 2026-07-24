/* One-tap demo account. Loads an aspirational, mid-journey state so a live
 * walkthrough shows the full experience — progress, streak, badges, a linked
 * bank, a customized character — instead of a cold 0% start. Everything here is
 * fabricated sample data for demos only. */
import type { AppState, Contribution, PlaidItem } from '../types'
import { DEFAULT_PROFILE } from '../data/cosmetics'
import { DEFAULT_AVATAR } from './avatar'

const BANK_KEY = 'keydate-bank-v1'

function monthsAgoFirst(n: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - n, 1)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

/** 14 consecutive monthly deposits (drives the streak + saved total). */
function demoContributions(): Contribution[] {
  const amounts = [2000, 2100, 2200, 2000, 2300, 2100, 2200, 2400, 2000, 2300, 2100, 2200, 2000, 2100]
  return amounts.map((amount, i) => ({ date: monthsAgoFirst(amounts.length - i), amount }))
}

export function buildDemoState(): AppState {
  const contributions = demoContributions()
  return {
    plan: {
      location: 'Toronto, ON',
      base: 1350000,
      homeType: 'townhouse',
      income: 115000,
      startingSavings: 13000,
      monthly: 2100,
      target: 680000,
      createdAt: monthsAgoFirst(14),
      targetSource: 'area',
    },
    contributions,
    earnedBadges: [
      'plan', 'first', 'firstLesson', 'bank',
      'save1k', 'save5k', 'save10k', 'save25k',
      'streak3', 'streak6', 'streak12',
      'learn3', 'learnStage',
    ],
    completedLessons: ['fhsa', 'downpayment', 'automate', 'credit', 'preapproval'],
    xp: 1180,
    lastVisit: new Date().toDateString(),
    profile: {
      ...DEFAULT_PROFILE,
      displayName: 'Alex Chen',
      bio: 'Saving for a first townhouse in Toronto. FHSA maxed, HBP on deck.',
      avatar: { ...DEFAULT_AVATAR },
      frame: 'gold',
    },
  }
}

/** Seed a linked sandbox bank so the Bank screen + dashboard show real balances
 *  that back up the earned savings badges (~$41K counting toward the goal). */
export function seedDemoBank(): void {
  const now = new Date().toISOString()
  const item: PlaidItem = {
    item_id: 'demo-bank',
    institution_id: 'ins_109508',
    institution_name: 'First Platypus Bank',
    emoji: '🦫',
    linkedAt: monthsAgoFirst(12),
    lastRefreshed: now,
    accounts: [
      { account_id: 'demo-chq', name: 'Everyday Chequing', mask: '1121', type: 'depository', subtype: 'chequing',
        balances: { available: 2450, current: 2450, iso_currency_code: 'CAD' }, countTowardGoal: false },
      { account_id: 'demo-hisa', name: 'High-Interest Savings', mask: '4412', type: 'depository', subtype: 'savings',
        balances: { available: 20500, current: 20500, iso_currency_code: 'CAD' }, countTowardGoal: true },
      { account_id: 'demo-fhsa', name: 'FHSA — First Home', mask: '7788', type: 'depository', subtype: 'other',
        balances: { available: 21000, current: 21000, iso_currency_code: 'CAD' }, countTowardGoal: true },
    ],
  }
  try {
    localStorage.setItem(BANK_KEY, JSON.stringify([item]))
  } catch {
    /* storage unavailable — session still works */
  }
}

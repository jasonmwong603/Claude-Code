import type { Badge, Contribution, Level } from '../types'
import { LESSONS, STAGES } from '../data/curriculum'

export const KEYRING: Badge[] = [
  { id: 'plan', label: 'Plan started', emoji: '🗝️' },
  { id: 'first', label: 'First deposit', emoji: '🔑' },
  { id: 'firstLesson', label: 'First lesson', emoji: '📖' },
  { id: 'bank', label: 'Bank linked', emoji: '🔗' },
  { id: 'save1k', label: 'First $1K', emoji: '💵' },
  { id: 'save5k', label: '$5K saved', emoji: '💰' },
  { id: 'save10k', label: '$10K saved', emoji: '🏦' },
  { id: 'save25k', label: '$25K saved', emoji: '💎' },
  { id: 'save50k', label: '$50K saved', emoji: '🪙' },
  { id: 'done', label: 'Fully funded', emoji: '🏠' },
  { id: 'streak3', label: '3-month streak', emoji: '🔥' },
  { id: 'streak6', label: '6-month streak', emoji: '🌟' },
  { id: 'streak12', label: '1-year streak', emoji: '🗓️' },
  { id: 'learn3', label: '3 lessons done', emoji: '📗' },
  { id: 'learnStage', label: 'Stage mastered', emoji: '🎓' },
  { id: 'learnAll', label: 'Curriculum done', emoji: '🏆' },
]

/** Below this goal, "fully funded" won't count — stops the exploit of lowering
 *  the goal to a trivial number to claim 100%. */
export const GOAL_FLOOR = 10000

/** The slice of state the badge rules read. Money achievements use a *verified*
 *  saved amount: the real bank balance when a bank is connected, else the
 *  self-reported total — so plan/goal edits can't fake dollar milestones. */
export interface BadgeSnapshot {
  contributions: Contribution[]
  streak: number
  completedLessons: string[]
  savedSelf: number
  goal: number
  bankLinked: boolean
  bankSaved: number
}

export function badgeTests(s: BadgeSnapshot): Record<string, boolean> {
  const verified = s.bankLinked ? s.bankSaved : s.savedSelf
  const stageDone = STAGES.some((st) =>
    LESSONS.filter((l) => l.stage === st.id).every((l) => s.completedLessons.includes(l.id)),
  )
  return {
    plan: true,
    first: s.contributions.length >= 1,
    firstLesson: s.completedLessons.length >= 1,
    bank: s.bankLinked,
    save1k: verified >= 1000,
    save5k: verified >= 5000,
    save10k: verified >= 10000,
    save25k: verified >= 25000,
    save50k: verified >= 50000,
    done: verified >= s.goal && s.goal >= GOAL_FLOOR,
    streak3: s.streak >= 3,
    streak6: s.streak >= 6,
    streak12: s.streak >= 12,
    learn3: s.completedLessons.length >= 3,
    learnStage: stageDone,
    learnAll: s.completedLessons.length === LESSONS.length,
  }
}

function monthKeyOf(dateStr: string): number {
  const d = new Date(dateStr)
  return d.getFullYear() * 12 + d.getMonth()
}

/** Count consecutive months (ending this month or last month) with a deposit. */
export function calcStreak(contributions: Contribution[]): number {
  if (!contributions.length) return 0
  const months = [...new Set(contributions.map((c) => monthKeyOf(c.date)))].sort((a, b) => b - a)
  const now = monthKeyOf(new Date().toISOString())
  if (months[0] !== now && months[0] !== now - 1) return 0
  let streak = 1
  for (let i = 1; i < months.length; i++) {
    if (months[i] === months[i - 1] - 1) streak++
    else break
  }
  return streak
}

/* ————— XP & levels ————— */
export const LEVELS: Level[] = [
  { xp: 0, title: 'Dreamer' },
  { xp: 150, title: 'Saver' },
  { xp: 400, title: 'Planner' },
  { xp: 800, title: 'House Hunter' },
  { xp: 1300, title: 'Negotiator' },
  { xp: 1900, title: 'Almost Home' },
  { xp: 2600, title: 'Key Holder' },
]

export interface LevelInfo {
  level: number
  title: string
  pct: number
  toNext: number
  max: boolean
}

export function levelInfo(xp = 0): LevelInfo {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i
  const next = LEVELS[idx + 1]
  return {
    level: idx + 1,
    title: LEVELS[idx].title,
    pct: next ? (xp - LEVELS[idx].xp) / (next.xp - LEVELS[idx].xp) : 1,
    toNext: next ? next.xp - xp : 0,
    max: !next,
  }
}

import type { Badge, Contribution, Level } from '../types'
import { LESSONS, STAGES } from '../data/curriculum'

export const KEYRING: Badge[] = [
  { id: 'plan', label: 'Plan started', emoji: '🗝️' },
  { id: 'first', label: 'First deposit', emoji: '🔑' },
  { id: 'p10', label: '10% saved', emoji: '🥉' },
  { id: 'p25', label: '25% saved', emoji: '🥈' },
  { id: 'p50', label: 'Halfway', emoji: '🥇' },
  { id: 'p75', label: '75% saved', emoji: '💎' },
  { id: 'done', label: 'Fully funded', emoji: '🏠' },
  { id: 'streak3', label: '3-month streak', emoji: '🔥' },
  { id: 'streak6', label: '6-month streak', emoji: '🌟' },
  { id: 'learn3', label: '3 lessons done', emoji: '📗' },
  { id: 'learnStage', label: 'Stage mastered', emoji: '🎓' },
  { id: 'learnAll', label: 'Curriculum complete', emoji: '🏆' },
]

/** The slice of state the badge rules read. */
export interface BadgeSnapshot {
  contributions: Contribution[]
  progress: number
  streak: number
  completedLessons: string[]
}

export function badgeTests(s: BadgeSnapshot): Record<string, boolean> {
  const stageDone = STAGES.some((st) =>
    LESSONS.filter((l) => l.stage === st.id).every((l) => s.completedLessons.includes(l.id)),
  )
  return {
    plan: true,
    first: s.contributions.length >= 1,
    p10: s.progress >= 0.1,
    p25: s.progress >= 0.25,
    p50: s.progress >= 0.5,
    p75: s.progress >= 0.75,
    done: s.progress >= 1,
    streak3: s.streak >= 3,
    streak6: s.streak >= 6,
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

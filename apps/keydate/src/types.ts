/* Shared domain types for KeyDate. */

export type HomeTypeKey =
  | 'apartment'
  | 'townhouse'
  | 'semi'
  | 'bungalow'
  | 'twostorey'
  | 'mobile'
  | 'land'

export type StageId = 'save' | 'prep' | 'search' | 'close'

export interface Plan {
  location: string
  /** Average detached price for the area, before the home-type multiplier. */
  base: number
  homeType: HomeTypeKey
  /** Household income, before tax, per year. */
  income: number
  startingSavings: number
  /** Amount the user plans to set aside each month. */
  monthly: number
  /** Convergence-derived target purchase price for the chosen home type. */
  target: number
  createdAt: string
  /** Optional plan tweaks applied from the "faster paths" cards. */
  coBuyer?: boolean
}

export interface Contribution {
  date: string
  amount: number
}

export interface AppState {
  plan: Plan
  contributions: Contribution[]
  earnedBadges: string[]
  completedLessons: string[]
  xp: number
  lastVisit: string
}

export interface Quiz {
  q: string
  options: string[]
  answer: number
  why: string
}

export interface Lesson {
  id: string
  stage: StageId
  emoji: string
  title: string
  mins: number
  cards: string[]
  quiz: Quiz
}

export interface Stage {
  id: StageId
  label: string
  /** Savings-progress fraction (0–1) at which this stage's lessons unlock. */
  unlockAt: number
}

export interface Badge {
  id: string
  label: string
  emoji: string
}

export interface Level {
  xp: number
  title: string
}

/** Result of resolving a location to an average price during onboarding. */
export interface ResolvedLocation {
  name: string
  base: number
  source: string
}

/* ————— Community forum ————— */
export type ForumCategory = 'milestone' | 'firsthome' | 'advice' | 'question'

export interface ForumPost {
  id: string
  author: string
  avatar: string
  location?: string
  category: ForumCategory
  title: string
  body: string
  createdAt: string
  likes: number
  /** True for posts written by this device's user (deletable, pre-liked state). */
  mine?: boolean
}

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

/** How the target price was set: the area's typical price, or a specific number
 *  the user chose (a listing they found, or a budget they're envisioning). */
export type TargetSource = 'area' | 'custom'

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
  /** Where `target` came from (defaults to 'area' when absent). */
  targetSource?: TargetSource
  /** A name for a custom target, e.g. "123 Elm St" or "My budget". */
  targetLabel?: string
  /** Optional link to the listing a custom target is based on. */
  listingUrl?: string
}

export interface Contribution {
  date: string
  amount: number
}

import type { AvatarConfig } from './lib/avatar'

/** Customizable profile / calling card. The avatar is a layered pixel character
 *  (see lib/avatar.ts); frame/banner/title point at items in data/cosmetics.ts.
 *  Cosmetics and premium avatar options unlock as the user's level rises. */
export interface Profile {
  displayName: string
  bio: string
  avatar: AvatarConfig
  frame: string
  banner: string
  title: string
}

export interface AppState {
  plan: Plan
  contributions: Contribution[]
  earnedBadges: string[]
  completedLessons: string[]
  xp: number
  lastVisit: string
  profile?: Profile
  /** "Focus mode": dials down the game layer (levels/XP/avatar chrome) for users
   *  who want a straight financial tool. Defaults to off. */
  focusMode?: boolean
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

/** A photo or video attached to a post. `id` points at a blob in IndexedDB
 *  (user uploads); `url` is a ready-to-use source (seeded examples). */
export interface PostMediaRef {
  kind: 'image' | 'video'
  id?: string
  url?: string
}

/* ————— Bank view (Plaid-shaped) —————
   These mirror Plaid's /accounts/balance/get response so the prototype's mock
   data and the real API are interchangeable. */
export interface PlaidBalance {
  available: number | null
  current: number
  iso_currency_code: string
}

export interface PlaidAccount {
  account_id: string
  name: string
  mask: string
  type: string
  subtype: string
  balances: PlaidBalance
  /** App-local: whether this account's balance counts toward the home fund. */
  countTowardGoal?: boolean
}

/** A linked institution (Plaid "Item") plus its accounts. */
export interface PlaidItem {
  item_id: string
  institution_id: string
  institution_name: string
  emoji: string
  accounts: PlaidAccount[]
  linkedAt: string
  lastRefreshed: string
}

export interface ForumNotification {
  id: string
  actorName: string | null
  type: 'reply' | 'like' | 'follow'
  postId: string | null
  postTitle: string | null
  excerpt: string | null
  read: boolean
  createdAt: string
}

export interface ForumReply {
  id: string
  postId: string
  authorId?: string | null
  author: string
  avatar: string
  body: string
  createdAt: string
  /** True for replies written by the current user (deletable). */
  mine?: boolean
}

export interface ForumPost {
  id: string
  /** The post author's account id (shared mode), or undefined for local/seed posts. */
  authorId?: string | null
  author: string
  avatar: string
  location?: string
  /** Number of replies on this post (shared mode). */
  replyCount?: number
  category: ForumCategory
  title: string
  body: string
  createdAt: string
  likes: number
  media?: PostMediaRef
  /** True for posts written by this device's user (deletable, pre-liked state). */
  mine?: boolean
}

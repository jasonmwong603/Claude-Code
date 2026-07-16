import type { Profile } from '../types'

/* The cosmetics wardrobe. Everything unlocks by level (XP). Level 1 items are
   the starting kit; higher tiers are earned by progressing. Kept emoji- and
   CSS-driven to match the "prairie dawn" look without heavy assets. */

export interface AvatarItem {
  id: string
  label: string
  unlockLevel: number
  emoji: string
}
export interface AccessoryItem {
  id: string
  label: string
  unlockLevel: number
  emoji: string | null
}
export interface FrameItem {
  id: string
  label: string
  unlockLevel: number
  border: string
  boxShadow?: string
  bg: string
}
export interface BannerItem {
  id: string
  label: string
  unlockLevel: number
  background: string
  text: 'light' | 'dark'
}
export interface TitleItem {
  id: string
  label: string
  unlockLevel: number
}

export const AVATARS: AvatarItem[] = [
  { id: 'sprout', label: 'Sprout', unlockLevel: 1, emoji: '🌱' },
  { id: 'key', label: 'Key', unlockLevel: 1, emoji: '🔑' },
  { id: 'beaver', label: 'Beaver', unlockLevel: 1, emoji: '🦫' },
  { id: 'person', label: 'You', unlockLevel: 1, emoji: '🧑' },
  { id: 'house', label: 'Cozy House', unlockLevel: 2, emoji: '🏠' },
  { id: 'owl', label: 'Wise Owl', unlockLevel: 2, emoji: '🦉' },
  { id: 'squirrel', label: 'Saver Squirrel', unlockLevel: 3, emoji: '🐿️' },
  { id: 'fox', label: 'Sly Fox', unlockLevel: 4, emoji: '🦊' },
  { id: 'moose', label: 'Moose', unlockLevel: 4, emoji: '🫎' },
  { id: 'bear', label: 'Bear', unlockLevel: 5, emoji: '🐻' },
  { id: 'maple', label: 'Maple', unlockLevel: 6, emoji: '🍁' },
  { id: 'unicorn', label: 'Dream Home', unlockLevel: 7, emoji: '🦄' },
]

export const ACCESSORIES: AccessoryItem[] = [
  { id: 'none', label: 'None', unlockLevel: 1, emoji: null },
  { id: 'cap', label: 'Ball Cap', unlockLevel: 2, emoji: '🧢' },
  { id: 'grad', label: 'Grad Cap', unlockLevel: 3, emoji: '🎓' },
  { id: 'scarf', label: 'Scarf', unlockLevel: 3, emoji: '🧣' },
  { id: 'shades', label: 'Shades', unlockLevel: 4, emoji: '🕶️' },
  { id: 'hardhat', label: 'Hard Hat', unlockLevel: 5, emoji: '⛑️' },
  { id: 'tophat', label: 'Top Hat', unlockLevel: 5, emoji: '🎩' },
  { id: 'sparkle', label: 'Sparkles', unlockLevel: 6, emoji: '✨' },
  { id: 'crown', label: 'Crown', unlockLevel: 7, emoji: '👑' },
]

export const FRAMES: FrameItem[] = [
  { id: 'simple', label: 'Simple', unlockLevel: 1, border: '3px solid #DDE4DC', bg: '#E3F2E9' },
  { id: 'sprout', label: 'Sprout', unlockLevel: 2, border: '3px solid #3FA672', bg: '#E3F2E9' },
  { id: 'gold', label: 'Gold', unlockLevel: 3, border: '3px solid #E8B84B', bg: '#FBF3DD' },
  {
    id: 'double',
    label: 'Double Gold',
    unlockLevel: 5,
    border: '3px solid #E8B84B',
    boxShadow: '0 0 0 3px #fff, 0 0 0 6px #E8B84B',
    bg: '#FBF3DD',
  },
  {
    id: 'gem',
    label: 'Gem',
    unlockLevel: 6,
    border: '3px solid #7db2d9',
    boxShadow: '0 0 0 4px #BFDFF0',
    bg: '#EAF4FB',
  },
  {
    id: 'royal',
    label: 'Key Holder',
    unlockLevel: 7,
    border: '3px solid #E8B84B',
    boxShadow: '0 0 0 4px #1E4D3B, 0 0 0 8px #E8B84B',
    bg: '#FBF3DD',
  },
]

export const BANNERS: BannerItem[] = [
  { id: 'paper', label: 'Paper', unlockLevel: 1, background: '#EFF2EA', text: 'dark' },
  { id: 'spruce', label: 'Spruce', unlockLevel: 1, background: '#1E4D3B', text: 'light' },
  { id: 'sproutGrad', label: 'Sprout Fade', unlockLevel: 2, background: 'linear-gradient(135deg,#3FA672,#1E4D3B)', text: 'light' },
  { id: 'goldGrad', label: 'Golden Hour', unlockLevel: 3, background: 'linear-gradient(135deg,#F0C766,#C88A1E)', text: 'dark' },
  { id: 'dawn', label: 'Prairie Dawn', unlockLevel: 4, background: 'linear-gradient(135deg,#FBF3DD,#E3F2E9)', text: 'dark' },
  { id: 'night', label: 'Night', unlockLevel: 5, background: 'linear-gradient(160deg,#12241E,#1E4D3B)', text: 'light' },
  { id: 'aurora', label: 'Aurora', unlockLevel: 6, background: 'linear-gradient(120deg,#1E4D3B,#3FA672,#7db2d9,#E8B84B)', text: 'light' },
  {
    id: 'royal',
    label: 'Key Holder',
    unlockLevel: 7,
    background: 'linear-gradient(120deg,#1E4D3B 0%,#2a6b52 45%,#E8B84B 100%)',
    text: 'light',
  },
]

export const TITLES: TitleItem[] = [
  { id: 'dreamer', label: 'Dreamer', unlockLevel: 1 },
  { id: 'saver', label: 'Saver', unlockLevel: 2 },
  { id: 'planner', label: 'Planner', unlockLevel: 3 },
  { id: 'hunter', label: 'House Hunter', unlockLevel: 4 },
  { id: 'negotiator', label: 'Negotiator', unlockLevel: 5 },
  { id: 'almost', label: 'Almost Home', unlockLevel: 6 },
  { id: 'keyholder', label: 'Key Holder', unlockLevel: 7 },
]

export const DEFAULT_PROFILE: Profile = {
  displayName: '',
  bio: '',
  avatar: 'sprout',
  accessory: 'none',
  frame: 'simple',
  banner: 'spruce',
  title: 'dreamer',
}

export const avatarOf = (id: string) => AVATARS.find((a) => a.id === id) ?? AVATARS[0]
export const accessoryOf = (id: string) => ACCESSORIES.find((a) => a.id === id) ?? ACCESSORIES[0]
export const frameOf = (id: string) => FRAMES.find((f) => f.id === id) ?? FRAMES[0]
export const bannerOf = (id: string) => BANNERS.find((b) => b.id === id) ?? BANNERS[0]
export const titleOf = (id: string) => TITLES.find((t) => t.id === id) ?? TITLES[0]

/** Total unlocked cosmetics vs. total — handy for a "wardrobe" progress line. */
export function unlockCounts(level: number): { unlocked: number; total: number } {
  const all = [...AVATARS, ...ACCESSORIES, ...FRAMES, ...BANNERS, ...TITLES]
  return { unlocked: all.filter((i) => level >= i.unlockLevel).length, total: all.length }
}

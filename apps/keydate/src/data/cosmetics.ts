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
  // Level 1 — starter kit
  { id: 'sprout', label: 'Sprout', unlockLevel: 1, emoji: '🌱' },
  { id: 'key', label: 'Key', unlockLevel: 1, emoji: '🔑' },
  { id: 'beaver', label: 'Beaver', unlockLevel: 1, emoji: '🦫' },
  { id: 'person', label: 'You', unlockLevel: 1, emoji: '🧑' },
  { id: 'chick', label: 'Newbie', unlockLevel: 1, emoji: '🐣' },
  // Level 2
  { id: 'house', label: 'Cozy House', unlockLevel: 2, emoji: '🏠' },
  { id: 'owl', label: 'Wise Owl', unlockLevel: 2, emoji: '🦉' },
  { id: 'penguin', label: 'Penguin', unlockLevel: 2, emoji: '🐧' },
  { id: 'fern', label: 'Fern', unlockLevel: 2, emoji: '🌿' },
  // Level 3
  { id: 'squirrel', label: 'Saver Squirrel', unlockLevel: 3, emoji: '🐿️' },
  { id: 'duck', label: 'Duck', unlockLevel: 3, emoji: '🦆' },
  { id: 'turtle', label: 'Steady Turtle', unlockLevel: 3, emoji: '🐢' },
  { id: 'builder', label: 'Builder', unlockLevel: 3, emoji: '👷' },
  // Level 4
  { id: 'fox', label: 'Sly Fox', unlockLevel: 4, emoji: '🦊' },
  { id: 'moose', label: 'Moose', unlockLevel: 4, emoji: '🫎' },
  { id: 'deer', label: 'Deer', unlockLevel: 4, emoji: '🦌' },
  { id: 'farmer', label: 'Homesteader', unlockLevel: 4, emoji: '🧑‍🌾' },
  // Level 5
  { id: 'bear', label: 'Bear', unlockLevel: 5, emoji: '🐻' },
  { id: 'wolf', label: 'Wolf', unlockLevel: 5, emoji: '🐺' },
  { id: 'raccoon', label: 'Raccoon', unlockLevel: 5, emoji: '🦝' },
  { id: 'eagle', label: 'Eagle', unlockLevel: 5, emoji: '🦅' },
  // Level 6
  { id: 'maple', label: 'Maple', unlockLevel: 6, emoji: '🍁' },
  { id: 'butterfly', label: 'Butterfly', unlockLevel: 6, emoji: '🦋' },
  { id: 'dolphin', label: 'Dolphin', unlockLevel: 6, emoji: '🐬' },
  { id: 'wizard', label: 'Money Wizard', unlockLevel: 6, emoji: '🧙' },
  // Level 7 — prestige
  { id: 'unicorn', label: 'Dream Home', unlockLevel: 7, emoji: '🦄' },
  { id: 'dragon', label: 'Dragon', unlockLevel: 7, emoji: '🐉' },
  { id: 'lion', label: 'Lionheart', unlockLevel: 7, emoji: '🦁' },
  { id: 'castle', label: 'Castle', unlockLevel: 7, emoji: '🏰' },
]

export const ACCESSORIES: AccessoryItem[] = [
  { id: 'none', label: 'None', unlockLevel: 1, emoji: null },
  // Level 2
  { id: 'cap', label: 'Ball Cap', unlockLevel: 2, emoji: '🧢' },
  { id: 'bow', label: 'Bow', unlockLevel: 2, emoji: '🎀' },
  { id: 'glasses', label: 'Glasses', unlockLevel: 2, emoji: '👓' },
  // Level 3
  { id: 'grad', label: 'Grad Cap', unlockLevel: 3, emoji: '🎓' },
  { id: 'scarf', label: 'Scarf', unlockLevel: 3, emoji: '🧣' },
  { id: 'sunhat', label: 'Sun Hat', unlockLevel: 3, emoji: '👒' },
  // Level 4
  { id: 'shades', label: 'Shades', unlockLevel: 4, emoji: '🕶️' },
  { id: 'headphones', label: 'Headphones', unlockLevel: 4, emoji: '🎧' },
  { id: 'flower', label: 'Flower', unlockLevel: 4, emoji: '🌸' },
  // Level 5
  { id: 'hardhat', label: 'Hard Hat', unlockLevel: 5, emoji: '⛑️' },
  { id: 'tophat', label: 'Top Hat', unlockLevel: 5, emoji: '🎩' },
  { id: 'leaf', label: 'Maple Leaf', unlockLevel: 5, emoji: '🍁' },
  // Level 6
  { id: 'sparkle', label: 'Sparkles', unlockLevel: 6, emoji: '✨' },
  { id: 'flame', label: 'On Fire', unlockLevel: 6, emoji: '🔥' },
  { id: 'star', label: 'Star', unlockLevel: 6, emoji: '🌟' },
  // Level 7
  { id: 'crown', label: 'Crown', unlockLevel: 7, emoji: '👑' },
  { id: 'halo', label: 'Halo', unlockLevel: 7, emoji: '😇' },
]

export const FRAMES: FrameItem[] = [
  { id: 'simple', label: 'Simple', unlockLevel: 1, border: '3px solid #DDE4DC', bg: '#E3F2E9' },
  // Level 2
  { id: 'sprout', label: 'Sprout', unlockLevel: 2, border: '3px solid #3FA672', bg: '#E3F2E9' },
  { id: 'silver', label: 'Silver', unlockLevel: 2, border: '3px solid #B8C2C0', boxShadow: '0 0 0 3px #EDF1EF', bg: '#F2F5F3' },
  // Level 3
  { id: 'gold', label: 'Gold', unlockLevel: 3, border: '3px solid #E8B84B', bg: '#FBF3DD' },
  { id: 'bronze', label: 'Bronze', unlockLevel: 3, border: '3px solid #C6803B', bg: '#F3E4D2' },
  // Level 4
  { id: 'emerald', label: 'Emerald', unlockLevel: 4, border: '3px solid #1E4D3B', boxShadow: '0 0 0 3px #3FA672', bg: '#E3F2E9' },
  { id: 'sky', label: 'Sky', unlockLevel: 4, border: '3px solid #7db2d9', bg: '#EAF4FB' },
  // Level 5
  {
    id: 'double',
    label: 'Double Gold',
    unlockLevel: 5,
    border: '3px solid #E8B84B',
    boxShadow: '0 0 0 3px #fff, 0 0 0 6px #E8B84B',
    bg: '#FBF3DD',
  },
  { id: 'rose', label: 'Rose', unlockLevel: 5, border: '3px solid #D98B9E', boxShadow: '0 0 0 3px #FBE7EC', bg: '#FBEEF1' },
  // Level 6
  {
    id: 'gem',
    label: 'Gem',
    unlockLevel: 6,
    border: '3px solid #7db2d9',
    boxShadow: '0 0 0 4px #BFDFF0',
    bg: '#EAF4FB',
  },
  {
    id: 'neon',
    label: 'Neon',
    unlockLevel: 6,
    border: '3px solid #6BE3A0',
    boxShadow: '0 0 0 3px #17302A, 0 0 0 6px #6BE3A0',
    bg: '#17302A',
  },
  // Level 7
  {
    id: 'royal',
    label: 'Key Holder',
    unlockLevel: 7,
    border: '3px solid #E8B84B',
    boxShadow: '0 0 0 4px #1E4D3B, 0 0 0 8px #E8B84B',
    bg: '#FBF3DD',
  },
  {
    id: 'rainbow',
    label: 'Rainbow',
    unlockLevel: 7,
    border: '3px solid #fff',
    boxShadow: '0 0 0 2px #E8734A, 0 0 0 4px #E8B84B, 0 0 0 6px #3FA672, 0 0 0 8px #7db2d9',
    bg: '#fff',
  },
]

export const BANNERS: BannerItem[] = [
  // Level 1
  { id: 'paper', label: 'Paper', unlockLevel: 1, background: '#EFF2EA', text: 'dark' },
  { id: 'spruce', label: 'Spruce', unlockLevel: 1, background: '#1E4D3B', text: 'light' },
  { id: 'mist', label: 'Mist', unlockLevel: 1, background: 'linear-gradient(135deg,#EFF2EA,#DDE4DC)', text: 'dark' },
  // Level 2
  { id: 'sproutGrad', label: 'Sprout Fade', unlockLevel: 2, background: 'linear-gradient(135deg,#3FA672,#1E4D3B)', text: 'light' },
  {
    id: 'blueprint',
    label: 'Blueprint',
    unlockLevel: 2,
    background:
      'repeating-linear-gradient(0deg, rgba(255,255,255,.14) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(255,255,255,.14) 0 1px, transparent 1px 22px), #1E4D3B',
    text: 'light',
  },
  { id: 'sky', label: 'Clear Sky', unlockLevel: 2, background: 'linear-gradient(135deg,#CDE7F7,#7db2d9)', text: 'dark' },
  // Level 3
  { id: 'goldGrad', label: 'Golden Hour', unlockLevel: 3, background: 'linear-gradient(135deg,#F0C766,#C88A1E)', text: 'dark' },
  { id: 'sunset', label: 'Sunset', unlockLevel: 3, background: 'linear-gradient(135deg,#F5D06B,#E8734A)', text: 'dark' },
  {
    id: 'forest',
    label: 'Forest Stripe',
    unlockLevel: 3,
    background: 'repeating-linear-gradient(45deg,#1E4D3B 0 14px,#245a44 14px 28px)',
    text: 'light',
  },
  // Level 4
  { id: 'dawn', label: 'Prairie Dawn', unlockLevel: 4, background: 'linear-gradient(135deg,#FBF3DD,#E3F2E9)', text: 'dark' },
  { id: 'ocean', label: 'Ocean', unlockLevel: 4, background: 'linear-gradient(160deg,#7db2d9,#1E4D3B)', text: 'light' },
  {
    id: 'confetti',
    label: 'Confetti',
    unlockLevel: 4,
    background: 'radial-gradient(circle, rgba(63,166,114,.45) 2.5px, transparent 3px) 0 0/20px 20px, #E3F2E9',
    text: 'dark',
  },
  // Level 5
  { id: 'night', label: 'Night', unlockLevel: 5, background: 'linear-gradient(160deg,#12241E,#1E4D3B)', text: 'light' },
  {
    id: 'brick',
    label: 'Brickwork',
    unlockLevel: 5,
    background: 'repeating-linear-gradient(0deg,#795038 0 20px, rgba(0,0,0,.18) 20px 22px), #6E4A38',
    text: 'light',
  },
  {
    id: 'ember',
    label: 'Ember Glow',
    unlockLevel: 5,
    background: 'radial-gradient(120% 120% at 50% 120%, #E8B84B 0%, #7a4e12 42%, #17302A 82%)',
    text: 'light',
  },
  // Level 6
  { id: 'aurora', label: 'Aurora', unlockLevel: 6, background: 'linear-gradient(120deg,#1E4D3B,#3FA672,#7db2d9,#E8B84B)', text: 'light' },
  { id: 'sakura', label: 'Sakura', unlockLevel: 6, background: 'linear-gradient(135deg,#F7D6E0,#FBF3DD)', text: 'dark' },
  { id: 'tealGold', label: 'Teal & Gold', unlockLevel: 6, background: 'linear-gradient(120deg,#1E4D3B,#3FA672 50%,#E8B84B)', text: 'light' },
  // Level 7
  {
    id: 'royal',
    label: 'Key Holder',
    unlockLevel: 7,
    background: 'linear-gradient(120deg,#1E4D3B 0%,#2a6b52 45%,#E8B84B 100%)',
    text: 'light',
  },
  { id: 'prism', label: 'Prism', unlockLevel: 7, background: 'linear-gradient(120deg,#7db2d9,#3FA672,#E8B84B,#E8734A)', text: 'light' },
  {
    id: 'goldleaf',
    label: 'Gold Leaf',
    unlockLevel: 7,
    background: 'radial-gradient(circle, rgba(232,184,75,.5) 2px, transparent 2.5px) 0 0/22px 22px, #17302A',
    text: 'light',
  },
]

export const TITLES: TitleItem[] = [
  { id: 'dreamer', label: 'Dreamer', unlockLevel: 1 },
  { id: 'saver', label: 'Saver', unlockLevel: 2 },
  { id: 'rentescapee', label: 'Rent Escapee', unlockLevel: 2 },
  { id: 'planner', label: 'Planner', unlockLevel: 3 },
  { id: 'fhsapro', label: 'FHSA Pro', unlockLevel: 3 },
  { id: 'streaker', label: 'Streak Keeper', unlockLevel: 3 },
  { id: 'hunter', label: 'House Hunter', unlockLevel: 4 },
  { id: 'blueprintboss', label: 'Blueprint Boss', unlockLevel: 4 },
  { id: 'negotiator', label: 'Negotiator', unlockLevel: 5 },
  { id: 'dphero', label: 'Down Payment Hero', unlockLevel: 5 },
  { id: 'almost', label: 'Almost Home', unlockLevel: 6 },
  { id: 'keycollector', label: 'Key Collector', unlockLevel: 6 },
  { id: 'keyholder', label: 'Key Holder', unlockLevel: 7 },
  { id: 'legend', label: 'Prairie Legend', unlockLevel: 7 },
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

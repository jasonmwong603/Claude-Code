/* ============================================================================
   Layered 2D pixel-avatar engine (Mii / MMORPG-style character creator).

   A character is composed from selectable layers on a 24×32 grid — background,
   body, bottom, top, facial hair, mouth, eyes, eyewear, mask, hair, headwear,
   and a handheld item — each a small sprite coloured at render time from the
   user's palette picks, then given an automatic dark outline. Head-only and
   full-body crops come from the same grid.

   To add options: append to the arrays / sprite maps below. Core identity
   (body, skin, eye shape/colour) is free; everything else unlocks by level.
   ========================================================================== */

export interface AvatarConfig {
  body: string
  skin: string
  eyeShape: string
  eyeColor: string
  hair: string
  hairColor: string
  facialHair: string
  eyewear: string
  mask: string
  headwear: string
  top: string
  topColor: string
  bottom: string
  bottomColor: string
  handheld: string
  background: string
}

export interface Swatch {
  id: string
  label: string
  color: string
  unlockLevel: number
}
export interface Style {
  id: string
  label: string
  unlockLevel: number
}
export interface BackgroundItem {
  id: string
  label: string
  unlockLevel: number
  background: string
}

/* ————— Colour palettes ————— */
export const SKINS: Swatch[] = [
  { id: 'porcelain', label: 'Porcelain', color: '#F7E0C8', unlockLevel: 1 },
  { id: 'light', label: 'Light', color: '#F1D2B4', unlockLevel: 1 },
  { id: 'warm', label: 'Warm', color: '#E8B98C', unlockLevel: 1 },
  { id: 'tan', label: 'Tan', color: '#D89B6A', unlockLevel: 1 },
  { id: 'olive', label: 'Olive', color: '#C07E52', unlockLevel: 1 },
  { id: 'brown', label: 'Brown', color: '#9C5E3A', unlockLevel: 1 },
  { id: 'deep', label: 'Deep', color: '#6E4227', unlockLevel: 1 },
  { id: 'espresso', label: 'Espresso', color: '#4A2C18', unlockLevel: 1 },
]

export const EYE_COLORS: Swatch[] = [
  { id: 'brown', label: 'Brown', color: '#5b3a1e', unlockLevel: 1 },
  { id: 'dark', label: 'Dark', color: '#2b2b2b', unlockLevel: 1 },
  { id: 'hazel', label: 'Hazel', color: '#7a5a2a', unlockLevel: 1 },
  { id: 'green', label: 'Green', color: '#3f7d4f', unlockLevel: 1 },
  { id: 'blue', label: 'Blue', color: '#3f6fa6', unlockLevel: 1 },
  { id: 'grey', label: 'Grey', color: '#6b7280', unlockLevel: 1 },
  { id: 'amber', label: 'Amber', color: '#C8892E', unlockLevel: 1 },
  { id: 'violet', label: 'Violet', color: '#7a5aa6', unlockLevel: 1 },
]

export const HAIR_COLORS: Swatch[] = [
  { id: 'black', label: 'Black', color: '#2b2b2b', unlockLevel: 1 },
  { id: 'brown', label: 'Brown', color: '#6b4423', unlockLevel: 1 },
  { id: 'darkbrown', label: 'Dark Brown', color: '#3f2a17', unlockLevel: 1 },
  { id: 'blonde', label: 'Blonde', color: '#E3C36B', unlockLevel: 1 },
  { id: 'ginger', label: 'Ginger', color: '#B5591F', unlockLevel: 1 },
  { id: 'grey', label: 'Grey', color: '#B9BEC2', unlockLevel: 1 },
  { id: 'blue', label: 'Blue', color: '#3F6FA6', unlockLevel: 2 },
  { id: 'green', label: 'Green', color: '#3FA672', unlockLevel: 2 },
  { id: 'white', label: 'Platinum', color: '#EDEEF0', unlockLevel: 3 },
  { id: 'pink', label: 'Pink', color: '#E38FB3', unlockLevel: 4 },
  { id: 'purple', label: 'Purple', color: '#8A6BC4', unlockLevel: 4 },
  { id: 'teal', label: 'Teal', color: '#2FA5A0', unlockLevel: 5 },
]

export const TOP_COLORS: Swatch[] = [
  { id: 'spruce', label: 'Spruce', color: '#1E4D3B', unlockLevel: 1 },
  { id: 'sprout', label: 'Sprout', color: '#3FA672', unlockLevel: 1 },
  { id: 'denim', label: 'Denim', color: '#3F6FA6', unlockLevel: 1 },
  { id: 'charcoal', label: 'Charcoal', color: '#33302b', unlockLevel: 1 },
  { id: 'gold', label: 'Gold', color: '#E8B84B', unlockLevel: 2 },
  { id: 'red', label: 'Red', color: '#C0442F', unlockLevel: 2 },
  { id: 'cream', label: 'Cream', color: '#EFE6CE', unlockLevel: 3 },
  { id: 'teal', label: 'Teal', color: '#2FA5A0', unlockLevel: 3 },
  { id: 'plum', label: 'Plum', color: '#7A4A6B', unlockLevel: 4 },
  { id: 'orange', label: 'Orange', color: '#E8734A', unlockLevel: 5 },
]

export const BOTTOM_COLORS: Swatch[] = [
  { id: 'denim', label: 'Denim', color: '#3F6FA6', unlockLevel: 1 },
  { id: 'charcoal', label: 'Charcoal', color: '#33302b', unlockLevel: 1 },
  { id: 'black', label: 'Black', color: '#22201d', unlockLevel: 1 },
  { id: 'khaki', label: 'Khaki', color: '#B79B6B', unlockLevel: 2 },
  { id: 'spruce', label: 'Spruce', color: '#1E4D3B', unlockLevel: 3 },
  { id: 'plum', label: 'Plum', color: '#7A4A6B', unlockLevel: 4 },
]

/* ————— Style catalogs ————— */
export const BODIES: Style[] = [
  { id: 'masc', label: 'Type A', unlockLevel: 1 },
  { id: 'fem', label: 'Type B', unlockLevel: 1 },
]

export const EYE_SHAPES: Style[] = [
  { id: 'round', label: 'Round', unlockLevel: 1 },
  { id: 'big', label: 'Big', unlockLevel: 1 },
  { id: 'sleepy', label: 'Sleepy', unlockLevel: 1 },
  { id: 'wide', label: 'Wide-set', unlockLevel: 1 },
  { id: 'narrow', label: 'Narrow', unlockLevel: 1 },
]

export const HAIRS: Style[] = [
  { id: 'bald', label: 'Bald', unlockLevel: 1 },
  { id: 'buzz', label: 'Buzz', unlockLevel: 1 },
  { id: 'short', label: 'Short', unlockLevel: 1 },
  { id: 'sidepart', label: 'Side Part', unlockLevel: 1 },
  { id: 'bob', label: 'Bob', unlockLevel: 2 },
  { id: 'spiky', label: 'Spiky', unlockLevel: 2 },
  { id: 'ponytail', label: 'Ponytail', unlockLevel: 3 },
  { id: 'long', label: 'Long', unlockLevel: 3 },
  { id: 'wavy', label: 'Wavy', unlockLevel: 4 },
  { id: 'bun', label: 'Top Bun', unlockLevel: 4 },
  { id: 'afro', label: 'Afro', unlockLevel: 5 },
  { id: 'mohawk', label: 'Mohawk', unlockLevel: 6 },
]

export const FACIAL_HAIRS: Style[] = [
  { id: 'none', label: 'None', unlockLevel: 1 },
  { id: 'stubble', label: 'Stubble', unlockLevel: 2 },
  { id: 'mustache', label: 'Mustache', unlockLevel: 2 },
  { id: 'goatee', label: 'Goatee', unlockLevel: 3 },
  { id: 'beard', label: 'Beard', unlockLevel: 4 },
  { id: 'fullbeard', label: 'Full Beard', unlockLevel: 5 },
]

export const EYEWEARS: Style[] = [
  { id: 'none', label: 'None', unlockLevel: 1 },
  { id: 'round', label: 'Round', unlockLevel: 2 },
  { id: 'square', label: 'Square', unlockLevel: 2 },
  { id: 'sunglasses', label: 'Sunglasses', unlockLevel: 3 },
  { id: 'monocle', label: 'Monocle', unlockLevel: 5 },
  { id: 'visor', label: 'Visor', unlockLevel: 4 },
]

export const MASKS: Style[] = [
  { id: 'none', label: 'None', unlockLevel: 1 },
  { id: 'surgical', label: 'Surgical', unlockLevel: 2 },
  { id: 'bandana', label: 'Bandana', unlockLevel: 3 },
  { id: 'ninja', label: 'Ninja', unlockLevel: 5 },
]

export const HEADWEARS: Style[] = [
  { id: 'none', label: 'None', unlockLevel: 1 },
  { id: 'cap', label: 'Ball Cap', unlockLevel: 2 },
  { id: 'beanie', label: 'Beanie', unlockLevel: 2 },
  { id: 'headband', label: 'Headband', unlockLevel: 3 },
  { id: 'cowboy', label: 'Cowboy', unlockLevel: 4 },
  { id: 'hardhat', label: 'Hard Hat', unlockLevel: 4 },
  { id: 'tophat', label: 'Top Hat', unlockLevel: 5 },
  { id: 'party', label: 'Party Hat', unlockLevel: 5 },
  { id: 'crown', label: 'Crown', unlockLevel: 7 },
]

export const TOPS: Style[] = [
  { id: 'tee', label: 'T-shirt', unlockLevel: 1 },
  { id: 'tank', label: 'Tank', unlockLevel: 1 },
  { id: 'longsleeve', label: 'Long Sleeve', unlockLevel: 2 },
  { id: 'hoodie', label: 'Hoodie', unlockLevel: 2 },
  { id: 'jacket', label: 'Jacket', unlockLevel: 3 },
  { id: 'dress', label: 'Dress', unlockLevel: 3 },
  { id: 'sweater', label: 'Sweater', unlockLevel: 4 },
  { id: 'flannel', label: 'Flannel', unlockLevel: 5 },
]

export const BOTTOMS: Style[] = [
  { id: 'pants', label: 'Pants', unlockLevel: 1 },
  { id: 'shorts', label: 'Shorts', unlockLevel: 1 },
  { id: 'jeans', label: 'Jeans', unlockLevel: 2 },
  { id: 'skirt', label: 'Skirt', unlockLevel: 3 },
  { id: 'joggers', label: 'Joggers', unlockLevel: 4 },
]

export const HANDHELDS: Style[] = [
  { id: 'none', label: 'None', unlockLevel: 1 },
  { id: 'coffee', label: 'Coffee', unlockLevel: 2 },
  { id: 'phone', label: 'Phone', unlockLevel: 2 },
  { id: 'key', label: 'Golden Key', unlockLevel: 4 },
  { id: 'plant', label: 'Plant', unlockLevel: 3 },
  { id: 'balloon', label: 'Balloon', unlockLevel: 5 },
]

export const BACKGROUNDS: BackgroundItem[] = [
  { id: 'none', label: 'None', unlockLevel: 1, background: 'transparent' },
  { id: 'mint', label: 'Mint', unlockLevel: 1, background: 'radial-gradient(120% 80% at 50% 20%, #E3F2E9, #cfe6d8)' },
  { id: 'sky', label: 'Sky', unlockLevel: 2, background: 'linear-gradient(180deg,#CDE7F7,#8fbfe0)' },
  { id: 'sunset', label: 'Sunset', unlockLevel: 3, background: 'linear-gradient(180deg,#F5D06B,#E8734A)' },
  { id: 'forest', label: 'Forest', unlockLevel: 3, background: 'linear-gradient(180deg,#3FA672,#1E4D3B)' },
  { id: 'night', label: 'Night', unlockLevel: 4, background: 'radial-gradient(circle at 30% 20%, #2a5a6b, #12241E)' },
  { id: 'aurora', label: 'Aurora', unlockLevel: 5, background: 'linear-gradient(160deg,#1E4D3B,#3FA672,#7db2d9)' },
  { id: 'gold', label: 'Gold Room', unlockLevel: 6, background: 'linear-gradient(180deg,#F0C766,#C88A1E)' },
]

export const DEFAULT_AVATAR: AvatarConfig = {
  body: 'masc',
  skin: 'warm',
  eyeShape: 'round',
  eyeColor: 'brown',
  hair: 'short',
  hairColor: 'brown',
  facialHair: 'none',
  eyewear: 'none',
  mask: 'none',
  headwear: 'none',
  top: 'tee',
  topColor: 'spruce',
  bottom: 'pants',
  bottomColor: 'denim',
  handheld: 'none',
  background: 'none',
}

/* ————— Sprites: row index → 24-char string. Chars:
   s skin · k skin-shade · p pupil · w eye-white · m mouth · h hair · H hair-shade
   c top · C top-shade · b bottom · f shoe · g dark frame · l lens
   1-9 fixed accessory colours (see FIXED below) · . empty ——————————————————— */
type Sprite = Record<number, string>

const BODY_SPRITES: Record<string, Sprite> = {
  masc: {
    4: '........ssssssss........',
    5: '........ssssssss........',
    6: '........ssssssss........',
    7: '........ssssssss........',
    8: '........ssssssss........',
    9: '........ssssssss........',
    10: '........ssssssss........',
    11: '........ssssssss........',
    12: '.........ssssss.........',
    13: '.........ssssss.........',
    14: '..........ssss..........',
    15: '......ssssssssssss......',
    16: '....ssssssssssssssss....',
    17: '....ssssssssssssssss....',
    18: '....ssssssssssssssss....',
    19: '....ssssssssssssssss....',
    20: '....ssssssssssssssss....',
    21: '....ssssssssssssssss....',
    22: '.....ssssssssssssss.....',
    23: '......ssssssssssss......',
    24: '......ssssssssssss......',
    25: '........sss..sss........',
    26: '........sss..sss........',
    27: '........sss..sss........',
    28: '........sss..sss........',
    29: '........sss..sss........',
    30: '........sss..sss........',
    31: '........fff..fff........',
  },
  fem: {
    4: '........ssssssss........',
    5: '........ssssssss........',
    6: '........ssssssss........',
    7: '........ssssssss........',
    8: '........ssssssss........',
    9: '........ssssssss........',
    10: '........ssssssss........',
    11: '........ssssssss........',
    12: '.........ssssss.........',
    13: '.........ssssss.........',
    14: '..........ssss..........',
    15: '......ssssssssssss......',
    16: '....ssssssssssssssss....',
    17: '....ssssssssssssssss....',
    18: '.....ssssssssssssss.....',
    19: '.....ssssssssssssss.....',
    20: '......ssssssssssss......',
    21: '......ssssssssssss......',
    22: '.....ssssssssssssss.....',
    23: '.....ssssssssssssss.....',
    24: '......ssssssssssss......',
    25: '........sss..sss........',
    26: '........sss..sss........',
    27: '........sss..sss........',
    28: '........sss..sss........',
    29: '........sss..sss........',
    30: '........sss..sss........',
    31: '........fff..fff........',
  },
}

const EYE_SPRITES: Record<string, Sprite> = {
  round: { 8: '.........ww..ww.........', 9: '.........pp..pp.........' },
  big: { 7: '.........ww..ww.........', 8: '.........pp..pp.........', 9: '.........pp..pp.........' },
  sleepy: { 9: '.........ww..ww.........', 10: '.........pp..pp.........' },
  wide: { 8: '........ww....ww........', 9: '........pp....pp........' },
  narrow: { 9: '.........pp..pp.........' },
}

const MOUTH: Sprite = { 12: '..........mmmm..........' }

const HAIR_SPRITES: Record<string, Sprite> = {
  bald: {},
  buzz: { 3: '........hhhhhhhh........', 4: '........hhhhhhhh........' },
  short: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hh.......',
  },
  sidepart: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......h.......hh.......',
    6: '...............hh.......',
  },
  bob: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '......hhhhhhhhhhhh......',
    5: '......hh........hh......',
    6: '......hh........hh......',
    7: '......hh........hh......',
    8: '......hh........hh......',
    9: '.......h........h.......',
  },
  spiky: {
    1: '......h..h..h..h.h......',
    2: '.......hhhhhhhhhh.......',
    3: '.......hhhhhhhhhh.......',
    4: '.......hh......hh.......',
  },
  ponytail: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hhh......',
    6: '...............hhh......',
    7: '................hhh.....',
    8: '................hhh.....',
    9: '.................h......',
  },
  long: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '......hhhhhhhhhhhh......',
    5: '......hh........hh......',
    6: '......hh........hh......',
    7: '......hh........hh......',
    8: '......hh........hh......',
    9: '......hh........hh......',
    10: '......hh........hh......',
    11: '......hh........hh......',
    12: '......hh........hh......',
  },
  wavy: {
    2: '.......hhhhhhhhh........',
    3: '......hhhhhhhhhhh.......',
    4: '......hhhhhhhhhhhh......',
    5: '......hh........hh......',
    6: '.....hh.........hh......',
    7: '......hh........hh......',
    8: '.....hh.........hh......',
    9: '......h..........h.....',
  },
  bun: {
    0: '..........hh...........',
    1: '.........hhhh..........',
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hh.......',
  },
  afro: {
    0: '.......hhhhhhhhhh.......',
    1: '......hhhhhhhhhhhh......',
    2: '.....hhhhhhhhhhhhhh.....',
    3: '.....hhhhhhhhhhhhhh.....',
    4: '.....hh..........hh.....',
    5: '......h..........h......',
  },
  mohawk: { 0: '..........hh...........', 1: '..........hh...........', 2: '..........hh...........', 3: '..........hh...........', 4: '..........hh...........' },
}

const FACIAL_SPRITES: Record<string, Sprite> = {
  none: {},
  stubble: { 12: '.........H.HH.H.........', 13: '.........HHHHHH.........', 14: '..........HHHH..........' },
  mustache: { 11: '..........hhhh..........' },
  goatee: { 12: '..........h..h..........', 13: '..........hhhh..........', 14: '..........hhhh..........' },
  beard: {
    11: '.........h....h.........',
    12: '.........h.hh.h.........',
    13: '.........hhhhhh.........',
    14: '..........hhhh..........',
  },
  fullbeard: {
    10: '.........h....h.........',
    11: '.........hhhhhh.........',
    12: '.........hhhhhh.........',
    13: '.........hhhhhh.........',
    14: '..........hhhh..........',
  },
}

const EYEWEAR_SPRITES: Record<string, Sprite> = {
  none: {},
  round: { 8: '.........gggggg.........', 9: '.........g.gg.g.........' },
  square: { 7: '.........gggggg.........', 8: '.........glgglg.........', 9: '.........gggggg.........' },
  sunglasses: { 8: '.........gggggg.........', 9: '.........gggggg.........' },
  monocle: { 8: '............ggg.........', 9: '............g.g.........', 10: '............ggg.........' },
  visor: { 8: '........gllllllg........', 9: '........gggggggg........' },
}

const MASK_SPRITES: Record<string, Sprite> = {
  none: {},
  surgical: { 10: '.........222222.........', 11: '.........222222.........', 12: '.........222222.........', 13: '.........222222.........', 14: '..........2222..........' },
  bandana: { 11: '........44444444........', 12: '........44444444........', 13: '.........444444.........', 14: '..........4444..........' },
  ninja: { 9: '........77777777........', 10: '........77777777........', 11: '........77777777........', 12: '........77777777........', 13: '.........777777.........', 14: '..........7777..........' },
}

const HEADWEAR_SPRITES: Record<string, Sprite> = {
  none: {},
  cap: { 2: '........55555555........', 3: '.......5555555555......', 4: '.......5555555555.5.....' },
  beanie: { 1: '........44444444........', 2: '.......4444444444.......', 3: '.......4444444444.......', 4: '.......4444444444.......' },
  headband: { 5: '.......4444444444.......' },
  cowboy: { 1: '........99999999........', 2: '........99999999........', 3: '.....999999999999999....', 4: '.....999999999999999....' },
  hardhat: { 1: '........33333333........', 2: '.......3333333333.......', 3: '......333333333333......' },
  tophat: { 0: '.......7777777.........', 1: '.......7777777.........', 2: '.......7777777.........', 3: '......99999999999......', 4: '......99999999999......' },
  party: { 0: '...........8...........', 1: '..........888..........', 2: '.........88888.........', 3: '........8888888........', 4: '........8888888........' },
  crown: { 1: '.......3.3.3.3.3.3......', 2: '.......333333333.......', 3: '.......333333333.......' },
}

const TOP_SPRITES: Record<string, Sprite> = {
  tee: {
    15: '......cccccccccccc......',
    16: '....cccccccccccccccc....',
    17: '....cccccccccccccccc....',
    18: '......cccccccccccc......',
    19: '......cccccccccccc......',
    20: '......cccccccccccc......',
    21: '......cccccccccccc......',
    22: '......cccccccccccc......',
  },
  tank: {
    15: '.......c......c.......',
    16: '......cccccccccccc......',
    17: '......cccccccccccc......',
    18: '......cccccccccccc......',
    19: '......cccccccccccc......',
    20: '......cccccccccccc......',
    21: '......cccccccccccc......',
    22: '......cccccccccccc......',
  },
  longsleeve: {
    15: '......cccccccccccc......',
    16: '....cccccccccccccccc....',
    17: '....cccccccccccccccc....',
    18: '....cccccccccccccccc....',
    19: '....cccccccccccccccc....',
    20: '....cccccccccccccccc....',
    21: '....cccccccccccccccc....',
    22: '......cccccccccccc......',
  },
  hoodie: {
    13: '........cccccccc........',
    14: '.......c........c.......',
    15: '......cccccccccccc......',
    16: '....cccccccccccccccc....',
    17: '....cccccccccccccccc....',
    18: '....cccccccccccccccc....',
    19: '....cccccccccccccccc....',
    20: '....cccccccccccccccc....',
    21: '....cccccccccccccccc....',
    22: '......cccccccccccc......',
  },
  jacket: {
    15: '......cccccccccccc......',
    16: '....ccccccc..ccccccc....',
    17: '....ccccccc..ccccccc....',
    18: '....ccccccc..ccccccc....',
    19: '....ccccccc..ccccccc....',
    20: '....ccccccc..ccccccc....',
    21: '....ccccccc..ccccccc....',
    22: '......ccccc..ccccc......',
  },
  dress: {
    15: '......cccccccccccc......',
    16: '....cccccccccccccccc....',
    17: '....cccccccccccccccc....',
    18: '......cccccccccccc......',
    19: '......cccccccccccc......',
    20: '......cccccccccccc......',
    21: '......cccccccccccc......',
    22: '......cccccccccccc......',
    23: '.....cccccccccccccc.....',
    24: '....cccccccccccccccc....',
    25: '...cccccccccccccccccc...',
    26: '...cccccccccccccccccc...',
  },
  sweater: {
    14: '........cccccccc........',
    15: '......cccccccccccc......',
    16: '....cccccccccccccccc....',
    17: '....cccccccccccccccc....',
    18: '....cccccccccccccccc....',
    19: '....cccccccccccccccc....',
    20: '....cccccccccccccccc....',
    21: '....cccccccccccccccc....',
    22: '......cccccccccccc......',
  },
  flannel: {
    15: '......cCcCcCcCcCcC......',
    16: '....cCcCcCcCcCcCcCcC....',
    17: '....cCcCcCcCcCcCcCcC....',
    18: '....cCcCcCcCcCcCcCcC....',
    19: '....cCcCcCcCcCcCcCcC....',
    20: '....cCcCcCcCcCcCcCcC....',
    21: '....cCcCcCcCcCcCcCcC....',
    22: '......cCcCcCcCcCcC......',
  },
}

const BOTTOM_SPRITES: Record<string, Sprite> = {
  pants: {
    24: '......bbbbbbbbbbbb......',
    25: '........bbb..bbb........',
    26: '........bbb..bbb........',
    27: '........bbb..bbb........',
    28: '........bbb..bbb........',
    29: '........bbb..bbb........',
    30: '........bbb..bbb........',
  },
  jeans: {
    24: '......bbbbbbbbbbbb......',
    25: '........bbb..bbb........',
    26: '........bbb..bbb........',
    27: '........bbb..bbb........',
    28: '........bbb..bbb........',
    29: '........bbb..bbb........',
    30: '........bbb..bbb........',
  },
  joggers: {
    24: '......bbbbbbbbbbbb......',
    25: '........bbb..bbb........',
    26: '........bbb..bbb........',
    27: '........bbb..bbb........',
    28: '........bbb..bbb........',
    29: '........bbbb.bbbb.......',
    30: '........bbbb.bbbb.......',
  },
  shorts: {
    24: '......bbbbbbbbbbbb......',
    25: '........bbb..bbb........',
    26: '........bbb..bbb........',
  },
  skirt: {
    24: '......bbbbbbbbbbbb......',
    25: '.....bbbbbbbbbbbbbb.....',
    26: '....bbbbbbbbbbbbbbbb....',
  },
}

const HANDHELD_SPRITES: Record<string, Sprite> = {
  none: {},
  coffee: { 19: '..................11....', 20: '..................11....', 21: '.................1111...' },
  phone: { 19: '..................2.....', 20: '..................7.....', 21: '..................2.....' },
  key: { 19: '..................3.....', 20: '..................3.....', 21: '.................333....' },
  plant: { 16: '.................6.6....', 17: '..................6.....', 18: '.................111....', 19: '.................111....' },
  balloon: { 12: '.................44.....', 13: '................4444....', 14: '................4444....', 15: '.................44.....', 16: '..................4.....', 17: '..................4.....', 18: '..................4.....' },
}

/* ————— Colours ————— */
const OUTLINE = '#2f2a25'
const MOUTH_COLOR = '#9c5b4d'
const SHOE_COLOR = '#3a332e'
const LENS = '#bfe0f5'
const FRAME_DARK = '#242424'
const FIXED: Record<string, string> = {
  '1': '#6b4423', // coffee cup
  '2': '#eef4f7', // white/light
  '3': '#E8B84B', // gold
  '4': '#C0442F', // red
  '5': '#3F6FA6', // blue
  '6': '#3FA672', // green
  '7': '#33302b', // dark
  '8': '#E38FB3', // pink
  '9': '#8a5a2b', // brown (hats/brim)
}
const W = 24
const H = 32

function darken(hex: string, f = 0.78): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function colorFor(ch: string, p: Record<string, string>): string | null {
  switch (ch) {
    case 's':
      return p.skin
    case 'k':
      return p.skinShade
    case 'p':
      return p.eye
    case 'w':
      return '#ffffff'
    case 'm':
      return MOUTH_COLOR
    case 'h':
      return p.hair
    case 'H':
      return p.hairShade
    case 'c':
      return p.top
    case 'C':
      return p.topShade
    case 'b':
      return p.bottom
    case 'f':
      return SHOE_COLOR
    case 'g':
      return FRAME_DARK
    case 'l':
      return LENS
    default:
      return FIXED[ch] ?? null
  }
}

function stamp(grid: (string | null)[][], sprite: Sprite, p: Record<string, string>) {
  for (const [rowStr, line] of Object.entries(sprite)) {
    const y = Number(rowStr)
    if (y < 0 || y >= H) continue
    for (let x = 0; x < Math.min(line.length, W); x++) {
      const c = colorFor(line[x], p)
      if (c) grid[y][x] = c
    }
  }
}

const swatchColor = (list: Swatch[], id: string) => (list.find((s) => s.id === id) ?? list[0]).color

/** Compose an AvatarConfig into a 32×24 colour grid (null = transparent),
 *  with an automatic 1px dark outline around the silhouette. */
export function composeAvatar(cfg: AvatarConfig): (string | null)[][] {
  const skin = swatchColor(SKINS, cfg.skin)
  const hair = swatchColor(HAIR_COLORS, cfg.hairColor)
  const top = swatchColor(TOP_COLORS, cfg.topColor)
  const bottom = swatchColor(BOTTOM_COLORS, cfg.bottomColor)
  const p = {
    skin,
    skinShade: darken(skin, 0.85),
    eye: swatchColor(EYE_COLORS, cfg.eyeColor),
    hair,
    hairShade: darken(hair, 0.72),
    top,
    topShade: darken(top, 0.8),
    bottom,
  }
  const grid: (string | null)[][] = Array.from({ length: H }, () => Array<string | null>(W).fill(null))

  stamp(grid, BODY_SPRITES[cfg.body] ?? BODY_SPRITES.masc, p)
  stamp(grid, BOTTOM_SPRITES[cfg.bottom] ?? {}, p)
  stamp(grid, TOP_SPRITES[cfg.top] ?? {}, p)
  stamp(grid, FACIAL_SPRITES[cfg.facialHair] ?? {}, p)
  stamp(grid, MOUTH, p)
  stamp(grid, EYE_SPRITES[cfg.eyeShape] ?? EYE_SPRITES.round, p)
  stamp(grid, EYEWEAR_SPRITES[cfg.eyewear] ?? {}, p)
  stamp(grid, MASK_SPRITES[cfg.mask] ?? {}, p)
  stamp(grid, HAIR_SPRITES[cfg.hair] ?? {}, p)
  stamp(grid, HEADWEAR_SPRITES[cfg.headwear] ?? {}, p)
  stamp(grid, HANDHELD_SPRITES[cfg.handheld] ?? {}, p)

  // Auto-outline: any empty cell touching a filled cell becomes outline.
  const out = grid.map((row) => row.slice())
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (grid[y][x]) continue
      const near =
        (y > 0 && grid[y - 1][x]) ||
        (y < H - 1 && grid[y + 1][x]) ||
        (x > 0 && grid[y][x - 1]) ||
        (x < W - 1 && grid[y][x + 1])
      if (near) out[y][x] = OUTLINE
    }
  }
  return out
}

export const bgOf = (id: string) => BACKGROUNDS.find((x) => x.id === id) ?? BACKGROUNDS[0]
export const AVATAR_GRID = { W, H }

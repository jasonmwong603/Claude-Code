/* ============================================================================
   Layered 2D pixel-avatar engine (Mii / MMORPG-style character creator).

   A character is composed on a 24×32 grid. The BODY defines a skin silhouette
   (the head is identical across body types so face accessories always align).
   Clothing is painted directly onto the body's torso / leg pixels, so every
   top and bottom fits every body shape automatically. Face layers (eyes,
   facial hair, eyewear, mask, hair, headwear) and a handheld item are stamped
   on top, then a dark outline is added around the silhouette.

   To add options: append to the arrays / sprite maps below.
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
  { id: 'taper', label: 'Athletic', unlockLevel: 1 },
  { id: 'curvy', label: 'Curvy', unlockLevel: 1 },
  { id: 'slim', label: 'Slim', unlockLevel: 1 },
  { id: 'broad', label: 'Broad', unlockLevel: 1 },
]

export const EYE_SHAPES: Style[] = [
  { id: 'round', label: 'Dot', unlockLevel: 1 },
  { id: 'big', label: 'Big', unlockLevel: 1 },
  { id: 'narrow', label: 'Dash', unlockLevel: 1 },
  { id: 'sleepy', label: 'Sleepy', unlockLevel: 1 },
  { id: 'wide', label: 'Wide-set', unlockLevel: 1 },
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
  body: 'taper',
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

/* ————— Sprites: row index → 24-char string ————— */
type Sprite = Record<number, string>

// Shared head (identical for every body so face layers always align). Rounder,
// slightly wider through the middle (cols 7–16) and tapered at the crown and
// chin so it reads as a soft circle instead of an elongated oval. Rows stay
// 4–14 so the body (row 15+) never shifts.
const HEAD: Sprite = {
  4: '.........ssssss.........',
  5: '........ssssssss........',
  6: '.......ssssssssss.......',
  7: '.......ssssssssss.......',
  8: '.......ssssssssss.......',
  9: '.......ssssssssss.......',
  10: '........ssssssss........',
  11: '........ssssssss........',
  12: '.........ssssss.........',
  13: '.........ssssss.........',
  14: '..........ssss..........',
}
const FEET: Sprite = { 31: '.........ff..ff.........' }
const LEGS: Sprite = {
  25: '.........ss..ss.........',
  26: '.........ss..ss.........',
  27: '.........ss..ss.........',
  28: '.........ss..ss.........',
  29: '.........ss..ss.........',
  30: '.........ss..ss.........',
}

/* Chibi / 8-bit proportions. The head (cols 8–15) is wider than a slim torso
   (cols 10–13). Shoulders connect at rows 15–16, then the arms split off with a
   1px gap (col 9 / col 14) so they read as distinct limbs hanging to the hands
   around rows 20–21. Sleeve-aware clothing paint leaves the lower arms as skin.
   The gap columns get the auto-outline, cleanly separating arm from body. */
const BODY_SPRITES: Record<string, Sprite> = {
  taper: {
    ...HEAD,
    15: '.......ssssssssss.......',
    16: '......ssssssssssss......',
    17: '.......ss.ssss.ss.......',
    18: '.......ss.ssss.ss.......',
    19: '.......ss.ssss.ss.......',
    20: '.......ss.ssss.ss.......',
    21: '.......ss.ssss.ss.......',
    22: '..........ssss..........',
    23: '.........ssssss.........',
    24: '.........ssssss.........',
    ...LEGS,
    ...FEET,
  },
  curvy: {
    ...HEAD,
    15: '........ssssssss........',
    16: '.......ssssssssss.......',
    17: '.......ss.ssss.ss.......',
    18: '.......ss.ssss.ss.......',
    19: '.......ss.ssss.ss.......',
    20: '.......ss.ssss.ss.......',
    21: '.......ss.ssss.ss.......',
    22: '..........ssss..........',
    23: '........ssssssss........',
    24: '........ssssssss........',
    ...LEGS,
    ...FEET,
  },
  slim: {
    ...HEAD,
    15: '........ssssssss........',
    16: '.......ssssssssss.......',
    17: '.......ss.ssss.ss.......',
    18: '........s.ssss.s........',
    19: '........s.ssss.s........',
    20: '........s.ssss.s........',
    21: '........s.ssss.s........',
    22: '..........ssss..........',
    23: '.........ssssss.........',
    24: '.........ssssss.........',
    ...LEGS,
    ...FEET,
  },
  broad: {
    ...HEAD,
    15: '......ssssssssssss......',
    16: '.....ssssssssssssss.....',
    17: '......sss.ssss.sss......',
    18: '......sss.ssss.sss......',
    19: '......sss.ssss.sss......',
    20: '......sss.ssss.sss......',
    21: '......sss.ssss.sss......',
    22: '.........ssssss.........',
    23: '.........ssssss.........',
    24: '.........ssssss.........',
    ...LEGS,
    ...FEET,
  },
}

// Eyes — big and shiny for a cute look. Each eye is a small block of pupil with
// a white 'w' sparkle in the top-left; 'narrow'/'sleepy' stay as slim dashes.
const EYE_SPRITES: Record<string, Sprite> = {
  round: { 7: '.........wp..wp.........', 8: '.........pp..pp.........' },
  big: { 6: '.........ww..ww.........', 7: '.........wp..wp.........', 8: '.........pp..pp.........' },
  narrow: { 8: '.........pp..pp.........' },
  sleepy: { 8: '.........p....p.........', 9: '.........pp..pp.........' },
  wide: { 7: '........wp....wp........', 8: '........pp....pp........' },
}

// Rosy blush on the cheeks, just below the eyes.
const CHEEKS: Sprite = { 10: '........rr....rr........' }

// A small upturned smile.
const MOUTH: Sprite = { 11: '..........m..m..........', 12: '...........mm...........' }

const HAIR_SPRITES: Record<string, Sprite> = {
  bald: {},
  buzz: {
    3: '........hhhhhhhh........',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hh.......',
  },
  short: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hh.......',
  },
  sidepart: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '......hhhhhhhhhh........',
    5: '......hh.......hh.......',
  },
  bob: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '......hhhhhhhhhhhh......',
    5: '......hh........hh......',
    6: '......hh........hh......',
    7: '......hh........hh......',
    8: '.......h........h.......',
    9: '.......hh......hh.......',
  },
  spiky: {
    0: '.......h.h.h.h.h.h......',
    1: '.......hhhhhhhhhh.......',
    2: '.......hhhhhhhhhh.......',
    3: '.......hh......hh.......',
  },
  ponytail: {
    2: '........hhhhhhhh........',
    3: '.......hhhhhhhhhh.......',
    4: '.......hhhhhhhhhh.......',
    5: '.......hh......hhh......',
    6: '...............hhh......',
    7: '................hhh.....',
    8: '................hhh.....',
    9: '................hh......',
  },
  long: {
    1: '........hhhhhhhh........',
    2: '.......hhhhhhhhhh.......',
    3: '......hhhhhhhhhhhh......',
    4: '......hh........hh......',
    5: '......hh........hh......',
    6: '......hh........hh......',
    7: '......hh........hh......',
    8: '......hh........hh......',
    9: '......hh........hh......',
    10: '......hh........hh......',
    11: '......hhh......hhh......',
  },
  wavy: {
    1: '........hhhhhhhh........',
    2: '.......hhhhhhhhhh.......',
    3: '......hhhhhhhhhhhh......',
    4: '......hh........hh......',
    5: '.....hhh........hh......',
    6: '......hh........hhh.....',
    7: '.....hhh........hh......',
    8: '......hh........hhh.....',
    9: '......hh........hh......',
  },
  bun: {
    0: '..........hhhh.........',
    1: '..........hhhh.........',
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
    4: '.....hhhhhhhhhhhhhh.....',
    5: '......hh........hh......',
    6: '......hh........hh......',
  },
  mohawk: {
    0: '..........hhhh.........',
    1: '..........hhhh.........',
    2: '..........hhhh.........',
    3: '..........hhhh.........',
    4: '..........hhhh.........',
    5: '..........hhhh.........',
  },
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

// Eyewear — temple arms stay within the face edge (cols 8–15), never protrude.
const EYEWEAR_SPRITES: Record<string, Sprite> = {
  none: {},
  round: { 8: '........gllggllg........' },
  square: { 7: '.........gg..gg.........', 8: '........gllggllg........', 9: '.........gg..gg.........' },
  sunglasses: { 7: '.........gg..gg.........', 8: '........gggggggg........' },
  monocle: { 7: '.............gg.........', 8: '............gllg........', 9: '.............gg.........' },
  visor: { 7: '........gggggggg........', 8: '........llllllll........' },
}

const MASK_SPRITES: Record<string, Sprite> = {
  none: {},
  surgical: { 10: '.........222222.........', 11: '........g222222g........', 12: '.........222222.........', 13: '.........222222.........', 14: '..........2222..........' },
  bandana: { 11: '........44444444........', 12: '........44444444........', 13: '.........444444.........', 14: '..........4444..........' },
  ninja: { 9: '........77777777........', 10: '........77777777........', 11: '........77777777........', 12: '........77777777........', 13: '.........777777.........', 14: '..........7777..........' },
}

const HEADWEAR_SPRITES: Record<string, Sprite> = {
  none: {},
  // Ball cap: rounded crown + a brim poking out to the front-right.
  cap: {
    1: '.........555555.........',
    2: '........55555555........',
    3: '.......5555555555.......',
    4: '.......55555555555555...',
  },
  beanie: {
    1: '........44444444........',
    2: '.......4444444444.......',
    3: '......444444444444......',
    4: '......444444444444......',
    5: '......4444444444444.....',
  },
  headband: { 6: '.......4444444444.......' },
  cowboy: {
    1: '........99999999........',
    2: '........99999999........',
    3: '....9999999999999999....',
    4: '....9999999999999999....',
  },
  hardhat: {
    1: '........33333333........',
    2: '.......3333333333.......',
    3: '......333333333333......',
    4: '......333333333333......',
  },
  tophat: {
    0: '........777777........',
    1: '........777777........',
    2: '........777777........',
    3: '........777777........',
    4: '......7777777777......',
  },
  party: {
    0: '...........8...........',
    1: '..........888..........',
    2: '.........88888.........',
    3: '........8888888........',
    4: '........8888888........',
  },
  crown: { 1: '.......3.3.3.3.3.3......', 2: '.......333333333.......', 3: '.......333333333.......' },
}

const HOOD: Sprite = { 14: '......cc........cc......', 15: '......cccccccccccc......' }

const HANDHELD_SPRITES: Record<string, Sprite> = {
  none: {},
  coffee: { 18: '..................11....', 19: '..................11....', 20: '.................1111...' },
  phone: { 18: '..................2.....', 19: '..................7.....', 20: '..................2.....' },
  key: { 18: '..................3.....', 19: '..................3.....', 20: '.................333....' },
  plant: { 15: '.................6.6....', 16: '..................6.....', 17: '.................111....', 18: '.................111....' },
  balloon: { 10: '.................44.....', 11: '................4444....', 12: '................4444....', 13: '.................44.....', 14: '..................4.....', 15: '..................4.....', 16: '..................4.....', 17: '..................4.....' },
}

/* ————— Clothing definitions (painted onto the body silhouette) ————— */
interface TopDef {
  neck?: number // rows of centre collar left as skin
  sleeve?: 'short' | 'long' | 'none' // how far the sleeves cover the arms
  open?: boolean // open front (centre column skin)
  dress?: boolean // extend over the hips/thighs
  dressHem?: number
  hood?: boolean
  plaid?: boolean
}
const TOP_DEFS: Record<string, TopDef> = {
  tee: { neck: 1, sleeve: 'short' },
  tank: { neck: 1, sleeve: 'none' },
  longsleeve: { neck: 1, sleeve: 'long' },
  hoodie: { neck: 1, sleeve: 'long', hood: true },
  jacket: { neck: 1, sleeve: 'long', open: true },
  dress: { neck: 1, sleeve: 'short', dress: true, dressHem: 28 },
  sweater: { neck: 0, sleeve: 'long' },
  flannel: { neck: 1, sleeve: 'long', plaid: true },
}
interface BottomDef {
  legEnd?: number
  skirt?: boolean
}
const BOTTOM_DEFS: Record<string, BottomDef> = {
  pants: {},
  jeans: {},
  joggers: {},
  shorts: { legEnd: 26 },
  skirt: { skirt: true, legEnd: 27 },
}

const TORSO_TOP = 15
const TORSO_HEM = 22

/* ————— Colours ————— */
const OUTLINE = '#2f2a25'
const MOUTH_COLOR = '#9c5b4d'
const BLUSH_COLOR = '#ef9a8e'
const SHOE_COLOR = '#3a332e'
const LENS = '#bfe0f5'
const FRAME_DARK = '#242424'
const FIXED: Record<string, string> = {
  '1': '#6b4423',
  '2': '#eef4f7',
  '3': '#E8B84B',
  '4': '#C0442F',
  '5': '#3F6FA6',
  '6': '#3FA672',
  '7': '#33302b',
  '8': '#E38FB3',
  '9': '#8a5a2b',
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

function lighten(hex: string, f = 1.14): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f))
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f))
  const b = Math.min(255, Math.round((n & 255) * f))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function colorFor(ch: string, p: Record<string, string>): string | null {
  switch (ch) {
    case 's':
      return p.skin
    case 'p':
      return p.eye
    case 'w':
      return '#ffffff'
    case 'm':
      return MOUTH_COLOR
    case 'r':
      return BLUSH_COLOR
    case 'h':
      return p.hair
    case 'H':
      return p.hairShade
    case 'c':
      return p.top
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

function paintRow(grid: (string | null)[][], y: number, skin: string, col: string, shade: string, skip?: (x: number) => boolean) {
  let lastX = -1
  for (let x = 0; x < W; x++) {
    if (grid[y][x] !== skin) continue
    if (skip && skip(x)) continue
    grid[y][x] = col
    lastX = x
  }
  if (lastX >= 0) grid[y][lastX] = shade // subtle right-edge shading
}

const swatchColor = (list: Swatch[], id: string) => (list.find((s) => s.id === id) ?? list[0]).color

export function composeAvatar(cfg: AvatarConfig): (string | null)[][] {
  const skin = swatchColor(SKINS, cfg.skin)
  const hair = swatchColor(HAIR_COLORS, cfg.hairColor)
  const top = swatchColor(TOP_COLORS, cfg.topColor)
  const bottom = swatchColor(BOTTOM_COLORS, cfg.bottomColor)
  const p = {
    skin,
    eye: swatchColor(EYE_COLORS, cfg.eyeColor),
    hair,
    hairShade: darken(hair, 0.72),
    top,
    topShade: darken(top, 0.8),
    bottom,
    bottomShade: darken(bottom, 0.8),
  }
  const grid: (string | null)[][] = Array.from({ length: H }, () => Array<string | null>(W).fill(null))

  stamp(grid, BODY_SPRITES[cfg.body] ?? BODY_SPRITES.taper, p)

  // Paint clothing onto the body's skin pixels so it fits any silhouette.
  const td = TOP_DEFS[cfg.top] ?? TOP_DEFS.tee
  const neck = td.neck ?? 1
  // Arm cells are the skin pixels outside the torso columns (9–14). Sleeves
  // cover them down to armEnd; below that the arm/hand stays skin.
  const armEnd = td.sleeve === 'none' ? -1 : td.sleeve === 'long' ? 20 : 17
  for (let y = TORSO_TOP; y <= TORSO_HEM; y++) {
    paintRow(grid, y, skin, p.top, p.topShade, (x) => {
      if (x < 9 || x > 14) return y > armEnd // arm: skin below the sleeve
      if (y < TORSO_TOP + neck && (x === 11 || x === 12)) return true // neckline
      if (td.open && (x === 11 || x === 12) && y >= TORSO_TOP + 1) return true // open front
      return false
    })
  }
  if (td.hood) stamp(grid, HOOD, p)
  if (td.plaid) for (let y = TORSO_TOP; y <= TORSO_HEM; y++) for (const x of [8, 11, 14, 17]) if (grid[y][x] === p.top) grid[y][x] = p.topShade
  if (td.dress) for (let y = 23; y <= (td.dressHem ?? 27); y++) paintRow(grid, y, skin, p.top, p.topShade)

  if (!td.dress) {
    const bd = BOTTOM_DEFS[cfg.bottom] ?? BOTTOM_DEFS.pants
    const legEnd = bd.legEnd ?? 30
    if (bd.skirt) for (let y = 23; y <= (bd.legEnd ?? 27); y++) { grid[y][11] = p.bottom; grid[y][12] = p.bottom }
    for (let y = 23; y <= legEnd; y++) paintRow(grid, y, skin, p.bottom, p.bottomShade)
  }

  // Face + accessory layers (head is identical across bodies, so these align).
  stamp(grid, FACIAL_SPRITES[cfg.facialHair] ?? {}, p)
  stamp(grid, MOUTH, p)
  if (cfg.facialHair === 'none' || cfg.facialHair === 'stubble' || cfg.facialHair === 'mustache') stamp(grid, CHEEKS, p)
  stamp(grid, EYE_SPRITES[cfg.eyeShape] ?? EYE_SPRITES.round, p)
  stamp(grid, EYEWEAR_SPRITES[cfg.eyewear] ?? {}, p)
  stamp(grid, MASK_SPRITES[cfg.mask] ?? {}, p)
  stamp(grid, HAIR_SPRITES[cfg.hair] ?? {}, p)
  stamp(grid, HEADWEAR_SPRITES[cfg.headwear] ?? {}, p)
  stamp(grid, HANDHELD_SPRITES[cfg.handheld] ?? {}, p)

  // Shading pass: give the big material regions (skin, hair, top, bottom) a
  // darker transitional tone on the bottom/right edges and a lighter one on the
  // top/left, for depth. Small features (eyes, glasses, accessories) are left
  // flat because their colours aren't in these maps.
  const shadeOf: Record<string, string> = {
    [skin]: darken(skin, 0.86),
    [hair]: p.hairShade,
    [top]: p.topShade,
    [bottom]: p.bottomShade,
  }
  const lightOf: Record<string, string> = {
    [skin]: lighten(skin),
    [hair]: lighten(hair),
    [top]: lighten(top),
    [bottom]: lighten(bottom),
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x]
      if (!c || !(c in shadeOf)) continue
      const rightEdge = x === W - 1 || !grid[y][x + 1]
      const bottomEdge = y === H - 1 || !grid[y + 1][x]
      const topEdge = y === 0 || !grid[y - 1][x]
      const leftEdge = x === 0 || !grid[y][x - 1]
      if (rightEdge || bottomEdge) grid[y][x] = shadeOf[c]
      else if (topEdge || leftEdge) grid[y][x] = lightOf[c]
    }
  }

  // Auto-outline.
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

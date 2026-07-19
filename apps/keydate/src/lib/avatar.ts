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
// Sideways rounded rectangle — distinctly wider (cols 5–18, 14px) than it is
// tall (rows 5–14, 10px), like the chibi bead sprites: a flat, wide face with
// only the corners rounded, no chin point. The flat bottom (row 14, cols 7–16)
// sits flush on the shoulders (row 15) with no neck gap.
const HEAD: Sprite = {
  5: '.......ssssssssss.......',
  6: '......ssssssssssss......',
  7: '......ssssssssssss......',
  8: '......ssssssssssss......',
  9: '......ssssssssssss......',
  10: '......ssssssssssss......',
  11: '......ssssssssssss......',
  12: '......ssssssssssss......',
  13: '......ssssssssssss......',
  14: '.......ssssssssss.......',
}
const FEET: Sprite = { 25: '........fff..fff........' }
const LEGS: Sprite = {
  21: '.........ss..ss.........',
  22: '.........ss..ss.........',
  23: '.........ss..ss.........',
  24: '.........ss..ss.........',
}

/* Chibi / 8-bit proportions. The head (cols 8–15) is wider than a slim torso
   (cols 10–13). Shoulders connect at rows 15–16, then the arms split off with a
   1px gap (col 9 / col 14) so they read as distinct limbs hanging to the hands
   around rows 20–21. Sleeve-aware clothing paint leaves the lower arms as skin.
   The gap columns get the auto-outline, cleanly separating arm from body. */
const BODY_SPRITES: Record<string, Sprite> = {
  // Athletic — even shoulders (aligned to the arms so there's no stray nub),
  // 2px arms, narrow hips. Compact chibi torso for a ~1:1 head-to-body ratio.
  taper: {
    ...HEAD,
    15: '.......ssssssssss.......',
    16: '.......ss.ssss.ss.......',
    17: '.......ss.ssss.ss.......',
    18: '.......ss.ssss.ss.......',
    19: '..........ssss..........',
    20: '.........ssssss.........',
    ...LEGS,
    ...FEET,
  },
  // Curvy — a cinched waist and clearly wider hips (hourglass / pear).
  curvy: {
    ...HEAD,
    15: '.......ssssssssss.......',
    16: '.......ss.ssss.ss.......',
    17: '.......ss.ssss.ss.......',
    18: '.......ss.ssss.ss.......',
    19: '.........ssssss.........',
    20: '.......ssssssssss.......',
    ...LEGS,
    ...FEET,
  },
  // Slim — narrow frame with thin 1px arms.
  slim: {
    ...HEAD,
    15: '........ssssssss........',
    16: '........s.ssss.s........',
    17: '........s.ssss.s........',
    18: '........s.ssss.s........',
    19: '..........ssss..........',
    20: '.........ssssss.........',
    ...LEGS,
    ...FEET,
  },
  // Broad — wide shoulders and thick 3px arms (aligned so there's no nub).
  broad: {
    ...HEAD,
    15: '......ssssssssssss......',
    16: '......sss.ssss.sss......',
    17: '......sss.ssss.sss......',
    18: '......sss.ssss.sss......',
    19: '.........ssssss.........',
    20: '........ssssssss........',
    ...LEGS,
    ...FEET,
  },
}

// Eyes — Pokémon-trainer style: a dark lash/lid line ('g') over a coloured eye
// with a white glint ('w'). 'narrow' is a plain dash, 'sleepy' looks down.
const EYE_SPRITES: Record<string, Sprite> = {
  round: { 7: '.........gg..gg.........', 8: '.........wp..wp.........' },
  big: { 6: '.........gg..gg.........', 7: '.........wp..wp.........', 8: '.........pp..pp.........' },
  narrow: { 8: '.........gg..gg.........' },
  sleepy: { 8: '.........gg..gg.........', 9: '.........pp..pp.........' },
  wide: { 7: '........gg....gg........', 8: '........wp....wp........' },
}

// Rosy blush on the cheeks, just below the eyes.
const CHEEKS: Sprite = { 10: '.......rr......rr.......' }

// A small upturned smile.
const MOUTH: Sprite = { 11: '..........m..m..........', 12: '...........mm...........' }

const HAIR_SPRITES: Record<string, Sprite> = {
  bald: {},
  // Buzz — a flat-topped crop, wider than the head with hard corners.
  buzz: {
    4: '.....hhhhhhhhhhhhhh.....',
    5: '.....hhhhhhhhhhhhhh.....',
    6: '.....h............h.....',
  },
  // Short — fuller on the left, tapering off flush with the head's right edge.
  short: {
    3: '.....hhhhhhhhhhhh.......',
    4: '.....hhhhhhhhhhhhh......',
    5: '.....hhhhhhhhhhhhh......',
    6: '.....hh..........h......',
  },
  // Side part — a flat top with a hard diagonal sweep to the left, right edge
  // tapering off flush with the head.
  sidepart: {
    3: '.....hhhhhhhhhhhhh......',
    4: '....hhhhhhhhhhhhh.......',
    5: '....hhhhhhhhhh.........',
    6: '....hhhh...............',
  },
  // Bob — a rigid flat-top helmet with straight sides and blunt ends.
  bob: {
    3: '.....hhhhhhhhhhhhhh.....',
    4: '.....hhhhhhhhhhhhhh.....',
    5: '.....hhhhhhhhhhhhhh.....',
    6: '.....hh..........hh.....',
    7: '.....hh..........hh.....',
    8: '.....hh..........hh.....',
    9: '.....hh..........hh.....',
    10: '.....hh..........hh.....',
    11: '.....hhh........hhh.....',
  },
  // Spiky — sharp separated spikes over a solid base that reaches the crown.
  spiky: {
    1: '.....h.h.h.h.h.h.h.....',
    2: '.....hhhhhhhhhhhhhh.....',
    3: '.....hhhhhhhhhhhhhh.....',
    4: '.....hhhhhhhhhhhhhh.....',
    5: '.....hh..........hh.....',
  },
  // Ponytail — flat pulled-back top with a blocky tail off the side.
  ponytail: {
    3: '.....hhhhhhhhhhhhhh.....',
    4: '.....hhhhhhhhhhhh.......',
    5: '.....hhhhhhhhhh.........',
    6: '...............hhhh.....',
    7: '...............hhhh.....',
    8: '...............hhhh.....',
    9: '...............hhh......',
  },
  // Long — fuller left curtain; the right curtain tapers off flush with the head.
  long: {
    3: '.....hhhhhhhhhhhh.......',
    4: '.....hhhhhhhhhhhhh......',
    5: '.....hhhhhhhhhhhhh......',
    6: '.....hh.........hh......',
    7: '.....hh.........hh......',
    8: '.....hh.........hh......',
    9: '.....hh.........hh......',
    10: '.....hh.........hh......',
    11: '.....hh.........hh......',
    12: '.....hh.........hh......',
  },
  // Wavy — stepped waves on the fuller left; right side tapers flush with the head.
  wavy: {
    3: '.....hhhhhhhhhhhh.......',
    4: '.....hhhhhhhhhhhhh......',
    5: '.....hhhhhhhhhhhhh......',
    6: '.....hh.........hh......',
    7: '....hhh.........hh......',
    8: '....hh..........hh......',
    9: '....hhh.........hh......',
    10: '.....hh.........hh......',
    11: '.....hhh.......hh.......',
  },
  // Top knot — a square knot sitting on a flat cap.
  bun: {
    1: '..........hhhh.........',
    2: '.........hhhhhh........',
    3: '..........hhhh.........',
    4: '.....hhhhhhhhhhhhhh.....',
    5: '.....hhhhhhhhhhhhhh.....',
    6: '.....hh..........hh.....',
  },
  // Afro — the biggest, squared-off volume, framing the cheeks.
  afro: {
    0: '.....hhhhhhhhhhhhhh.....',
    1: '....hhhhhhhhhhhhhhhh....',
    2: '....hhhhhhhhhhhhhhhh....',
    3: '....hhhhhhhhhhhhhhhh....',
    4: '....hhhhhhhhhhhhhhhh....',
    5: '....hhhhhhhhhhhhhhhh....',
    6: '.....hh..........hh.....',
    7: '.....hh..........hh.....',
  },
  // Mohawk — a tall central strip, shaved sides.
  mohawk: {
    0: '..........hhhh.........',
    1: '..........hhhh.........',
    2: '..........hhhh.........',
    3: '..........hhhh.........',
    4: '..........hhhh.........',
    5: '..........hhhh.........',
    6: '..........hhhh.........',
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

// Eyewear — lenses sit over the eyes (cols 9–10 / 13–14) and the temple arms
// run out to the head's edge (cols 6 / 17) but never past it.
const EYEWEAR_SPRITES: Record<string, Sprite> = {
  none: {},
  round: { 8: '......gggllggllggg......' },
  square: { 7: '........gg.gg.gg........', 8: '......gggllggllggg......', 9: '.........gg.gg.........' },
  sunglasses: { 7: '........gg.gg.gg........', 8: '......gggggggggggg......' },
  monocle: { 7: '............gg.........', 8: '...........gllg........', 9: '............gg.........' },
  visor: { 6: '......gggggggggggg......', 7: '......llllllllllll......' },
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
    3: '......5555555555555.....',
    4: '.....555555555555555....',
    5: '.....55555555555555555..',
  },
  beanie: {
    2: '.....44444444444444.....',
    3: '.....44444444444444.....',
    4: '.....44444444444444.....',
    5: '.....44444444444444.....',
    6: '.....444444444444444....',
  },
  headband: { 6: '.....44444444444444.....' },
  cowboy: {
    3: '......9999999999999.....',
    4: '......9999999999999.....',
    5: '...999999999999999999...',
    6: '...999999999999999999...',
  },
  hardhat: {
    3: '......333333333333......',
    4: '.....33333333333333.....',
    5: '.....33333333333333.....',
  },
  tophat: {
    0: '........77777777........',
    1: '........77777777........',
    2: '........77777777........',
    3: '........77777777........',
    4: '......777777777777......',
  },
  party: {
    0: '...........88..........',
    1: '..........8888.........',
    2: '.........888888........',
    3: '........88888888.......',
    4: '.......8888888888......',
  },
  crown: { 3: '......3.3.3.3.3.3.3.....', 4: '......333333333333......', 5: '......333333333333......' },
}

const HOOD: Sprite = { 14: '......cc........cc......', 15: '......cccccccccccc......' }

// Held just outside the right hand (arm around cols 15–16, rows 16–18).
const HANDHELD_SPRITES: Record<string, Sprite> = {
  none: {},
  // To-go coffee cup: brown lid, white cup, tapering to the base.
  coffee: {
    15: '................1111....',
    16: '................2222....',
    17: '................2222....',
    18: '.................22.....',
  },
  // Phone: dark body framing a light screen.
  phone: {
    15: '................777.....',
    16: '................7ll7....',
    17: '................7ll7....',
    18: '................777.....',
  },
  // Golden key: a hollow round bow, a shaft, and two teeth on the bit.
  key: {
    15: '.................333....',
    16: '.................3.3....',
    17: '.................333....',
    18: '..................3.....',
    19: '..................33....',
    20: '..................3.....',
    21: '..................33....',
  },
  // Potted plant: green sprout leaves in a brown pot with a rim.
  plant: {
    13: '................6.6.....',
    14: '................666.....',
    15: '.................6......',
    16: '................999.....',
    17: '................111.....',
    18: '.................1......',
  },
  // Balloon on a string floating up beside the hand.
  balloon: {
    7: '.................44.....',
    8: '................4444....',
    9: '................4444....',
    10: '.................44.....',
    11: '.................w......',
    12: '.................4......',
    13: '.................4......',
    14: '.................4......',
    15: '.................4......',
    16: '.................4......',
    17: '.................4......',
    18: '.................4......',
  },
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
  dress: { neck: 1, sleeve: 'short', dress: true, dressHem: 23 },
  sweater: { neck: 0, sleeve: 'long' },
  flannel: { neck: 1, sleeve: 'long', plaid: true },
}
interface BottomDef {
  legEnd?: number
  skirt?: boolean
  waistband?: boolean // lighter band at the top (denim look)
  cuff?: boolean // lighter rolled hem at the ankles
}
const BOTTOM_DEFS: Record<string, BottomDef> = {
  pants: {},
  jeans: { waistband: true, cuff: true },
  joggers: { cuff: true },
  shorts: { legEnd: 22 },
  skirt: { skirt: true, legEnd: 22 },
}

const TORSO_TOP = 15
const TORSO_HEM = 19
const HIP_TOP = 20
const LEG_END = 24

/* ————— Colours ————— */
const OUTLINE = '#231f1b'
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
  const armEnd = td.sleeve === 'none' ? -1 : td.sleeve === 'long' ? 18 : 16
  for (let y = TORSO_TOP; y <= TORSO_HEM; y++) {
    paintRow(grid, y, skin, p.top, p.topShade, (x) => {
      // Shoulders (rows 15–16) are always covered; the arms only split off from
      // row 16 down, so a sleeveless top still covers the shoulders cleanly.
      if (y >= 16 && (x < 9 || x > 14)) return y > armEnd // arm: skin below the sleeve
      if (y < TORSO_TOP + neck && (x === 11 || x === 12)) return true // neckline
      if (td.open && (x === 11 || x === 12) && y >= TORSO_TOP + 1) return true // open front
      return false
    })
  }
  if (td.hood) stamp(grid, HOOD, p)
  if (td.plaid) for (let y = TORSO_TOP; y <= TORSO_HEM; y++) for (const x of [8, 11, 14, 17]) if (grid[y][x] === p.top) grid[y][x] = p.topShade
  if (td.dress) for (let y = HIP_TOP; y <= (td.dressHem ?? 22); y++) paintRow(grid, y, skin, p.top, p.topShade)

  if (!td.dress) {
    const bd = BOTTOM_DEFS[cfg.bottom] ?? BOTTOM_DEFS.pants
    const legEnd = bd.legEnd ?? LEG_END
    if (bd.skirt) for (let y = HIP_TOP; y <= (bd.legEnd ?? 22); y++) { grid[y][11] = p.bottom; grid[y][12] = p.bottom }
    for (let y = HIP_TOP; y <= legEnd; y++) paintRow(grid, y, skin, p.bottom, p.bottomShade)
    // Jeans / joggers: pick out a lighter waistband and rolled cuffs so denim
    // reads differently from plain pants of the same colour.
    const bandLight = lighten(bottom, 1.22)
    const recolor = (y: number) => { for (let x = 0; x < W; x++) if (grid[y][x] === p.bottom || grid[y][x] === p.bottomShade) grid[y][x] = bandLight }
    if (bd.waistband) recolor(HIP_TOP)
    if (bd.cuff) { recolor(legEnd - 1); recolor(legEnd) }
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

  // GBA-style cel shading. Each big material region (skin, hair, top, bottom)
  // gets four tones under a consistent top-left light: a highlight on the
  // top/left rim, the flat base in the interior, a shadow on the bottom/right
  // rim, and a deeper shadow in the bottom-right corners. Small features (eyes,
  // glasses, accessories) keep their flat colours.
  const hi: Record<string, string> = {}
  const sh: Record<string, string> = {}
  const deep: Record<string, string> = {}
  for (const c of [skin, hair, top, bottom]) {
    hi[c] = lighten(c, 1.13)
    sh[c] = darken(c, 0.82)
    deep[c] = darken(c, 0.64)
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x]
      if (!c || !(c in sh)) continue
      const rightEdge = x === W - 1 || !grid[y][x + 1]
      const bottomEdge = y === H - 1 || !grid[y + 1][x]
      const topEdge = y === 0 || !grid[y - 1][x]
      const leftEdge = x === 0 || !grid[y][x - 1]
      if (bottomEdge && rightEdge) grid[y][x] = deep[c]
      else if (bottomEdge || rightEdge) grid[y][x] = sh[c]
      else if (topEdge || leftEdge) grid[y][x] = hi[c]
    }
  }
  // Light dither on the inner edge of the shadow band, for that pixel-art
  // banding texture (checkerboard so it stays subtle).
  const snap = grid.map((row) => row.slice())
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x]
      if (!c || !(c in sh) || (x + y) % 2 !== 0) continue
      const below = y < H - 1 ? snap[y + 1][x] : null
      const right = x < W - 1 ? snap[y][x + 1] : null
      const shaded = (v: string | null) => v === sh[c] || v === deep[c]
      if (shaded(below) || shaded(right)) grid[y][x] = sh[c]
    }
  }

  // Auto-outline — a deep, near-black rim all the way around the silhouette.
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

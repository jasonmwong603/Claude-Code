/* ============================================================================
   Layered 2D pixel-avatar engine (Mii / MMORPG-style character creator).

   A character is composed from selectable layers — body, skin tone, eyes,
   eye colour, hairstyle, hair colour, top, bottom — each drawn as a small
   sprite on a 16×24 grid. Sprites are authored as row maps (only the rows they
   touch), coloured at render time from the user's palette picks, then a dark
   outline is added automatically around the silhouette so flat art still looks
   crisp. Head-only and full-body crops come from the same grid.

   To add options later, just append to the arrays / sprite maps below — the UI
   reads them generically. Core identity (body, skin, eye shape/colour) is
   free; hairstyles, clothing, and fancy hair colours unlock by level.
   ========================================================================== */

export interface AvatarConfig {
  body: string
  skin: string
  eyeShape: string
  eyeColor: string
  hair: string
  hairColor: string
  top: string
  topColor: string
  bottom: string
  bottomColor: string
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

/* ————— Style catalogs (each has a sprite below) ————— */
export const BODIES: Style[] = [
  { id: 'masc', label: 'Type A', unlockLevel: 1 },
  { id: 'fem', label: 'Type B', unlockLevel: 1 },
]

export const EYE_SHAPES: Style[] = [
  { id: 'round', label: 'Round', unlockLevel: 1 },
  { id: 'big', label: 'Big', unlockLevel: 1 },
  { id: 'sleepy', label: 'Sleepy', unlockLevel: 1 },
  { id: 'wide', label: 'Wide-set', unlockLevel: 1 },
]

export const HAIRS: Style[] = [
  { id: 'bald', label: 'Bald', unlockLevel: 1 },
  { id: 'buzz', label: 'Buzz', unlockLevel: 1 },
  { id: 'short', label: 'Short', unlockLevel: 1 },
  { id: 'bob', label: 'Bob', unlockLevel: 1 },
  { id: 'spiky', label: 'Spiky', unlockLevel: 2 },
  { id: 'ponytail', label: 'Ponytail', unlockLevel: 2 },
  { id: 'long', label: 'Long', unlockLevel: 3 },
  { id: 'bun', label: 'Top Bun', unlockLevel: 4 },
  { id: 'afro', label: 'Afro', unlockLevel: 4 },
  { id: 'mohawk', label: 'Mohawk', unlockLevel: 5 },
]

export const TOPS: Style[] = [
  { id: 'tee', label: 'T-shirt', unlockLevel: 1 },
  { id: 'tank', label: 'Tank', unlockLevel: 1 },
  { id: 'longsleeve', label: 'Long Sleeve', unlockLevel: 2 },
  { id: 'hoodie', label: 'Hoodie', unlockLevel: 2 },
  { id: 'jacket', label: 'Jacket', unlockLevel: 3 },
  { id: 'dress', label: 'Dress', unlockLevel: 3 },
  { id: 'sweater', label: 'Sweater', unlockLevel: 4 },
  { id: 'overalls', label: 'Overalls', unlockLevel: 5 },
]

export const BOTTOMS: Style[] = [
  { id: 'pants', label: 'Pants', unlockLevel: 1 },
  { id: 'shorts', label: 'Shorts', unlockLevel: 1 },
  { id: 'jeans', label: 'Jeans', unlockLevel: 2 },
  { id: 'skirt', label: 'Skirt', unlockLevel: 3 },
  { id: 'joggers', label: 'Joggers', unlockLevel: 4 },
]

export const DEFAULT_AVATAR: AvatarConfig = {
  body: 'masc',
  skin: 'warm',
  eyeShape: 'round',
  eyeColor: 'brown',
  hair: 'short',
  hairColor: 'brown',
  top: 'tee',
  topColor: 'spruce',
  bottom: 'pants',
  bottomColor: 'denim',
}

/* ————— Sprites: row index → 16-char string. Chars:
   s skin · p eye · m mouth · h hair · c top · b bottom · f shoe · . empty ——— */
type Sprite = Record<number, string>

const BODY_SPRITES: Record<string, Sprite> = {
  masc: {
    2: '.....ssssss.....',
    3: '.....ssssss.....',
    4: '.....ssssss.....',
    5: '.....ssssss.....',
    6: '.....ssssss.....',
    7: '......ssss......',
    8: '....ssssssss....',
    9: '...ssssssssss...',
    10: '...ssssssssss...',
    11: '...ssssssssss...',
    12: '...ssssssssss...',
    13: '...ssssssssss...',
    14: '....ssssssss....',
    15: '.....ss..ss.....',
    16: '.....ss..ss.....',
    17: '.....ss..ss.....',
    18: '.....ss..ss.....',
    19: '.....ss..ss.....',
    20: '.....ss..ss.....',
    21: '.....ff..ff.....',
  },
  fem: {
    2: '.....ssssss.....',
    3: '.....ssssss.....',
    4: '.....ssssss.....',
    5: '.....ssssss.....',
    6: '.....ssssss.....',
    7: '......ssss......',
    8: '....ssssssss....',
    9: '....ssssssss....',
    10: '....ssssssss....',
    11: '.....ssssss.....',
    12: '.....ssssss.....',
    13: '....ssssssss....',
    14: '...ssssssssss...',
    15: '.....ss..ss.....',
    16: '.....ss..ss.....',
    17: '.....ss..ss.....',
    18: '.....ss..ss.....',
    19: '.....ss..ss.....',
    20: '.....ss..ss.....',
    21: '.....ff..ff.....',
  },
}

const EYE_SPRITES: Record<string, Sprite> = {
  round: { 5: '......p..p......' },
  big: { 4: '......p..p......', 5: '......p..p......' },
  sleepy: { 6: '......p..p......' },
  wide: { 5: '.....p....p.....' },
}

const MOUTH: Sprite = { 7: '.......mm.......' }

const HAIR_SPRITES: Record<string, Sprite> = {
  bald: {},
  buzz: { 2: '.....hhhhhh.....' },
  short: { 1: '.....hhhhhh.....', 2: '.....hhhhhh.....', 3: '.....h....h.....' },
  bob: {
    1: '.....hhhhhh.....',
    2: '....hhhhhhhh....',
    3: '....hh....hh....',
    4: '....hh....hh....',
    5: '....hh....hh....',
    6: '....hh....hh....',
    7: '.....h....h.....',
  },
  spiky: { 0: '....h.hh.h.h....', 1: '.....hhhhhh.....', 2: '.....hhhhhh.....' },
  ponytail: {
    1: '.....hhhhhh.....',
    2: '....hhhhhhhh....',
    3: '....hh....hh....',
    4: '..........hhh...',
    5: '...........hh...',
    6: '...........hh...',
    7: '...........h....',
  },
  long: {
    1: '.....hhhhhh.....',
    2: '....hhhhhhhh....',
    3: '....hh....hh....',
    4: '....hh....hh....',
    5: '....hh....hh....',
    6: '....hh....hh....',
    7: '....hh....hh....',
    8: '....hh....hh....',
    9: '....hh....hh....',
    10: '....hh....hh....',
  },
  bun: {
    0: '.......hh.......',
    1: '.....hhhhhh.....',
    2: '....hhhhhhhh....',
    3: '.....h....h.....',
  },
  afro: {
    0: '....hhhhhhhh....',
    1: '...hhhhhhhhhh...',
    2: '...hhhhhhhhhh...',
    3: '...hh......hh...',
    4: '....h......h....',
  },
  mohawk: { 0: '.......hh.......', 1: '.......hh.......', 2: '.......hh.......', 3: '.......hh.......' },
}

const TOP_SPRITES: Record<string, Sprite> = {
  tee: {
    8: '....cccccccc....',
    9: '...cccccccccc...',
    10: '...cccccccccc...',
    11: '....cccccccc....',
    12: '....cccccccc....',
    13: '....cccccccc....',
    14: '....cccccccc....',
  },
  tank: {
    8: '.....c....c.....',
    9: '.....cccccc.....',
    10: '.....cccccc.....',
    11: '.....cccccc.....',
    12: '.....cccccc.....',
    13: '.....cccccc.....',
    14: '.....cccccc.....',
  },
  longsleeve: {
    8: '....cccccccc....',
    9: '...cccccccccc...',
    10: '...cccccccccc...',
    11: '...cccccccccc...',
    12: '...cccccccccc...',
    13: '...cccccccccc...',
    14: '....cccccccc....',
  },
  hoodie: {
    7: '.....c....c.....',
    8: '....cccccccc....',
    9: '...cccccccccc...',
    10: '...cccccccccc...',
    11: '...cccccccccc...',
    12: '...cccccccccc...',
    13: '...cccccccccc...',
    14: '....cccccccc....',
  },
  jacket: {
    8: '....cc.cc.cc....',
    9: '...ccc.cc.ccc...',
    10: '...ccc.cc.ccc...',
    11: '...ccc.cc.ccc...',
    12: '...ccc.cc.ccc...',
    13: '...ccc.cc.ccc...',
    14: '....cc.cc.cc....',
  },
  dress: {
    8: '....cccccccc....',
    9: '...cccccccccc...',
    10: '...cccccccccc...',
    11: '....cccccccc....',
    12: '....cccccccc....',
    13: '...cccccccccc...',
    14: '...cccccccccc...',
    15: '...cccccccccc...',
    16: '..cccccccccccc..',
    17: '..cccccccccccc..',
  },
  sweater: {
    7: '....cccccccc....',
    8: '...cccccccccc...',
    9: '...cccccccccc...',
    10: '...cccccccccc...',
    11: '...cccccccccc...',
    12: '...cccccccccc...',
    13: '...cccccccccc...',
    14: '....cccccccc....',
  },
  overalls: {
    8: '.....c....c.....',
    9: '....cccccccc....',
    10: '....cccccccc....',
    11: '....cccccccc....',
    12: '....cccccccc....',
    13: '....cccccccc....',
    14: '....cccccccc....',
  },
}

const BOTTOM_SPRITES: Record<string, Sprite> = {
  pants: {
    14: '.....bbbbbb.....',
    15: '.....bb..bb.....',
    16: '.....bb..bb.....',
    17: '.....bb..bb.....',
    18: '.....bb..bb.....',
    19: '.....bb..bb.....',
    20: '.....bb..bb.....',
  },
  jeans: {
    14: '.....bbbbbb.....',
    15: '.....bb..bb.....',
    16: '.....bb..bb.....',
    17: '.....bb..bb.....',
    18: '.....bb..bb.....',
    19: '.....bb..bb.....',
    20: '.....bb..bb.....',
  },
  joggers: {
    14: '.....bbbbbb.....',
    15: '.....bb..bb.....',
    16: '.....bb..bb.....',
    17: '.....bb..bb.....',
    18: '.....bb..bb.....',
    19: '.....bb..bb.....',
    20: '.....bbbbbb.....',
  },
  shorts: {
    14: '.....bbbbbb.....',
    15: '.....bb..bb.....',
    16: '.....bb..bb.....',
  },
  skirt: {
    14: '....bbbbbbbb....',
    15: '...bbbbbbbbbb...',
    16: '...bbbbbbbbbb...',
  },
}

const OUTLINE = '#2f2a25'
const MOUTH_COLOR = '#9c5b4d'
const SHOE_COLOR = '#3a332e'
const W = 16
const H = 24

function colorFor(ch: string, p: Record<string, string>): string | null {
  switch (ch) {
    case 's':
      return p.skin
    case 'p':
      return p.eye
    case 'm':
      return MOUTH_COLOR
    case 'h':
      return p.hair
    case 'c':
      return p.top
    case 'b':
      return p.bottom
    case 'f':
      return SHOE_COLOR
    default:
      return null
  }
}

function stamp(grid: (string | null)[][], sprite: Sprite, p: Record<string, string>) {
  for (const [rowStr, line] of Object.entries(sprite)) {
    const y = Number(rowStr)
    for (let x = 0; x < Math.min(line.length, W); x++) {
      const c = colorFor(line[x], p)
      if (c) grid[y][x] = c
    }
  }
}

const swatchColor = (list: Swatch[], id: string) => (list.find((s) => s.id === id) ?? list[0]).color

/** Compose an AvatarConfig into a 24×16 colour grid (null = transparent),
 *  with an automatic 1px dark outline around the silhouette. */
export function composeAvatar(cfg: AvatarConfig): (string | null)[][] {
  const p = {
    skin: swatchColor(SKINS, cfg.skin),
    eye: swatchColor(EYE_COLORS, cfg.eyeColor),
    hair: swatchColor(HAIR_COLORS, cfg.hairColor),
    top: swatchColor(TOP_COLORS, cfg.topColor),
    bottom: swatchColor(BOTTOM_COLORS, cfg.bottomColor),
  }
  const grid: (string | null)[][] = Array.from({ length: H }, () => Array<string | null>(W).fill(null))

  stamp(grid, BODY_SPRITES[cfg.body] ?? BODY_SPRITES.masc, p)
  stamp(grid, BOTTOM_SPRITES[cfg.bottom] ?? {}, p)
  stamp(grid, TOP_SPRITES[cfg.top] ?? {}, p)
  stamp(grid, HAIR_SPRITES[cfg.hair] ?? {}, p)
  stamp(grid, EYE_SPRITES[cfg.eyeShape] ?? EYE_SPRITES.round, p)
  stamp(grid, MOUTH, p)

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

export const AVATAR_GRID = { W, H }

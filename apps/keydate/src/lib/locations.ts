import type { HomeTypeKey, ResolvedLocation } from '../types'

/* ————— Built-in market prices (rough average detached, CAD) —————
   Illustrative baseline figures. TODO (see project roadmap): replace this
   hand-maintained table with a generated one sourced from CMHC / StatCan and a
   real geocoder for disambiguation. */
export const BUILT_IN: Record<string, number> = {
  edmonton: 480000, calgary: 620000, 'red deer': 380000, lethbridge: 400000,
  'medicine hat': 340000, 'grande prairie': 380000, 'grand prairie': 380000,
  'fort mcmurray': 400000, camrose: 330000, airdrie: 555000, 'st. albert': 550000,
  'st albert': 550000, 'sherwood park': 540000, leduc: 470000, 'spruce grove': 490000,
  okotoks: 600000, 'cold lake': 300000, lloydminster: 340000,
  'fort saskatchewan': 450000, beaumont: 480000, cochrane: 620000,
  canmore: 1300000, wetaskiwin: 280000, brooks: 300000,
  saskatoon: 420000, regina: 340000, 'prince albert': 250000, 'moose jaw': 280000,
  'swift current': 260000, yorkton: 240000, 'north battleford': 220000, estevan: 250000,
  winnipeg: 400000, brandon: 320000, steinbach: 350000,
  'portage la prairie': 280000, thompson: 250000,
  vancouver: 2000000, victoria: 1150000, kelowna: 900000, kamloops: 650000,
  abbotsford: 1050000, nanaimo: 750000, 'prince george': 480000, surrey: 1500000,
  burnaby: 1900000, chilliwack: 850000, coquitlam: 1450000, richmond: 1700000,
  langley: 1350000, delta: 1400000, 'maple ridge': 1150000,
  'port coquitlam': 1250000, 'north vancouver': 2100000, 'west vancouver': 3200000,
  'new westminster': 1300000, vernon: 750000, penticton: 750000,
  courtenay: 800000, 'campbell river': 700000, squamish: 1500000,
  mission: 1000000, 'white rock': 1600000,
  toronto: 1350000, ottawa: 730000, hamilton: 850000, london: 650000,
  kitchener: 800000, waterloo: 810000, windsor: 550000, kingston: 600000,
  sudbury: 450000, 'thunder bay': 350000, barrie: 800000, guelph: 850000,
  mississauga: 1300000, brampton: 1100000, 'niagara falls': 650000,
  'st. catharines': 650000, 'st catharines': 650000, oshawa: 850000,
  markham: 1400000, vaughan: 1500000, 'richmond hill': 1500000,
  oakville: 1500000, burlington: 1200000, milton: 1150000, ajax: 1000000,
  pickering: 1050000, whitby: 1050000, newmarket: 1150000, aurora: 1300000,
  cambridge: 750000, brantford: 650000, 'sault ste. marie': 330000,
  'sault ste marie': 330000, 'north bay': 420000, peterborough: 650000,
  belleville: 550000, sarnia: 500000, 'chatham-kent': 430000, chatham: 430000,
  cornwall: 400000, orillia: 700000, 'owen sound': 500000, timmins: 280000,
  montreal: 650000, 'montréal': 650000, 'quebec city': 400000, 'québec city': 400000,
  gatineau: 500000, sherbrooke: 420000, 'trois-rivières': 320000,
  'trois-rivieres': 320000, laval: 600000, longueuil: 580000,
  'saint-jérôme': 450000, 'saint-jerome': 450000, terrebonne: 550000,
  brossard: 650000, drummondville: 350000, saguenay: 300000,
  'lévis': 400000, levis: 400000,
  halifax: 565000, moncton: 350000, 'saint john': 300000, fredericton: 350000,
  charlottetown: 400000, "st. john's": 350000, "st john's": 350000, sydney: 300000,
  dartmouth: 500000, truro: 350000, bathurst: 250000, miramichi: 220000,
  summerside: 330000, 'corner brook': 280000,
  yellowknife: 550000, whitehorse: 600000, iqaluit: 620000,
  'east gwillimbury': 1300000, 'new tecumseth': 900000,
  'bradford west gwillimbury': 1000000, bradford: 1000000,
  'wasaga beach': 750000, collingwood: 850000, innisfil: 950000,
  caledon: 1400000, 'whitchurch-stouffville': 1350000, stouffville: 1350000,
  'carleton place': 600000, 'the blue mountains': 1000000,
  tillsonburg: 600000, woodstock: 620000, shelburne: 750000, stratford: 700000,
  langford: 950000, 'west kelowna': 950000, 'lake country': 1000000,
  fernie: 800000, invermere: 750000, sooke: 850000, comox: 800000,
  parksville: 800000, 'salmon arm': 650000,
  chestermere: 600000, blackfalds: 380000, 'sylvan lake': 420000,
  'stony plain': 470000, warman: 380000, martensville: 370000,
  winkler: 380000, niverville: 400000, morden: 350000, 'west st. paul': 550000,
  mirabel: 550000, blainville: 620000, mascouche: 550000, chambly: 550000,
  carignan: 600000, 'saint-lin-laurentides': 450000,
  'stratford pei': 450000, 'cornwall pei': 430000, dieppe: 400000,
  riverview: 350000, quispamsis: 350000, paradise: 400000,
  'conception bay south': 380000,
}

export const TYPE_MULT: Record<HomeTypeKey, number> = {
  apartment: 0.45, townhouse: 0.65, semi: 0.75, bungalow: 0.85,
  twostorey: 1.0, mobile: 0.25, land: 0.3,
}

export const HOME_TYPES: { key: HomeTypeKey; label: string }[] = [
  { key: 'apartment', label: 'Apartment / Condo' },
  { key: 'townhouse', label: 'Townhouse / Row' },
  { key: 'semi', label: 'Semi-detached' },
  { key: 'bungalow', label: 'Bungalow' },
  { key: 'twostorey', label: 'Two-storey detached' },
  { key: 'mobile', label: 'Mobile / Manufactured' },
  { key: 'land', label: 'Vacant land' },
]

export function homeTypeLabel(key: HomeTypeKey): string {
  return HOME_TYPES.find((t) => t.key === key)?.label ?? key
}

const titleCase = (s: string) => s.replace(/(^|\s|'|\.|-)\S/g, (c) => c.toUpperCase())

/** Substring match against the built-in table. Note: still substring-based and
 *  can false-positive on very short inputs (guarded to length >= 3). */
export function matchBuiltIn(q: string): ResolvedLocation | null {
  const norm = q.trim().toLowerCase()
  if (norm.length < 3) return null
  for (const key of Object.keys(BUILT_IN)) {
    if (norm === key || norm.includes(key) || key.startsWith(norm)) {
      return { name: titleCase(key), base: BUILT_IN[key], source: 'built-in estimate' }
    }
  }
  return null
}

/**
 * Production hook for a live price lookup by location.
 *
 * The v5 prototype called the Anthropic API directly from the browser — that
 * only worked inside a Claude.ai artifact (no API key, and it would hit CORS
 * from a normal site) so it is intentionally NOT shipped here. Wire this to
 * your own backend endpoint when you build the location pipeline (CMHC / a
 * geocoder). Until then the UI falls back to manual price entry, so the app is
 * fully usable standalone.
 */
export async function lookupPrices(_location: string): Promise<ResolvedLocation> {
  throw new Error('LOOKUP_NOT_CONFIGURED')
}

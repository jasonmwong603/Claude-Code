import type { HomeTypeKey, ResolvedLocation } from '../types'

/* ————— Built-in market prices (representative detached, CAD) —————
   These are ESTIMATES, not live market data. The `base` for each place is a
   rough "typical detached" figure; the app scales it by home type (see
   TYPE_MULT). The largest metros were calibrated against mid-2026 CREA / local-
   board / WOWA figures (e.g. Toronto detached avg ≈ $1.36M, Vancouver ≈ $1.99M,
   Edmonton benchmark ≈ $530K, June/July 2026); the long tail of smaller towns
   remains hand-estimated and can be off. Markets also move, so treat every
   number as a starting point the user can override.
   TODO (roadmap): replace this hand-maintained table with a live feed (CREA
   MLS® HPI / a data API) + a real geocoder — see resolvePrice() below. */
export const BUILT_IN: Record<string, number> = {
  edmonton: 530000, calgary: 740000, 'red deer': 380000, lethbridge: 400000,
  'medicine hat': 340000, 'grande prairie': 380000, 'grand prairie': 380000,
  'fort mcmurray': 400000, camrose: 330000, airdrie: 555000, 'st. albert': 550000,
  'st albert': 550000, 'sherwood park': 540000, leduc: 470000, 'spruce grove': 490000,
  okotoks: 600000, 'cold lake': 300000, lloydminster: 340000,
  'fort saskatchewan': 450000, beaumont: 480000, cochrane: 620000,
  canmore: 1300000, wetaskiwin: 280000, brooks: 300000,
  saskatoon: 460000, regina: 385000, 'prince albert': 250000, 'moose jaw': 280000,
  'swift current': 260000, yorkton: 240000, 'north battleford': 220000, estevan: 250000,
  winnipeg: 420000, brandon: 320000, steinbach: 350000,
  'portage la prairie': 280000, thompson: 250000,
  vancouver: 1990000, victoria: 1300000, kelowna: 1050000, kamloops: 690000,
  abbotsford: 1170000, nanaimo: 800000, 'prince george': 480000, surrey: 1500000,
  burnaby: 1900000, chilliwack: 850000, coquitlam: 1450000, richmond: 1700000,
  langley: 1350000, delta: 1400000, 'maple ridge': 1150000,
  'port coquitlam': 1250000, 'north vancouver': 2100000, 'west vancouver': 3200000,
  'new westminster': 1300000, vernon: 750000, penticton: 750000,
  courtenay: 800000, 'campbell river': 700000, squamish: 1500000,
  mission: 1000000, 'white rock': 1600000,
  toronto: 1360000, ottawa: 790000, hamilton: 900000, london: 700000,
  kitchener: 870000, waterloo: 870000, windsor: 575000, kingston: 620000,
  sudbury: 450000, 'thunder bay': 350000, barrie: 750000, guelph: 880000,
  mississauga: 1300000, brampton: 1100000, 'niagara falls': 650000,
  'st. catharines': 650000, 'st catharines': 650000, oshawa: 850000,
  markham: 1500000, vaughan: 1500000, 'richmond hill': 1500000,
  oakville: 1650000, burlington: 1200000, milton: 1150000, ajax: 1000000,
  pickering: 1050000, whitby: 1050000, newmarket: 1150000, aurora: 1300000,
  cambridge: 750000, brantford: 650000, 'sault ste. marie': 330000,
  'sault ste marie': 330000, 'north bay': 420000, peterborough: 650000,
  belleville: 550000, sarnia: 500000, 'chatham-kent': 430000, chatham: 430000,
  cornwall: 400000, orillia: 700000, 'owen sound': 500000, timmins: 280000,
  montreal: 650000, 'montréal': 650000, 'quebec city': 450000, 'québec city': 450000,
  gatineau: 500000, sherbrooke: 420000, 'trois-rivières': 320000,
  'trois-rivieres': 320000, laval: 600000, longueuil: 580000,
  'saint-jérôme': 450000, 'saint-jerome': 450000, terrebonne: 550000,
  brossard: 650000, drummondville: 350000, saguenay: 300000,
  'lévis': 400000, levis: 400000,
  halifax: 620000, moncton: 355000, 'saint john': 300000, fredericton: 350000,
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

  // ——— Expanded coverage (illustrative averages, CAD) ———
  // Alberta
  banff: 900000, jasper: 650000, 'high river': 500000, strathmore: 470000,
  lacombe: 380000, olds: 390000, drumheller: 300000, hinton: 350000,
  whitecourt: 340000, edson: 330000, 'slave lake': 300000, 'peace river': 320000,
  'high level': 300000, bonnyville: 320000, 'st. paul': 300000, 'st paul': 300000,
  vegreville: 300000, wainwright: 300000, taber: 300000, devon: 450000,
  morinville: 430000, ponoka: 340000, 'rocky mountain house': 340000, stettler: 300000,
  coaldale: 390000, didsbury: 420000, crossfield: 480000, sundre: 380000,
  raymond: 380000, cardston: 320000,

  // British Columbia
  cranbrook: 500000, nelson: 650000, trail: 400000, castlegar: 460000,
  'dawson creek': 350000, 'fort st. john': 400000, 'fort st john': 400000,
  terrace: 450000, kitimat: 380000, quesnel: 350000, 'williams lake': 400000,
  'port alberni': 500000, duncan: 700000, ladysmith: 700000, sechelt: 850000,
  gibsons: 900000, merritt: 500000, revelstoke: 800000, golden: 600000,
  osoyoos: 700000, summerland: 800000, peachland: 850000, rossland: 550000,
  whistler: 1800000, pemberton: 1100000, hope: 600000, 'pitt meadows': 1100000,
  'port moody': 1650000, 'powell river': 560000, oliver: 650000, 'grand forks': 400000,
  creston: 450000, kimberley: 560000, sparwood: 450000, ucluelet: 800000,
  tofino: 1200000, 'qualicum beach': 850000, 'north cowichan': 740000, sicamous: 600000,
  enderby: 600000, armstrong: 660000, princeton: 400000, smithers: 460000,
  'prince rupert': 360000, saanich: 1050000, 'central saanich': 1050000,
  'north saanich': 1250000, sidney: 900000, esquimalt: 860000, colwood: 920000,
  'view royal': 960000,

  // Saskatchewan
  weyburn: 280000, melfort: 260000, humboldt: 300000, melville: 220000,
  kindersley: 280000, 'meadow lake': 280000, nipawin: 240000, rosetown: 250000,
  unity: 250000, "fort qu'appelle": 300000, tisdale: 230000, canora: 200000,
  outlook: 300000, wadena: 190000, 'la ronge': 260000,

  // Manitoba
  selkirk: 360000, dauphin: 280000, 'flin flon': 200000, 'the pas': 200000,
  stonewall: 400000, neepawa: 250000, virden: 250000, 'swan river': 230000,
  altona: 350000, carman: 330000, beausejour: 340000, gimli: 380000, pinawa: 350000,

  // Ontario
  welland: 600000, 'fort erie': 650000, grimsby: 860000, lincoln: 860000,
  pelham: 900000, thorold: 700000, 'port colborne': 560000, ingersoll: 650000,
  simcoe: 600000, leamington: 660000, kingsville: 700000, tecumseh: 720000,
  lasalle: 760000, amherstburg: 660000, orangeville: 860000, midland: 660000,
  penetanguishene: 600000, bracebridge: 660000, gravenhurst: 650000, huntsville: 660000,
  'parry sound': 560000, cobourg: 700000, 'port hope': 710000, trenton: 560000,
  'quinte west': 560000, napanee: 560000, brockville: 500000, gananoque: 500000,
  'smiths falls': 500000, perth: 560000, renfrew: 460000, pembroke: 420000,
  arnprior: 610000, 'elliot lake': 250000, kapuskasing: 250000, kenora: 410000,
  dryden: 300000, 'fort frances': 320000, georgina: 920000, uxbridge: 1150000,
  'halton hills': 1150000, georgetown: 1150000, acton: 960000, clarington: 920000,
  bowmanville: 920000, fergus: 760000, elora: 860000, listowel: 610000,
  goderich: 510000, kincardine: 510000, 'saugeen shores': 560000, 'port elgin': 560000,
  hanover: 450000, meaford: 560000, paris: 760000, ancaster: 1150000,
  dundas: 1050000, 'stoney creek': 860000, bolton: 1250000, strathroy: 600000,
  'st. thomas': 560000, 'st thomas': 560000, aylmer: 500000, 'mount forest': 550000,
  walkerton: 430000, 'new hamburg': 760000, elmira: 760000, haliburton: 560000,
  bancroft: 410000, 'deep river': 350000, hawkesbury: 380000, rockland: 560000,
  casselman: 550000, essa: 800000, 'clarence-rockland': 560000,

  // Quebec
  repentigny: 480000, boucherville: 660000, 'saint-bruno': 710000,
  'saint-hyacinthe': 380000, granby: 410000, victoriaville: 320000, rimouski: 320000,
  'rouyn-noranda': 300000, "val-d'or": 280000, alma: 280000, 'sept-îles': 300000,
  'sept-iles': 300000, 'baie-comeau': 280000, shawinigan: 270000, joliette: 380000,
  'sorel-tracy': 360000, 'saint-georges': 310000, 'thetford mines': 230000, magog: 450000,
  'vaudreuil-dorion': 610000, 'sainte-julie': 560000, candiac: 660000, 'la prairie': 610000,
  beloeil: 520000, varennes: 560000, 'salaberry-de-valleyfield': 360000, 'gaspé': 280000,
  gaspe: 280000, 'rivière-du-loup': 300000, 'riviere-du-loup': 300000,
  'saint-jean-sur-richelieu': 460000, 'châteauguay': 480000, chateauguay: 480000,
  'pointe-claire': 710000, 'dollard-des-ormeaux': 720000, kirkland: 810000,
  'sainte-thérèse': 500000, 'sainte-therese': 500000, boisbriand: 560000,
  'saint-eustache': 510000, 'deux-montagnes': 510000, cowansville: 350000,

  // Atlantic
  'new glasgow': 300000, kentville: 400000, amherst: 280000, bridgewater: 380000,
  yarmouth: 300000, antigonish: 350000, 'glace bay': 220000, wolfville: 500000,
  bedford: 620000, 'lower sackville': 560000, edmundston: 250000, campbellton: 220000,
  oromocto: 320000, shediac: 380000, rothesay: 410000, hampton: 380000,
  'new maryland': 390000, 'grand falls': 250000, 'mount pearl': 390000, gander: 300000,
  'grand falls-windsor': 250000, 'labrador city': 320000, stephenville: 250000,
  clarenville: 300000, 'happy valley-goose bay': 330000,

  // Territories
  'hay river': 380000, inuvik: 400000, 'fort smith': 350000, 'dawson city': 450000,
  'watson lake': 350000, 'rankin inlet': 560000,
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
      return { name: titleCase(key), base: BUILT_IN[key], source: 'rough estimate' }
    }
  }
  return null
}

// Accent- and punctuation-insensitive key, used to dedupe spelling variants
// like "montreal"/"montréal" and "st albert"/"st. albert" in suggestions.
const dedupeKey = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')

/** Ranked location suggestions for the autocomplete: names that start with the
 *  query first, then names that merely contain it, de-duplicated. */
export function suggestLocations(q: string, limit = 6): ResolvedLocation[] {
  const norm = q.trim().toLowerCase()
  if (norm.length < 2) return []
  const starts: string[] = []
  const contains: string[] = []
  for (const key of Object.keys(BUILT_IN)) {
    if (key.startsWith(norm)) starts.push(key)
    else if (key.includes(norm)) contains.push(key)
  }
  const seen = new Set<string>()
  const out: ResolvedLocation[] = []
  for (const key of [...starts.sort(), ...contains.sort()]) {
    const d = dedupeKey(key)
    if (seen.has(d)) continue
    seen.add(d)
    out.push({ name: titleCase(key), base: BUILT_IN[key], source: 'rough estimate' })
    if (out.length >= limit) break
  }
  return out
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

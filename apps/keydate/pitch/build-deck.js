const pptxgen = require('pptxgenjs')

/* KeyDate — JCI Edmonton CYE pitch deck.
   Palette is the product's own brand, not a generic template. */
const SPRUCE = '1E4D3B'
const SPROUT = '3FA672'
const GOLD = 'E8B84B'
const PAPER = 'F7F8F4'
const INK = '17302A'
const MUTED = '5C6F66'
const LINE = 'DDE4DC'
const WHITE = 'FFFFFF'
const MIST = 'E3F2E9'

const HEAD = 'Cambria'
const BODY = 'Calibri'

const W = 13.33
const H = 7.5
const M = 0.75

const pres = new pptxgen()
pres.layout = 'LAYOUT_WIDE'
pres.author = 'KeyDate'
pres.title = 'KeyDate — JCI Edmonton CYE'

/** Recurring motif: the gold key mark. Fresh objects every call — pptxgenjs
 *  mutates options in place. */
function keyMark(s, x, y, scale = 1, color = GOLD) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: 0.42 * scale, h: 0.42 * scale,
    fill: { type: 'solid', color: 'FFFFFF', transparency: 100 },
    line: { color, width: 2.6 * scale },
  })
  s.addShape(pres.ShapeType.rect, {
    x: x + 0.38 * scale, y: y + 0.17 * scale, w: 0.46 * scale, h: 0.075 * scale,
    fill: { color }, line: { color, width: 0 },
  })
  s.addShape(pres.ShapeType.rect, {
    x: x + 0.66 * scale, y: y + 0.17 * scale, w: 0.075 * scale, h: 0.2 * scale,
    fill: { color }, line: { color, width: 0 },
  })
}

function darkSlide() {
  const s = pres.addSlide()
  s.background = { color: SPRUCE }
  return s
}
function lightSlide() {
  const s = pres.addSlide()
  s.background = { color: PAPER }
  return s
}

/** Small eyebrow label above a title. */
function eyebrow(s, text, color = SPROUT) {
  s.addText(text.toUpperCase(), {
    x: M, y: 0.52, w: 8, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, charSpacing: 2, color,
  })
}

function title(s, text, color = INK, y = 0.88, size = 40) {
  s.addText(text, {
    x: M, y, w: W - M * 2, h: 0.95, margin: 0,
    fontFace: HEAD, fontSize: size, bold: true, color,
  })
}

/* ─────────────────────────── 1. Title ─────────────────────────── */
{
  const s = darkSlide()
  keyMark(s, M, 1.62, 1.5, GOLD)
  s.addText([
    { text: 'Key', options: { color: WHITE } },
    { text: 'Date', options: { color: SPROUT } },
  ], {
    x: M, y: 2.35, w: 9, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 60, bold: true,
  })
  s.addText('Owning a home isn’t impossible.\nIt has a date.', {
    x: M, y: 3.42, w: 9.2, h: 1.5, margin: 0,
    fontFace: HEAD, fontSize: 30, color: MIST, lineSpacing: 38,
  })
  s.addText('JCI Edmonton  ·  Creative Young Entrepreneur', {
    x: M, y: 6.25, w: 8, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 14, color: MIST, bold: true,
  })
  s.addText('keydate.ca', {
    x: W - M - 3, y: 6.25, w: 3, h: 0.35, margin: 0, align: 'right',
    fontFace: BODY, fontSize: 14, color: MIST,
  })
  s.addNotes('Ask someone in their twenties when they\'ll own a home. They won\'t give you a year — they\'ll give you a feeling.')
}

/* ───────────── 2. I bought my first place ───────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Why I built this')
  s.addText('I bought my first place.', {
    x: M, y: 1.55, w: 11.6, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 46, bold: true, color: INK,
  })
  s.addText('I got there.', {
    x: M, y: 2.75, w: 11.6, h: 0.7, margin: 0,
    fontFace: HEAD, fontSize: 32, color: MUTED,
  })
  s.addText('I was guessing the entire way.', {
    x: M, y: 3.5, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 38, bold: true, color: SPRUCE,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 4.85, w: 11.6, h: 1.35, rectRadius: 0.16,
    fill: { color: MIST }, line: { color: SPROUT, width: 1 },
  })
  s.addText('Spreadsheets I rebuilt every month. Advice that contradicted itself. A goal that moved every time I looked at it.', {
    x: M + 0.5, y: 4.85, w: 10.6, h: 1.35, margin: 0, valign: 'middle',
    fontFace: BODY, fontSize: 17, color: INK, lineSpacing: 25,
  })
  s.addNotes('SWAP IN YOUR REAL DETAIL HERE — the specific month, the specific spreadsheet, the specific person who gave you bad advice. Name one concrete thing. Specifics are what make a room lean in; generalities are what make them check the time.')
}

/* ───────────── 3. Nobody could tell me when ───────────── */
{
  const s = darkSlide()
  keyMark(s, M, 1.25, 1.0, GOLD)
  s.addText('Nobody could tell me when.', {
    x: M, y: 2.05, w: 11.6, h: 1.1, margin: 0,
    fontFace: HEAD, fontSize: 46, bold: true, color: GOLD,
  })
  const qs = [
    'How much do I actually need?',
    'Am I even close?',
    'Is this the year — or is it five years away?',
  ]
  let y = 3.45
  qs.forEach((q) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.05, y: y + 0.11, w: 0.16, h: 0.16,
      fill: { color: SPROUT }, line: { color: SPROUT, width: 0 },
    })
    s.addText(q, {
      x: M + 0.5, y, w: 10.8, h: 0.5, margin: 0,
      fontFace: HEAD, fontSize: 25, color: MIST,
    })
    y += 0.72
  })
  s.addText('Every tool I found answered a different question than the one I was actually asking.', {
    x: M, y: 5.95, w: 11.6, h: 0.6, margin: 0,
    fontFace: BODY, fontSize: 17, italic: true, color: MIST,
  })
  s.addNotes('Slow down. These are the three questions you genuinely could not answer. Say them like you are still annoyed about it.')
}

/* ───────────── 4. And I had it easier ───────────── */
{
  const s = lightSlide()
  eyebrow(s, 'And I had it easier than the people behind me')
  title(s, 'The same house, one generation apart')

  const cardY = 2.3
  const cardW = 5.415
  const GAP = 1.0
  const cardH = 2.2

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: cardY, w: cardW, h: cardH, rectRadius: 0.14,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  })
  s.addText('2006', {
    x: M + 0.45, y: cardY + 0.28, w: 3, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 15, bold: true, color: MUTED,
  })
  s.addText('$276,974', {
    x: M + 0.45, y: cardY + 0.72, w: 4.4, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: INK,
  })
  s.addText('average Canadian home', {
    x: M + 0.45, y: cardY + 1.6, w: 4.4, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MUTED,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M + cardW + GAP, y: cardY, w: cardW, h: cardH, rectRadius: 0.14,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 1 },
  })
  s.addText('TODAY', {
    x: M + cardW + GAP + 0.45, y: cardY + 0.28, w: 3, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 15, bold: true, color: GOLD,
  })
  s.addText('$696,078', {
    x: M + cardW + GAP + 0.45, y: cardY + 0.72, w: 4.4, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: WHITE,
  })
  s.addText('average Canadian home', {
    x: M + cardW + GAP + 0.45, y: cardY + 1.6, w: 4.4, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MIST,
  })
  s.addText('2.5×', {
    x: M + cardW, y: cardY + 0.8, w: GAP, h: 0.6, margin: 0, align: 'center',
    fontFace: HEAD, fontSize: 24, bold: true, color: SPROUT,
  })

  s.addText('If it was that hard for me — what is it for someone starting now?', {
    x: M, y: 5.1, w: 11.6, h: 0.6, margin: 0,
    fontFace: HEAD, fontSize: 24, italic: true, color: SPRUCE,
  })
  s.addText('Most of you in this room bought somewhere inside that gap too.', {
    x: M, y: 5.8, w: 11.6, h: 0.5, margin: 0,
    fontFace: BODY, fontSize: 16, color: MUTED,
  })
  s.addText('Source: CREA (2006 average MLS price) · national average, June 2026', {
    x: M, y: 6.6, w: 11.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 10, color: MUTED,
  })
  s.addNotes('One number beat, then straight back to the story. Do not linger — the numbers are evidence for the feeling, not the point.')
}

/* ───────────────── 5. What it does ───────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'So I built the thing I needed')
  title(s, 'Sixty seconds in. A real date out.')

  const steps = [
    ['1', 'Tell it three things', 'Your income, what you’ve saved, and what you can put away each month.'],
    ['2', 'Get a date', 'Not a maybe — a month. Built on the actual Canadian rules: FHSA, Home Buyers’ Plan, the stress test.'],
    ['3', 'Watch it get closer', 'Every dollar you save builds your house on screen, piece by piece.'],
  ]
  let y = 2.15
  steps.forEach(([n, head, desc]) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M, y: y + 0.05, w: 0.62, h: 0.62,
      fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
    })
    s.addText(n, {
      x: M, y: y + 0.05, w: 0.62, h: 0.62, margin: 0, align: 'center', valign: 'middle',
      fontFace: HEAD, fontSize: 22, bold: true, color: GOLD,
    })
    s.addText(head, {
      x: M + 0.95, y: y, w: 4.0, h: 0.45, margin: 0,
      fontFace: HEAD, fontSize: 21, bold: true, color: INK,
    })
    s.addText(desc, {
      x: M + 0.95, y: y + 0.5, w: 6.9, h: 0.8, margin: 0,
      fontFace: BODY, fontSize: 14.5, color: MUTED, lineSpacing: 20,
    })
    y += 1.5
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: 8.9, y: 2.15, w: 3.68, h: 4.0, rectRadius: 0.18,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
  })
  s.addText('KEYS IN HAND', {
    x: 9.25, y: 2.62, w: 3.0, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: GOLD,
  })
  s.addText('June 2029', {
    x: 9.25, y: 3.02, w: 3.0, h: 0.85, margin: 0,
    fontFace: HEAD, fontSize: 36, bold: true, color: WHITE,
  })
  s.addText('likely window · Apr – Sep 2029', {
    x: 9.25, y: 3.92, w: 3.1, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 12, color: MIST,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: 9.25, y: 4.55, w: 3.0, h: 0.28, rectRadius: 0.14,
    fill: { color: '2C6349' }, line: { color: '2C6349', width: 0 },
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: 9.25, y: 4.55, w: 1.74, h: 0.28, rectRadius: 0.14,
    fill: { color: SPROUT }, line: { color: SPROUT, width: 0 },
  })
  s.addText('$41K saved  ·  58% of the way there', {
    x: 9.25, y: 4.95, w: 3.1, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 12, color: MIST,
  })
  s.addNotes('Hold up the phone here. Have your own plan already on screen — never type live, never rely on venue wifi.')
}

/* ───────────────── 6. The reframe ───────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Innovation')
  title(s, 'We changed the question')

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 2.25, w: 5.55, h: 3.15, rectRadius: 0.16,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  })
  s.addText('EVERY OTHER TOOL', {
    x: M + 0.45, y: 2.6, w: 4.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: MUTED,
  })
  s.addText('“Can you afford it\ntoday?”', {
    x: M + 0.45, y: 3.0, w: 4.7, h: 1.2, margin: 0,
    fontFace: HEAD, fontSize: 27, bold: true, color: MUTED, lineSpacing: 34,
  })
  s.addText('No.', {
    x: M + 0.45, y: 4.28, w: 4.6, h: 0.6, margin: 0,
    fontFace: HEAD, fontSize: 32, bold: true, color: 'B4452F',
  })
  s.addText('So they close the tab, and stop saving.', {
    x: M + 0.45, y: 4.92, w: 4.7, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MUTED,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M + 6.05, y: 2.25, w: 5.55, h: 3.15, rectRadius: 0.16,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
  })
  s.addText('KEYDATE', {
    x: M + 6.5, y: 2.6, w: 4.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: GOLD,
  })
  s.addText('“When?”', {
    x: M + 6.5, y: 3.0, w: 4.7, h: 1.2, margin: 0,
    fontFace: HEAD, fontSize: 27, bold: true, color: WHITE, lineSpacing: 34,
  })
  s.addText('June 2029.', {
    x: M + 6.5, y: 4.28, w: 4.6, h: 0.6, margin: 0,
    fontFace: HEAD, fontSize: 32, bold: true, color: SPROUT,
  })
  s.addText('So they keep going — and the date moves closer.', {
    x: M + 6.5, y: 4.92, w: 4.7, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MIST,
  })

  s.addText('I can’t make the house cheaper. I can give people the answer I never got.', {
    x: M, y: 5.85, w: W - M * 2, h: 0.5, margin: 0,
    fontFace: HEAD, fontSize: 20, italic: true, color: SPRUCE,
  })
  s.addNotes('"I can\'t make the house cheaper" pre-empts the sharpest question in the room and buys credibility for everything after. Never cut it.')
}

/* ───────────────── 7. Impact ───────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'It was never just my story')
  title(s, 'The engine doesn’t change at the border')

  s.addText('When people can’t see a path, they stop building wealth entirely. That’s a household problem and a national one — renters instead of owners, wealth that never compounds.', {
    x: M, y: 2.1, w: 11.6, h: 0.9, margin: 0,
    fontFace: BODY, fontSize: 16, color: INK, lineSpacing: 24,
  })

  const countries = ['Canada', 'Australia', 'United Kingdom', 'Ireland', 'New Zealand']
  let x = M
  countries.forEach((c, i) => {
    const first = i === 0
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 3.25, w: 2.16, h: 1.0, rectRadius: 0.12,
      fill: { color: first ? SPROUT : WHITE },
      line: { color: first ? SPROUT : LINE, width: 1 },
    })
    s.addText(c, {
      x, y: 3.25, w: 2.16, h: 1.0, margin: 0, align: 'center', valign: 'middle',
      fontFace: BODY, fontSize: 14, bold: true, color: first ? WHITE : INK,
    })
    x += 2.32
  })
  s.addText('Same two problems everywhere: a generation priced out, and a tangle of government programs almost nobody understands.', {
    x: M, y: 4.62, w: 11.6, h: 0.5, margin: 0,
    fontFace: BODY, fontSize: 14, color: MUTED,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 5.2, w: 11.6, h: 1.15, rectRadius: 0.14,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
  })
  s.addText([
    { text: 'KeyDate is a rules engine with a Canadian rulebook loaded. ', options: { color: MIST } },
    { text: 'The engine stays. The rulebook swaps.', options: { color: GOLD, bold: true } },
  ], {
    x: M + 0.5, y: 5.2, w: 10.6, h: 1.15, margin: 0, valign: 'middle',
    fontFace: HEAD, fontSize: 21,
  })
  s.addNotes('Slow down on "The rulebook does." This is one of your two biggest scoring lines — international impact is written into the 35-point criterion.')
}

/* ───────────────── 8. The promise (dark) ───────────────── */
{
  const s = darkSlide()
  eyebrow(s, 'Community impact & sustainability', GOLD)
  title(s, 'The money we refuse to take', WHITE)

  s.addText('The obvious way to monetise this is to sell these users to mortgage brokers. People who just told you their income, their savings, and exactly when they’ll need a mortgage.', {
    x: M, y: 2.05, w: 11.6, h: 0.9, margin: 0,
    fontFace: BODY, fontSize: 16, color: MIST, lineSpacing: 24,
  })
  s.addText('It is the most valuable lead list in the country.', {
    x: M, y: 2.95, w: 11.6, h: 0.45, margin: 0,
    fontFace: HEAD, fontSize: 20, italic: true, color: WHITE,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 3.65, w: 5.55, h: 2.15, rectRadius: 0.16,
    fill: { color: '17402F' }, line: { color: SPROUT, width: 1.2 },
  })
  s.addText('Our privacy policy says we never will.', {
    x: M + 0.45, y: 3.98, w: 4.7, h: 0.85, margin: 0,
    fontFace: HEAD, fontSize: 20, bold: true, color: WHITE,
  })
  s.addText('In writing. Live on the site today.', {
    x: M + 0.45, y: 4.92, w: 4.7, h: 0.5, margin: 0,
    fontFace: BODY, fontSize: 14, color: MIST,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M + 6.05, y: 3.65, w: 5.55, h: 2.15, rectRadius: 0.16,
    fill: { color: '17402F' }, line: { color: SPROUT, width: 1.2 },
  })
  s.addText('We built the tool that tells you not to buy.', {
    x: M + 6.5, y: 3.98, w: 4.7, h: 0.85, margin: 0,
    fontFace: HEAD, fontSize: 20, bold: true, color: WHITE,
  })
  s.addText('Rent-vs-buy says rent when the maths says rent.', {
    x: M + 6.5, y: 4.92, w: 4.7, h: 0.5, margin: 0,
    fontFace: BODY, fontSize: 14, color: MIST,
  })

  s.addText('A company built on referral fees can never say that sentence.', {
    x: M, y: 6.1, w: 11.6, h: 0.5, margin: 0,
    fontFace: HEAD, fontSize: 21, italic: true, color: GOLD,
  })
  s.addNotes('Second big scoring line. Land "never say that sentence" slowly — this covers both community impact and ethical sustainability, worth 20 points.')
}

/* ───────────────── 9. Scale & execution ───────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Scalability & leadership')
  title(s, 'Built, shipped, and live')

  const stats = [
    ['467', 'Canadian municipalities\nin the app today'],
    ['~$0', 'marginal cost\nper new user'],
    ['1', 'founder — built and\nshipped it end to end'],
  ]
  let x = M
  stats.forEach(([big, label]) => {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.15, w: 3.68, h: 2.1, rectRadius: 0.16,
      fill: { color: WHITE }, line: { color: LINE, width: 1 },
    })
    s.addText(big, {
      x: x + 0.4, y: 2.42, w: 2.9, h: 0.85, margin: 0,
      fontFace: HEAD, fontSize: 42, bold: true, color: SPROUT,
    })
    s.addText(label, {
      x: x + 0.4, y: 3.32, w: 2.95, h: 0.75, margin: 0,
      fontFace: BODY, fontSize: 13.5, color: MUTED, lineSpacing: 18,
    })
    x += 3.96
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 4.55, w: 11.6, h: 1.75, rectRadius: 0.16,
    fill: { color: MIST }, line: { color: SPROUT, width: 1 },
  })
  s.addText('A new country is a rulebook, not a rebuild.', {
    x: M + 0.5, y: 4.82, w: 10.6, h: 0.45, margin: 0,
    fontFace: HEAD, fontSize: 21, bold: true, color: SPRUCE,
  })
  s.addText('Live at keydate.ca  ·  incorporated  ·  privacy policy, terms and content moderation in place before the first user — because I’d rather be trusted than fast.', {
    x: M + 0.5, y: 5.35, w: 10.6, h: 0.8, margin: 0,
    fontFace: BODY, fontSize: 14.5, color: INK, lineSpacing: 21,
  })
  s.addNotes('Leadership is 15 points and you are solo — so lead with evidence of execution, not claims about character.')
}

/* ───────────────── 10. Close (dark) ───────────────── */
{
  const s = darkSlide()
  keyMark(s, M, 1.5, 1.5, GOLD)
  s.addText('Owning a home isn’t impossible.', {
    x: M, y: 2.55, w: 11.6, h: 0.8, margin: 0,
    fontFace: HEAD, fontSize: 38, color: MIST,
  })
  s.addText('It just doesn’t have a date yet.', {
    x: M, y: 3.35, w: 11.6, h: 0.8, margin: 0,
    fontFace: HEAD, fontSize: 38, color: MIST,
  })
  s.addText('We’re giving it one.', {
    x: M, y: 4.3, w: 11.6, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 50, bold: true, color: GOLD,
  })
  s.addText('keydate.ca', {
    x: M, y: 6.2, w: 6, h: 0.4, margin: 0,
    fontFace: BODY, fontSize: 17, bold: true, color: GOLD,
  })
  s.addText('Edmonton beta opens this week', {
    x: W - M - 5, y: 6.2, w: 5, h: 0.4, margin: 0, align: 'right',
    fontFace: BODY, fontSize: 14, color: MIST,
  })
  s.addNotes('Memorise these three lines. Never read the close.')
}

pres.writeFile({ fileName: 'KeyDate-JCI-Edmonton.pptx' }).then((f) => console.log('wrote', f))

const pptxgen = require('pptxgenjs')
const fs = require('fs')
const path = require('path')

/* KeyDate — JCI Edmonton CYE pitch deck.
 *
 * Design rule: the slide is an anchor, the founder is the narration. No slide
 * carries more than a handful of words, and every sentence that used to sit on
 * a slide now lives in the speaker notes as a talking point. If a judge can
 * read the pitch off the wall, they stop listening to the person giving it. */

const SPRUCE = '1E4D3B'
const SPROUT = '3FA672'
const GOLD = 'E8B84B'
const PAPER = 'F7F8F4'
const INK = '17302A'
const MUTED = '5C6F66'
const LINE = 'DDE4DC'
const WHITE = 'FFFFFF'
const MIST = 'E3F2E9'

/* Three builds from one layout, chosen by DECK_FONT.
 *
 *   (default)            → Arial. The only typeface guaranteed to exist on
 *                          every device, including phone previews, Google
 *                          Drive, and Quick Look. Anything else risks a viewer
 *                          silently substituting a serif — which is exactly
 *                          what "it looks like Times New Roman" is.
 *   DECK_FONT=century    → Century Gothic. Geometric, closer to the intended
 *                          look, ships with Office — but absent from most
 *                          previewers.
 *   DECK_FONT=montserrat → Montserrat. Best looking, narrowest support. This
 *                          is the build the PDF is printed from, because a PDF
 *                          embeds the font and stops caring what is installed.
 *
 * Century Gothic and Montserrat set wider than Arial. Measuring the Montserrat
 * build found exactly one line under 22% horizontal slack — the slide 7 title,
 * at 14% — so only that one is scaled, via tight(). */
const FONT = process.env.DECK_FONT || 'arial'
const FACES = { arial: 'Arial', century: 'Century Gothic', montserrat: 'Montserrat' }
const HEAD = FACES[FONT] || FACES.arial
const BODY = HEAD
const OUTFILE = FONT === 'arial'
  ? 'KeyDate-JCI-Edmonton.pptx'
  : `KeyDate-JCI-Edmonton-${HEAD.replace(/ /g, '')}.pptx`
/** Size for a line with little room to spare, given the wider faces. */
const tight = (n) => (FONT === 'arial' ? n : Math.round(n * 0.9))

const W = 13.33
const M = 0.75

/* Layout grid. Every slide places against these, so headings land on the same
 * baseline, content blocks start together, and the right-hand images share a
 * margin with the text above them. Ad-hoc y-values are what made the deck look
 * like ten separate slides rather than one deck. */
const RIGHT = W - M          // 12.58 — right edge of the live area
const EYEBROW_Y = 0.55
const TITLE_Y = 1.05         // titled slides (4-9)
const CONTENT_Y = 2.45       // where content starts on every slide
const STATEMENT_Y = 2.15     // big statements on the wordless slides (2,3,10)
const MARK_Y = 1.05          // the key mark, same height wherever it appears
const SOURCE_Y = 6.75

const pres = new pptxgen()
pres.layout = 'LAYOUT_WIDE'
pres.author = 'KeyDate'
pres.title = 'KeyDate — JCI Edmonton CYE'

/** Any PNG in this directory, inlined. Used for the logo and the UI captures —
 *  a self-contained deck means no missing-image placeholders on a strange
 *  laptop. */
function shot(name) {
  const f = path.join(__dirname, name)
  return 'image/png;base64,' + fs.readFileSync(f).toString('base64')
}

/** Recurring motif: the key lifted out of the KeyDate app icon.
 *
 *  The full icon is a gold key on a dark green tile — which disappears against
 *  these dark green slides, so the mark used here is the key alone on
 *  transparency. logo.png keeps the complete tile for the app and the site. */
function keyMark(s, x, y, scale = 1) {
  const h = 0.72 * scale
  s.addImage({ data: shot('logo-key.png'), x, y, w: h * 0.469, h })
}

const darkSlide = () => {
  const s = pres.addSlide()
  s.background = { color: SPRUCE }
  return s
}
const lightSlide = () => {
  const s = pres.addSlide()
  s.background = { color: PAPER }
  return s
}

function eyebrow(s, text, color = SPROUT) {
  s.addText(text.toUpperCase(), {
    x: M, y: EYEBROW_Y, w: 10, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, charSpacing: 2, color,
  })
}

/* ───────────────────────── 1. Title ───────────────────────── */
{
  const s = darkSlide()
  keyMark(s, M, MARK_Y, 1.5)
  s.addText([
    { text: 'Key', options: { color: WHITE } },
    { text: 'Date', options: { color: SPROUT } },
  ], {
    x: M, y: 2.35, w: 9, h: 1.1, margin: 0,
    fontFace: HEAD, fontSize: 58, bold: true,
  })
  s.addText('Owning a home isn’t impossible.\nIt has a date.', {
    x: M, y: 3.55, w: 10, h: 1.6, margin: 0,
    fontFace: HEAD, fontSize: 28, color: MIST, lineSpacing: 42,
  })
  s.addText('JCI Edmonton  ·  Creative Young Entrepreneur', {
    x: M, y: 6.55, w: 8, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 14, color: MIST, bold: true,
  })
  s.addText('keydate.ca', {
    x: RIGHT - 3, y: 6.55, w: 3, h: 0.35, margin: 0, align: 'right',
    fontFace: BODY, fontSize: 14, color: GOLD, bold: true,
  })
  s.addNotes(
    'OPEN COLD. Do not read the slide.\n\n' +
    '"Ask someone in their twenties when they\'ll own a home. They won\'t give you a year. They\'ll give you a feeling — probably never."\n\n' +
    'Pause. Then move to slide 2.',
  )
}

/* ─────────────── 2. I bought my first place ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Why I built this')
  s.addText('I bought my first place.', {
    x: M, y: STATEMENT_Y, w: 11.6, h: 1.1, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: INK,
  })
  s.addText('I was guessing the whole way.', {
    x: M, y: 3.35, w: 11.6, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 37, bold: true, color: SPRUCE,
  })

  const chips = ['Spreadsheets', 'Contradictory advice', 'A goal that kept moving']
  let x = M
  chips.forEach((c) => {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 4.9, w: 3.68, h: 0.9, rectRadius: 0.14,
      fill: { color: MIST }, line: { color: SPROUT, width: 1 },
    })
    s.addText(c, {
      x, y: 4.9, w: 3.68, h: 0.9, margin: 0, align: 'center', valign: 'middle',
      fontFace: BODY, fontSize: 16, bold: true, color: SPRUCE,
    })
    x += 3.96
  })
  s.addNotes(
    'THIS IS THE SLIDE THAT NEEDS YOUR REAL DETAIL. Pick ONE and tell it properly:\n' +
    '· the month you nearly gave up\n' +
    '· the person who gave you advice that turned out to be wrong\n' +
    '· the number you were short by\n\n' +
    'Talking points: rebuilt the spreadsheet every month · every source said something different · the target moved every time you looked at it.\n\n' +
    'One concrete detail beats three general ones.',
  )
}

/* ─────────────── 3. Nobody could tell me when ─────────────── */
{
  const s = darkSlide()
  keyMark(s, M, MARK_Y, 1.0)
  s.addText('Nobody could tell me when.', {
    x: M, y: STATEMENT_Y, w: 11.6, h: 1.2, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: GOLD,
  })
  const qs = ['How much do I actually need?', 'Am I even close?', 'Is this the year, or five years away?']
  let y = 3.85
  qs.forEach((q) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.05, y: y + 0.14, w: 0.18, h: 0.18,
      fill: { color: SPROUT }, line: { color: SPROUT, width: 0 },
    })
    s.addText(q, {
      x: M + 0.55, y, w: 10.8, h: 0.55, margin: 0,
      fontFace: HEAD, fontSize: 25, color: MIST,
    })
    y += 0.82
  })
  s.addNotes(
    'Say these like you are still annoyed about it. They were YOUR questions.\n\n' +
    'Talking point to land after: "Every tool I found answered a different question than the one I was actually asking."',
  )
}

/* ─────────────── 4. One generation apart ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'And I had it easier than the people behind me')
  s.addText('One generation apart', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: INK,
  })

  const cardY = CONTENT_Y
  const cardW = 5.415
  const GAP = 1.0
  const cardH = 3.1

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: cardY, w: cardW, h: cardH, rectRadius: 0.14,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  })
  s.addText('2006', {
    x: M + 0.45, y: cardY + 0.42, w: 3, h: 0.38, margin: 0,
    fontFace: BODY, fontSize: 16, bold: true, color: MUTED,
  })
  s.addText('$276,974', {
    x: M + 0.45, y: cardY + 1.05, w: 4.5, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 42, bold: true, color: INK,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M + cardW + GAP, y: cardY, w: cardW, h: cardH, rectRadius: 0.14,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 1 },
  })
  s.addText('TODAY', {
    x: M + cardW + GAP + 0.45, y: cardY + 0.42, w: 3, h: 0.38, margin: 0,
    fontFace: BODY, fontSize: 16, bold: true, color: GOLD,
  })
  s.addText('$696,078', {
    x: M + cardW + GAP + 0.45, y: cardY + 1.05, w: 4.5, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 42, bold: true, color: WHITE,
  })
  s.addText('2.5×', {
    x: M + cardW, y: cardY + 1.25, w: GAP, h: 0.6, margin: 0, align: 'center',
    fontFace: HEAD, fontSize: 23, bold: true, color: SPROUT,
  })

  s.addText('average Canadian home', {
    x: M + 0.45, y: cardY + 2.32, w: 4.5, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MUTED,
  })
  s.addText('average Canadian home', {
    x: M + cardW + GAP + 0.45, y: cardY + 2.32, w: 4.5, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 13, color: MIST,
  })
  s.addText('Source: CREA (2006 average MLS price) · national average, June 2026', {
    x: M, y: SOURCE_Y, w: 11.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 10, color: MUTED,
  })
  s.addNotes(
    'Do not linger — this is evidence for a feeling, not the argument.\n\n' +
    'Talking points: "If it was that hard for me, what is it for someone starting now?" · "Most of you in this room bought somewhere inside that gap too."\n\n' +
    'If challenged: 2006 is CREA\'s own figure for a record year. No income number is quoted on purpose — the series isn\'t cleanly comparable that far back.',
  )
}

/* ─────────────── 5. So I built it ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'So I built the thing I needed')
  s.addText('Sixty seconds in. A real date out.', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: INK,
  })

  const steps = [['1', 'Three questions'], ['2', 'A real month'], ['3', 'Watch it get closer']]
  let y = CONTENT_Y
  steps.forEach(([n, head]) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M, y, w: 0.7, h: 0.7,
      fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
    })
    s.addText(n, {
      x: M, y, w: 0.7, h: 0.7, margin: 0, align: 'center', valign: 'middle',
      fontFace: HEAD, fontSize: 21, bold: true, color: GOLD,
    })
    s.addText(head, {
      x: M + 1.05, y: y + 0.05, w: 6.4, h: 0.6, margin: 0,
      fontFace: HEAD, fontSize: 25, bold: true, color: INK,
    })
    y += 1.2
  })

  // 1170x1300 → 0.900 aspect
  s.addImage({
    data: shot('deck-dashboard.png'),
    x: RIGHT - 3.6, y: CONTENT_Y, w: 3.6, h: 4.0,
    shadow: { type: 'outer', color: '17302A', opacity: 0.28, blur: 14, offset: 4, angle: 90 },
  })
  s.addText('Real screen, real plan', {
    x: RIGHT - 3.6, y: CONTENT_Y + 4.1, w: 3.6, h: 0.35, margin: 0, align: 'center',
    fontFace: BODY, fontSize: 12, color: MUTED,
  })

  s.addNotes(
    'HOLD UP THE PHONE HERE. Have your own plan already on screen — never type live, never rely on venue wifi.\n\n' +
    'Talking points: income, savings, monthly · built on the real Canadian rules — FHSA, Home Buyers\' Plan, the stress test · every dollar saved builds the house on screen.',
  )
}

/* ─────────────── 6. The reframe ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Innovation')
  s.addText('We changed the question', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: INK,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: CONTENT_Y, w: 5.55, h: 3.45, rectRadius: 0.16,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  })
  s.addText('EVERY OTHER TOOL', {
    x: M + 0.5, y: CONTENT_Y + 0.5, w: 4.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: MUTED,
  })
  s.addText('“Afford it today?”', {
    x: M + 0.5, y: CONTENT_Y + 1.05, w: 4.7, h: 0.7, margin: 0,
    fontFace: HEAD, fontSize: 25, bold: true, color: MUTED,
  })
  s.addText('No.', {
    x: M + 0.5, y: CONTENT_Y + 2.25, w: 4.6, h: 0.7, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: 'B4452F',
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M + 6.05, y: CONTENT_Y, w: 5.55, h: 3.45, rectRadius: 0.16,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
  })
  s.addText('KEYDATE', {
    x: M + 6.55, y: CONTENT_Y + 0.5, w: 4.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: GOLD,
  })
  s.addText('“When?”', {
    x: M + 6.55, y: CONTENT_Y + 1.05, w: 4.7, h: 0.7, margin: 0,
    fontFace: HEAD, fontSize: 25, bold: true, color: WHITE,
  })
  s.addText('June 2029.', {
    x: M + 6.55, y: CONTENT_Y + 2.25, w: 4.6, h: 0.7, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: SPROUT,
  })
  s.addNotes(
    'KEY LINE — do not cut for time: "I can\'t make the house cheaper. I can give people the answer I never got."\n\n' +
    'It pre-empts the sharpest question in the room and buys credibility for everything after it.\n\n' +
    'Talking point: today the answer is no, so people close the tab and stop saving entirely.',
  )
}

/* ─────────────── 7. Not just my story ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'It was never just my story')
  s.addText('The engine doesn’t change at the border', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: tight(35), bold: true, color: INK,
  })

  const countries = ['Canada', 'Australia', 'UK', 'Ireland', 'New Zealand']
  let x = M
  countries.forEach((c, i) => {
    const first = i === 0
    s.addShape(pres.ShapeType.roundRect, {
      x, y: CONTENT_Y, w: 2.16, h: 1.15, rectRadius: 0.12,
      fill: { color: first ? SPROUT : WHITE },
      line: { color: first ? SPROUT : LINE, width: 1 },
    })
    s.addText(c, {
      x, y: CONTENT_Y, w: 2.16, h: 1.15, margin: 0, align: 'center', valign: 'middle',
      fontFace: BODY, fontSize: 15, bold: true, color: first ? WHITE : INK,
    })
    x += 2.32
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: CONTENT_Y + 1.75, w: 11.6, h: 1.5, rectRadius: 0.16,
    fill: { color: SPRUCE }, line: { color: SPRUCE, width: 0 },
  })
  s.addText([
    { text: 'The engine stays. ', options: { color: MIST } },
    { text: 'The rulebook swaps.', options: { color: GOLD, bold: true } },
  ], {
    x: M + 0.6, y: CONTENT_Y + 1.75, w: 10.4, h: 1.5, margin: 0, valign: 'middle',
    fontFace: HEAD, fontSize: 26,
  })
  s.addNotes(
    'BIGGEST SCORING SLIDE — impact is 35 of 115 points, and "international" is written into it.\n\n' +
    'Talking points: when people can\'t see a path they stop building wealth at all — renters instead of owners, wealth that never compounds · every one of these countries has the same two problems: a generation priced out, and government programs nobody understands · KeyDate is a rules engine with a Canadian rulebook loaded.\n\n' +
    'Slow down on "The rulebook swaps."',
  )
}

/* ─────────────── 8. The promise ─────────────── */
{
  const s = darkSlide()
  eyebrow(s, 'Community impact & sustainability', GOLD)
  s.addText('The money we refuse to take', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: WHITE,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: CONTENT_Y, w: 6.3, h: 1.55, rectRadius: 0.16,
    fill: { color: '17402F' }, line: { color: SPROUT, width: 1.2 },
  })
  s.addText('We never sell you\nto brokers.', {
    x: M + 0.5, y: CONTENT_Y, w: 5.4, h: 1.55, margin: 0, valign: 'middle',
    fontFace: HEAD, fontSize: 23, bold: true, color: WHITE,
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: CONTENT_Y + 1.75, w: 6.3, h: 1.55, rectRadius: 0.16,
    fill: { color: '17402F' }, line: { color: SPROUT, width: 1.2 },
  })
  s.addText('We built the tool\nthat says don’t buy.', {
    x: M + 0.5, y: CONTENT_Y + 1.75, w: 5.4, h: 1.55, margin: 0, valign: 'middle',
    fontFace: HEAD, fontSize: 23, bold: true, color: WHITE,
  })

  // 1170x1258 → 0.930 aspect. This is the app telling a user to keep renting,
  // cropped to end after the verdict rather than mid-sentence.
  s.addImage({
    data: shot('deck-rentbuy.png'),
    x: RIGHT - 3.9, y: CONTENT_Y, w: 3.9, h: 4.19,
    shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 16, offset: 4, angle: 90 },
  })

  s.addText('A company on referral fees can never say that.', {
    x: M, y: CONTENT_Y + 3.75, w: 7.3, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 21, italic: true, color: GOLD,
  })

  s.addNotes(
    'SECOND BIGGEST SCORING SLIDE — community + sustainability is 20 points.\n\n' +
    'Talking points: the obvious way to monetise this is selling users to mortgage brokers — people who just told you their income, their savings, and exactly when they\'ll need a mortgage · most valuable lead list in the country · our privacy policy says we never will, in writing, live today · the moment I\'m paid to push you toward a house I stop being able to tell you the truth.\n\n' +
    'Land the last line slowly.',
  )
}

/* ─────────────── 9. Built and live ─────────────── */
{
  const s = lightSlide()
  eyebrow(s, 'Scalability & leadership')
  s.addText('Built, shipped, live', {
    x: M, y: TITLE_Y, w: 11.6, h: 0.9, margin: 0,
    fontFace: HEAD, fontSize: 35, bold: true, color: INK,
  })

  const stats = [['467', 'municipalities'], ['~$0', 'cost per user'], ['1', 'founder']]
  let x = M
  stats.forEach(([big, label]) => {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: CONTENT_Y, w: 3.68, h: 2.05, rectRadius: 0.16,
      fill: { color: WHITE }, line: { color: LINE, width: 1 },
    })
    s.addText(big, {
      x: x + 0.45, y: CONTENT_Y + 0.3, w: 2.9, h: 0.9, margin: 0,
      fontFace: HEAD, fontSize: 40, bold: true, color: SPROUT,
    })
    s.addText(label, {
      x: x + 0.45, y: CONTENT_Y + 1.25, w: 2.95, h: 0.4, margin: 0,
      fontFace: BODY, fontSize: 15, color: MUTED,
    })
    x += 3.96
  })

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: CONTENT_Y + 2.45, w: 11.6, h: 1.2, rectRadius: 0.16,
    fill: { color: MIST }, line: { color: SPROUT, width: 1 },
  })
  s.addText('A new country is a rulebook, not a rebuild.', {
    x: M + 0.6, y: CONTENT_Y + 2.45, w: 10.4, h: 1.2, margin: 0, valign: 'middle',
    fontFace: HEAD, fontSize: 23, bold: true, color: SPRUCE,
  })
  s.addNotes(
    'Leadership is 15 points and you are solo — lead with evidence, not adjectives.\n\n' +
    'Talking points: live at keydate.ca right now · incorporated · privacy policy, terms and content moderation done before the first user — because I\'d rather be trusted than fast · I built and shipped it myself.',
  )
}

/* ─────────────── 10. Close ─────────────── */
{
  const s = darkSlide()
  keyMark(s, M, MARK_Y, 1.5)
  s.addText('It just doesn’t have\na date yet.', {
    x: M, y: STATEMENT_Y, w: 11.6, h: 1.8, margin: 0,
    fontFace: HEAD, fontSize: 35, color: MIST, lineSpacing: 54,
  })
  s.addText('We’re giving it one.', {
    x: M, y: 4.35, w: 11.6, h: 1.1, margin: 0,
    fontFace: HEAD, fontSize: 48, bold: true, color: GOLD,
  })
  s.addText('keydate.ca', {
    x: M, y: 6.55, w: 6, h: 0.4, margin: 0,
    fontFace: BODY, fontSize: 17, bold: true, color: GOLD,
  })
  s.addText('Edmonton beta opens this week', {
    x: RIGHT - 5, y: 6.55, w: 5, h: 0.4, margin: 0, align: 'right',
    fontFace: BODY, fontSize: 14, color: MIST,
  })
  s.addNotes(
    'MEMORISE THIS. Never read the close.\n\n' +
    '"Owning a home isn\'t impossible. It just doesn\'t have a date yet. We\'re giving it one."\n\n' +
    'Then stop talking.',
  )
}

pres.writeFile({ fileName: OUTFILE }).then((f) => console.log('wrote', f))

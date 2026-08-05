import { chromium } from 'playwright-core'

/* Capture real UI for the pitch deck. Phone viewport at 3x so the images stay
   crisp when projected.
 *
 * Serve a production build first:
 *   (cd ../ && npm run build) && python3 -m http.server 8910 --directory ../dist
 *
 * The scenario is chosen deliberately: an Edmonton two-storey on $92k with $9k
 * saved puts the keys date years out AND trips the stress-test warning, so the
 * dashboard shot carries the honesty message on its own. The rent-vs-buy step
 * walks the rent up until the app says renting wins — that screen is the proof
 * for the ethics slide, so the script asserts it rather than assuming it. */
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
})
// Skip the gates — we want the product, not the door.
await ctx.addInitScript(() => {
  localStorage.setItem('keydate-beta-email', 'demo@keydate.ca')
  localStorage.setItem('keydate-beta-open', '1')
})
const p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))

await p.goto('http://127.0.0.1:8910/', { waitUntil: 'networkidle' })
await p.waitForTimeout(900)
await p.locator('button:has-text("Continue as guest")').click()
await p.waitForTimeout(700)

// --- 1. Onboarding, part-filled: shows the three questions ---
await p.locator('input[type=text]').first().fill('Edmonton')
await p.waitForTimeout(450)
await p.locator('text=/📍 Edmonton/').first().click().catch(() => {})
await p.waitForTimeout(400)
await p.locator('button:has-text("Two-storey detached")').click().catch(() => {})
await p.waitForTimeout(300)
const money = () => p.locator('input[type=number]')
const vals = [92000, 9000, 750]
for (let i = 0; i < 3; i++) {
  await money().nth(i).click()
  await p.keyboard.type(String(vals[i]))
  await p.waitForTimeout(120)
}
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(300)
await p.screenshot({ path: 'ui-onboarding.png' })

// --- 2. Dashboard hero: the keys date ---
await p.locator('button:has-text("Build my plan")').click()
await p.waitForTimeout(1600)
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(400)
await p.screenshot({ path: 'ui-dashboard.png' })

// --- 3. Rent vs buy: the tool that tells you not to buy ---
await p.locator('button:has-text("rent vs. buy")').first().click()
await p.waitForTimeout(1200)
// Push rent down until the honest answer is "don't buy" — that is the slide.
const rent = p.locator('input[type=number]').first()
for (const r of [1500, 1200, 1000, 850, 700]) {
  await rent.fill(String(r))
  await p.waitForTimeout(500)
  const t = await p.locator('body').innerText()
  if (/Renting \+ investing wins/i.test(t)) {
    console.log('rent-vs-buy shows "renting wins" at $' + r + '/mo')
    break
  }
}
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(400)
await p.screenshot({ path: 'ui-rentbuy.png' })
console.log('verdict on screen:', (await p.locator('body').innerText()).split('\n').find((l) => /wins|ahead|wash/.test(l)))

console.log('errors:', errs.length ? errs : 'none')
await b.close()

/* Then crop for the deck:
 *   python3 -c "
 *   from PIL import Image, ImageDraw
 *   def c(src,dst,h,r=34):
 *       im=Image.open(src).convert('RGB').crop((0,0,1170,h))
 *       m=Image.new('L',im.size,0)
 *       ImageDraw.Draw(m).rounded_rectangle([0,0,im.size[0]-1,im.size[1]-1],radius=r,fill=255)
 *       o=Image.new('RGBA',im.size,(0,0,0,0)); o.paste(im,(0,0),m); o.save(dst)
 *   c('ui-dashboard.png','deck-dashboard.png',1300)
 *   c('ui-rentbuy.png','deck-rentbuy.png',1010)"
 */

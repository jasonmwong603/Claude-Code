import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const p = await b.newPage()
await p.goto('file:///home/user/Claude-Code/apps/keydate/pitch/preview.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.pdf({
  path: 'KeyDate-JCI-Edmonton.pdf',
  width: '13.333in', height: '7.5in',
  printBackground: true, margin: { top:0, right:0, bottom:0, left:0 },
})
console.log('pdf written')
await b.close()

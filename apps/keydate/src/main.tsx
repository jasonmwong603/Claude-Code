import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KeyDateApp from './App'
import { PasscodeGate } from './components/PasscodeGate'
import { BetaEmailGate } from './components/BetaEmailGate'

/* Two entrances to the same build:
 *   /prelaunchdemo/ → private investor demo, passcode only (no email ask)
 *   /app/ (public)  → beta, email joins the launch list and opens the app
 * PasscodeGate no-ops off the demo path, so only one gate ever shows. */
const isPrivateDemo = location.pathname.includes('prelaunchdemo')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PasscodeGate>
      {isPrivateDemo ? (
        <KeyDateApp />
      ) : (
        <BetaEmailGate>
          <KeyDateApp />
        </BetaEmailGate>
      )}
    </PasscodeGate>
  </StrictMode>,
)

// Register the service worker so the app is installable + works offline.
// Relative URL keeps the scope under the deploy path (e.g. /prelaunchdemo/).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // updateViaCache:'none' keeps the browser's HTTP cache from handing back a
    // stale sw.js, which would leave an old caching strategy in charge.
    navigator.serviceWorker
      .register('./sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        // A new worker that activates while a tab is open means the assets in
        // memory are now the old build; reload once so the user lands on the
        // deploy rather than a half-stale mix.
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (sw.state === 'activated' && navigator.serviceWorker.controller) location.reload()
          })
        })
      })
      .catch(() => {
        /* SW is a progressive enhancement — ignore failures */
      })
  })
}

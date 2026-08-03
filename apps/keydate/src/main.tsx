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
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* SW is a progressive enhancement — ignore failures */
    })
  })
}

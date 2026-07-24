import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KeyDateApp from './App'
import { PasscodeGate } from './components/PasscodeGate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PasscodeGate>
      <KeyDateApp />
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

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

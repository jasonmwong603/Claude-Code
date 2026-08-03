import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { C, DISPLAY_FONT } from '../theme'

/* Client-side passcode gate for the private pre-launch demo build.
 *
 * This is obfuscation, not real security: a static site can't enforce auth
 * without a backend, and a determined person can bypass any client gate. We
 * store only the SHA-256 hash of the passcode (never the plaintext) so it
 * isn't a readable string in the bundle, and remember a successful unlock in
 * localStorage so the code is entered once per browser. Good enough to keep
 * the demo out of casual/accidental hands during investor walkthroughs. */

// SHA-256 of the demo passcode. To change it, run:
//   printf '%s' 'NEWCODE' | sha256sum
const PASSCODE_HASH = '8bc008922a0fdd30340f562e1c3cffcced2051a4f655e74bd040eded3ded4347'
const UNLOCK_KEY = 'keydate-demo-unlocked'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function PasscodeGate({ children }: { children: ReactNode }) {
  // The same build is served at two paths: the public beta at /app/ (open to
  // testers) and the private investor demo at /prelaunchdemo/ (gated). Only the
  // latter asks for a passcode.
  const gatedPath = typeof location !== 'undefined' && location.pathname.includes('prelaunchdemo')

  const [unlocked, setUnlocked] = useState(() => {
    if (!gatedPath) return true
    try {
      return localStorage.getItem(UNLOCK_KEY) === PASSCODE_HASH
    } catch {
      return false
    }
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  // crypto.subtle needs a secure context (https or localhost). If it's missing
  // for some reason, fail open so the app is never permanently locked out.
  useEffect(() => {
    if (!crypto?.subtle) setUnlocked(true)
  }, [])

  if (unlocked) return <>{children}</>

  async function submit(e: FormEvent) {
    e.preventDefault()
    setChecking(true)
    setError(false)
    const hash = await sha256Hex(code.trim())
    if (hash === PASSCODE_HASH) {
      try {
        localStorage.setItem(UNLOCK_KEY, PASSCODE_HASH)
      } catch {
        /* private mode — unlock for this session anyway */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setCode('')
      setChecking(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(120% 90% at 50% 0%, ${C.sproutSoft}, ${C.paper} 60%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 22px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 20px',
            borderRadius: 18,
            background: C.spruce,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 24px rgba(30,77,59,0.28)',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="8" cy="9" r="4.4" stroke={C.gold} strokeWidth="2.2" />
            <path d="M11 11.5 20 20M17 17l2.5-2.5M15 15l2 2" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>
          Key<span style={{ color: C.sprout }}>Date</span>
        </div>
        <h1 style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 19, margin: '14px 0 6px' }}>
          Pre-launch demo
        </h1>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, margin: '0 auto 22px', maxWidth: 300 }}>
          This build is private. Enter the demo passcode to continue.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setError(false)
            }}
            placeholder="Demo passcode"
            aria-label="Demo passcode"
            autoFocus
            autoComplete="off"
            style={{
              font: 'inherit',
              fontSize: 15,
              textAlign: 'center',
              padding: '14px 16px',
              borderRadius: 14,
              border: `1.5px solid ${error ? C.err : C.line}`,
              background: '#fff',
              color: C.ink,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={checking || !code.trim()}
            style={{
              font: 'inherit',
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 16px',
              borderRadius: 14,
              border: 'none',
              color: '#fff',
              background: C.spruce,
              cursor: checking || !code.trim() ? 'default' : 'pointer',
              opacity: checking || !code.trim() ? 0.6 : 1,
            }}
          >
            {checking ? 'Checking…' : 'Unlock demo'}
          </button>
        </form>

        {error && (
          <p style={{ fontSize: 13, color: C.err, marginTop: 12, fontWeight: 600 }}>
            Incorrect passcode. Try again.
          </p>
        )}

        <p style={{ fontSize: 11.5, color: C.sub, marginTop: 24, lineHeight: 1.5 }}>
          Invite-only preview · not for public distribution.
        </p>
      </div>
    </div>
  )
}

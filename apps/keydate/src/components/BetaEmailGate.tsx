import { useState, type FormEvent, type ReactNode } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { supabase } from '../lib/auth'

/* Beta entry gate: joining the launch list is how you get into the beta.
 *
 * The normal path is the landing page, which captures the email and forwards
 * here with the flag already set. This component is the backstop for anyone who
 * lands on /app/ directly (shared link, bookmark), so the email is captured
 * either way. Stored per-device, so it's asked once. */

const EMAIL_KEY = 'keydate-beta-email'

export function hasJoined(): boolean {
  try {
    return !!localStorage.getItem(EMAIL_KEY)
  } catch {
    return false
  }
}

export function BetaEmailGate({ children }: { children: ReactNode }) {
  const [joined, setJoined] = useState(hasJoined)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [honey, setHoney] = useState('')

  if (joined) return <>{children}</>

  async function submit(e: FormEvent) {
    e.preventDefault()
    const value = email.trim()
    // Honeypot filled → bot. Accept silently without storing anything.
    if (honey) {
      setJoined(true)
      return
    }
    if (!value || value.indexOf('@') < 1) {
      setError('Please enter a valid email address.')
      return
    }
    setBusy(true)
    try {
      localStorage.setItem(EMAIL_KEY, value)
    } catch {
      /* private mode — continue for this session */
    }
    // Fire-and-forget: never make the user wait on the network to get in.
    if (supabase) {
      void supabase.from('waitlist').insert({ email: value, source: 'app' }).then(
        () => {},
        () => {},
      )
    }
    setJoined(true)
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
        fontFamily: BODY_FONT,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
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
        <h1 style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 20, margin: '16px 0 8px', textWrap: 'balance' }}>
          Join the beta
        </h1>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, margin: '0 auto 22px', maxWidth: 320 }}>
          Pop in your email and you’re straight into your plan. You’ll also be on the launch list —
          we’ll let you know when KeyDate goes live. No spam.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="you@email.com"
            aria-label="Email address"
            autoFocus
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
          {/* Honeypot — hidden from people, catches bots. */}
          <input
            type="text"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
          />
          <button
            type="submit"
            disabled={busy}
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
              cursor: busy ? 'default' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Opening…' : 'Join & start my plan →'}
          </button>
        </form>

        {error && <p style={{ fontSize: 13, color: C.err, marginTop: 12, fontWeight: 600 }}>{error}</p>}

        <p style={{ fontSize: 11.5, color: C.sub, marginTop: 22, lineHeight: 1.5 }}>
          Free beta · no credit card. Educational only — not financial, legal, or tax advice.
          <br />
          <a href="/privacy/" style={{ color: C.sub }}>Privacy</a> ·{' '}
          <a href="/terms/" style={{ color: C.sub }}>Terms</a>
        </p>
      </div>
    </div>
  )
}

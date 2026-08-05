import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { supabase } from '../lib/auth'
import { betaOpenCached, fetchBetaOpen } from '../lib/flags'

/* Beta entry gate.
 *
 * Signing up joins the launch list — it does NOT grant access. Everyone waits
 * until the admin flips `beta_open`, so the whole cohort starts together rather
 * than the earliest signups getting a head start. Once the flag is on, joining
 * (or having already joined) opens the app immediately.
 *
 * /prelaunchdemo/ never reaches this component, so demos still work while the
 * public door is shut. */

const EMAIL_KEY = 'keydate-beta-email'

export function hasJoined(): boolean {
  try {
    return !!localStorage.getItem(EMAIL_KEY)
  } catch {
    return false
  }
}

type Phase = 'checking' | 'form' | 'waiting' | 'in'

export function BetaEmailGate({ children }: { children: ReactNode }) {
  // Cached-open + already-joined is the steady state after launch: no flash, no
  // network wait, straight into the app.
  const [phase, setPhase] = useState<Phase>(() =>
    betaOpenCached() && hasJoined() ? 'in' : 'checking',
  )
  const open = useRef(betaOpenCached())
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [honey, setHoney] = useState('')

  useEffect(() => {
    if (phase !== 'checking') return
    let alive = true
    void fetchBetaOpen().then((isOpen) => {
      if (!alive) return
      open.current = isOpen
      setPhase(isOpen ? (hasJoined() ? 'in' : 'form') : hasJoined() ? 'waiting' : 'form')
    })
    return () => {
      alive = false
    }
  }, [phase])

  if (phase === 'in') return <>{children}</>

  async function submit(e: FormEvent) {
    e.preventDefault()
    const value = email.trim()
    // Honeypot filled → bot. Show the same confirmation, store nothing.
    if (honey) {
      setPhase('waiting')
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
    // Fire-and-forget: never make the user wait on the network to be counted.
    if (supabase) {
      void supabase.from('waitlist').insert({ email: value, source: 'app' }).then(
        () => {},
        () => {},
      )
    }
    setBusy(false)
    setPhase(open.current ? 'in' : 'waiting')
  }

  return (
    <Shell>
      {phase === 'checking' ? (
        <p style={{ fontSize: 14, color: C.sub, marginTop: 18 }}>Loading…</p>
      ) : phase === 'waiting' ? (
        <>
          <h1 style={h1Style}>You’re on the list 🎉</h1>
          <p style={pStyle}>
            KeyDate opens to everyone at once, so nobody starts ahead of anyone else. We’ll email
            you the moment it’s live — keep an eye on your inbox.
          </p>
          <div
            style={{
              background: C.sproutSoft,
              border: `1.5px solid ${C.sprout}`,
              borderRadius: 14,
              padding: '14px 16px',
              fontSize: 13.5,
              color: C.spruce,
              lineHeight: 1.55,
            }}
          >
            🔑 Want in sooner? Send this to a friend who’s trying to buy their first place — we’re
            opening the Edmonton beta first.
          </div>
        </>
      ) : (
        <>
          <h1 style={h1Style}>Join the beta launch list</h1>
          <p style={pStyle}>
            Drop your email and you’re in line for the beta. We’re opening it to everyone at the
            same time — we’ll email you the moment it’s live. No spam.
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
              {busy ? 'Saving…' : 'Save my spot →'}
            </button>
          </form>

          {error && <p style={{ fontSize: 13, color: C.err, marginTop: 12, fontWeight: 600 }}>{error}</p>}
        </>
      )}
    </Shell>
  )
}

const h1Style = {
  fontFamily: DISPLAY_FONT,
  fontWeight: 800,
  fontSize: 20,
  margin: '16px 0 8px',
  textWrap: 'balance',
} as const

const pStyle = {
  fontSize: 14,
  color: C.sub,
  lineHeight: 1.55,
  margin: '0 auto 22px',
  maxWidth: 320,
} as const

/** The branded card every gate state sits inside. */
function Shell({ children }: { children: ReactNode }) {
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

        {children}

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

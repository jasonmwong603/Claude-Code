import { C, DISPLAY_FONT } from '../theme'
import { BrandMark } from '../components/atoms'
import type { OAuthProvider } from '../lib/auth'

/* First-run front door. New users choose how to start — Google, Facebook, or as
 * a guest — before building their plan. Social buttons appear regardless; if
 * auth isn't configured yet, the handler explains and guest is always available. */
export function Welcome({
  onSignIn,
  onGuest,
  onDemo,
}: {
  authConfigured: boolean
  onSignIn: (provider: OAuthProvider) => void
  onGuest: () => void
  onDemo?: () => void
}) {
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
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <BrandMark size={68} radius={20} />

        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em' }}>
          Key<span style={{ color: C.sprout }}>Date</span>
        </div>
        <h1
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 800,
            fontSize: 22,
            lineHeight: 1.25,
            margin: '16px 0 8px',
            textWrap: 'balance',
          }}
        >
          Owning a home isn’t impossible. It has a date.
        </h1>
        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.55, margin: '0 auto 28px', maxWidth: 320 }}>
          Turn your income and savings into a real “keys date,” then watch your home build itself as you save.
        </p>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button type="button" onClick={() => onSignIn('google')} style={btnWhite}>
            <GoogleMark /> Continue with Google
          </button>
          <button type="button" onClick={() => onSignIn('facebook')} style={btnFacebook}>
            <FacebookMark /> Continue with Facebook
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 2px' }}>
            <span style={{ flex: 1, height: 1, background: C.line }} />
            <span style={{ fontSize: 11.5, color: C.sub, fontWeight: 600 }}>or</span>
            <span style={{ flex: 1, height: 1, background: C.line }} />
          </div>

          <button type="button" onClick={onGuest} style={btnGuest}>
            Continue as guest
          </button>
        </div>

        {onDemo && (
          <button type="button" onClick={onDemo} style={btnDemo}>
            👀 Preview a sample journey
          </button>
        )}

        <p style={{ fontSize: 11.5, color: C.sub, marginTop: 22, lineHeight: 1.5 }}>
          Educational only — not financial, legal, or tax advice.
        </p>
      </div>
    </div>
  )
}

const btnBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: '14px 16px',
  fontSize: 15,
  fontWeight: 600,
  borderRadius: 14,
  cursor: 'pointer',
} as const

const btnWhite = { ...btnBase, color: C.ink, background: '#fff', border: `1.5px solid ${C.line}` } as const
const btnFacebook = { ...btnBase, color: '#fff', background: '#1877F2', border: '1.5px solid #1877F2' } as const
const btnGuest = {
  ...btnBase,
  fontFamily: DISPLAY_FONT,
  fontWeight: 700,
  color: '#fff',
  background: C.spruce,
  border: 'none',
} as const
const btnDemo = {
  ...btnBase,
  marginTop: 12,
  fontSize: 13.5,
  fontWeight: 600,
  color: C.sub,
  background: 'transparent',
  border: `1px dashed ${C.line}`,
} as const

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}

function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#fff">
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z" />
    </svg>
  )
}

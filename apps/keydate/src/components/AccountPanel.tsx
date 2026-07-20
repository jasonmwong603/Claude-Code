import { C, DISPLAY_FONT } from '../theme'
import type { AuthUser, OAuthProvider } from '../lib/auth'

/* Account card for the profile screen. Sign-in is optional — guests keep using
 * the app on-device; signing in with Google/Facebook saves progress to the
 * cloud. Renders nothing until auth is configured, so guest mode stays clean. */
export function AccountPanel({
  configured,
  user,
  onSignIn,
  onSignOut,
}: {
  configured: boolean
  user: AuthUser | null
  onSignIn: (provider: OAuthProvider) => void
  onSignOut: () => void
}) {
  if (!configured) return null

  if (user) {
    const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase()
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" width={40} height={40} style={{ borderRadius: '50%', display: 'block' }} />
          ) : (
            <span style={avatarFallback}>{initial}</span>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || 'Signed in'}
            </div>
            <div style={{ fontSize: 12.5, color: C.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email || ''}{user.provider ? ` · ${user.provider}` : ''}
            </div>
          </div>
          <button type="button" onClick={onSignOut} style={signOutBtn}>Sign out</button>
        </div>
        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 10 }}>☁️ Progress saved to your account.</div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Save your progress</div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 12, lineHeight: 1.5 }}>
        Sign in to keep your plan, savings, and character across devices. You can keep going as a guest too.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" onClick={() => onSignIn('google')} style={providerBtn}>
          <GoogleMark /> Continue with Google
        </button>
        <button type="button" onClick={() => onSignIn('facebook')} style={{ ...providerBtn, background: '#1877F2', color: '#fff', borderColor: '#1877F2' }}>
          <FacebookMark /> Continue with Facebook
        </button>
      </div>
    </div>
  )
}

const cardStyle = {
  background: '#fff',
  border: `1.5px solid ${C.line}`,
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
} as const

const avatarFallback = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: C.sproutSoft,
  color: C.spruce,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 18,
  flexShrink: 0,
} as const

const providerBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: '12px 14px',
  fontSize: 14.5,
  fontWeight: 600,
  color: C.ink,
  background: '#fff',
  border: `1.5px solid ${C.line}`,
  borderRadius: 12,
  cursor: 'pointer',
} as const

const signOutBtn = {
  fontSize: 12.5,
  fontWeight: 600,
  color: C.sub,
  background: 'none',
  border: `1.5px solid ${C.line}`,
  borderRadius: 10,
  padding: '7px 11px',
  cursor: 'pointer',
  flexShrink: 0,
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

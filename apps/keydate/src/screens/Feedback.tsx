import { useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { track } from '../lib/analytics'
import { inputStyle, bigBtn, card } from '../components/atoms'
import { supabase } from '../lib/auth'
import type { AuthUser } from '../lib/auth'

/* Feedback / "tell us what's wrong".
 *
 * Beta testers need a way to report a wrong number or a confusing screen at the
 * moment they hit it. Submissions are stored in Supabase (so nothing is lost and
 * it's all in one place) AND can be sent straight to the inbox via a prefilled
 * email — the mailto is the guaranteed-delivery path while there's no backend
 * mailer. */

const FEEDBACK_EMAIL = 'keydateadmin@gmail.com'

type Kind = 'wrong' | 'confusing' | 'idea' | 'praise' | 'other'

const KINDS: { key: Kind; label: string }[] = [
  { key: 'wrong', label: '🔢 A number looks wrong' },
  { key: 'confusing', label: '😕 Something’s confusing' },
  { key: 'idea', label: '💡 I have an idea' },
  { key: 'praise', label: '💚 Something I like' },
  { key: 'other', label: '💬 Something else' },
]

export function Feedback({ user, onBack }: { user: AuthUser | null; onBack: () => void }) {
  const [kind, setKind] = useState<Kind>('wrong')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(user?.email ?? '')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const mailtoHref = () => {
    const subject = `KeyDate feedback — ${KINDS.find((k) => k.key === kind)?.label ?? kind}`
    const body = `${message}\n\n---\nFrom: ${email || 'not provided'}\nScreen size: ${window.innerWidth}×${window.innerHeight}\nApp: ${location.pathname}`
    return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const submit = async () => {
    if (!message.trim() || busy) return
    setBusy(true)
    track('feedback_sent', kind)
    // Store it (best-effort) so nothing is lost even if the mail client never opens.
    if (supabase) {
      try {
        await supabase.from('feedback').insert({
          kind,
          message: message.trim(),
          email: email.trim() || null,
          user_id: user?.id ?? null,
          path: location.pathname,
        })
      } catch {
        /* fall through to the mailto, which is the guaranteed path */
      }
    }
    setSent(true)
    setBusy(false)
  }

  if (sent) {
    return (
      <>
        <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '16px 0 8px' }}>
          Thank you — genuinely 💚
        </h2>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: '0 0 18px' }}>
          Your feedback is in. In a beta this small, one message really does change what gets built
          next.
        </p>
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>
            Want a reply, or want to add a screenshot? Send it as an email too — it goes straight to
            the person building this.
          </div>
          <a href={mailtoHref()} style={{ ...bigBtn(true, C.spruce), display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            ✉️ Also email it
          </a>
        </div>
        <button type="button" onClick={onBack} style={{ ...bigBtn(true, C.sprout) }}>
          Back to my plan
        </button>
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: BODY_FONT, color: C.spruce, padding: '4px 0 8px' }}
      >
        ← Back
      </button>
      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '4px 0 6px' }}>
        Tell us what you think
      </h2>
      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, margin: '0 0 18px' }}>
        KeyDate is in beta and built by a very small team. If a number looks wrong, something’s
        confusing, or you wish it did something else — say so. We read every message.
      </p>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sub, marginBottom: 8 }}>
        What’s this about?
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {KINDS.map((k) => {
          const active = kind === k.key
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              style={{
                padding: '8px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: BODY_FONT,
                borderRadius: 999,
                cursor: 'pointer',
                border: `1.5px solid ${active ? C.sprout : C.line}`,
                background: active ? C.sproutSoft : '#fff',
                color: active ? C.spruce : C.ink,
              }}
            >
              {k.label}
            </button>
          )
        })}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        placeholder="What happened, or what would you change? The more specific the better — e.g. “the average price for Sherwood Park looks way too high.”"
        style={{ ...inputStyle, resize: 'vertical', marginBottom: 12 }}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email (optional — only if you'd like a reply)"
        style={{ ...inputStyle, marginBottom: 16 }}
      />

      <button
        type="button"
        onClick={submit}
        disabled={!message.trim() || busy}
        style={{ ...bigBtn(!!message.trim() && !busy, C.sprout) }}
      >
        {busy ? 'Sending…' : 'Send feedback'}
      </button>

      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.55, marginTop: 14, textAlign: 'center' }}>
        Prefer email? Write to{' '}
        <a href={`mailto:${FEEDBACK_EMAIL}?subject=KeyDate%20feedback`} style={{ color: C.spruce, fontWeight: 600 }}>
          {FEEDBACK_EMAIL}
        </a>
      </p>
    </>
  )
}

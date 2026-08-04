import type { CSSProperties, ReactNode } from 'react'
import { C, BODY_FONT, DISPLAY_FONT } from '../theme'

/* Shared inline-style primitives and tiny components, matching the prototype's
   look. Kept as inline styles deliberately (single file → single visual system,
   easy for a solo founder to tweak). */

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 14px',
  fontSize: 16,
  fontFamily: BODY_FONT,
  border: `1.5px solid ${C.line}`,
  borderRadius: 12,
  background: '#fff',
  color: C.ink,
  outline: 'none',
}

export const card: CSSProperties = {
  background: '#fff',
  border: `1.5px solid ${C.line}`,
  borderRadius: 18,
  padding: 18,
  marginBottom: 14,
}

export function bigBtn(enabled = true, bg: string = C.spruce): CSSProperties {
  return {
    width: '100%',
    padding: '16px',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: DISPLAY_FONT,
    color: '#fff',
    background: enabled ? bg : '#A9B8B0',
    border: 'none',
    borderRadius: 14,
    cursor: enabled ? 'pointer' : 'not-allowed',
  }
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <label style={{ display: 'block', marginBottom: 22 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{label}</div>
      {children}
      {hint && (
        <div style={{ fontSize: 12, color: C.sub, marginTop: 6, lineHeight: 1.45 }}>{hint}</div>
      )}
    </label>
  )
}

export function MoneyInput({
  value,
  onChange,
  step = 1000,
  placeholder,
}: {
  value: number
  onChange: (n: number) => void
  step?: number
  placeholder?: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: C.sub,
          fontSize: 15,
        }}
      >
        $
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={step}
        // Show an empty field rather than a stray "0" before anything is typed
        // (and when the user clears it) — 0 means "not entered yet" here.
        value={value === 0 ? '' : value}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        style={{ ...inputStyle, paddingLeft: 28 }}
      />
    </div>
  )
}

export function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = o.key === value
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            style={{
              padding: '9px 14px',
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: BODY_FONT,
              cursor: 'pointer',
              border: `1.5px solid ${active ? C.spruce : C.line}`,
              background: active ? C.spruce : '#fff',
              color: active ? '#fff' : C.ink,
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** The future home, built piece-by-piece as the user levels up. */
export function HouseSvg({ level }: { level: number }) {
  const on = (n: number) => (level >= n ? 1 : 0.12)
  return (
    <svg viewBox="0 0 200 130" style={{ width: '100%', maxWidth: 210 }}>
      <circle cx="170" cy="24" r="12" fill={C.gold} opacity={on(1)} />
      <rect x="10" y="112" width="180" height="6" rx="3" fill={C.spruce} opacity={on(1)} />
      <rect x="55" y="100" width="90" height="12" fill="#B8AF9E" opacity={on(2)} />
      <rect x="60" y="58" width="80" height="44" fill="#F1E8D2" stroke={C.ink} strokeWidth="1.5" opacity={on(3)} />
      <rect x="88" y="72" width="24" height="30" fill={C.spruce} opacity={on(4)} />
      <rect x="66" y="66" width="16" height="14" fill="#BFDFF0" stroke={C.ink} strokeWidth="1" opacity={on(4)} />
      <rect x="118" y="66" width="16" height="14" fill="#BFDFF0" stroke={C.ink} strokeWidth="1" opacity={on(4)} />
      <polygon points="52,60 100,28 148,60" fill={C.sprout} opacity={on(5)} />
      <rect x="124" y="34" width="10" height="18" fill="#8A6A4F" opacity={on(6)} />
      <circle cx="30" cy="96" r="12" fill={C.sprout} opacity={on(6)} />
      <rect x="27" y="102" width="6" height="12" fill="#8A6A4F" opacity={on(6)} />
      <text x="100" y="22" textAnchor="middle" fontSize="14" opacity={on(7)}>
        🔑
      </text>
    </svg>
  )
}

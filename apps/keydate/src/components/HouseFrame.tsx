import type { ReactNode } from 'react'
import { C, DISPLAY_FONT } from '../theme'

/* Renders content as a house cross-section: a roofline, an attic band (the
   hero), stacked "floor" rooms divided by joist lines, and a foundation. Purely
   presentational — the dashboard supplies what goes in each part. */

export interface FloorSpec {
  /** Small room label shown on the joist (e.g. "Main floor · this month"). */
  label: string
  node: ReactNode
  key: string
}


function Roof() {
  // Proportional triangle so it scales with the column; chimney on the right.
  return (
    <svg
      viewBox="0 0 240 44"
      width="100%"
      role="presentation"
      style={{ display: 'block', marginBottom: -1 }}
    >
      {/* chimney (drawn first so the roof overlaps its base) */}
      <rect x="176" y="12" width="16" height="24" fill="#6B4A3A" />
      <rect x="173" y="10" width="22" height="6" rx="2" fill="#7C5946" />
      {/* roof body with a slight eave overhang */}
      <polygon points="0,44 120,4 240,44" fill={C.spruce} />
      <polygon points="0,44 120,4 120,10 8,44" fill="#173D2F" opacity="0.6" />
    </svg>
  )
}

function Joist({ label }: { label: string }) {
  return (
    <div style={{ position: 'relative', height: 0 }}>
      <div
        style={{
          borderTop: `2px dashed ${C.line}`,
          margin: '0 2px',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: -10,
          left: 12,
          background: C.sproutSoft,
          color: C.spruce,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: 999,
        }}
      >
        {label}
      </span>
    </div>
  )
}

export function HouseFrame({
  attic,
  floors,
  foundation,
}: {
  attic: ReactNode
  floors: FloorSpec[]
  foundation: ReactNode
}) {
  return (
    <div style={{ margin: '10px 0 16px' }}>
      <Roof />

      {/* Attic — the hero (keys date) sits under the roof. */}
      <div style={{ background: C.spruce, color: '#fff', padding: '18px 20px 22px' }}>
        {attic}
      </div>

      {/* Walls + floors */}
      <div
        style={{
          borderLeft: `3px solid ${C.spruce}`,
          borderRight: `3px solid ${C.spruce}`,
          background: '#fff',
        }}
      >
        {floors.map((f, i) => (
          <div key={f.key}>
            {i > 0 && <Joist label={f.label} />}
            {i === 0 && (
              <div style={{ position: 'relative', height: 0 }}>
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 12,
                    background: C.sproutSoft,
                    color: C.spruce,
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '3px 9px',
                    borderRadius: 999,
                  }}
                >
                  {f.label}
                </span>
              </div>
            )}
            <div style={{ padding: i === 0 ? '30px 16px 16px' : '22px 16px 16px' }}>{f.node}</div>
          </div>
        ))}
      </div>

      {/* Foundation — brickwork base holding the keyring. */}
      <div
        style={{
          background: 'linear-gradient(180deg, #48392F, #33291F)',
          color: '#fff',
          padding: '20px 16px 22px',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.85,
            marginBottom: 12,
          }}
        >
          🧱 Foundation · your keyring
        </div>
        {foundation}
      </div>
    </div>
  )
}

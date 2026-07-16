import { accessoryOf, avatarOf, frameOf } from '../data/cosmetics'

/** Renders a profile avatar: the character emoji on a framed disc, with an
 *  optional accessory (hat / glasses / sparkle) sitting on top. */
export function Avatar({
  avatar,
  accessory,
  frame,
  size = 64,
}: {
  avatar: string
  accessory: string
  frame: string
  size?: number
}) {
  const a = avatarOf(avatar)
  const acc = accessoryOf(accessory)
  const f = frameOf(frame)
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        border: f.border,
        boxShadow: f.boxShadow,
        background: f.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size * 0.56, lineHeight: 1 }}>{a.emoji}</span>
      {acc.emoji && (
        <span
          style={{
            position: 'absolute',
            top: -size * 0.14,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: size * 0.44,
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))',
            pointerEvents: 'none',
          }}
        >
          {acc.emoji}
        </span>
      )}
    </div>
  )
}

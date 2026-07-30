import { useCallback, useEffect, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { loadNotifications, markNotificationsRead, subscribeNotifications, timeAgo } from '../lib/forum'
import type { AuthUser } from '../lib/auth'
import type { ForumNotification } from '../types'

const META: Record<ForumNotification['type'], { icon: string; verb: string }> = {
  reply: { icon: '💬', verb: 'replied to your post' },
  like: { icon: '❤️', verb: 'liked your post' },
  follow: { icon: '👤', verb: 'followed you' },
}

/* Activity feed: replies, likes, and follows on the signed-in user's content.
 * Opening it marks everything read (clearing the header bell). */
export function Activity({ user, onBack }: { user: AuthUser | null; onBack: () => void }) {
  const [items, setItems] = useState<ForumNotification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setItems(await loadNotifications(user?.id ?? null))
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    void load()
    // Mark read shortly after opening so the badge clears once they've seen it.
    const t = setTimeout(() => void markNotificationsRead(user?.id ?? null), 800)
    return () => clearTimeout(t)
  }, [load, user?.id])

  useEffect(() => subscribeNotifications(user?.id ?? null, () => void load()), [load, user?.id])

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: BODY_FONT, color: C.spruce, padding: '4px 0 8px' }}
      >
        ← Back
      </button>
      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '4px 0 4px' }}>Activity</h2>
      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5, margin: '0 0 16px' }}>
        Replies, likes, and follows on your posts.
      </p>

      {loading ? (
        <p style={{ fontSize: 13, color: C.sub, textAlign: 'center', padding: '24px 0' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 12px', color: C.sub }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🔔</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            No activity yet. Post a milestone or reply to someone — when people react, you’ll see it here.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((n) => {
            const m = META[n.type]
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  background: n.read ? '#fff' : C.sproutSoft,
                  border: `1px solid ${n.read ? C.line : 'rgba(63,166,114,0.3)'}`,
                  borderRadius: 14,
                  padding: '12px 14px',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ fontWeight: 700 }}>{n.actorName || 'Someone'}</span> {m.verb}
                    {n.postTitle && (
                      <span style={{ color: C.sub }}> · “{n.postTitle}”</span>
                    )}
                  </div>
                  {n.excerpt && (
                    <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.45, marginTop: 3, whiteSpace: 'pre-wrap' }}>
                      {n.excerpt}
                    </div>
                  )}
                  <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

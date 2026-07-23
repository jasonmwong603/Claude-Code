import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { Pills, bigBtn, card, inputStyle } from '../components/atoms'
import { CATEGORY_META } from '../data/forumSeed'
import {
  AVATARS,
  addPost,
  addReply,
  deletePost,
  deleteReply,
  getIdentity,
  isRemoteForum,
  loadFeed,
  loadReplies,
  loadSavedPosts,
  loadSocial,
  saveIdentity,
  subscribeFeed,
  subscribeReplies,
  timeAgo,
  toggleFollow,
  toggleLike,
  toggleSave,
  uploadForumMedia,
  type Identity,
} from '../lib/forum'
import { MAX_MEDIA_BYTES, getMedia, putMedia } from '../lib/media'
import type { AuthUser, OAuthProvider } from '../lib/auth'
import type { AppState, ForumCategory, ForumPost, ForumReply, PostMediaRef } from '../types'

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_META) as ForumCategory[]).map((k) => ({
  key: k,
  label: `${CATEGORY_META[k].emoji} ${CATEGORY_META[k].label}`,
}))

/** Suggestions to share, derived from what the user has already earned. */
function achievementPrompts(state: AppState): { category: ForumCategory; title: string }[] {
  const b = state.earnedBadges
  const out: { category: ForumCategory; title: string }[] = []
  if (b.includes('done')) out.push({ category: 'firsthome', title: "I'm fully funded — ready to buy! 🔑" })
  if (b.includes('p75')) out.push({ category: 'milestone', title: 'Hit 75% of my down payment goal!' })
  else if (b.includes('p50')) out.push({ category: 'milestone', title: 'Halfway to my down payment! 🎯' })
  else if (b.includes('p25')) out.push({ category: 'milestone', title: 'Passed 25% of my goal.' })
  else if (b.includes('p10')) out.push({ category: 'milestone', title: 'First 10% saved!' })
  if (b.includes('streak6')) out.push({ category: 'milestone', title: '6-month saving streak 🔥' })
  else if (b.includes('streak3')) out.push({ category: 'milestone', title: '3-month saving streak 🔥' })
  if (b.includes('learnAll')) out.push({ category: 'advice', title: 'Finished the whole curriculum — happy to answer questions' })
  return out.slice(0, 3)
}

function CategoryTag({ category }: { category: ForumCategory }) {
  const m = CATEGORY_META[category]
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#fff',
        background: m.color,
        borderRadius: 999,
        padding: '3px 9px',
        whiteSpace: 'nowrap',
      }}
    >
      {m.emoji} {m.label}
    </span>
  )
}

/** Resolves a media ref to a displayable source (direct url, or a blob object
 *  URL loaded from IndexedDB) and renders it. */
function PostMedia({ media }: { media: PostMediaRef }) {
  const [src, setSrc] = useState<string | null>(media.url ?? null)

  useEffect(() => {
    if (media.url || !media.id) return
    let objUrl: string | null = null
    let alive = true
    getMedia(media.id).then((blob) => {
      if (blob && alive) {
        objUrl = URL.createObjectURL(blob)
        setSrc(objUrl)
      }
    })
    return () => {
      alive = false
      if (objUrl) URL.revokeObjectURL(objUrl)
    }
  }, [media.id, media.url])

  if (!src) return null
  const style = {
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    maxHeight: 340,
    objectFit: 'cover' as const,
    background: '#000',
  }
  return media.kind === 'video' ? (
    <video src={src} controls playsInline style={style} />
  ) : (
    <img src={src} alt="" style={style} />
  )
}

export function Forum({
  state,
  onEarnXp,
  user,
  onSignIn,
}: {
  state: AppState
  onEarnXp: (n: number) => void
  user: AuthUser | null
  onSignIn: (provider: OAuthProvider) => void
}) {
  const remote = isRemoteForum()
  const canPost = !remote || !!user // preview mode posts locally; shared mode needs sign-in

  const canFollow = remote && !!user
  const canSave = !remote || !!user

  const [feed, setFeed] = useState<{ posts: ForumPost[]; liked: Set<string> }>({ posts: [], liked: new Set() })
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<ForumPost[]>([])
  const [scope, setScope] = useState<'all' | 'following' | 'saved'>('all')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ForumCategory | 'all'>('all')
  const [open, setOpen] = useState(false)

  const [identity, setIdentity] = useState<Identity>(() => {
    const saved = getIdentity()
    return { author: saved.author || state.profile?.displayName || user?.name || '', avatar: saved.avatar || AVATARS[0] }
  })
  const [category, setCategory] = useState<ForumCategory>('milestone')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaError, setMediaError] = useState('')
  const [posting, setPosting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const prompts = useMemo(() => achievementPrompts(state), [state])

  const refresh = useCallback(async () => {
    const [f, soc] = await Promise.all([loadFeed(user?.id ?? null), loadSocial(user?.id ?? null)])
    setFeed(f)
    setLiked(f.liked)
    setFollowing(soc.following)
    setSaved(soc.saved)
    setLoading(false)
  }, [user?.id])

  // Initial load + reload when the signed-in user changes.
  useEffect(() => {
    setLoading(true)
    void refresh()
  }, [refresh])

  // Shared mode: new posts / like changes from anyone push in live.
  useEffect(() => subscribeFeed(() => void refresh()), [refresh])

  // Saved posts can be older than the loaded feed, so fetch them in full.
  useEffect(() => {
    if (scope !== 'saved') return
    void loadSavedPosts(user?.id ?? null, [...saved]).then(setSavedPosts)
  }, [scope, saved, user?.id])

  const clearMedia = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setMediaError('')
    if (fileInput.current) fileInput.current.value = ''
  }

  const pickFile = (f: File | undefined) => {
    if (!f) return
    if (!/^(image|video)\//.test(f.type)) {
      setMediaError('Please choose a photo or video.')
      return
    }
    if (f.size > MAX_MEDIA_BYTES) {
      setMediaError(`That file is too big (max ${Math.round(MAX_MEDIA_BYTES / 1024 / 1024)} MB).`)
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setMediaError('')
  }

  const submit = async () => {
    if (!title.trim() || !body.trim() || posting) return
    setPosting(true)
    try {
      let media: PostMediaRef | undefined
      let mediaUrl: string | undefined
      let mediaKind: 'image' | 'video' | undefined
      if (file) {
        if (remote && user) {
          const up = await uploadForumMedia(file, user.id)
          mediaUrl = up.url
          mediaKind = up.kind
        } else {
          const id = await putMedia(file)
          media = { kind: file.type.startsWith('video') ? 'video' : 'image', id }
        }
      }
      saveIdentity(identity)
      await addPost({
        identity,
        userId: user?.id ?? null,
        location: state.plan.location,
        category,
        title,
        body,
        media,
        mediaUrl,
        mediaKind,
      })
      onEarnXp(15)
      setTitle('')
      setBody('')
      clearMedia()
      setOpen(false)
      await refresh()
    } catch (e) {
      alert(`Couldn't post: ${(e as Error)?.message ?? e}`)
    } finally {
      setPosting(false)
    }
  }

  // Optimistic like toggle (works in both modes); reverts by reloading on error.
  const like = (id: string) => {
    const wasLiked = liked.has(id)
    setLiked((prev) => {
      const n = new Set(prev)
      if (wasLiked) n.delete(id)
      else n.add(id)
      return n
    })
    setFeed((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === id ? { ...p, likes: Math.max(0, p.likes + (wasLiked ? -1 : 1)) } : p,
      ),
    }))
    void toggleLike(id, wasLiked, user?.id ?? null).catch(() => void refresh())
  }

  const remove = async (id: string) => {
    await deletePost(id)
    await refresh()
  }

  const follow = (authorId: string) => {
    const was = following.has(authorId)
    setFollowing((prev) => {
      const n = new Set(prev)
      if (was) n.delete(authorId)
      else n.add(authorId)
      return n
    })
    void toggleFollow(authorId, was, user?.id ?? null).catch(() => void refresh())
  }

  const save = (postId: string) => {
    const was = saved.has(postId)
    setSaved((prev) => {
      const n = new Set(prev)
      if (was) n.delete(postId)
      else n.add(postId)
      return n
    })
    void toggleSave(postId, was, user?.id ?? null).catch(() => void refresh())
  }

  const base = scope === 'saved' ? savedPosts : feed.posts
  const posts = base.filter(
    (p) =>
      (scope !== 'following' || (!!p.authorId && following.has(p.authorId))) &&
      (filter === 'all' || p.category === filter),
  )

  return (
    <>
      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '16px 0 4px' }}>
        Community
      </h2>
      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5, margin: '0 0 14px' }}>
        {remote
          ? 'Share your wins, first-home stories, and advice with first-time buyers across Canada.'
          : 'Share your wins, first-home stories, and advice — with photos or video if you like.'}
      </p>

      {!remote && (
        <div
          style={{
            fontSize: 12,
            color: C.sub,
            background: C.goldSoft,
            border: `1px solid ${C.gold}`,
            borderRadius: 12,
            padding: '10px 12px',
            lineHeight: 1.5,
            marginBottom: 14,
          }}
        >
          👋 <strong>Preview.</strong> The posts below are example stories. Anything you post — text,
          photos, or video — is saved on <em>this device</em> for now. Shared posting across everyone
          turns on when the community server is connected.
        </div>
      )}

      {/* Shared mode, not signed in: reading is open, posting needs an account. */}
      {remote && !user && (
        <div style={{ ...card, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            Join the conversation
          </div>
          <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5, margin: '0 0 12px' }}>
            Sign in to post your own milestones and reply to others. You can read everything without an account.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => onSignIn('google')} style={{ ...bigBtn(true, C.spruce), width: 'auto', padding: '12px 18px' }}>
              Continue with Google
            </button>
            <button type="button" onClick={() => onSignIn('facebook')} style={{ ...bigBtn(true, '#1877F2'), width: 'auto', padding: '12px 18px' }}>
              Continue with Facebook
            </button>
          </div>
        </div>
      )}

      {prompts.length > 0 && !open && canPost && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 8 }}>
            🎉 Share one of your wins:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {prompts.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => {
                  setCategory(p.category)
                  setTitle(p.title)
                  setOpen(true)
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontFamily: BODY_FONT,
                  color: C.spruce,
                  background: C.sproutSoft,
                  border: 'none',
                  borderRadius: 999,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {CATEGORY_META[p.category].emoji} {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {canPost && (!open ? (
        <button type="button" onClick={() => setOpen(true)} style={{ ...bigBtn(true, C.sprout), marginBottom: 16 }}>
          ✍️ Write a post
        </button>
      ) : (
        <div style={{ ...card, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Your name or handle"
            value={identity.author}
            onChange={(e) => setIdentity({ ...identity, author: e.target.value })}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setIdentity({ ...identity, avatar: a })}
                style={{
                  fontSize: 20,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: identity.avatar === a ? C.sproutSoft : '#fff',
                  border: `1.5px solid ${identity.avatar === a ? C.sprout : C.line}`,
                }}
              >
                {a}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <Pills options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
          </div>

          <input
            type="text"
            placeholder="Title — e.g. Hit 50% of my goal!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ ...inputStyle, marginBottom: 10 }}
          />
          <textarea
            placeholder="Share the details, what worked, or ask the community…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', marginBottom: 12 }}
          />

          {/* Photo / video attachment. Shared mode uploads to Supabase Storage
              (visible on every device); preview mode keeps it on-device. */}
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => pickFile(e.target.files?.[0] ?? undefined)}
            style={{ display: 'none' }}
          />
          {!preview ? (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                fontWeight: 600,
                color: C.spruce,
                background: '#fff',
                border: `1.5px dashed ${C.sprout}`,
                borderRadius: 12,
                cursor: 'pointer',
                marginBottom: 12,
                fontFamily: BODY_FONT,
              }}
            >
              📷 Add a photo or video
            </button>
          ) : (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              {file && file.type.startsWith('video') ? (
                <video src={preview} controls playsInline style={{ width: '100%', borderRadius: 12, maxHeight: 260, background: '#000' }} />
              ) : (
                <img src={preview} alt="" style={{ width: '100%', borderRadius: 12, maxHeight: 260, objectFit: 'cover' }} />
              )}
              <button
                type="button"
                onClick={clearMedia}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 15,
                  cursor: 'pointer',
                }}
                aria-label="Remove attachment"
              >
                ✕
              </button>
            </div>
          )}
          {mediaError && (
            <div style={{ fontSize: 12.5, color: C.err, marginBottom: 12 }}>{mediaError}</div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => {
                clearMedia()
                setOpen(false)
              }}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: 15,
                fontWeight: 600,
                color: C.sub,
                background: '#fff',
                border: `1.5px solid ${C.line}`,
                borderRadius: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!title.trim() || !body.trim() || posting}
              style={{ ...bigBtn(!!title.trim() && !!body.trim() && !posting, C.sprout), flex: 2 }}
            >
              {posting ? 'Posting…' : 'Post (+15 XP)'}
            </button>
          </div>
        </div>
      ))}

      {/* Feed scope: All / Following / Saved */}
      {(canFollow || canSave) && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {([
            ['all', '🌐 All'],
            ...(canFollow ? [['following', '👤 Following'] as const] : []),
            ...(canSave ? [['saved', '🔖 Saved'] as const] : []),
          ] as [typeof scope, string][]).map(([k, label]) => {
            const active = scope === k
            return (
              <button
                key={k}
                type="button"
                onClick={() => setScope(k)}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: BODY_FONT,
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: `1.5px solid ${active ? C.sprout : C.line}`,
                  background: active ? C.sproutSoft : '#fff',
                  color: active ? C.spruce : C.sub,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {(['all', ...(Object.keys(CATEGORY_META) as ForumCategory[])] as const).map((k) => {
          const active = filter === k
          const label = k === 'all' ? '🏘️ All' : `${CATEGORY_META[k].emoji} ${CATEGORY_META[k].label}`
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              style={{
                padding: '7px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: BODY_FONT,
                borderRadius: 999,
                cursor: 'pointer',
                border: `1.5px solid ${active ? C.spruce : C.line}`,
                background: active ? C.spruce : '#fff',
                color: active ? '#fff' : C.ink,
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: C.sub, textAlign: 'center', padding: '20px 0' }}>Loading the feed…</p>
      ) : posts.length === 0 ? (
        <p style={{ fontSize: 13, color: C.sub, textAlign: 'center', padding: '20px 0' }}>
          {scope === 'following'
            ? 'Follow people to see their posts here.'
            : scope === 'saved'
              ? 'No saved posts yet — tap 🔖 Save on any post to keep it here.'
              : 'No posts here yet — be the first to share.'}
        </p>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            liked={liked.has(p.id)}
            onLike={() => like(p.id)}
            onDelete={() => remove(p.id)}
            isFollowing={!!p.authorId && following.has(p.authorId)}
            onFollow={canFollow && p.authorId && !p.mine ? () => follow(p.authorId as string) : undefined}
            isSaved={saved.has(p.id)}
            onSave={canSave ? () => save(p.id) : undefined}
            userId={user?.id ?? null}
            canReply={canPost}
            replyIdentity={identity}
          />
        ))
      )}

      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.55, marginTop: 6 }}>
        Be kind and keep it real. Posts are personal stories, not financial advice.
      </p>
    </>
  )
}

function PostCard({
  post,
  liked,
  onLike,
  onDelete,
  isFollowing,
  onFollow,
  isSaved,
  onSave,
  userId,
  canReply,
  replyIdentity,
}: {
  post: ForumPost
  liked: boolean
  onLike: () => void
  onDelete: () => void
  isFollowing: boolean
  onFollow?: () => void
  isSaved: boolean
  onSave?: () => void
  userId: string | null
  canReply: boolean
  replyIdentity: Identity
}) {
  const [showReplies, setShowReplies] = useState(false)
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div
          style={{
            fontSize: 20,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: C.sproutSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {post.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {post.author}
            {post.mine && <span style={{ color: C.sub, fontWeight: 500 }}> · you</span>}
          </div>
          <div style={{ fontSize: 11.5, color: C.sub }}>
            {post.location ? `${post.location} · ` : ''}
            {timeAgo(post.createdAt)}
          </div>
        </div>
        <CategoryTag category={post.category} />
      </div>

      <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 16.5, lineHeight: 1.25, marginBottom: 5 }}>
        {post.title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: C.ink, whiteSpace: 'pre-wrap' }}>{post.body}</div>

      {post.media && <PostMedia media={post.media} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <button
          type="button"
          onClick={onLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: BODY_FONT,
            color: liked ? C.err : C.sub,
            padding: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>{liked ? '❤️' : '🤍'}</span> {post.likes}
        </button>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: BODY_FONT,
              color: isSaved ? C.spruce : C.sub,
              padding: 0,
            }}
            aria-label={isSaved ? 'Unsave post' : 'Save post'}
          >
            <span style={{ fontSize: 15 }}>{isSaved ? '🔖' : '📑'}</span> {isSaved ? 'Saved' : 'Save'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowReplies((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: BODY_FONT,
            color: showReplies ? C.spruce : C.sub,
            padding: 0,
          }}
        >
          <span style={{ fontSize: 15 }}>💬</span> {post.replyCount ? post.replyCount : 'Reply'}
        </button>

        <span style={{ flex: 1 }} />

        {onFollow && (
          <button
            type="button"
            onClick={onFollow}
            style={{
              background: isFollowing ? '#fff' : C.sproutSoft,
              border: `1.5px solid ${isFollowing ? C.line : C.sprout}`,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              color: isFollowing ? C.sub : C.spruce,
              fontFamily: BODY_FONT,
              borderRadius: 999,
              padding: '5px 11px',
            }}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        )}
        {post.mine && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 600,
              color: C.sub,
              fontFamily: BODY_FONT,
              padding: 0,
            }}
          >
            Delete
          </button>
        )}
      </div>

      {showReplies && (
        <PostThread postId={post.id} userId={userId} canReply={canReply} identity={replyIdentity} />
      )}
    </div>
  )
}

function PostThread({
  postId,
  userId,
  canReply,
  identity,
}: {
  postId: string
  userId: string | null
  canReply: boolean
  identity: Identity
}) {
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    setReplies(await loadReplies(postId, userId))
    setLoading(false)
  }, [postId, userId])

  useEffect(() => {
    void load()
  }, [load])
  // Live: new replies from anyone appear in the open thread.
  useEffect(() => subscribeReplies(postId, () => void load()), [postId, load])

  const send = async () => {
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    try {
      await addReply({ postId, userId, identity, body })
      setText('')
      await load()
    } catch (e) {
      alert(`Couldn't reply: ${(e as Error)?.message ?? e}`)
    } finally {
      setSending(false)
    }
  }

  const del = async (r: ForumReply) => {
    await deleteReply(r)
    await load()
  }

  return (
    <div style={{ marginTop: 12, borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
      {loading ? (
        <div style={{ fontSize: 12.5, color: C.sub }}>Loading replies…</div>
      ) : replies.length === 0 ? (
        <div style={{ fontSize: 12.5, color: C.sub, marginBottom: canReply ? 10 : 0 }}>
          No replies yet{canReply ? ' — start the conversation.' : '.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: canReply ? 12 : 0 }}>
          {replies.map((r) => (
            <div key={r.id} style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  fontSize: 15,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: C.sproutSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {r.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5 }}>
                  <span style={{ fontWeight: 700 }}>{r.author}</span>
                  {r.mine && <span style={{ color: C.sub, fontWeight: 500 }}> · you</span>}
                  <span style={{ color: C.sub }}> · {timeAgo(r.createdAt)}</span>
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre-wrap' }}>{r.body}</div>
                {r.mine && (
                  <button
                    type="button"
                    onClick={() => del(r)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: C.sub,
                      fontFamily: BODY_FONT,
                      padding: '2px 0 0',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {canReply && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            placeholder="Write a reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 40, flex: 1 }}
          />
          <button
            type="button"
            onClick={send}
            disabled={!text.trim() || sending}
            style={{
              ...bigBtn(!!text.trim() && !sending, C.sprout),
              width: 'auto',
              padding: '10px 16px',
              whiteSpace: 'nowrap',
            }}
          >
            {sending ? '…' : 'Reply'}
          </button>
        </div>
      )}
    </div>
  )
}

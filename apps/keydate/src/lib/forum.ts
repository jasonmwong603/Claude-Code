import type { ForumCategory, ForumPost, PostMediaRef } from '../types'
import { SEED_POSTS } from '../data/forumSeed'
import { delMedia } from './media'
import { supabase } from './auth'

/* Community forum persistence.
 *
 * TWO MODES, chosen automatically:
 *  • SHARED (Supabase configured) — posts + likes live in Postgres and are shared
 *    across everyone, live. See supabase/forum.sql for the schema/RLS. Posting
 *    requires being signed in; reading is public.
 *  • ON-DEVICE PREVIEW (no Supabase) — the original behaviour: seed posts plus the
 *    visitor's own posts in localStorage, so the app still works with no backend.
 *
 * The Forum screen calls loadFeed / addPost / toggleLike / deletePost (all async)
 * and passes the current user id; everything else is internal. */

const POSTS_KEY = 'keydate-forum-posts-v1'
const LIKES_KEY = 'keydate-forum-likes-v1'
const IDENTITY_KEY = 'keydate-forum-identity-v1'

export interface Identity {
  author: string
  avatar: string
}

export const AVATARS = ['🔑', '🌷', '🧭', '🛠️', '🌻', '🦫', '🍁', '🏡', '⭐', '🌱', '🐿️', '🎈']

/** True when the shared (Supabase) forum is active. */
export function isRemoteForum(): boolean {
  return !!supabase
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable — preview still works in-memory this session
  }
}

export function getIdentity(): Identity {
  return readJSON<Identity>(IDENTITY_KEY, { author: '', avatar: AVATARS[0] })
}

export function saveIdentity(identity: Identity): void {
  writeJSON(IDENTITY_KEY, identity)
}

export interface AddPostInput {
  identity: Identity
  userId?: string | null
  location?: string
  category: ForumCategory
  title: string
  body: string
  media?: PostMediaRef
}

/* ————————————————————————— shared (Supabase) ————————————————————————— */

interface PostRow {
  id: string
  author_id: string | null
  author_name: string
  avatar: string
  location: string | null
  category: ForumCategory
  title: string
  body: string
  like_count: number
  created_at: string
}

function rowToPost(row: PostRow, userId: string | null): ForumPost {
  return {
    id: row.id,
    authorId: row.author_id,
    author: row.author_name,
    avatar: row.avatar,
    location: row.location ?? undefined,
    category: row.category,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    likes: row.like_count,
    mine: !!userId && row.author_id === userId,
  }
}

async function loadFeedRemote(userId: string | null): Promise<{ posts: ForumPost[]; liked: Set<string> }> {
  const { data: rows } = await supabase!
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  const posts = ((rows as PostRow[] | null) ?? []).map((r) => rowToPost(r, userId))

  const liked = new Set<string>()
  if (userId) {
    const { data: likes } = await supabase!.from('forum_likes').select('post_id')
    for (const l of (likes as { post_id: string }[] | null) ?? []) liked.add(l.post_id)
  }
  return { posts, liked }
}

/* ————————————————————————— on-device preview ————————————————————————— */

function getMyPosts(): ForumPost[] {
  return readJSON<ForumPost[]>(POSTS_KEY, [])
}
function getLikes(): string[] {
  return readJSON<string[]>(LIKES_KEY, [])
}

function loadFeedLocal(): { posts: ForumPost[]; liked: Set<string> } {
  const liked = new Set(getLikes())
  const posts = [...getMyPosts(), ...SEED_POSTS]
    .map((p) => ({ ...p, likes: p.likes + (liked.has(p.id) && !p.mine ? 1 : 0) }))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  return { posts, liked }
}

/* ————————————————————————— unified API ————————————————————————— */

/** The feed + this user's liked set. Shared when configured, else on-device. */
export async function loadFeed(userId: string | null): Promise<{ posts: ForumPost[]; liked: Set<string> }> {
  if (supabase) return loadFeedRemote(userId)
  return loadFeedLocal()
}

/** Create a post. In shared mode requires a signed-in userId. */
export async function addPost(input: AddPostInput): Promise<ForumPost> {
  const author = input.identity.author.trim() || 'Anonymous'
  if (supabase && input.userId) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        author_id: input.userId,
        author_name: author,
        avatar: input.identity.avatar,
        location: input.location?.trim() || null,
        category: input.category,
        title: input.title.trim(),
        body: input.body.trim(),
      })
      .select()
      .single()
    if (error) throw error
    return rowToPost(data as PostRow, input.userId)
  }

  // local preview
  const post: ForumPost = {
    id: `me-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    author,
    avatar: input.identity.avatar,
    location: input.location?.trim() || undefined,
    category: input.category,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    media: input.media,
    mine: true,
  }
  writeJSON(POSTS_KEY, [post, ...getMyPosts()])
  return post
}

export async function deletePost(id: string): Promise<void> {
  if (supabase && !id.startsWith('me-')) {
    await supabase.from('forum_posts').delete().eq('id', id)
    return
  }
  const posts = getMyPosts()
  const gone = posts.find((p) => p.id === id)
  writeJSON(POSTS_KEY, posts.filter((p) => p.id !== id))
  if (gone?.media?.id) await delMedia(gone.media.id)
}

/** Toggle a like. Pass whether it was already liked so we know the direction. */
export async function toggleLike(id: string, wasLiked: boolean, userId: string | null): Promise<void> {
  if (supabase && userId) {
    if (wasLiked) await supabase.from('forum_likes').delete().eq('post_id', id).eq('user_id', userId)
    else await supabase.from('forum_likes').insert({ post_id: id, user_id: userId })
    return
  }
  const likes = new Set(getLikes())
  if (wasLiked) likes.delete(id)
  else likes.add(id)
  writeJSON(LIKES_KEY, [...likes])
}

export function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - +new Date(iso)) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w}w ago`
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/* ————————————————————————— follows & saved posts ————————————————————————— */

const SAVES_KEY = 'keydate-forum-saves-v1'

/** This user's follow set (author ids) and saved-post set (post ids). */
export async function loadSocial(userId: string | null): Promise<{ following: Set<string>; saved: Set<string> }> {
  if (supabase && userId) {
    const [follows, saves] = await Promise.all([
      supabase.from('forum_follows').select('following_id'),
      supabase.from('forum_saves').select('post_id'),
    ])
    const following = new Set<string>()
    for (const f of (follows.data as { following_id: string }[] | null) ?? []) following.add(f.following_id)
    const saved = new Set<string>()
    for (const s of (saves.data as { post_id: string }[] | null) ?? []) saved.add(s.post_id)
    return { following, saved }
  }
  // preview: saves persist locally, follows aren't meaningful without real authors
  return { following: new Set(), saved: new Set(readJSON<string[]>(SAVES_KEY, [])) }
}

/** Follow / unfollow an author (shared mode only). */
export async function toggleFollow(authorId: string, wasFollowing: boolean, userId: string | null): Promise<void> {
  if (!supabase || !userId) return
  if (wasFollowing) {
    await supabase.from('forum_follows').delete().eq('follower_id', userId).eq('following_id', authorId)
  } else {
    await supabase.from('forum_follows').insert({ follower_id: userId, following_id: authorId })
  }
}

/** Save / unsave a post. Falls back to localStorage in preview mode. */
export async function toggleSave(postId: string, wasSaved: boolean, userId: string | null): Promise<void> {
  if (supabase && userId && !postId.startsWith('me-')) {
    if (wasSaved) await supabase.from('forum_saves').delete().eq('user_id', userId).eq('post_id', postId)
    else await supabase.from('forum_saves').insert({ user_id: userId, post_id: postId })
    return
  }
  const set = new Set(readJSON<string[]>(SAVES_KEY, []))
  if (wasSaved) set.delete(postId)
  else set.add(postId)
  writeJSON(SAVES_KEY, [...set])
}

/** Fetch the user's saved posts in full (they may be older than the loaded feed). */
export async function loadSavedPosts(userId: string | null, savedIds: string[]): Promise<ForumPost[]> {
  if (!savedIds.length) return []
  if (supabase && userId) {
    const { data } = await supabase
      .from('forum_posts')
      .select('*')
      .in('id', savedIds)
      .order('created_at', { ascending: false })
    return ((data as PostRow[] | null) ?? []).map((r) => rowToPost(r, userId))
  }
  // preview: pull from the local seed + own posts
  const local = loadFeedLocal().posts
  const idset = new Set(savedIds)
  return local.filter((p) => idset.has(p.id))
}

/** Subscribe to live post inserts/updates (shared mode only). Returns an
 *  unsubscribe function; a no-op in preview mode. */
export function subscribeFeed(onChange: () => void): () => void {
  if (!supabase) return () => {}
  const chan = supabase
    .channel('forum-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => onChange())
    .subscribe()
  return () => {
    void supabase!.removeChannel(chan)
  }
}

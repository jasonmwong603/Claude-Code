import type { ForumCategory, ForumPost, PostMediaRef } from '../types'
import { SEED_POSTS } from '../data/forumSeed'
import { delMedia } from './media'

/* Community forum persistence — ON-DEVICE PREVIEW.

   Posts and likes are stored in localStorage on this device only. The seeded
   posts (data/forumSeed.ts) illustrate the feed; a visitor's own posts are real
   but visible only to them. This is deliberately a self-contained preview so the
   app ships on static hosting with no accounts.

   To make it a truly shared, cross-user forum, replace the four functions below with
   calls to a backend (e.g. Supabase: a `posts` table + `likes`, anon auth, and
   row-level security). The Forum screen only calls loadFeed / addPost /
   toggleLike / deletePost, so nothing else has to change. */

const POSTS_KEY = 'keydate-forum-posts-v1'
const LIKES_KEY = 'keydate-forum-likes-v1'
const IDENTITY_KEY = 'keydate-forum-identity-v1'

export interface Identity {
  author: string
  avatar: string
}

export const AVATARS = ['🔑', '🌷', '🧭', '🛠️', '🌻', '🦫', '🍁', '🏡', '⭐', '🌱', '🐿️', '🎈']

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

function getMyPosts(): ForumPost[] {
  return readJSON<ForumPost[]>(POSTS_KEY, [])
}

function getLikes(): string[] {
  return readJSON<string[]>(LIKES_KEY, [])
}

/** The merged feed: the user's posts + seed posts, newest first, with the
 *  device's like state folded in. */
export function loadFeed(): { posts: ForumPost[]; liked: Set<string> } {
  const liked = new Set(getLikes())
  const posts = [...getMyPosts(), ...SEED_POSTS]
    .map((p) => ({ ...p, likes: p.likes + (liked.has(p.id) && !p.mine ? 1 : 0) }))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  return { posts, liked }
}

export function addPost(input: {
  identity: Identity
  location?: string
  category: ForumCategory
  title: string
  body: string
  media?: PostMediaRef
}): ForumPost {
  const post: ForumPost = {
    id: `me-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    author: input.identity.author.trim() || 'Anonymous',
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
  const posts = getMyPosts()
  const gone = posts.find((p) => p.id === id)
  writeJSON(POSTS_KEY, posts.filter((p) => p.id !== id))
  // Reclaim the attachment blob, if any.
  if (gone?.media?.id) await delMedia(gone.media.id)
}

/** Toggle a like on a post (device-local). Returns the new liked set. */
export function toggleLike(id: string): Set<string> {
  const likes = new Set(getLikes())
  if (likes.has(id)) likes.delete(id)
  else likes.add(id)
  writeJSON(LIKES_KEY, [...likes])
  return likes
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

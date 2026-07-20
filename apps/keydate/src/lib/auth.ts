/* Social sign-in (Google / Facebook) via Supabase Auth.
 *
 * Auth is OPTIONAL: the app runs fully as a guest (on-device) and only talks to
 * Supabase once the two public env vars are set. Until then `authConfigured` is
 * false and every helper is a safe no-op, so the guest experience is unchanged.
 *
 * Setup (see README → "Accounts & sign-in"): create a Supabase project, enable
 * the Google and Facebook providers with your own OAuth apps, add the deployed
 * URL to the allowed redirect list, then provide:
 *   VITE_SUPABASE_URL       = https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY  = <public anon key>   (safe to expose client-side)
 */
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'

const env = import.meta.env
const URL = env.VITE_SUPABASE_URL
const ANON = env.VITE_SUPABASE_ANON_KEY

export const authConfigured = Boolean(URL && ANON)

/** The Supabase client, or null when auth isn't configured yet. Exposed so a
 *  future cloud-sync layer can reuse the same authenticated client. */
export const supabase: SupabaseClient | null = authConfigured
  ? createClient(URL as string, ANON as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

export type OAuthProvider = 'google' | 'facebook'

export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  avatarUrl: string | null
  provider: string | null
}

function toUser(session: Session | null): AuthUser | null {
  const u = session?.user
  if (!u) return null
  const m = (u.user_metadata ?? {}) as Record<string, string | undefined>
  return {
    id: u.id,
    email: u.email ?? null,
    name: m.full_name || m.name || m.user_name || null,
    avatarUrl: m.avatar_url || m.picture || null,
    provider: (u.app_metadata?.provider as string | undefined) ?? null,
  }
}

/** Current signed-in user, or null (also null in guest / unconfigured mode). */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return toUser(data.session)
}

/** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(toUser(session)))
  return () => data.subscription.unsubscribe()
}

/** Redirect to the provider's consent screen; the app reloads signed in. */
export async function signIn(provider: OAuthProvider): Promise<void> {
  if (!supabase) throw new Error('Sign-in is not configured yet.')
  const redirectTo = window.location.origin + window.location.pathname
  const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut()
}

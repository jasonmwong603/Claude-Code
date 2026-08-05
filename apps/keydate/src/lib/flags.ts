import { supabase } from './auth'

/* Whether the beta has been opened to everyone.
 *
 * Fails CLOSED. If we can't reach the server, or the flag table hasn't been
 * created yet, nobody gets in early — the whole point is that access starts for
 * everyone at the same moment, so "unknown" has to mean "not yet". */

const OPEN_KEY = 'keydate-beta-open'
const TIMEOUT_MS = 6000

/** Once a device has seen the beta open, it stays open there. Prevents a
 *  network blip *after* launch from locking an existing user back out. */
export function betaOpenCached(): boolean {
  try {
    return localStorage.getItem(OPEN_KEY) === '1'
  } catch {
    return false
  }
}

export async function fetchBetaOpen(): Promise<boolean> {
  if (!supabase) return false
  try {
    // Don't let a hanging request leave the user on a spinner forever.
    const timeout = new Promise<null>((r) => setTimeout(() => r(null), TIMEOUT_MS))
    const res = await Promise.race([supabase.rpc('beta_open'), timeout])
    if (!res || res.error || res.data !== true) return false
    try {
      localStorage.setItem(OPEN_KEY, '1')
    } catch {
      /* private mode — fine, we'll just re-check next load */
    }
    return true
  } catch {
    return false
  }
}

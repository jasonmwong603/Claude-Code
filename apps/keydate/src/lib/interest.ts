/* Feature demand signals.
 *
 * Instead of guessing whether to build something expensive (real bank sync via
 * Plaid needs a backend, paid production access, and heavier compliance), let
 * users vote with a tap and build on evidence. Votes are deduped per account —
 * or per device for guests — and the raw list is admin-only. */
import { supabase } from './auth'

const DEVICE_KEY = 'keydate-device-id'
const LOCAL_KEY = 'keydate-interest'

export type FeatureKey = 'bank_sync'

function deviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

function localVotes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') as string[]
  } catch {
    return []
  }
}

/** Has this device already voted for the feature? Drives the button state. */
export function hasVoted(feature: FeatureKey): boolean {
  return localVotes().includes(feature)
}

/** Record interest. Always remembered locally so the UI is instant and works
 *  offline; also written to Supabase when configured so the count is global. */
export async function registerInterest(feature: FeatureKey, userId: string | null): Promise<void> {
  const votes = new Set(localVotes())
  votes.add(feature)
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...votes]))
  } catch {
    /* storage unavailable — still fine for this session */
  }
  if (!supabase) return
  try {
    await supabase.from('feature_interest').insert({
      feature,
      user_id: userId,
      device_id: userId ? null : deviceId(),
    })
  } catch {
    /* duplicate vote or offline — the local flag is what the UI needs */
  }
}

/* Cloud sync of the saved app state for signed-in users.
 *
 * One row per user in a `keydate_state` table (user_id → state jsonb), private
 * to that user via row-level security. All calls are best-effort and no-op when
 * auth isn't configured or nobody is signed in, so guest mode is untouched.
 *
 * Table + policies (run once in the Supabase SQL editor — see README):
 *   create table public.keydate_state (
 *     user_id uuid primary key references auth.users(id) on delete cascade,
 *     state jsonb not null,
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table public.keydate_state enable row level security;
 *   create policy "own_read"   on public.keydate_state for select using (auth.uid() = user_id);
 *   create policy "own_insert" on public.keydate_state for insert with check (auth.uid() = user_id);
 *   create policy "own_update" on public.keydate_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
 */
import { supabase } from './auth'
import type { AppState } from '../types'

/** Fetch this user's cloud-saved state, or null if none / not signed in. */
export async function pullState(): Promise<AppState | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('keydate_state').select('state').maybeSingle()
  if (error || !data) return null
  return data.state as AppState
}

/** Upsert this user's state to the cloud. */
export async function pushState(state: AppState): Promise<void> {
  if (!supabase) return
  const { data } = await supabase.auth.getUser()
  const uid = data.user?.id
  if (!uid) return
  await supabase.from('keydate_state').upsert(
    { user_id: uid, state, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
}

// Debounced push so rapid edits (logging, editing the plan) coalesce into one
// write instead of hammering the network.
let timer: ReturnType<typeof setTimeout> | null = null
let pending: AppState | null = null
export function queueSync(state: AppState): void {
  if (!supabase) return
  pending = state
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const s = pending
    pending = null
    if (s) void pushState(s)
  }, 1500)
}

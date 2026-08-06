/* Privacy-light usage metric so the team can see how many people use the app.
 *
 * Records one anonymous row per device (a random id kept in localStorage) with
 * first_seen / last_seen and whether it ever signed in — no names, no behaviour
 * tracking. You read the counts yourself in the Supabase dashboard / SQL editor;
 * the client can only upsert its own device via a security-definer function, so
 * the raw table stays unreadable from the browser.
 *
 * One-time setup (Supabase SQL editor — see README):
 *   create table public.keydate_devices (
 *     device_id uuid primary key,
 *     first_seen timestamptz not null default now(),
 *     last_seen  timestamptz not null default now(),
 *     signed_in  boolean not null default false
 *   );
 *   alter table public.keydate_devices enable row level security;  -- no policies: locked
 *   create or replace function public.track_device(p_device uuid, p_signed_in boolean)
 *   returns void language sql security definer set search_path = public as $$
 *     insert into public.keydate_devices (device_id, signed_in) values (p_device, p_signed_in)
 *     on conflict (device_id) do update
 *       set last_seen = now(), signed_in = keydate_devices.signed_in or excluded.signed_in;
 *   $$;
 *   grant execute on function public.track_device(uuid, boolean) to anon, authenticated;
 */
import { supabase, type AuthUser } from './auth'

const DEVICE_KEY = 'keydate-device-id'

function deviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

/** Record (or refresh) this device's presence. Best-effort; silent no-op when
 *  analytics/auth isn't configured. */
export async function trackVisit(signedIn: boolean): Promise<void> {
  if (!supabase) return
  try {
    await supabase.rpc('track_device', { p_device: deviceId(), p_signed_in: signedIn })
  } catch {
    /* never let a metric ping affect the app */
  }
}

/** Register / refresh a signed-in user's profile row — the permanent record of
 *  who has an account (the total is your registered-user count, active or not).
 *  A DB trigger also creates this row at signup; this keeps name/avatar current.
 *  Best-effort; no-op when unconfigured. */
export async function recordProfile(user: AuthUser): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatarUrl,
        last_seen: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
  } catch {
    /* metric only — never block the app */
  }
}

/* ── Product funnel ──────────────────────────────────────────────────────────
 *
 * A fixed vocabulary of product events, so we can tell "nobody finished
 * onboarding" from "everyone finished and never came back" — those need
 * opposite fixes, and the difference is invisible without this.
 *
 * Deliberately narrow: no free-form payloads, no PII, no third-party tracker.
 * `detail` carries only bounded context like a lesson id. Fire-and-forget, so a
 * blocked request or a missing table can never affect what the user sees.
 *
 * Requires supabase/events.sql. */
export type EventName =
  | 'app_opened'
  | 'onboarding_started'
  | 'plan_created'
  | 'contribution_logged'
  | 'lesson_completed'
  | 'rentbuy_viewed'
  | 'forum_viewed'
  | 'feedback_sent'
  | 'bank_connect_clicked'

/** Events that should count once per device per session, not once per render —
 *  screen views fire on every mount otherwise and drown the funnel. */
const oncePerSession = new Set<string>()

export function track(name: EventName, detail?: string, opts?: { once?: boolean }): void {
  if (!supabase) return
  const key = detail ? `${name}:${detail}` : name
  if (opts?.once) {
    if (oncePerSession.has(key)) return
    oncePerSession.add(key)
  }
  try {
    void supabase
      .from('events')
      .insert({ name, device_id: deviceId(), detail: detail?.slice(0, 60) ?? null })
      .then(() => {}, () => {})
  } catch {
    /* analytics must never break the app */
  }
}

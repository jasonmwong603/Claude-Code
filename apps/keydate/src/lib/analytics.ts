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
import { supabase } from './auth'

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

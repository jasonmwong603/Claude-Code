/* KeyDate service worker — makes the app installable + usable offline.
   Stale-while-revalidate for same-origin GETs (the app shell + assets); never
   caches cross-origin requests (e.g. Supabase API), so data stays fresh. */
const CACHE = 'keydate-shell-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() =>
      self.clients.claim(),
    ),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const sameOrigin = new URL(req.url).origin === self.location.origin
  if (!sameOrigin) return // let cross-origin (Supabase, etc.) hit the network directly
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})

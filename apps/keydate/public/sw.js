/* KeyDate service worker — makes the app installable + usable offline.

   Caching strategy, and why it's split:

   • NAVIGATIONS (the HTML shell) are network-first. The shell names the
     content-hashed JS/CSS to load, so serving a stale shell pins a returning
     visitor to an old build — they keep running last week's app even after a
     deploy. Fetching it fresh (with the cache as an offline fallback) means a
     deploy reaches people on their very next load.
   • EVERYTHING ELSE same-origin is stale-while-revalidate. Those URLs are
     content-hashed, so a cached copy can never be the "wrong" version — a new
     build asks for a new filename.
   • CROSS-ORIGIN (Supabase, etc.) is never touched, so data stays live.

   Bump CACHE whenever this file changes: `activate` deletes every cache whose
   name doesn't match, which is what evicts a bad shell from existing installs. */
const CACHE = 'keydate-shell-v2'

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
  if (new URL(req.url).origin !== self.location.origin) return // Supabase etc. → straight to network

  // The shell: always try the network, fall back to cache only when offline.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html'))),
    )
    return
  }

  // Hashed assets: serve instantly, refresh in the background.
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

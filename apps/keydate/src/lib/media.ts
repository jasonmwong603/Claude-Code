/* On-device media store for forum attachments.

   Photos and videos are too large for localStorage (5MB, strings only), so blobs
   live in IndexedDB and posts keep only a short id. This keeps the preview fully
   offline. When a real backend is wired, replace putMedia/getMedia with an
   upload that returns a URL and store that on the post's `media.url` instead —
   the Forum screen already renders `url` directly for seeded posts. */

const DB_NAME = 'keydate-media'
const STORE = 'blobs'
const VERSION = 1

/** Reject uploads bigger than this so a single post can't blow the disk quota. */
export const MAX_MEDIA_BYTES = 30 * 1024 * 1024 // 30 MB

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function putMedia(blob: Blob): Promise<string> {
  const id = `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  return id
}

export async function getMedia(id: string): Promise<Blob | null> {
  const db = await openDB()
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve((req.result as Blob) ?? null)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return blob
}

export async function delMedia(id: string): Promise<void> {
  const db = await openDB()
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => resolve() // best-effort cleanup
  })
  db.close()
}

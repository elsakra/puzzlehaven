/**
 * Online Jigsaws — Service Worker
 *
 * Strategy:
 *  - Static assets (JS, CSS, fonts, icons) → cache-first
 *  - HTML pages and API routes → network-first (always fresh content)
 *  - Puzzle images from Cloudinary → stale-while-revalidate (fast loads + eventual freshness)
 */

const CACHE_VERSION = "v2";
const STATIC_CACHE = `oj-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `oj-images-${CACHE_VERSION}`;

/** URLs to pre-cache on install */
const PRECACHE_URLS = [
  "/",
  "/daily",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

// ─── Install ───────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key !== STATIC_CACHE && key !== IMAGE_CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and Cloudinary requests
  const isSameOrigin = url.origin === self.location.origin;
  const isCloudinary = url.hostname.includes("cloudinary.com");
  if (!isSameOrigin && !isCloudinary) return;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Next.js internal routes and API routes
  if (url.pathname.startsWith("/_next/") && !url.pathname.includes("/_next/static/")) return;
  if (url.pathname.startsWith("/api/")) return;

  // Cloudinary images → stale-while-revalidate
  if (isCloudinary) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // Next.js static assets (_next/static/) → cache-first (content-hashed, safe to cache forever)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Icons, manifest, and other static public files → cache-first
  if (
    url.pathname.match(/\.(svg|png|ico|webp|woff2?|ttf|css)$/) ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages → network-first (ensures users always get fresh puzzle lists)
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ─── Strategy helpers ──────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Offline fallback for HTML — return the cached homepage
    const fallback = await caches.match("/");
    return fallback ?? new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  return cached ?? fetchPromise;
}

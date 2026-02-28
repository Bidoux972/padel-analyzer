const CACHE_VERSION = 13;
const CACHE_NAME = 'padel-analyzer-v' + CACHE_VERSION;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/bundle.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap',
];

// Install: cache core assets, skip waiting immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete ALL old caches, claim clients, notify update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      const oldKeys = keys.filter(k => k !== CACHE_NAME);
      return Promise.all(oldKeys.map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      }));
    }).then(() => {
      return self.clients.claim().then(() => {
        // Always use message approach — never force-reload (could interrupt wizard/session)
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION }));
        });
      });
    })
  );
});

// Fetch strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API calls: network only
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request).catch(() => new Response('{"error":"offline"}', {
      status: 503, headers: { 'Content-Type': 'application/json' }
    })));
    return;
  }

  // bundle.js & index.html: NETWORK-FIRST (always get latest, cache fallback for offline)
  if (url.pathname === '/bundle.js' || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Images from padelful: stale-while-revalidate
  if (url.hostname.includes('padelful.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else (fonts, manifest): cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

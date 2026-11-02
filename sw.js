/* Flânerie — service worker : le parcours fonctionne hors ligne après une première visite. */
const CACHE = "flanerie-v5";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.svg", "content/catalog.json",
  ...["fr", "en", "es", "it", "de", "pt", "zh", "ar"].flatMap(l => ["paris-insolite-5e-6e", "paris-insolite-marais", "paris-insolite-rivegauche", "paris-insolite-journee"].map(p => `content/${l}/${p}.json`)),
  ...["paris-insolite-5e-6e", "paris-insolite-marais", "paris-insolite-rivegauche", "paris-insolite-journee"].map(p => `content/traces/${p}.geojson`)];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname === "routing.openstreetmap.de") return; // l'itinéraire reste en ligne
  const sameOrigin = url.origin === self.location.origin;
  const media = /(^|\.)(upload|thumb)\.wikimedia\.org$|fonts\.(googleapis|gstatic)\.com$|^cdnjs\.cloudflare\.com$/.test(url.hostname);
  const tiles = url.hostname === "tiles.openfreemap.org";
  if (sameOrigin) { // réseau d'abord, cache en secours : les mises à jour arrivent dès qu'on est en ligne
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
  } else if (tiles && !/\.(pbf|png|webp|json)$/.test(url.pathname) && !/\/(fonts|sprites)\//.test(url.pathname) || tiles && /\/styles\//.test(url.pathname)) { // style et index des tuiles : réseau d'abord
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; }).catch(() => caches.match(req)));
  } else if (media || tiles) { // photos, polices, bibliothèque de cartes et tuiles déjà vues : cache d'abord
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { if (res.ok || res.type === "opaque") { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return res; })));
  }
});

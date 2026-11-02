/* Flânerie — service worker : le parcours fonctionne hors ligne après une première visite. */
const CACHE = "flanerie-v4";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.svg", "content/catalog.json",
  ...["fr", "en", "es", "it", "de", "pt", "zh", "ar"].flatMap(l => ["paris-insolite-5e-6e", "paris-insolite-marais", "paris-insolite-rivegauche", "paris-insolite-journee"].map(p => `content/${l}/${p}.json`))];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname === "routing.openstreetmap.de") return; // l'itinéraire reste en ligne
  const sameOrigin = url.origin === self.location.origin;
  const media = /(^|\.)(upload|thumb)\.wikimedia\.org$|fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (sameOrigin) { // réseau d'abord, cache en secours : les mises à jour arrivent dès qu'on est en ligne
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
  } else if (media) { // photos et polices : cache d'abord
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); return res; })));
  }
});

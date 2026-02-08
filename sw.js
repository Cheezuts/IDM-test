// Service Worker pour IDM Entreprise
const CACHE_NAME = 'idm-entreprise-v3.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/avis.html',
  '/climatisation.html',
  '/pompe-a-chaleur.html',
  '/ballon-thermodynamique.html',
  '/traitement-eau.html',
  '/faq.html',
  '/zone-intervention.html',
  '/mentions-legales.html',
  '/css/style.css',
  '/js/script.js',
  '/logo-idm-entreprise-optimized.png',
  '/manifest.json',
  '/favicon.ico',
  // Images principales
  '/Background logo IDM Entreprise.jpg',
  '/Ballon thermodynamique.png',
  '/Climatisation.png',
  '/Logo Pompe à chaleur.png',
  '/Logo Traitement de l\'eau.png',
  '/Logo ballon thermodynamique.png',
  '/Logo climatisation.png',
  '/Pompe à chaleur.jpeg',
  '/filtration et accessoires.png',
  '/logo-sci.png'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Mise à jour du cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

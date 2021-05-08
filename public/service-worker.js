var CACHE_NAME = "my-site-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"


//cached files for quicker loading
const FILES_TO_CACHE = [
    '/',
    '/indexedDB.js',
    "/index.js",
    "/maifest.json",
    "/style.css",
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // 'https://fonts.googleapis.com/css?family=Istok+Web|Montserrat:800&display=swap',
    // 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
  ];
  //install function which grabs cached pages
  //two self.add
  self.addEventListener('install', function(evt){
      evt.waitUntil(
          caches.open(CACHE_NAME).then(function(cache){
              console.log("open cache")
              return cache.addAll(FILES_TO_CACHE)
          })
      )
    })
  //self.add fetch
  self.addEventListener('fetch', function (evt) {
    //cache successful requests to api
   if (evt.request.url.inclues('/api')) {
     evt.respondWith(
       caches.open(CACHE_NAME).then(cache => {
         return fetch(evt.request)
         .then(response => {
           if (response.status === 200) {
             cache.put(evt.request.url, response.clone())
           }

           return response;

         })
         .catch(err => {
           return cache.match(evt.request);
         });
       }).catch(err => console,log(err))
     );
     return;
   }
  })
  //event.respond with
  
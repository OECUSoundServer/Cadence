const CACHE = 'cadence-pos-demo-v1';

const CORE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
];


/* ==============================
   Install
============================== */

self.addEventListener(
    'install',
    event => {

        event.waitUntil(
            caches
                .open(CACHE)
                .then(cache => {
                    return cache.addAll(CORE);
                })
        );

    }
);


/* ==============================
   Activate
============================== */

self.addEventListener(
    'activate',
    event => {

        event.waitUntil(
            self.clients.claim()
        );

    }
);


/* ==============================
   Fetch
============================== */

self.addEventListener(
    'fetch',
    event => {

        // GET以外のリクエストは処理しない
        if (event.request.method !== 'GET') {
            return;
        }


        event.respondWith(

            caches
                .match(event.request)

                .then(cachedResponse => {

                    // キャッシュが存在する場合
                    if (cachedResponse) {
                        return cachedResponse;
                    }


                    // キャッシュがない場合はネットワークから取得
                    return fetch(event.request)

                        .then(response => {

                            // キャッシュ保存用に複製
                            const clonedResponse =
                                response.clone();


                            caches
                                .open(CACHE)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        clonedResponse
                                    );

                                });


                            return response;

                        })

                        .catch(() => {

                            // オフラインかつキャッシュにも存在しない場合
                            return caches.match(
                                './index.html'
                            );

                        });

                })

        );

    }
);
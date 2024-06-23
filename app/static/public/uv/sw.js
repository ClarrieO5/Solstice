importScripts('/epoxy/index.js');
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts(__uv$config.sw || '/uv/uv.sw.js');

const sw = new UVServiceWorker();

if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        event.respondWith((async function() {
            return await uv.fetch(event);
        })());
    }
    else {
        event.respondWith((async function() {
            return await fetch(event.request);
        })());
    }

//import
importScripts('js/sw-utils.js');



//Constantes
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';
const DYNAMIC_CACHE_LIMIT = 50;

//Corazon de la app, archivos estaticos
const APP_SHELL =[
    /* '/', */
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//Archivos invariables
const APP_SHELL_INMUTABLE = [

    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


//Proceso de instalacion
self.addEventListener('install', e=>{

        const cache_static = caches.open(STATIC_CACHE).then(cache =>
            cache.addAll(APP_SHELL) );
        
        const cache_inmutable = caches.open(INMUTABLE_CACHE).then(cache =>
                cache.addAll(APP_SHELL_INMUTABLE) );

        e.waitUntil(Promise.all([ cache_static, cache_inmutable]));
});

//Proceso de activacion
self.addEventListener('activate', e =>{

    const respuesta = caches.keys().then( keys =>{

        keys.forEach(key =>{

            if(key !== STATIC_CACHE && key.includes('static'))
            return caches.delete(key);
        });
    });

    e.waitUntil( respuesta );


});


//Proceso de ejecucion
self.addEventListener('fetch', e =>{

    //2-cache with network fallback then cache, busca dentro de la cache si no existe la direccion entonces acude a internet 
    //para buscarla
    const respuestaCaches = caches.match( e.request).then( resp =>{
            
        if(resp) {
                return resp;
        }else{
                
            
            return fetch(e.request).then( newResp =>{            
                        return actializarCacheDinamico(DYNAMIC_CACHE, e.request, newResp.clone() );
            });

        }
    
        });

        e.respondWith(respuestaCaches);
});
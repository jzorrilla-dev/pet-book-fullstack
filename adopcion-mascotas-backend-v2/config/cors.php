<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'test-session',
        '/',
    ],

    'allowed_methods' => ['*'],

    // ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE!
    // Usamos la variable de entorno como respaldo, pero también agregamos
    // explícitamente el dominio de producción del frontend para garantizar que funcione.
    'allowed_origins' => [env('FRONTEND_URL'), 'https://pet-book-fullstack-production.up.railway.app'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

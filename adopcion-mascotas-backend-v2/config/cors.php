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

    // Usamos la variable de entorno para el origen del frontend.
    // En producción, esto será el dominio real de tu aplicación.
    'allowed_origins' => [env('FRONTEND_URL')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

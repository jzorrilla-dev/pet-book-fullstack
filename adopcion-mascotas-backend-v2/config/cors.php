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

    'allowed_origins' => [
        // Si estamos en producción, usamos la URL de Railway
        env('APP_ENV') === 'production'
            ? 'https://appealing-vitality-production.up.railway.app'
            : env('FRONTEND_URL'), // Si no, leemos la variable de entorno local
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

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
        env('FRONTEND_URL_PROD', 'http://localhost:3000')
    ],
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'test-session', // <-- ¡Añade esta línea!
        '/'             // <-- ¡Añade esta línea! Esto cubrirá cualquier ruta en la raíz.
    ],

    'allowed_methods' => ['*'],

    // Asegúrate de que tu frontend (React) esté aquí. Si solo usas localhost:3000, solo esa es suficiente.
    'allowed_origins' => ['http://localhost:3000'], // <-- Simplificado, a menos que realmente necesites 127.0.0.1:3000 o 127.0.0.1:8000 en el frontend

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // <-- Esto es crucial para Sanctum y cookies.
];

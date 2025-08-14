<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\LostPetController;
use App\Http\Controllers\SocialAuthController;

// Rutas que necesitan el middleware 'web' para la sesión y CSRF
// Estas rutas serán accesibles como /api/login, /api/register, /api/sanctum/csrf-cookie
Route::middleware('web')->group(callback: function (): void {
    // Rutas de autenticación
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']); // <-- ¡Añade esta línea!

    // Ruta para obtener el token CSRF (esencial para Sanctum SPA)
    // Se accede como /api/sanctum/csrf-cookie
    Route::get('/sanctum/csrf-cookie', function (Request $request) {
        return response()->noContent();
    });
});


// Rutas públicas (no requieren autenticación, pero no necesitan el middleware 'web' si son solo GETs)
// Estas rutas también tendrán el prefijo /api/
Route::get('/lostpets', [LostPetController::class, 'index']);
Route::get('/pets', [PetController::class, 'index']);
Route::get('/pets/{pet_id}', [PetController::class, 'show']);
Route::get('/lostpets/{id}', [LostPetController::class, 'show']);

// Rutas para autenticación social (si las usas)
// También tendrán el prefijo /api/
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);


// Rutas protegidas por Sanctum (requieren autenticación)
// Estas rutas ya están dentro del prefijo /api/ y usan auth:sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas de usuario autenticado
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/{user_id}', [AuthController::class, 'getUserById']); // Añadí esta ruta para obtener un usuario por ID
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas de mascotas
    Route::post('/pets', [PetController::class, 'store']);
    Route::delete('/pets/{pet_id}', [PetController::class, 'destroy']);
    Route::put('/pets/{pet_id}', [PetController::class, 'update']);

    // Rutas para mascotas perdidas
    Route::post('/lostpets', [LostPetController::class, 'store']);
    Route::delete('/lostpets/{id}', [LostPetController::class, 'destroy']);
    Route::put('/lostpets/{id}', [LostPetController::class, 'update']); // Añadí el PUT para consistencia
});

// Ruta de prueba (si la usas)
Route::get('/phpinfo', function (): void {
    phpinfo();
});

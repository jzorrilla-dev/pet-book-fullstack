<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome'); // O lo que tengas en tu ruta raíz
});

// AÑADE ESTO:
Route::get('/test-session', function (Request $request) {
    $sessionValue = session('test_key', 'No session value set.');
    if ($request->has('set')) {
        session(['test_key' => 'Session value set!']);
        $sessionValue = 'Session value set!';
    }
    return response()->json(['status' => $sessionValue]);
})->middleware([EnsureFrontendRequestsAreStateful::class]); // Mantén este middleware

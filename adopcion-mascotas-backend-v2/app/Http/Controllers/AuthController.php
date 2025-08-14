<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Asegúrate de importar Log
use Illuminate\Support\Facades\Password; // Para el restablecimiento de contraseña
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset; // Para el evento de restablecimiento de contraseña
use Illuminate\Support\Facades\Validator; // Para la validación de restablecimiento de contraseña

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string|max:255',
            'user_phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'user_name' => $request->user_name,
            'user_phone' => $request->user_phone,
            'city' => $request->city,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Para SPA (Sanctum cookie authentication), el registro establece la sesión
        // y la autenticación se verifica con la cookie en subsiguientes peticiones.
        // No necesitas Auth::login($user) aquí, ni generar tokens.

        // Puedes opcionalmente devolver los datos del usuario recién registrado
        // o simplemente un mensaje de éxito.
        return response()->json([
            'message' => 'Registro exitoso',
            'user' => $user, // Devolver el usuario es útil para el frontend
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Intentar autenticar al usuario usando el guard 'web' (para sesiones)
        // Laravel Sanctum se basa en esta sesión 'web' para la autenticación de SPA.
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Si las credenciales son inválidas, devuelve un error 401
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Si la autenticación es exitosa, Laravel ya ha establecido la sesión 'web'
        // y Sanctum se encargará de la cookie de sesión.
        // Registra el éxito en los logs para depuración
        Log::info('Login exitoso, usuario:', ['user' => Auth::user()]);

        // ¡IMPORTANTE! Elimina o comenta cualquier dd() o dump() aquí.
        // dd('Login successful. Session status: ' . session()->get('_token') . ' - User ID: ' . Auth::id()); // ¡ELIMINA ESTA LÍNEA!

        // Para autenticación de SPA con Sanctum, simplemente devuelve una respuesta exitosa.
        // El frontend luego hará una petición GET /api/user para obtener los datos del usuario.
        return response()->json([
            'message' => 'Login exitoso',
            'user' => Auth::user(), // Opcional: devolver el usuario aquí también
        ], 200); // 200 OK o 204 No Content son válidos. 200 con el usuario es más informativo.
    }

    public function user(Request $request)
    {
        // Esta ruta está protegida por el middleware 'auth:sanctum' en api.php.
        // Si se llega aquí, el usuario ya está autenticado a través de la cookie de sesión.
        return response()->json([
            'user' => $request->user(), // Accede al usuario autenticado
        ]);
    }

    public function getUserById($user_id)
    {
        // Busca el usuario por ID
        $user = User::find(id: $user_id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    public function logout(Request $request)
    {
        try {
            // Invalida la sesión del guard 'web' (que Sanctum usa para SPA).
            Auth::guard('web')->logout();

            // Esto es crucial para la seguridad de la sesión de Laravel:
            $request->session()->invalidate(); // Invalida la sesión actual
            $request->session()->regenerateToken(); // Regenera el token CSRF para futuras sesiones

            // Opcional: Eliminar explícitamente las cookies del navegador.
            // Sanctum a menudo maneja esto, pero es una buena práctica para asegurar.
            return response()->json(['message' => 'Sesión cerrada'], 200)
                ->withCookie(cookie()->forget('XSRF-TOKEN')) // Elimina la cookie del token CSRF
                ->withCookie(cookie()->forget(config('session.cookie'))); // Elimina la cookie de sesión (ej. 'laravel_session')
        } catch (\Exception $e) {
            Log::error('Error al cerrar sesión: ' . $e->getMessage());
            return response()->json(['message' => 'Error al cerrar sesión'], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        try {
            // Laravel manejará internamente si el email existe o no.
            // Si el email no existe, no se envía nada y se devuelve un mensaje genérico.
            Password::sendResetLink($request->only('email'));

            // Si la aplicación no está en producción, registra el email al que se envió el enlace.
            if (config('app.env') !== 'production') {
                Log::info('Enlace de restablecimiento enviado a: ' . $request->email);
            }

            return response()->json(['message' => 'Enlace de restablecimiento enviado'], 200);
        } catch (\Exception $e) {
            Log::error('Error al enviar enlace de restablecimiento: ' . $e->getMessage());
            return response()->json(['message' => 'Error al enviar enlace de restablecimiento'], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $response = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($response == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña restablecida correctamente.'], 200);
        }

        // Si la respuesta no es exitosa, devolvemos un error.
        return response()->json(['error' => 'No se pudo restablecer la contraseña. El token es inválido o ha expirado.'], 400);
    }
}

<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Socialite\Two\InvalidStateException;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;

class SocialAuthController extends Controller
{
    public function redirectToProvider($provider): JsonResponse
    {
        \Log::debug("Iniciando redirección a $provider");
        try {
            if ($provider === 'facebook') {
                $url = Socialite::driver('facebook')
                    ->setScopes(['email'])
                    ->stateless()
                    ->redirect()
                    ->getTargetUrl();
                return response()->json(['url' => $url], 200);
            }
            $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url], 200);
        } catch (\Exception $e) {
            \Log::error("Error al redirigir a $provider: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo redirigir a ' . $provider], 500);
        }
    }

    public function handleProviderCallback(Request $request, $provider)
    {
        \Log::debug("Procesando callback de $provider");
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            \Log::debug("Usuario obtenido de $provider", ['user' => $socialUser->getEmail()]);

            $email = $socialUser->getEmail();

            if (!$email) {
                \Log::warning("No se obtuvo email de $provider");
                return response()->json(['error' => 'El proveedor no devolvió un correo electrónico'], 400);
            }

            $user = User::where('email', $email)->first();

            if (!$user) {
                \Log::warning("Usuario no encontrado para email: $email");
                return response()->json(['error' => 'No encontramos una cuenta con este correo. Por favor, regístrate primero.'], 404);
            }

            Auth::login($user);
            $request->session()->regenerate();

            \Log::info("Usuario autenticado: $email");

            return response()->json([
                'message' => 'Login exitoso con ' . $provider,
                'user' => $user,
            ])->withCookie(cookie(
                        name: 'pet_adoption_session',
                        value: session()->getId(),
                        minutes: 60 * 24,
                        path: '/',
                        domain: null,
                        secure: env('SESSION_SECURE_COOKIE', false), // true en producción
                        httpOnly: true,
                        sameSite: 'lax'
                    ));
        } catch (InvalidStateException $e) {
            \Log::error("InvalidStateException en callback de $provider: " . $e->getMessage());
            return response()->json(['error' => 'Estado inválido en la autenticación con ' . $provider], 400);
        } catch (ClientException $e) {
            \Log::error("ClientException en callback de $provider: " . $e->getMessage());
            return response()->json(['error' => 'Error de cliente con ' . $provider], 400);
        } catch (\Exception $e) {
            \Log::error("Error en callback de $provider: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo iniciar sesión con ' . $provider], 500);
        }
    }
}

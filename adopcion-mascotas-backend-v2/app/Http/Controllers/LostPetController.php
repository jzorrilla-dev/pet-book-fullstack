<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LostPet;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LostPetController extends Controller
{
    public function __construct()
    {
        // ¡IMPORTANTE! Haz 'index' y 'show' públicos para que las mascotas se vean sin login.
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function store(Request $request)
    {
        Log::info('Request data (LostPet):', $request->all());
        Log::info('Archivo recibido (LostPet): ' . ($request->hasFile('pet_photo') ? 'Sí' : 'No'));

        $validated = $request->validate([
            'pet_name' => 'nullable|string|max:255',
            'last_seen' => 'nullable|string|max:255',
            'lost_date' => 'nullable|date',
            'pet_species' => 'required|string|max:255',
            'pet_photo' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        try {
            $userId = Auth::id();

            if (is_null($userId)) {
                Log::error('Intento de crear LostPet sin user_id autenticado.');
                return response()->json(['message' => 'No autorizado. Por favor, inicia sesión.'], 401);
            }

            $lostPet = new LostPet();
            $lostPet->user_id = $userId;
            $lostPet->pet_name = $request->pet_name;
            $lostPet->last_seen = $request->last_seen;
            $lostPet->lost_date = $request->lost_date;
            $lostPet->pet_species = $request->pet_species;
            $lostPet->description = $request->description ?? '';

            if ($request->hasFile('pet_photo') && $request->file('pet_photo')->isValid()) {
                Log::info('Subiendo archivo de mascota perdida a Cloudinary...');
                $uploadedFile = $request->file('pet_photo');
                $result = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'lost_pets',
                    'public_id' => 'lost_' . time(),
                ]);
                $lostPet->pet_photo = $result->getSecurePath();
                Log::info('Archivo subido a Cloudinary: ' . $lostPet->pet_photo);
            } else {
                $lostPet->pet_photo = null;
            }

            $lostPet->save();

            Log::info('Mascota perdida creada exitosamente:', $lostPet->toArray());
            return response()->json($lostPet, 201);
        } catch (\Exception $e) {
            Log::error('Error al registrar mascota perdida: ' . $e->getMessage());
            Log::error('Stack trace LostPetController: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error al registrar la publicación', 'error' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        // Cargar la relación 'user' para incluir los datos del usuario
        $lostPets = LostPet::with('user')->latest()->get();
        return response()->json($lostPets);
    }

    public function show($id)
    {
        // Cargar la relación 'user' para incluir los datos del usuario
        $lostPet = LostPet::with('user')->findOrFail($id);
        return response()->json($lostPet);
    }

    public function update(Request $request, $id) // Asumo que también tienes un método update para LostPet
    {
        $lostPet = LostPet::findOrFail($id);

        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Casteamos ambos IDs a entero para asegurar la comparación de tipo y valor.
        // Accedemos al ID del usuario autenticado vía user()->user_id (como en tu modelo User)
        if ((int) $request->user()->user_id !== (int) $lostPet->user_id) {
            Log::warning('403 Forbidden: User ID mismatch for LostPet update.', [
                'authenticated_user_id' => $request->user()->user_id,
                'authenticated_user_id_type' => gettype($request->user()->user_id),
                'lost_pet_user_id' => $lostPet->user_id,
                'lost_pet_user_id_type' => gettype($lostPet->user_id),
            ]);
            return response()->json(['message' => 'No autorizado para editar esta mascota perdida'], 403);
        }

        $validated = $request->validate([
            'pet_name' => 'nullable|string|max:255',
            'last_seen' => 'nullable|string|max:255',
            'lost_date' => 'nullable|date',
            'pet_species' => 'required|string|max:255',
            'pet_photo' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        try {
            $lostPet->pet_name = $request->pet_name;
            $lostPet->last_seen = $request->last_seen;
            $lostPet->lost_date = $request->lost_date;
            $lostPet->pet_species = $request->pet_species;
            $lostPet->description = $request->description ?? '';

            if ($request->hasFile('pet_photo') && $request->file('pet_photo')->isValid()) {
                $uploadedFile = $request->file('pet_photo');
                $result = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'lost_pets',
                    'public_id' => 'lost_' . time(),
                ]);
                $lostPet->pet_photo = $result->getSecurePath();
            }

            $lostPet->save();
            return response()->json($lostPet);
        } catch (\Exception $e) {
            Log::error('Error al actualizar mascota perdida: ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar la publicación'], 500);
        }
    }

    public function destroy($id, Request $request)
    {
        $lostPet = LostPet::findOrFail($id);

        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Casteamos ambos IDs a entero para asegurar la comparación de tipo y valor.
        // Accedemos al ID del usuario autenticado vía user()->user_id (como en tu modelo User)
        if ((int) $request->user()->user_id !== (int) $lostPet->user_id) {
            Log::warning('403 Forbidden: User ID mismatch for LostPet delete.', [
                'authenticated_user_id' => $request->user()->user_id,
                'authenticated_user_id_type' => gettype($request->user()->user_id),
                'lost_pet_user_id' => $lostPet->user_id,
                'lost_pet_user_id_type' => gettype($lostPet->user_id),
            ]);
            return response()->json(['message' => 'No autorizado'], 403);
        }

        try {
            $lostPet->delete();
            return response()->json(['message' => 'Publicación eliminada con éxito']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar mascota: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar la mascota'], 500);
        }
    }
}

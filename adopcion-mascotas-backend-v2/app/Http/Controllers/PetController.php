<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    public function __construct()
    {
        // Esto protegerá todas las rutas de este controlador excepto index y show
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function store(Request $request)
    {
        Log::info('CLOUDINARY_URL: ' . env('CLOUDINARY_URL'));
        Log::info('Request data:', $request->all());
        Log::info('Archivo recibido: ' . ($request->hasFile('pet_photo') ? 'Sí' : 'No'));

        if ($request->has('castrated')) {
            Log::info('Castrated value:', [$request->castrated, gettype($request->castrated)]);
        }

        $validated = $request->validate([
            'pet_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'pet_species' => 'required|string|max:255',
            'castrated' => 'required',
            'pet_photo' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'health_condition' => 'nullable|string',
        ]);

        try {
            $pet = new Pet();
            $pet->pet_name = $request->pet_name;
            $pet->location = $request->location;
            $pet->description = $request->description ?? '';
            $pet->pet_species = $request->pet_species;
            $pet->health_condition = $request->health_condition ?? '';
            $pet->castrated = filter_var($request->castrated, FILTER_VALIDATE_BOOLEAN);
            $pet->pet_status = 'available';

            $pet->user_id = Auth::id(); // ¡Esto es correcto!
            Log::info('User ID autenticado para la mascota:', ['user_id' => $pet->user_id]);


            if ($request->hasFile('pet_photo') && $request->file('pet_photo')->isValid()) {
                Log::info('Subiendo archivo a Cloudinary...');
                $uploadedFile = $request->file('pet_photo');
                $result = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'pets',
                    'public_id' => 'pet_' . time()
                ]);

                $pet->pet_photo = $result->getSecurePath();
                Log::info('Archivo subido a Cloudinary: ' . $pet->pet_photo);
            } else {
                $pet->pet_photo = null;
            }

            $pet->save();

            return response()->json($pet, 201);
        } catch (\Exception $e) {
            Log::error('Error al crear mascota: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error al crear la mascota: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        // Cargar la relación 'user' para incluir los datos del usuario
        $pets = Pet::where('pet_status', 'available')->with('user')->get();
        return response()->json($pets);
    }

    public function show($pet_id)
    {
        // Cargar la relación 'user' para incluir los datos del usuario
        $pet = Pet::with('user')->findOrFail($pet_id);
        return response()->json($pet);
    }

    public function update(Request $request, $pet_id)
    {
        $pet = Pet::findOrFail($pet_id);

        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Casteamos ambos IDs a entero para asegurar la comparación de tipo y valor.
        // Accedemos al ID del usuario autenticado vía user()->user_id (como en tu modelo User)
        if ((int) $request->user()->user_id !== (int) $pet->user_id) {
            Log::warning('403 Forbidden: User ID mismatch for Pet update.', [
                'authenticated_user_id' => $request->user()->user_id,
                'authenticated_user_id_type' => gettype($request->user()->user_id),
                'pet_user_id' => $pet->user_id,
                'pet_user_id_type' => gettype($pet->user_id),
            ]);
            return response()->json(['message' => 'No autorizado para editar esta mascota'], 403);
        }

        $validated = $request->validate([
            'pet_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'pet_species' => 'required|string|max:255',
            'castrated' => 'required',
            'pet_photo' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'health_condition' => 'nullable|string',
        ]);

        try {
            $pet->pet_name = $request->pet_name;
            $pet->location = $request->location;
            $pet->description = $request->description ?? '';
            $pet->pet_species = $request->pet_species;
            $pet->health_condition = $request->health_condition ?? '';
            $pet->castrated = filter_var($request->castrated, FILTER_VALIDATE_BOOLEAN);

            if ($request->hasFile('pet_photo') && $request->file('pet_photo')->isValid()) {
                $uploadedFile = $request->file('pet_photo');
                $result = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'pets',
                    'public_id' => 'pet_' . time(),
                ]);
                $pet->pet_photo = $result->getSecurePath();
            }

            $pet->save();

            return response()->json($pet);
        } catch (\Exception $e) {
            Log::error('Error al actualizar mascota: ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar la mascota'], 500);
        }
    }

    public function destroy(Request $request, $pet_id)
    {
        $pet = Pet::findOrFail($pet_id);

        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Casteamos ambos IDs a entero para asegurar la comparación de tipo y valor.
        // Accedemos al ID del usuario autenticado vía user()->user_id (como en tu modelo User)
        if ((int) $request->user()->user_id !== (int) $pet->user_id) {
            Log::warning('403 Forbidden: User ID mismatch for Pet delete.', [
                'authenticated_user_id' => $request->user()->user_id,
                'authenticated_user_id_type' => gettype($request->user()->user_id),
                'pet_user_id' => $pet->user_id,
                'pet_user_id_type' => gettype($pet->user_id),
            ]);
            return response()->json(['message' => 'No autorizado para eliminar esta mascota'], 403);
        }

        try {
            $pet->delete();
            return response()->json(['message' => 'Mascota eliminada con éxito']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar mascota: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar la mascota'], 500);
        }
    }
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react"; // Importar useEffect
import { createLostPet } from "../services/api"; // Asegúrate de NO importar setupApiClient aquí
import { petLostSchema, LostPetFormData } from "../schemas/petLostSchema";
import { RootState } from "../store/store";
import Swal from "sweetalert2"; // Para mensajes más amigables

// Validar archivo subido
const validateFile = (file: File | undefined): string | null => {
  if (!file) return null; // Archivo opcional
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return "Solo se permiten imágenes (JPEG, PNG, GIF)";
  }
  if (file.size > maxSize) {
    return "El archivo no debe exceder los 5MB";
  }
  return null;
};

const CrearMascotaPerdidaForm: React.FC = () => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth); // Obtener el usuario del estado
  const navigate = useNavigate();

  // Redirigir si el usuario no está logueado
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "No autenticado",
        text: "Debes iniciar sesión para publicar una mascota.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login"); // Redirigir al login
      });
    }
  }, [user, navigate]); // Dependencias: user y navigate

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LostPetFormData>({
    resolver: zodResolver(petLostSchema),
    defaultValues: {
      pet_name: "",
      pet_species: "",
      description: "",
      last_seen: "",
      lost_date: "",
      pet_photo: undefined,
    },
  });

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const error = validateFile(file);
    setFileError(error);
  };

  // Manejar envío del formulario
  const onSubmit = async (data: LostPetFormData) => {
    // Si el usuario no está logueado, deberíamos haber redirigido en el useEffect.
    // Esto es una doble verificación.
    if (!user) {
      setFormStatus("Error: Usuario no autenticado.");
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Por favor, inicia sesión para continuar.",
        confirmButtonText: "OK",
      });
      navigate("/login"); // Redirigir al login
      return;
    }

    if (fileError) {
      setFormStatus("Por favor, corrige los errores en el archivo.");
      Swal.fire({
        icon: "error",
        title: "Error de archivo",
        text: fileError,
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "pet_photo" &&
          value instanceof FileList &&
          Array.from(value).length > 0
        ) {
          formData.append(key, value[0]);
        } else if (value && typeof value === "string") {
          formData.append(key, value);
        }
      });

      // createLostPet usará authApi, que ya enviará las cookies automáticamente
      await createLostPet(formData);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "¡Mascota perdida publicada con éxito!",
        confirmButtonText: "OK",
      });
      reset();
      setTimeout(() => navigate("/mascotas-perdidas"), 1000); // Redirigir tras 1s
    } catch (error: any) {
      console.error("Error al crear mascota perdida:", error);
      let errorMessage = "Ocurrió un error al publicar. Intenta nuevamente.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            "No estás autorizado. Por favor, inicia sesión de nuevo.";
          navigate("/login"); // Redirigir al login si es 401
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      setFormStatus(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  // Si el usuario no está logueado y el useEffect lo ha redirigido, no renderizamos el formulario.
  // Esto evita un breve flash del formulario antes de la redirección.
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reportar Mascota Perdida</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la mascota */}
        <div>
          <label
            htmlFor="pet_name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la mascota
          </label>
          <input
            id="pet_name"
            type="text"
            {...register("pet_name")}
            placeholder="Nombre de la mascota"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.pet_name && (
            <p className="text-red-500 text-sm">{errors.pet_name.message}</p>
          )}
        </div>

        {/* Última vez vista */}
        <div>
          <label
            htmlFor="last_seen"
            className="block text-sm font-medium text-gray-700"
          >
            Última vez vista
          </label>
          <input
            id="last_seen"
            type="text"
            {...register("last_seen")}
            placeholder="Ej: Parque Central, Buenos Aires"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.last_seen && (
            <p className="text-red-500 text-sm">{errors.last_seen.message}</p>
          )}
        </div>

        {/* Fecha de pérdida */}
        <div>
          <label
            htmlFor="lost_date"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de pérdida
          </label>
          <input
            id="lost_date"
            type="date"
            {...register("lost_date")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.lost_date && (
            <p className="text-red-500 text-sm">{errors.lost_date.message}</p>
          )}
        </div>

        {/* Especie */}
        <div>
          <label
            htmlFor="pet_species"
            className="block text-sm font-medium text-gray-700"
          >
            Especie
          </label>
          <input
            id="pet_species"
            type="text"
            {...register("pet_species")}
            placeholder="Ej: Perro, Gato"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.pet_species && (
            <p className="text-red-500 text-sm">{errors.pet_species.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Describe características o detalles adicionales"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Foto de la mascota */}
        <div>
          <label
            htmlFor="pet_photo"
            className="block text-sm font-medium text-gray-700"
          >
            Foto de la mascota (opcional)
          </label>
          <input
            id="pet_photo"
            type="file"
            accept="image/*"
            {...register("pet_photo")}
            onChange={handleFileChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
          {errors.pet_photo && (
            <p className="text-red-500 text-sm">{errors.pet_photo.message}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting || !!fileError}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>

      {/* Mensaje de estado */}
      {formStatus && (
        <p
          className={`mt-4 text-center ${
            formStatus.includes("éxito") ? "text-green-500" : "text-red-500"
          }`}
        >
          {formStatus}
        </p>
      )}
    </div>
  );
};

export default CrearMascotaPerdidaForm;

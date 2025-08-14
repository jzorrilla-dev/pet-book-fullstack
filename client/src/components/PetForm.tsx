import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mascotaSchema, MascotaFormData } from "../schemas/mascotaSchema";

interface PetFormProps {
  onSubmit: (data: MascotaFormData, file?: File) => Promise<void>;
  initialValues?: Partial<MascotaFormData>;
  submitButtonText: string;
  isSubmitting: boolean;
  fileError: string | null;
  onFileChange: (file: File | undefined) => void;
  selectedFile?: File;
}

const PetForm: React.FC<PetFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText,
  isSubmitting,
  fileError,
  onFileChange,
  selectedFile,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MascotaFormData>({
    resolver: zodResolver(mascotaSchema),
    defaultValues: initialValues,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
      className="space-y-4"
      encType="multipart/form-data"
    >
      <div>
        <label
          htmlFor="pet_name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          id="pet_name"
          type="text"
          {...register("pet_name")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.pet_name && (
          <p className="text-red-500 text-sm">{errors.pet_name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Ubicación
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción (opcional)
        </label>
        <input
          id="description"
          type="text"
          {...register("description")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.pet_species && (
          <p className="text-red-500 text-sm">{errors.pet_species.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="health_condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condición de salud (opcional)
        </label>
        <input
          id="health_condition"
          type="text"
          {...register("health_condition")}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.health_condition && (
          <p className="text-red-500 text-sm">
            {errors.health_condition.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="castrated"
          className="block text-sm font-medium text-gray-700"
        >
          ¿Castrado?
        </label>
        <input
          id="castrated"
          type="checkbox"
          {...register("castrated")}
          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        {errors.castrated && (
          <p className="text-red-500 text-sm">{errors.castrated.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="pet_photo"
          className="block text-sm font-medium text-gray-700"
        >
          Foto (opcional)
        </label>
        <input
          id="pet_photo"
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0])}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
        {selectedFile && (
          <p className="text-green-500 text-sm mt-1">
            Archivo seleccionado: {selectedFile.name}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !!fileError}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default PetForm;

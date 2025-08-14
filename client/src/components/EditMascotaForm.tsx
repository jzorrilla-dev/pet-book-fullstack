import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updatePet, getPetById } from "../services/api";
import { MascotaFormData } from "../schemas/mascotaSchema";
import PetForm from "./PetForm";
import { useNavigate } from "react-router-dom";

interface EditMascotaFormProps {
  petId: string;
}

const EditMascotaForm: React.FC<EditMascotaFormProps> = ({ petId }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<MascotaFormData>>(
    {}
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const validateFile = useCallback(
    (file: File | undefined): boolean => {
      if (!file) return true;
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        setFileError("Solo se permiten imágenes JPG, PNG o GIF");
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFileError("La imagen debe ser menor a 2MB");
        return false;
      }
      setFileError(null);
      return true;
    },
    [setFileError]
  );

  const handleFileChange = (file: File | undefined) => {
    setSelectedFile(file);
    validateFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data: MascotaFormData, file?: File) => {
    if (!user) {
      alert("Debes estar autenticado para editar una mascota");
      return;
    }
    if (!validateFile(file)) {
      return;
    }
    setApiError(null);
    setIsSubmitting(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("pet_name", data.pet_name);
    formData.append("location", data.location);
    if (data.description) formData.append("description", data.description);
    formData.append("pet_species", data.pet_species);
    if (data.health_condition)
      formData.append("health_condition", data.health_condition);
    formData.append("castrated", data.castrated ? "1" : "0");
    if (file) formData.append("pet_photo", file);

    try {
      await updatePet(Number(petId), formData);
      setIsSubmitting(false);
      setLoading(false);
      setSelectedFile(undefined);
      setPreviewImage(null);
      setCurrentImage(null);
      alert("¡Mascota actualizada con éxito!");
      navigate("/mascotas");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al actualizar la mascota";
      setApiError(errorMsg);
      console.error("Error al actualizar la mascota", error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const res = await getPetById(Number(petId));
        const pet = res.data;
        setInitialValues({
          pet_name: pet.pet_name,
          location: pet.location,
          description: pet.description || "",
          pet_species: pet.pet_species,
          health_condition: pet.health_condition || "",
          castrated: !!pet.castrated,
        });
        setCurrentImage(pet.pet_photo);
      } catch (error) {
        setApiError("Error al cargar la mascota");
        console.error("Error al cargar la mascota", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && petId) {
      fetchPet();
    }
  }, [petId, user]);

  if (!user) {
    return (
      <p className="text-center text-red-500">
        Por favor, inicia sesión para editar una mascota.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Mascota</h2>
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {apiError}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {currentImage && !previewImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Foto actual:</p>
              <img
                src={currentImage}
                alt="Foto actual"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
          {previewImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Vista previa:</p>
              <img
                src={previewImage}
                alt="Vista previa"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
          <PetForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitButtonText="Guardar Cambios"
            isSubmitting={isSubmitting}
            fileError={fileError}
            onFileChange={handleFileChange}
            selectedFile={selectedFile}
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => navigate("/mascotas")}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditMascotaForm;

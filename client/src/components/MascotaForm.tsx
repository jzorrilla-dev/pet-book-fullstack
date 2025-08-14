import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { createPet } from "../services/api";
import { MascotaFormData } from "../schemas/mascotaSchema";
import PetForm from "./PetForm"; // Importa el componente reutilizable

const MascotaForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

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
  };

  const onSubmit = async (data: MascotaFormData, file?: File) => {
    if (!user) {
      alert("Debes estar autenticado para publicar una mascota");
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setIsSubmitting(true);
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
      const response = await createPet(formData);
      console.log("Mascota creada:", response.data);
      setIsSubmitting(false);
      setSelectedFile(undefined);
      setFileError(null);
      alert("¡Mascota publicada con éxito!");
    } catch (error: any) {
      console.error("Error al crear mascota:", error);
      setIsSubmitting(false);
      const errorMsg =
        error.response?.data?.message || "Hubo un error al publicar la mascota";
      alert(errorMsg);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500">
        Por favor, inicia sesión para publicar una mascota.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Publicar Mascota en Adopción
      </h2>
      <PetForm
        onSubmit={onSubmit}
        submitButtonText="Publicar Mascota"
        isSubmitting={isSubmitting}
        fileError={fileError}
        onFileChange={handleFileChange}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default MascotaForm;

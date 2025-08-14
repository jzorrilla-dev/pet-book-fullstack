import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPetById, deletePet } from "../services/api";
import { Pet } from "../Types/Pet"; // Asegúrate de que Pet ahora incluye la relación User

interface MascotaDetalleProps {
  pet?: Pet;
  isPreview?: boolean;
}

const MascotaDetalle: React.FC<MascotaDetalleProps> = ({
  pet,
  isPreview = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<Pet | null>(pet || null);
  const [loading, setLoading] = useState(!isPreview);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPreview || !id) return;

    const fetchMascota = async () => {
      try {
        const response = await getPetById(Number(id));
        setMascota(response.data);
      } catch (err: any) {
        console.error("Error al cargar los datos de la mascota:", err);
        if (err.response && err.response.status === 401) {
          setError("No estás autenticado para ver esta información.");
        } else {
          setError(err.message || "Error al cargar los datos de la mascota.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMascota();
  }, [id, isPreview]);

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta mascota?")) {
      try {
        await deletePet(Number(id!));
        navigate("/mascotas");
      } catch (err: any) {
        console.error("Error al eliminar la mascota:", err);
        alert(err.response?.data?.message || "No se pudo eliminar la mascota.");
      }
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Cargando...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!mascota)
    return <p className="p-4 text-gray-600">Mascota no encontrada</p>;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        isPreview
          ? "bg-white max-w-sm mx-auto"
          : "max-w-xl mx-auto border bg-gray-50"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {mascota.pet_name}
      </h2>
      {mascota.pet_photo && (
        <Link to={isPreview ? "/mascotas" : `/mascotas/${mascota.pet_id}`}>
          <img
            src={mascota.pet_photo}
            alt={mascota.pet_name}
            className="w-full h-64 object-cover rounded-lg mb-4 hover:opacity-90 transition-opacity"
          />
        </Link>
      )}
      <p className="text-gray-700">
        <strong>Especie:</strong> {mascota.pet_species}
      </p>
      <p className="text-gray-700">
        <strong>Ubicación:</strong> {mascota.location}
      </p>
      {isPreview ? (
        <p className="text-gray-600 mt-2 truncate">
          {mascota.description || "Conoce más sobre esta adorable mascota."}
        </p>
      ) : (
        <>
          <p className="text-gray-700">
            <strong>Estado:</strong> {mascota.pet_status}
          </p>
          {mascota.description && (
            <p className="text-gray-700 mt-2">
              <strong>Descripción:</strong> {mascota.description}
            </p>
          )}
          {mascota.health_condition && (
            <p className="text-gray-700">
              <strong>Salud:</strong> {mascota.health_condition}
            </p>
          )}
          <p className="text-gray-700">
            <strong>Castrado:</strong> {mascota.castrated ? "Sí" : "No"}
          </p>
          {/* --- ¡AÑADE ESTO PARA MOSTRAR EL TELÉFONO! --- */}
          {mascota.user && mascota.user.user_phone && (
            <p className="text-gray-700">
              <strong>Teléfono de Contacto:</strong> {mascota.user.user_phone}
            </p>
          )}
          {/* --- FIN DE LA ADICIÓN --- */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate(`/mascotas/${mascota.pet_id}/editar`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MascotaDetalle;

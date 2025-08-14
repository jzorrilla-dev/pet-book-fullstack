// MascotaPerdidaList.tsx
import { useEffect, useState } from "react";
import { getLostPets } from "../services/api";

import { AxiosError } from "axios";

type LostPet = {
  id: number;
  pet_name?: string;
  pet_species: string;
  last_seen?: string;
  lost_date?: string;
  pet_photo?: string;
  description?: string;
  user?: {
    user_name: string;
    user_phone: string;
  };
};

export default function MascotaPerdidaList() {
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<LostPet | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getLostPets();
        console.log("Mascotas perdidas:", data);

        // **¡MODIFICACIÓN CLAVE AQUÍ!**
        // Asegúrate de que 'data' (que es response.data de Axios) es un array.
        // Si no lo es, usa un array vacío para evitar el TypeError.
        const fetchedLostPets: LostPet[] = Array.isArray(data) ? data : [];
        setLostPets(fetchedLostPets); // Asigna el array validado al estado
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          setError(
            "No estás autorizado para ver las mascotas perdidas. Por favor, inicia sesión."
          );
        } else {
          setError(
            "Error al cargar las mascotas perdidas. Por favor, intenta de nuevo."
          );
        }
        console.error("Error al cargar las mascotas perdidas", axiosError);
        // En caso de error, también es buena práctica resetear la lista a un array vacío
        setLostPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDetails = (pet: LostPet) => {
    setSelectedPet(pet);
  };

  const closeDetails = () => {
    setSelectedPet(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Mascotas Perdidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {lostPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            {pet.pet_photo && (
              <img
                src={pet.pet_photo}
                alt={pet.pet_name || "Mascota"}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="font-bold text-lg text-gray-800">
              {pet.pet_name || "Mascota sin nombre"}
            </h3>
            <p className="text-gray-600">Especie: {pet.pet_species}</p>
            <p className="text-gray-600">
              Última vez vista: {pet.last_seen || "No especificado"}
            </p>
            <button
              onClick={() => openDetails(pet)}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Ver Detalles
            </button>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeDetails}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedPet.pet_name || "Mascota sin nombre"}
            </h3>
            {selectedPet.pet_photo && (
              <img
                src={selectedPet.pet_photo}
                alt={selectedPet.pet_name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-700">
              <span className="font-semibold">Especie:</span>{" "}
              {selectedPet.pet_species}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Última vez vista:</span>{" "}
              {selectedPet.last_seen || "No especificado"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Fecha de pérdida:</span>{" "}
              {selectedPet.lost_date || "No especificado"}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Descripción:</span>{" "}
              {selectedPet.description || "Sin descripción"}
            </p>
            {selectedPet.user && (
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Publicado por:</span>{" "}
                  {selectedPet.user.user_name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  <a
                    href={`tel:${selectedPet.user.user_phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedPet.user.user_phone}
                  </a>
                </p>
                <p className="text-gray-700"></p>
              </div>
            )}
            <button
              onClick={closeDetails}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

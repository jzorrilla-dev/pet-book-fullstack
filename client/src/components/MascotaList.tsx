// MascotaList.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMascotas } from "../store/mascotaSlice";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import { Pet } from "../Types/Pet"; // Asegúrate de que la ruta sea correcta

export default function MascotaList() {
  const dispatch = useDispatch<AppDispatch>();
  // Asegúrate de que el selector apunta a 'mascotas' y no a 'pets' si el slice se llama 'mascota'
  const { mascotas, loading, error } = useSelector(
    (state: RootState) => state.mascota
  ); // <-- Verifica este selector

  useEffect(() => {
    dispatch(fetchMascotas()); // <-- Despacha el thunk
  }, [dispatch]); // Asegúrate de incluir dispatch en las dependencias

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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mascotas en Adopción</h2>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && mascotas.length === 0 && (
        <p className="text-gray-500">No hay mascotas disponibles</p>
      )}

      {/* Solo renderiza la tabla si hay mascotas y no está cargando ni hay error */}
      {!loading && !error && mascotas.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Foto</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Especie</th>
              <th className="border p-2">Ubicación</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* 'mascotas' está garantizado de ser un array aquí */}
            {mascotas.map((mascota: Pet) => (
              <tr key={mascota.pet_id} className="text-center">
                <td className="border p-2">
                  {mascota.pet_photo ? (
                    <img
                      src={mascota.pet_photo}
                      alt={mascota.pet_name}
                      className="h-16 w-16 object-cover mx-auto"
                    />
                  ) : (
                    "Sin foto"
                  )}
                </td>
                <td className="border p-2">{mascota.pet_name}</td>
                <td className="border p-2">{mascota.pet_species}</td>
                <td className="border p-2">{mascota.location}</td>
                <td className="border p-2">{mascota.pet_status}</td>
                <td className="border p-2">
                  <Link
                    to={`/mascotas/${mascota.pet_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

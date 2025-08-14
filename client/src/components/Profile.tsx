import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserById } from "../services/api";
import { RootState } from "../store/store";
import { useParams } from "react-router-dom";
import { User } from "../Types/User";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [userData, setUserData] = useState<User | null>(null); // Usa la interfaz User
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // debugger; // Eliminar o comentar después de depurar

    const fetchUser = async () => {
      if (!id) {
        console.warn("ID de usuario no encontrado en la URL.");
        setError(
          "No se pudo cargar la información del usuario: ID no proporcionado."
        );
        setLoading(false);
        return;
      }

      try {
        const userIdAsNumber = Number(id);
        if (isNaN(userIdAsNumber)) {
          console.error("ID de usuario inválido (NaN):", id);
          setError(
            "No se pudo cargar la información del usuario: ID inválido."
          );
          setLoading(false);
          return;
        }

        const response = await getUserById(userIdAsNumber);
        setUserData(response.data.user); // Asegúrate de que la respuesta tenga la estructura correcta (ej. { user: {...} })
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  if (userData && user.user_id !== userData.user_id) {
    // Accede directamente a user_id
    console.warn("Intento de acceso a perfil no autorizado.");
    return <Navigate to="/" />;
  }
  if (!userData) {
    return <div>Error: Datos de usuario no disponibles.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{userData.user_name}</h2>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {userData.user_phone}
        </p>
        <p>
          <strong>Ciudad:</strong> {userData.city}
        </p>
        <p>
          <strong>Descripción:</strong>{" "}
          {userData.description || "No disponible"}
        </p>
        <p>
          <strong>Registrado el:</strong>{" "}
          {new Date(userData.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;

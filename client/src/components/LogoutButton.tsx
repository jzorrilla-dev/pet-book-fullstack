// src/components/LogoutButton.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/api"; // Tu instancia de Axios para la petición a /logout
import { logout as reduxLogoutAction } from "../store/authSlice"; // Acción de Redux
import { toast } from "react-toastify";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm("¿Estás seguro de que quieres cerrar sesión?")) return;

    setIsLoading(true);
    try {
      // Petición POST a Laravel para invalidar la sesión y la cookie.
      await logout();

      // Despacha la acción de Redux para limpiar el estado del frontend.
      dispatch(reduxLogoutAction());
      toast.success("¡Sesión cerrada exitosamente!");
      navigate("/login"); // Redirige al login
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      const errorMessage =
        error.response?.status === 401
          ? "Sesión no válida o ya expirada. Por favor, inicia sesión nuevamente."
          : "Hubo un error al cerrar la sesión.";
      toast.error(errorMessage);
      // Incluso si hay un error del lado del backend (ej. 401 si la sesión ya expiró),
      // forzamos el logout en el frontend para mantener la consistencia del UI.
      dispatch(reduxLogoutAction());
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out focus:ring-2 focus:ring-red-500 focus:outline-none ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Cerrar sesión"
    >
      {isLoading ? "Cerrando..." : "Cerrar Sesión"}
    </button>
  );
};

export default LogoutButton;

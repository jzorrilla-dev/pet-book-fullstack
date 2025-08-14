// src/components/Layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LogoutButton from "../LogoutButton";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const currentUserId = user?.user_id;
  const isUserIdValid =
    typeof currentUserId === "number" && !isNaN(currentUserId);

  return (
    <nav className="bg-gray-800 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Botón de menú hamburguesa para abrir el sidebar */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-2 mr-4"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">
              Adopta una Mascota
            </Link>
          </div>

          {/* Botón de autenticación (cambia según el token) */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="text-sm font-medium">Cargando...</div>
            ) : user ? (
              <>
                <LogoutButton />
                {isUserIdValid && (
                  <Link
                    to={`/perfil/${currentUserId}`}
                    onClick={toggleSidebar}
                    className="ml-4 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hidden md:block"
                  >
                    Mi Perfil
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

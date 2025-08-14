import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LogoutButton from "../LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const currentUserId = user?.user_id;
  const isUserIdValid =
    typeof currentUserId === "number" && !isNaN(currentUserId);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-40`}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
        Menú
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none md:hidden"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        {/* Enlaces siempre visibles */}
        <Link
          to="/"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          Inicio
        </Link>
        <Link
          to="/mascotas"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          Mascotas en Adopción
        </Link>
        <Link
          to="/mascotas_perdidas"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          Mascotas Perdidas
        </Link>

        {/* Enlaces solo para usuarios logueados */}
        {user && (
          <>
            <Link
              to="/crear_mascotas"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              Registrar Mascota (Adopción)
            </Link>
            <Link
              to="/crear_mascotas_perdidas"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              Publicar Mascota Perdida
            </Link>
            {isUserIdValid && (
              <Link
                to={`/perfil/${currentUserId}`}
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                Ver Perfil
              </Link>
            )}
          </>
        )}

        {/* Enlaces siempre visibles */}
        <Link
          to="/sobre-nosotros"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          Sobre Nosotros
        </Link>
        <Link
          to="/contacto"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          Contacto
        </Link>

        {/* Botón de Iniciar Sesión / Cerrar Sesión */}
        {!user ? (
          <Link
            to="/login"
            className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 mt-4 mx-4 rounded-md text-sm font-medium"
            onClick={toggleSidebar}
          >
            Iniciar Sesión
          </Link>
        ) : (
          <div className="px-4 py-2 mt-4">
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}

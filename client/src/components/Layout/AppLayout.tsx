import { useState, ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar minimalista que solo tiene el botón de hamburguesa */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay/Capa oscura cuando el sidebar está abierto (solo en móviles) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" // z-index para que esté debajo del sidebar pero encima del contenido
          onClick={toggleSidebar} // Cierra el sidebar al hacer clic fuera
        ></div>
      )}

      {/* Contenido principal de la aplicación */}
      <main
        className={`flex-grow transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "md:ml-64" : "md:ml-0"} `} // Empuja el contenido en desktop si el sidebar está abierto
      >
        {/* Tu ToastContainer se queda aquí, ya que es parte del layout global */}
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children} {/* Aquí se renderizarán tus rutas */}
        </div>
      </main>
    </div>
  );
}

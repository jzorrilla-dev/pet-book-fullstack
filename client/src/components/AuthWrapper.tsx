// src/components/AuthWrapper.tsx
import React from "react";
import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth"; // Tu hook useAuth
import AppLayout from "./Layout/AppLayout"; // Tu componente AppLayout
import { Routes, Route } from "react-router-dom"; // Para tus rutas

// Importa tus componentes de página aquí también, ya que se usarán en las rutas
import Home from "./Home";
import MascotaList from "./MascotaList";
import LoginForm from "./LoginForm";
import RegistroUsuario from "./RegistroUsuario";
import MascotaForm from "./MascotaForm";
import MascotaDetalle from "./MascotaDetalle";
import EditMascotaForm from "./EditMascotaForm";
import CrearMascotaPerdidaForm from "./MascotaPerdidaForm";
import ListaMascotasPerdidas from "./MascotaPerdidaList";
import SobreNosotros from "./SobreNosotros";
import Contacto from "./Contacto";
import Profile from "./Profile";
import { useParams, Navigate } from "react-router-dom"; // Para ProtectedRoute y EditMascotaWrapper
import ForgotPassword from "./ForgotPassword"; // Componente de recuperación de contraseña
import ResetPassword from "./ResetPassword"; // Componente de restablecimiento de contraseña
// Componente para rutas no encontradas (404) - Mantenlo aquí o impórtalo si lo tienes en otro archivo

const NotFound: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 className="text-2xl font-bold text-gray-800">
      404 - Página no encontrada
    </h2>
    <p className="mt-2 text-gray-600">
      Lo sentimos, la página que buscas no existe.
    </p>
    <a href="/" className="text-blue-600 hover:underline">
      Volver al inicio
    </a>
  </div>
);

// Componente wrapper para acceder al parámetro 'id' de la ruta de edición - Mantenlo aquí
const EditMascotaWrapper: React.FC = () => {
  const { id } = useParams();
  if (!id) {
    return <Navigate to="/mascotas" />;
  }
  return <EditMascotaForm petId={id} />;
};

// Componente para rutas protegidas - Mantenlo aquí
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(); // useAuth se llama aquí, dentro del Router
  const isAuthenticated = !!user;

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AuthWrapper: React.FC = () => {
  // Ahora useAuth() se llama DENTRO del contexto del Router

  // Puedes usar user y isLoading aquí si necesitas lógica de carga global
  // Por ejemplo, un spinner global mientras isLoading es true

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mascotas" element={<MascotaList />} />
        <Route path="/mascotas/:id" element={<MascotaDetalle />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recuperar-contraseña" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/perfil/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear_mascotas"
          element={
            <ProtectedRoute>
              <MascotaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mascotas/:id/editar"
          element={
            <ProtectedRoute>
              <EditMascotaWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear_mascotas_perdidas"
          element={
            <ProtectedRoute>
              <CrearMascotaPerdidaForm />
            </ProtectedRoute>
          }
        />
        <Route path="/mascotas_perdidas" element={<ListaMascotasPerdidas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default AuthWrapper;

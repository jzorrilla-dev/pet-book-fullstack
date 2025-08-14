import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  logout,
  setLoading,
  setError,
} from "../store/authSlice";
import { getUser } from "../services/api";
import { RootState, AppDispatch } from "../store/store";
import { AxiosError } from "axios";
import { useLocation } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const restoreUser = async () => {
      // Define las rutas que NO requieren autenticación para funcionar.
      // Usa .startsWith() para manejar rutas base y sus subrutas (ej. /mascotas y /mascotas/1)
      const publicPaths = [
        "/login",
        "/registro",
        "/",
        "/mascotas", // Esto cubrirá /mascotas y /mascotas/:id si no hay un /mascotas_perdidas/:id que empiece igual
        "/mascotas_perdidas",
        "/sobre-nosotros",
        "/contacto",
      ];

      // Verifica si la ruta actual comienza con alguna de las rutas públicas
      const isPublicRoute = publicPaths.some((path) =>
        location.pathname.startsWith(path)
      );

      // Solo intenta restaurar el usuario si NO hay usuario Y NO estamos cargando
      // Y la ruta actual NO es una ruta pública
      if (!user && !isLoading && !isPublicRoute) {
        dispatch(setLoading(true));
        try {
          const response = await getUser();

          // Asumiendo que response.data es el objeto User directo
          dispatch(setCredentials({ user: response.data }));
        } catch (error: unknown) {
          console.error("useAuth: Error en getUser:", error);
          const axiosError = error as AxiosError;
          if (
            axiosError.response &&
            (axiosError.response.status === 401 ||
              axiosError.response.status === 419)
          ) {
            dispatch(logout());
          } else {
            console.error(
              "useAuth: Error inesperado al verificar la sesión:",
              axiosError
            );
            dispatch(setError("Error al verificar la sesión."));
            dispatch(logout());
          }
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        console.log(
          "useAuth: No se intenta restaurar el usuario (ya logueado, cargando, o en ruta pública)."
        );
        if (isLoading && user) {
          dispatch(setLoading(false));
        }
      }
    };
    restoreUser();
  }, [dispatch, user, isLoading, location.pathname]);

  return { user, isAuthenticated: !!user, isLoading };
};

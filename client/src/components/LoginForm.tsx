import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
// Importamos la acción `login` y el estado del slice de autenticación
import { login } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store"; // Para tipado de Redux
import { Link, useNavigate } from "react-router-dom"; // Eliminamos `useLocation`

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Obtenemos el estado de autenticación de Redux
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showpassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // useEffect para redirigir si el usuario ya está autenticado
  // Este useEffect es mucho más simple ahora.
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirige a la página principal o dashboard
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // La acción `login` de Redux Thunk ya maneja:
      // 1. Obtener el token CSRF (si es necesario y no se hizo globalmente).
      // 2. Realizar la petición POST /login.
      // 3. Realizar la petición GET /user.
      // 4. Actualizar el estado de Redux (`user`, `isLoading`, `error`).
      // 5. Mostrar toasts de éxito/error.
      await dispatch(login(data)).unwrap(); // `.unwrap()` para que `try/catch` funcione
      reset(); // Limpia el formulario al éxito
      // La navegación es manejada por el `useEffect` de arriba
    } catch (err: any) {
      // Los errores ya se manejan y se muestran con `toast` dentro del thunk (`authSlice.ts`),
      // y se guardan en el estado `error` de Redux.
      // Aquí, solo reiniciamos la contraseña por seguridad si el login falla.
      reset({ email: data.email, password: "" });
      // Si quieres mostrar un toast adicional aquí para ciertos errores, podrías.
      // Pero el thunk ya debería haberlo cubierto.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        {/* Mostramos el error si existe en el estado de Redux */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading} // Deshabilitar mientras carga
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type={showpassword ? "text" : "password"}
              {...register("password")}
              className="mt-1 block w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading} // Deshabilitar mientras carga
              value={undefined} // Aseguramos que el valor no esté definido para evitar problemas de controlado/no controlado
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showpassword}
                onChange={togglePasswordVisibility}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Mostrar contraseña
              </label>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Deshabilitar el botón durante la carga
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          <Link
            to="/recuperar-contraseña" // <-- Nuevo enlace para la recuperación
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </form>
        <div className="mt-4 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

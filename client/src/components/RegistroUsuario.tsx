import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register } from "../services/api"; // Elimina getUser de aquí
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Esquema de validación con Zod alineado al backend
const registerSchema = z
  .object({
    user_name: z.string().min(1, "El nombre es obligatorio"),
    user_phone: z.string().min(1, "El teléfono es obligatorio"),
    city: z.string().min(1, "La ciudad es obligatoria"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    password_confirmation: z.string().min(8, "Mínimo 8 caracteres"),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["password_confirmation"],
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegistroUsuario: React.FC = () => {
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [mensaje, setMensaje] = useState("");

  const onSubmit = async (data: RegisterFormData) => {
    setMensaje("");
    try {
      await register(data); // Solo la petición de registro

      // --- ¡ELIMINADAS LAS LÍNEAS DE getUser() Y setCredentials() AQUÍ! ---
      // Después de un registro exitoso, redirigimos al usuario a la página de login.
      // La autenticación se manejará cuando el usuario inicie sesión.

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Usuario registrado con éxito. Ahora puedes iniciar sesión.",
        confirmButtonText: "OK",
      });

      reset(); // Limpiar el formulario
      navigate("/login"); // Redirige al usuario a la página de login
    } catch (error: any) {
      console.error(
        "Error al registrar usuario:",
        error.response?.data || error.message
      );

      let errorMsg = "Error al registrar usuario. Intenta de nuevo.";
      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          errorMsg = Object.values(error.response.data.errors).flat().join(" ");
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMsg = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      setMensaje(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Error de Registro",
        text: errorMsg,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Registro de Usuario
      </h2>

      {mensaje && (
        <p
          className={`mb-4 text-center p-2 rounded-md ${
            mensaje.includes("éxito")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="user_name"
            className="block mb-1 font-semibold text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="user_name"
            {...formRegister("user_name")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.user_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.user_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="user_phone"
            className="block mb-1 font-semibold text-gray-700"
          >
            Teléfono
          </label>
          <input
            type="text"
            id="user_phone"
            {...formRegister("user_phone")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.user_phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.user_phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block mb-1 font-semibold text-gray-700"
          >
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            {...formRegister("city")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-semibold text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            {...formRegister("email")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-semibold text-gray-700"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...formRegister("password")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password_confirmation"
            className="block mb-1 font-semibold text-gray-700"
          >
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="password_confirmation"
            {...formRegister("password_confirmation")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 font-semibold text-gray-700"
          >
            Descripción (opcional)
          </label>
          <input
            type="text"
            id="description"
            {...formRegister("description")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Registrarse
        </button>
        <div>
          <p className="text-sm text-gray-600 text-center mt-4">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistroUsuario;

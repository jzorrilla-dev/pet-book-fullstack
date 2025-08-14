import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { recoverPassword } from "../services/api"; // Asegúrate de que la ruta sea correcta

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await recoverPassword(email);
      setMessage(
        response.data.message ||
          "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico."
      );
      toast.success("¡Revisa tu correo!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Hubo un error al procesar tu solicitud.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace
          para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-2"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        </form>
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Éxito:</strong>
            <span className="block sm:inline ml-2">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

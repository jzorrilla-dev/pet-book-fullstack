import axios from "axios";
import { Pet } from "../Types/Pet";
import { ResetPasswordCredentials } from "../Types/User";

// Importa y usa la variable de entorno para la URL de la API.
const BASE_URL = process.env.REACT_APP_API_URL || "/";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Petición para obtener el token CSRF.
export const getCsrfToken = async () => {
  await api.get("/api/sanctum/csrf-cookie");
};

// Rutas de autenticación
export const login = (credentials: { email: string; password: string }) => {
  return api.post("/api/login", credentials);
};

export const register = (data: {
  user_name: string;
  user_phone: string;
  city: string;
  email: string;
  password: string;
  description?: string;
}) => {
  return api.post("/api/register", data);
};

// --- ¡LA CORRECCIÓN CLAVE AQUÍ! ---
// Hacemos la URL de getUser explícita para asegurar que siempre vaya al proxy
export const getUser = () => {
  // Aseguramos que la URL siempre comience con /api/
  return api.get("/api/user");
};

export const getUserById = (user_id: number) => api.get(`/api/user/${user_id}`);
export const logout = () => api.post("/api/logout");
export const createPet = (data: FormData) =>
  api.post("/api/pets", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const recoverPassword = (email: string) =>
  api.post("/api/forgot-password", { email });

// Nueva función para enviar la solicitud de restablecimiento de contraseña
export const resetPassword = (credentials: ResetPasswordCredentials) =>
  api.post("/api/reset-password", credentials); // Esta es la ruta por defecto de Laravel

export const getPets = async (): Promise<Pet[]> => {
  try {
    const response = await api.get<Pet[]>("/api/pets");
    return response.data;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

export const getPetById = (pet_id: number) => api.get(`/api/pets/${pet_id}`);
export const deletePet = async (id: number) => {
  return await api.delete(`/api/pets/${id}`);
};
export const updatePet = (pet_id: number, data: FormData) =>
  api.post(`/api/pets/${pet_id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createLostPet = (data: FormData) =>
  api.post("/api/lostpets", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getLostPets = () => api.get("/api/lostpets");
export const getLostPetById = (lostpet_id: number) =>
  api.get(`/api/lostpets/${lostpet_id}`);
export const deleteLostPet = async (id: number) => {
  return await api.delete(`/api/lostpets/${id}`);
};
export const updateLostPet = (lostpet_id: number, data: FormData) =>
  api.post(`/api/lostpets/${lostpet_id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const handleTestSession = async () => {
  // ... tu lógica ...
};

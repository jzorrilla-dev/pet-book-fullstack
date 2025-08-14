// src/Types/User.ts

// Interfaz para representar un usuario completo obtenido del backend
export interface User {
  user_id: number;
  user_name: string;
  user_phone: string;
  city: string;
  email: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Interfaz para los datos que se envían al API para iniciar sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz para los datos que se envían al API para registrar un nuevo usuario
export interface NewUser {
  user_name: string;
  user_phone: string;
  city: string;
  email: string;
  password: string;
}

// Interfaz para los datos que se envían al API para solicitar un enlace de recuperación
export interface RecoverPasswordCredentials {
  email: string;
}

// Interfaz para los datos que se envían al API para restablecer la contraseña
export interface ResetPasswordCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

import { User } from './User';

export interface Pet {
  pet_id: number;
  user_id: number;
  pet_name: string;
  location: string;
  pet_species: string;
  castrated: boolean;
  pet_photo: string | null; // <-- CAMBIO AQUÍ: Aceptar null
  description: string | null; // <-- CAMBIO AQUÍ: Aceptar null
  health_condition: string | null; // <-- CAMBIO AQUÍ: Aceptar null
  pet_status: string;
  created_at: string;
  updated_at: string;
  user?: User; // La relación user es opcional y puede ser undefined si no se carga
}
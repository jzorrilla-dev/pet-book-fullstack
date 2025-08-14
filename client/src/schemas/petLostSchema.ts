import * as z from "zod";

export const petLostSchema = z.object({
  pet_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_seen: z.string().min(5, "Ingresa un lugar válido"),
  lost_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha válida"),
  pet_species: z.string().min(3, "Ingresa una especie válida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  pet_photo: z.instanceof(FileList).optional(),
});

export type LostPetFormData = z.infer<typeof petLostSchema>;
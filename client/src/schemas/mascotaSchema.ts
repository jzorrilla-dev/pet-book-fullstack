import { z } from "zod";

export const mascotaSchema = z.object({
  pet_name: z.string().min(1, "El nombre es obligatorio"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  description: z.string().optional(),
  pet_species: z.string().min(1, "La especie es obligatoria"),
  health_condition: z.string().optional(),
  castrated: z.boolean({ required_error: "Debes indicar si está castrado" }),
});

export type MascotaFormData = z.infer<typeof mascotaSchema>;

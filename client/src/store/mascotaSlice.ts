import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getPets } from "../services/api"; // Tu función getPets, que ahora devuelve un Promise<Pet[]>
import { Pet } from "../Types/Pet"; // Importa la interfaz Pet desde el archivo de tipos

interface MascotaState {
  mascotas: Pet[];
  loading: boolean;
  error: string | null;
}

const initialState: MascotaState = {
  mascotas: [],
  loading: false,
  error: null,
};

// --- PASO 1: Crear el Async Thunk para obtener las mascotas ---
export const fetchMascotas = createAsyncThunk<Pet[]>( // El tipo del payload esperado es Pet[]
  "mascota/fetchMascotas", // Nombre de la acción async (sliceName/actionName)
  async (_, { rejectWithValue }) => {
    try {
      const mascotasArray = await getPets(); // getPets() AHORA DEVUELVE DIRECTAMENTE EL ARRAY
      return mascotasArray; // <--- ¡LA CORRECCIÓN ESTÁ AQUÍ! Devuelve directamente el array
    } catch (err: any) {
      // Puedes adaptar el mensaje de error según la respuesta de Axios
      return rejectWithValue(
        err.response?.data?.message ||
          "Error desconocido al cargar las mascotas."
      );
    }
  }
);

const mascotaSlice = createSlice({
  name: "mascota",
  initialState,
  reducers: {
    // Reducers síncronos (se mantienen si los usas para otras cosas)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMascotas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMascotas.fulfilled,
        (state, action: PayloadAction<Pet[]>) => {
          state.loading = false;
          state.mascotas = action.payload;
          console.log(
            "Redux: Mascotas cargadas y actualizadas en el store:",
            action.payload
          );
        }
      )
      .addCase(fetchMascotas.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Fallo al cargar mascotas";
        state.mascotas = [];
        console.error("Redux: Error al cargar mascotas:", state.error);
      });
  },
});

export default mascotaSlice.reducer;

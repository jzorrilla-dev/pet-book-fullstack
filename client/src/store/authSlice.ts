import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login as apiLogin, getUser, getCsrfToken } from "../services/api";
import { User } from "../Types/User";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await getCsrfToken();
    await apiLogin(credentials);

    const userResponse = await getUser();

    // --- ¡LA CORRECCIÓN CLAVE ESTÁ AQUÍ! ---
    // Basado en el payload que me mostraste de Redux DevTools, userResponse.data es:
    // { user: { user_id: 5, ... } }
    // Para obtener el objeto User plano, necesitamos acceder a userResponse.data.user
    const actualUserData = userResponse.data.user; // <-- ¡Este es el cambio crucial!

    dispatch(setCredentials({ user: actualUserData }));

    toast.success("¡Inicio de sesión exitoso!");

    return actualUserData;
  } catch (error: any) {
    console.error("Error en el login thunk:", error);
    let errorMessage = "Error desconocido al iniciar sesión.";
    if (error.response) {
      if (error.response.status === 422 && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
      } else if (
        error.response.status === 401 ||
        error.response.status === 419
      ) {
        errorMessage = "Credenciales inválidas o sesión expirada.";
      } else {
        errorMessage = error.response.data.message || error.response.statusText;
      }
    } else if (error.request) {
      errorMessage = "No se pudo conectar con el servidor.";
    }
    toast.error(errorMessage);
    dispatch(setError(errorMessage));
    return rejectWithValue(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user; // Esto ahora asignará el objeto User plano
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error =
          (action.payload as string) || "Error de inicio de sesión.";
      });
  },
});

export const { setCredentials, logout, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mascotaReducer from './mascotaSlice';
import petLostReducer from './petLostSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mascota: mascotaReducer,
    petLost: petLostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
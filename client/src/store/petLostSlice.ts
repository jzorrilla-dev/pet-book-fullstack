import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface PetLost {
    pet_id: number;
    pet_name: string;
    description?: string;
    pet_species: string;
    last_seen: string;
    lost_date: string;
    pet_photo?: string;
    user_id: number;
    }
interface PetLostState {
    lostPets: PetLost[];
    loading: boolean;
    error: string | null;
    }
const initialState: PetLostState = {
    lostPets: [],
    loading: false,
    error: null,
    };
const petLostSlice = createSlice({
    name: 'petLost',
    initialState,
    reducers: {
        setLostPets: (state, action: PayloadAction<PetLost[]>) => {
        state.lostPets = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        },
    },
    },
);
export const { setLostPets, setLoading, setError } = petLostSlice.actions;
export default petLostSlice.reducer;
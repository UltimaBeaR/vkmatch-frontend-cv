import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'global',

    initialState: {
        isLoading: true
    },

    reducers: {
        setIsLoading: (state, action: { type: string, payload: boolean }) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setIsLoading } = slice.actions;

export default slice.reducer;
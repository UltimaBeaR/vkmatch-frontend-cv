import { createSlice } from '@reduxjs/toolkit';
import { Account } from "services/backend/ApiModels/Account";

export const slice = createSlice({
    name: 'account',

    initialState: {
        account: null as (Account | null)
    },

    reducers: {
        setAccount: (state, action: { type: string, payload: (Account | null) }) => {
            state.account = action.payload;
        }
    }
});

export const { setAccount } = slice.actions;

export default slice.reducer;
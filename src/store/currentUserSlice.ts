import { createSlice } from '@reduxjs/toolkit';
import { UserDistribution, UserPage } from 'services/backend/ApiModels/UserPage';

export const slice = createSlice({
    name: 'currentUser',

    initialState: {
        page: {
            isAnyUserNotFound: true,
            isSpecificUserNotFound: false,
            isUserInListNotFound: false,
            openedDistribution: UserDistribution.Undistributed,
            userDistribution: UserDistribution.Undistributed,
            score: 0,
            userDetails: null
        } as UserPage,
        isPageLoaded: false
    },

    reducers: {
        setPage: (state, action: { type: string, payload: UserPage }) => {
            state.page = action.payload;
            state.isPageLoaded = true;
        },

        changeUserDistribution: (state, action: { type: string, payload: UserDistribution }) => {
            state.page.userDistribution = action.payload;
        }
    }
});

export const { setPage, changeUserDistribution } = slice.actions;

export default slice.reducer;
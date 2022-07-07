import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'vkUserList',

    initialState: {
        // Список юзеров которые были "обработаны" в списке - визуально помечаются серыми/неактивными, но все равно доступны для выбора
        handledUserIds: [] as number[]
    },

    reducers: {
        reset: (state) => {
            state.handledUserIds = [];
        },

        addHandledUserId: (state, action: { type: string, payload: number }) => {
            const isUserAlreadyHandled = state.handledUserIds.indexOf(action.payload) !== -1;

            if (!isUserAlreadyHandled) {
                state.handledUserIds = [ ...state.handledUserIds, action.payload ];
            }
        }
    }
});

export const { reset, addHandledUserId } = slice.actions;

export default slice.reducer;
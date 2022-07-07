import { configureStore } from '@reduxjs/toolkit';

import globalReducer from './globalSlice';
import accountReducer from './accountSlice';
import currentUserReducer from './currentUserSlice';
import vkUserListReducer from './vkUserListSlice';

export default configureStore({
    reducer: {
        global: globalReducer,
        account: accountReducer,
        currentUser: currentUserReducer,
        vkUserList: vkUserListReducer
    }
});
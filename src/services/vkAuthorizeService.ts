import appConfig from 'appConfig';

import * as backend from "services/backend/backend";

import store from 'store/store';
import { setAccount } from 'store/accountSlice';
import { setIsLoading } from 'store/globalSlice';

// https://dev.vk.com/reference/access-rights
const possibleAccessRights = {
    photos: 1 << 2
};

class VkAuthorizeService {
    buildVkAuthorizeUrl() {
        const redirectUrl = `${appConfig.baseUrl}/api/vk_oauth_redirect`;

        const accessRights = possibleAccessRights.photos;

        const authorizeUrlBuilder = new URL('https://oauth.vk.com/authorize');

        authorizeUrlBuilder.searchParams.append('client_id', appConfig.clientId as string);
        authorizeUrlBuilder.searchParams.append('redirect_uri', redirectUrl);
        authorizeUrlBuilder.searchParams.append('display', 'page');
        authorizeUrlBuilder.searchParams.append('scope', accessRights.toString());

        authorizeUrlBuilder.searchParams.append('response_type', 'code');

        return authorizeUrlBuilder.href;
    };

    async setAuthorizationState() {
        const account = await backend.account.getAccount();

        store.dispatch(setIsLoading(false));

        if (account !== null) {
            store.dispatch(setAccount(account));
        }
        else {
            store.dispatch(setAccount(null));
        }
    }

    async logout() {
        await backend.account.logout();
        store.dispatch(setAccount(null));
    }
}

const vkAuthorizeService = new VkAuthorizeService();

export default vkAuthorizeService;
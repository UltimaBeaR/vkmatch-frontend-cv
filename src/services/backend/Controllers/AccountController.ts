import { Account } from 'services/backend/ApiModels/Account';
import ajaxService from 'services/ajaxService';

export default class UserListsController {
    async getAccount(): Promise<Account | null> {
        const response = await ajaxService.fetchGet<Account | null>('/api/account', {},
            response => {
                if (response.status === 401) {
                    return false;
                }

                return true;
            }
        );
        return response.result;
    }

    async logout(): Promise<void> {
        await ajaxService.fetchPost('/api/account/logout');
    }
}
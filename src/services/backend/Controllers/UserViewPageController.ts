import ajaxService from 'services/ajaxService';
import { UserDistribution, UserPage } from 'services/backend/ApiModels/UserPage';

export default class UserViewPageController {
    async getPage(distribution: UserDistribution | null, userId: number | null): Promise<UserPage> {
        const response = await ajaxService.fetchGet<UserPage>('/api/user-view/page', {
            distribution: distribution,
            userId: userId
        });

        return response.result!;
    }
}
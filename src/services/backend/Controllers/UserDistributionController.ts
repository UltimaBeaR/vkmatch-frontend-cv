import ajaxService from 'services/ajaxService';
import { ListWithTotalCount } from 'services/backend/ApiModels/ListWithTotalCount';
import { UserDistributionItem } from 'services/backend/ApiModels/UserDistributionItem';
import { UserDistribution } from 'services/backend/ApiModels/UserPage';

export default class UserDistributionController {
    async getDistribution(offset: number, limit: number, distribution: UserDistribution): Promise<ListWithTotalCount<UserDistributionItem>> {
        const response = await ajaxService.fetchGet<ListWithTotalCount<any>>('/api/user-distribution', {
            offset: offset,
            limit: limit ?? 50,
            distribution: distribution
        });

        const tempResult = response.result!;

        for (let item of tempResult.items) {
            item.lastSeen = new Date(item.lastSeen);
        }

        return tempResult;
    }

    async likeUser(userId: number): Promise<number | null> {
        const response = await ajaxService.fetchPost<number | null>('/api/user-distribution/like', {
            userId: userId
        });

        return response.result;
    }

    async dislikeUser(userId: number): Promise<number | null> {
        const response = await ajaxService.fetchPost<number | null>('/api/user-distribution/dislike', {
            userId: userId
        });

        return response.result;
    }
}
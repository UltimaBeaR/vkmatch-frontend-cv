import ajaxService from 'services/ajaxService';
import { ListWithTotalCount } from 'services/backend/ApiModels/ListWithTotalCount';
import { Photo } from 'services/backend/ApiModels/Photo';

export default class PhotoController {
    async get(userId: number, offset: number, limit: number): Promise<ListWithTotalCount<Photo>> {
        const response = await ajaxService.fetchGet<ListWithTotalCount<Photo>>('/api/photo', {
            userId: userId,
            offset: offset,
            limit: limit ?? 0
        });

        return response.result!;
    }
}
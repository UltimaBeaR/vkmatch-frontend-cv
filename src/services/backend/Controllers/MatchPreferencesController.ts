import ajaxService from 'services/ajaxService';
import { MatchPreferences } from 'services/backend/ApiModels/MatchPreferences';

export default class MatchPreferencesController {
    async save(preferences: MatchPreferences): Promise<boolean> {
        const response = await ajaxService.fetchPost<boolean>('/api/match-preferences/save', {}, preferences);
        return response.result!;
    }
}
import type { FilterCombination } from '../models/FilterCombination';
import { httpService } from './HttpService';

/** Service for fetching the analysis data */
class AnalysisService {

    /** Get analysis objects, given a list of selected hackathons and a list of filters */
    getAnalyses(ids: string, filters: FilterCombination[] = []) {
        filters.forEach((filter) => {
            delete filter.index;
            delete filter.id;
        });
        return httpService.get(`/analyses?hackathons=${ids}&filters=${JSON.stringify(filters)}`, {});
    }
}

export const analysisService = new AnalysisService();
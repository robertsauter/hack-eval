import { httpService } from "./HttpService";

class AnalysisService {

    /** Get analysis objects, given a list of selected hackathons and a list of filters */
    getAnalyses(ids: string, filters: any = []) {
        return httpService.get(`/analyses?hackathons=${ids}&filters=${JSON.stringify(filters)}`, {});
    }
}

export const analysisService = new AnalysisService();
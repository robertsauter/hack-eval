import { FilterCombination } from "../models/FilterCombination";
import { HackathonInformation } from "../models/HackathonInformation";
import type { RawHackathon, RawResponses } from "../models/RawHackathon";
import { httpService } from "./HttpService";

/** Handles everything relating to uploaded hackathons */
class HackathonService {

    /** Send a hackathon object from google forms to the backend to save it */
    uploadHackathonGoogle(formData: FormData, results: RawResponses, survey: any) {
        const startDate = new Date(formData.get('start') as string);
        startDate.setHours(12);
        const endDate = new Date(formData.get('end') as string);
        endDate.setHours(12);
        const rawHackathon: RawHackathon = {
            title: formData.get('title') as string,
            incentives: formData.get('incentives') as HackathonInformation['incentives'],
            venue: formData.get('venue') as HackathonInformation['venue'],
            size: formData.get('size') as HackathonInformation['size'],
            types: (formData.get('types') as string).split(',') as HackathonInformation['types'],
            start: startDate,
            end: endDate,
            link: formData.get('link') as string,
            results,
            survey
        };
        return httpService.post('/hackathons/google', { body: rawHackathon }, true);
    }

    /** Send a hackathon from a CSV file to the backend to save it */
    uploadHackathonCsv(formData: FormData) {
        const startDate = new Date(formData.get('start') as string);
        startDate.setHours(12);
        formData.set('start', startDate.toISOString());
        const endDate = new Date(formData.get('end') as string);
        endDate.setHours(12);
        formData.set('end', endDate.toISOString());
        return httpService.post('/hackathons/csv', { body: formData });
    }

    /** Load all uploaded hackathons of the logged in user */
    getHackathonsOfLoggedInUser() {
        return httpService.get('/hackathons');
    }

    /** Remove the hackathon with the given id */
    removeHackathon(id: string) {
        return httpService.delete(`/hackathons/${id}`);
    }

    /** Get all hackathon data of the logged in user as a csv string */
    getHackathonData() {
        return httpService.get('/hackathons/aggregated/csv');
    }

    /** Process a csv string, create a csv file and download it. Returns a promise, so we can wait for execution of this method elsewhere */
    async downloadCsvStringAsFile(csvString: string) {
        const file = new Blob([csvString], { type: 'text/csv' });
        const downloadUrl = window.URL.createObjectURL(file);
        const downloadLink = document.getElementById('DownloadLink');
        downloadLink?.setAttribute('href', downloadUrl);
        downloadLink?.click();
        return;
    }

    /** Get the amount of hackathons, that match the given filter combination */
    getHackathonsAmount(selectedHackathonId: string, filter: FilterCombination) {
        return httpService.get(`/hackathons/amount?raw_filter=${JSON.stringify(filter)}&selected_hackathon_id=${selectedHackathonId}`);
    }
}

export const hackathonService = new HackathonService();
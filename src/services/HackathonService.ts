import { FilterCombination } from "../models/FilterCombination";
import { HackathonInformation } from "../models/HackathonInformation";
import type { RawHackathon } from "../models/RawHackathon";
import { httpService } from "./HttpService";

/** Handles everything relating to uploaded hackathons */
class HackathonService {

    /** Send a hackathon object from google forms to the backend to save it */
    uploadHackathonGoogle(hackathon: RawHackathon) {
        return httpService.post('/hackathons/google', { body: hackathon }, true);
    }

    /** Send a hackathon object from a CSV file to the backend to save it */
    uploadHackathonCsv(information: HackathonInformation, file: File) {
        const formData = new FormData();
        formData.append('title', information.title);
        formData.append('incentives', information.incentives);
        formData.append('venue', information.venue);
        formData.append('size', information.size);
        formData.append('types', information.types.join(','));
        formData.append('start', information.start.toISOString());
        formData.append('end', information.end.toISOString());
        formData.append('file', file);
        if (information.link) {
            formData.append('link', information.link);
        }
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
    downloadCsvStringAsFile(csvString: string) {
        const file = new Blob([csvString], { type: 'text/csv' });
        const downloadUrl = window.URL.createObjectURL(file);
        const downloadLink = document.getElementById('DownloadLink');
        downloadLink?.setAttribute('href', downloadUrl);
        downloadLink?.click();
        return Promise.resolve();
    }

    /** Get the amount of hackathons, that match the given filter combination */
    getHackathonsAmount(filter: FilterCombination) {
        return httpService.get(`/hackathons/amount?raw_filter=${JSON.stringify(filter)}`);
    }
}

export const hackathonService = new HackathonService();
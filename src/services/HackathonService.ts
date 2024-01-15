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
        formData.append('file', file);
        return httpService.post('/hackathons/csv', { body: formData });
    }

    getHackathonsOfLoggedInUser() {
        return httpService.get('/hackathons', {});
    }

    removeHackathon(id: string) {
        return httpService.delete(`/hackathons/${id}`, {});
    }
}

export const hackathonService = new HackathonService();
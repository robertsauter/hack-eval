import type { RawHackathon } from "../models/RawHackathon";
import { httpService } from "./HttpService";

/** Handles everything relating to uploaded hackathons */
class HackathonService {

    /** Send a hackathon object from google forms to the backend to save it */
    uploadHackathonGoogle(hackathon: RawHackathon) {
        return httpService.post('/hackathons/google', { body: hackathon }, true);
    }

    /** Send a hackathon object from a CSV file to the backend to save it */
    uploadHackathonCsv(form: HTMLFormElement) {
        const formData = new FormData(form);
        return httpService.post('/hackathons/csv', { body: formData });
    }
}

export const hackathonService = new HackathonService();
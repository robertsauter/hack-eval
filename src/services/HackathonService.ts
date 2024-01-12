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
    uploadHackathonCsv(
        title: string,
        incentives: HackathonInformation['incentives'],
        venue: HackathonInformation['venue'],
        participants: number,
        type: HackathonInformation['type'],
        file: File
    ) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('incentives', incentives);
        formData.append('venue', venue);
        formData.append('participants', participants.toString());
        formData.append('type', type);
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
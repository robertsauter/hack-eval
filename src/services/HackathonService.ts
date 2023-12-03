import type { RawHackathon } from "../models/RawHackathon";
import { httpService } from "./HttpService";

/** Handles everything relating to uploaded hackathons */
class HackathonService {

    /** Send a hackathon object to the backend to save it */
    uploadHackathon(hackathon: RawHackathon) {
        httpService.post('/hackathons', { body: hackathon }, true);
    }
}

export const hackathonService = new HackathonService();
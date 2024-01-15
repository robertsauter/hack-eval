import { HackathonInformation } from "./HackathonInformation";

export type FilterCombination = {
    id: number;
    incentives: HackathonInformation['incentives'][];
    venue: HackathonInformation['venue'][];
    size: HackathonInformation['size'][];
    types: HackathonInformation['types'];
};
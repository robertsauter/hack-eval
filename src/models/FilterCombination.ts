import type { HackathonInformation } from './HackathonInformation';

export type FilterCombination = {
    index?: number;
    id?: string;
    name: string;
    incentives: HackathonInformation['incentives'][];
    venue: HackathonInformation['venue'][];
    size: HackathonInformation['size'][];
    types: HackathonInformation['types'];
    onlyOwn: boolean;
};
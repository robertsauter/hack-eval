type HackathonType = 'prototype' | 'conceptual' | 'analysis' | 'education' | 'community' | 'ideation';

export type HackathonInformation = {
    title: string;
    incentives: 'collaboration' | 'competition';
    venue: 'in-person' | 'virtual' | 'hybrid';
    participants: number;
    types: HackathonType[];
    id?: string;
};
export type HackathonInformation = {
    title: string;
    incentives: 'collaboration' | 'competition';
    venue: 'in-person' | 'virtual' | 'hybrid';
    participants: number;
    type: 'prototype' | 'conceptual' | 'analysis' | 'education' | 'community' | 'ideation';
    id?: string;
};
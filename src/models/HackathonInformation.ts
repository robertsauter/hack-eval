export type HackathonInformation = {
    title: string;
    venue: 'in-person' | 'virtual' | 'hybrid';
    participants: number;
    type: 'prototype' | 'conceptual' | 'analysis' | 'education' | 'community' | 'ideation';
};
export type HackathonType = 'prototype' | 'conceptual' | 'analysis' | 'education' | 'community' | 'ideation';

export type HackathonInformation = {
    title: string;
    incentives: 'cooperative' | 'competitive';
    venue: 'in person' | 'online' | 'hybrid';
    size: 'small' | 'medium' | 'large';
    types: HackathonType[];
    start: Date;
    end: Date;
    id?: string;
    link?: string;
};
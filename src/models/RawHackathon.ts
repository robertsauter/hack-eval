import type { HackathonInformation } from "./HackathonInformation"

type RawAnswer = {
    questionId: string;
    textAnswers: {
        answers: {
            value: string;
        }[];
    };
};

/** A survey response object, received from Google Forms API */
export type RawResponses = {
    responses: {
        responseId: string;
        createTime: Date;
        lastSubmittedTime: Date;
        answers: Record<string, RawAnswer>
    }[];
}

export type RawHackathon = HackathonInformation & {
    results: RawResponses;
};
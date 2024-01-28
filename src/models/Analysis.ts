import type { HackathonInformation } from './HackathonInformation';

export type StatisticalValues = {
    participants: number;
    average?: number;
    deviation?: number;
    distribution: Record<string, string | number>;
};

export type AnalysisSubQuestion = {
    title: string;
    statistical_values?: StatisticalValues;
};

type AnalysisMeasureInformation = {
    title: string;
    question_type: 'single_question' | 'group_question' | 'score_question' | 'category_question';
    answer_type: 'string_to_int' | 'int' | 'string';
};

export type AnalysisMeasure = AnalysisMeasureInformation & {
    sub_questions?: string[] | AnalysisSubQuestion[];
    statistical_values?: StatisticalValues;
};

export type Analysis = HackathonInformation & {
    results: AnalysisMeasure[];
};

type MappedAnalysisSubquestion = {
    title: string;
    values: {
        hackathonTitle: string;
        statisticalValues : StatisticalValues;
    }[]
};

export type MappedAnalysisQuestion = AnalysisMeasureInformation & {
    values?: {
        hackathonTitle: string;
        statisticalValues?: StatisticalValues;
    }[],
    subQuestions?: MappedAnalysisSubquestion[]
};
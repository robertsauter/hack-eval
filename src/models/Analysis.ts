import { HackathonInformation } from "./HackathonInformation"

type StatisticalValues = {
    participants: number;
    average?: number;
    deviation?: number;
    distribution: {};
};

export type AnalysisSubQuestion = {
    title: string;
    statistical_values?: StatisticalValues;
};

type AnalysisMeasure = {
    title: string;
    question_type: 'single_question' | 'group_question' | 'score_question' | 'category_question';
    answer_type: 'string_to_int' | 'int' | 'string';
    sub_questions?: string[] | AnalysisSubQuestion[];
    statistical_values?: StatisticalValues;
};

type Analysis = HackathonInformation & {
    results: AnalysisMeasure[];
};

export type AnalysisData = {
    selected: Analysis;
    comparisons: Analysis[];
};
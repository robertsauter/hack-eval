import type { Analysis, AnalysisMeasure, AnalysisSectionType, AnalysisSubQuestion, MappedAnalysisQuestion, MappedAnalysisSection, StatisticalValues } from '../models/Analysis';
import type { FilterCombination } from '../models/FilterCombination';
import { httpService } from './HttpService';

/** Service for fetching the analysis data */
class AnalysisService {

    /** Get analysis objects, given a list of selected hackathons and a list of filters */
    getAnalyses(ids: string, filters: FilterCombination[] = []) {
        filters.forEach((filter) => {
            delete filter.index;
            delete filter.id;
        });
        return httpService.get(`/analyses?hackathons=${ids}&filters=${JSON.stringify(filters)}`, {});
    }

    /** Filter analysis data for specific questions */
    getQuestionsFromAnalysis(analyses: Analysis[], sections: AnalysisSectionType[]): MappedAnalysisSection[] {
        return sections.map((section) => {
            const questions = section.questions.map((title) => {
                const foundQuestion = analyses[0].results.find((question) => question.title === title) as AnalysisMeasure;
                //Handle questions without subquestions
                if(foundQuestion.question_type !== 'group_question') {
                    const values = analyses.map((analysis) => {
                        const currentQuestion = analysis.results.find((question) => question.title === title) as AnalysisMeasure;
                        return {
                            hackathonTitle: analysis.title,
                            statisticalValues: currentQuestion.statistical_values as StatisticalValues
                        }
                    });
                    return {
                        title: foundQuestion.title,
                        answer_type: foundQuestion.answer_type,
                        question_type: foundQuestion.question_type,
                        values: values,
                        answers: foundQuestion.answers
                    };
                }
                //Handle questions with subquestions
                else {
                    const subQuestionValues = foundQuestion.sub_questions?.map((subQuestion) => {
                        const typedQuestion = subQuestion as AnalysisSubQuestion;
                        const values = analyses.map((analysis) => {
                            const currentQuestion = analysis.results.find((question) => question.title === title);
                            const currentSubQuestion = currentQuestion?.sub_questions?.find((question) => {
                                const currentTypedQuestion = question as AnalysisSubQuestion;
                                return currentTypedQuestion.title === typedQuestion.title;
                            }) as AnalysisSubQuestion;
                            return {
                                hackathonTitle: analysis.title,
                                statisticalValues: currentSubQuestion.statistical_values as StatisticalValues
                            };
                        });
                        
                        return {
                            title: typedQuestion.title,
                            values: values
                        };
                    //Filter out subquestions, where the selected hackathons don't have data
                    }).filter((subQuestion) => subQuestion.values[0].statisticalValues.participants > 0);
                    return {
                        title: foundQuestion.title,
                        answer_type: foundQuestion.answer_type,
                        question_type: foundQuestion.question_type,
                        subQuestions: subQuestionValues,
                        answers: foundQuestion.answers
                    };
                }
            }).filter((question) => {
                if(question.question_type === 'group_question') {
                    //Filter out questions of the selected hackathons, where none of the subquestions have data
                    return question.subQuestions?.find((subQuestion) => subQuestion.values[0].statisticalValues.participants > 0);
                }
                //Filter out single questions, where the selected hackathons have no data
                return question.values[0].statisticalValues.participants > 0;
            });

            return {
                sectionTitle: section.sectionTitle,
                questions: questions
            }
        }).filter((section) => section.questions.length);
    }
}

export const analysisService = new AnalysisService();
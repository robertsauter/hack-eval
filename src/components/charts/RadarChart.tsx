import { ResponsiveRadar } from '@nivo/radar';
import { AnalysisData, AnalysisSubQuestion } from '../../models/Analysis';

export function RadarChart(props: { data: AnalysisData }) {

    const { data } = props;

    const typedQuestions = data.selected.results[0].sub_questions as AnalysisSubQuestion[];
    const mappedData = typedQuestions.map((question, index) => {
        const typedQuestion = question as AnalysisSubQuestion;
        const subQuestion: Record<string, string | number> = { 'subQuestionTitle': typedQuestion.title };
        subQuestion[data.selected.title] = typedQuestion.statistical_values?.average || 0;

        data.comparisons.forEach((comparison) => {
            const currentTypedQuestion = comparison.results[0].sub_questions?.[index] as AnalysisSubQuestion;
            subQuestion[data.selected.title] = currentTypedQuestion.statistical_values?.average || 0;
        });
        return subQuestion;
    });

    const titles = [data.selected.title, ...data.comparisons.map((comparison) => comparison.title)];

    return <div className="h-80">
        <ResponsiveRadar
            data={mappedData}
            indexBy="subQuestionTitle"
            keys={titles}
            maxValue={5}
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            valueFormat=">-.2f" />
    </div>;
}
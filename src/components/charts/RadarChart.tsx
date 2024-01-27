import { ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';

export function RadarChart(props: { question: MappedAnalysisQuestion }) {

    const { question } = props;

    const data = question.subQuestions?.map((subQuestion) => {
        const mappedQuestion: Record<string, number | string> = { 'subQuestionTitle': subQuestion.title };
        subQuestion.values.forEach((value) => {
            mappedQuestion[value.hackathonTitle] = value.statisticalValues.average || 0;
        });
        return mappedQuestion;
    });

    const titles = question.subQuestions?.[0].values.map((value) => value.hackathonTitle);

    return <div className="h-80">
        {data && titles
            ? <ResponsiveRadar
                data={data}
                indexBy="subQuestionTitle"
                keys={titles}
                maxValue={5}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                valueFormat=">-.2f" />
            : <></>
        }
    </div>;
}
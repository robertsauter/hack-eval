import { GridLabelProps, ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';

export const RadarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.subQuestions?.filter((subQuestion) => {
        const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(subQuestion.values);
        return hackathonsAmount > 1;
    }).map((subQuestion) => {
        const mappedQuestion: Record<string, number | string> = { 'subQuestionTitle': subQuestion.title };
        subQuestion.values.forEach((value) => {
            mappedQuestion[value.hackathonTitle] = value.statisticalValues.average ?? 0;
        });
        return mappedQuestion;
    });

    const titles = question.subQuestions?.[0]
        ? question.subQuestions?.[0].values.map((value) => value.hackathonTitle)
        : [];

    /** Truncate the label, if it is too long and compute label position */
    const truncateLabel = (props: GridLabelProps) => {
        let label = props.id;
        const translateEnd = label.length > 25 ? -120 : -(label.length * 4);
        const translateMiddle = label.length > 25 ? -60 : -(label.length * 2.5);
        if (label.length > 25) label = `${label.substring(0, 22)}...`;
        return <g transform={`translate(${props.x}, ${props.y})`}>
            <g transform={`translate(${props.anchor === 'end' ? translateEnd : props.anchor === 'middle' ? translateMiddle : 0})`}>
                <text fontSize={11}>{label}</text>
            </g>
        </g>;
    };

    return data
        ? <div className="h-80">
            <ResponsiveRadar
                data={data}
                indexBy="subQuestionTitle"
                keys={titles}
                maxValue={5}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                valueFormat=">-.2f"
                gridShape="linear"
                dotColor="white"
                dotBorderWidth={2}
                dotSize={8}
                gridLabel={truncateLabel}
                legends={[{
                    anchor: 'bottom',
                    direction: 'row',
                    itemWidth: 100,
                    itemHeight: 20,
                    translateX: -50,
                    translateY: -50
                }]} />
        </div>
        : <></>;
})
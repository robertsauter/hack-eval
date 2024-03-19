import { BarTooltipProps, ResponsiveBar } from '@nivo/bar';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { memo } from 'react';
import { Typography } from '@mui/material';
import { analysisService } from '../../services/AnalysisService';

export const GroupedBarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.subQuestions?.[0].values.map((hackathon, i) => {
        const mappedData: Record<string, string | number> = {
            hackathonTitle: hackathon.hackathonTitle
        };
        question.subQuestions?.forEach((subQuestion) => {
            mappedData[subQuestion.title] = subQuestion.values[i].statisticalValues.average ?? 0;
        });
        return mappedData;
    });

    const maxValue = question.answers ? Math.max(...Object.values(question.answers).map((answer) => +answer)) : null;
    const subQuestionTitles = question.subQuestions?.map((subQuestion) => subQuestion.title);
    const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560', '#f1e15b'];

    /** Create a custom legend */
    const customLegend = () => {
        return <div className="flex items-center justify-center gap-x-8 gap-y-2 flex-wrap">{question.subQuestions?.map((subQuestion, i) =>
            <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: colors[i] }}></div>
                <Typography className="text-xs">{subQuestion.title}</Typography>
            </div>
        )}
        </div>;
    };

    /** Create custom tooltip for a subquestion of a hackathon */
    const customTooltip = (props: BarTooltipProps<Record<string, string | number>>) => {
        const subQuestion = question.subQuestions?.find((subQuestion) => subQuestion.title === props.id);
        const statisticalValues = subQuestion?.values.find((hackathon) => hackathon.hackathonTitle === props.data['hackathonTitle'])?.statisticalValues;
        return <div className="p-2 bg-white shadow-md rounded-md">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: props.color }}></div>
                <Typography className="font-bold">{props.id}</Typography>
            </div>
            <Typography>M={props.formattedValue}</Typography>
            <Typography>N={statisticalValues?.participants}</Typography>
            <Typography>SD={analysisService.roundValue(statisticalValues?.deviation ?? 0, 2)}</Typography>
        </div>;
    };

    //TODO: Add error bars

    return data
        ? <>
            <div className="h-80">
                <ResponsiveBar
                    data={data}
                    keys={subQuestionTitles}
                    indexBy="hackathonTitle"
                    valueFormat=">-.2f"
                    margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                    maxValue={maxValue ?? 'auto'}
                    groupMode="grouped"
                    tooltip={customTooltip} />
            </div>
            {customLegend()}
        </>
        : <></>;
});
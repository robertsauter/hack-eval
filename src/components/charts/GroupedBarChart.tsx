import { BarTooltipProps, ComputedBarDatum, ResponsiveBar } from '@nivo/bar';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { memo } from 'react';
import { Typography } from '@mui/material';
import { analysisService } from '../../services/AnalysisService';
import { AnyScale } from '@nivo/scales';

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
            <div key={`groupedBarChartLegend${i}`} className="flex items-center">
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

    /** Create error bars for every bar of the chart */
    const errorBars = (bars: readonly ComputedBarDatum<Record<string, string | number>>[], yScale: AnyScale) => {
        return bars.map((bar) => {
            const hackathonTitle = bar.data.data['hackathonTitle'];
            const subQuestionTitle = bar.data.id;
            const deviation = question.subQuestions
                ?.find((subQuestion) => subQuestion.title === subQuestionTitle)
                ?.values.find((hackathon) => hackathon.hackathonTitle === hackathonTitle)
                ?.statisticalValues.deviation;
            const xTop = bar.x + bar.width / 2;
            const xBottom = bar.x + bar.width / 2;
            const yTop = yScale((bar.data.value ?? 0) + (deviation ?? 0));
            const yBottom = yScale((bar.data.value ?? 0) - (deviation ?? 0));
            return <g key={`errorBar${hackathonTitle}${subQuestionTitle}`}>
                <line
                    x1={xTop - 5}
                    y1={yTop}
                    x2={xTop + 5}
                    y2={yTop}
                    stroke="black" />
                <line
                    x1={xTop}
                    y1={yTop}
                    x2={xBottom}
                    y2={yBottom}
                    stroke="black" />
                <line
                    x1={xBottom - 5}
                    y1={yBottom}
                    x2={xBottom + 5}
                    y2={yBottom}
                    stroke="black" />
            </g>
        });
    };

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
                    tooltip={customTooltip}
                    layers={[
                        'grid',
                        'axes',
                        'bars',
                        'markers',
                        'legends',
                        'annotations',
                        ({ bars, yScale }) => errorBars(bars, yScale)
                    ]} />
            </div>
            {customLegend()}
        </>
        : <></>;
});
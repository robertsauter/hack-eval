import { GridLabelProps, RadarSliceTooltipProps, ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';
import { Typography } from '@mui/material';

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

    /** Custom tooltip for a group of the radar charts */
    const customTooltip = (props: RadarSliceTooltipProps) => {
        return <div className="p-2 bg-white shadow-md rounded-md">
            {props.data.map((hackathon) => {
                const subQuestion = question.subQuestions?.find((subQuestion) => subQuestion.title === props.index);
                const statisticalValues = subQuestion?.values.find((hack) => hack.hackathonTitle === hackathon.id)?.statisticalValues;
                return <div key={`radarChartTooltip${hackathon.id}`} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3" style={{ backgroundColor: hackathon.color }}></div>
                        <Typography className="font-bold">{hackathon.id}</Typography>
                    </div>
                    <div className="flex items-center gap-1">
                        <Typography>M={hackathon.formattedValue}</Typography>
                        <Typography>N={statisticalValues?.participants}</Typography>
                        <Typography>SD={analysisService.roundValue(statisticalValues?.deviation ?? 0, 2)}</Typography>
                    </div>
                </div>
            })}
        </div>;
    }

    return data
        ? <div className="h-80">
            <ResponsiveRadar
                data={data}
                indexBy="subQuestionTitle"
                keys={titles}
                maxValue={5}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                valueFormat=">-.2f"
                sliceTooltip={customTooltip}
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
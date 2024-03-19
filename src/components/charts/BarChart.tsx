import { BarTooltipProps, ComputedBarDatum, ResponsiveBar } from '@nivo/bar';
import { AnyScale } from '@nivo/scales';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Typography } from '@mui/material';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';

type BarChartData = {
    hackathonTitle: string;
    average: number;
    deviation: number;
    participants: number;
    reliability?: number;
};

export const BarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.values?.map((hackathon) => {
        const mappedData: BarChartData = {
            hackathonTitle: hackathon.hackathonTitle,
            average: hackathon.statisticalValues?.average ?? 0,
            deviation: hackathon.statisticalValues?.deviation ?? 0,
            participants: hackathon.statisticalValues?.participants ?? 0
        };
        if (question.question_type === 'score_question') {
            mappedData.reliability = hackathon.statisticalValues?.cronbach_alpha ?? 0;
        }
        return mappedData;
    });

    const maxValue = question.answers ? Math.max(...Object.values(question.answers).map((answer) => +answer)) : null;

    /** Create error bars for every bar */
    const errorBars = (bars: readonly ComputedBarDatum<BarChartData>[], yScale: AnyScale) => {
        return <g>
            {bars.map((bar, i) => {
                const xTop = bar.x + bar.width / 2;
                const xBottom = bar.x + bar.width / 2;
                const yTop = yScale((data?.[i].average ?? 0) + (data?.[i].deviation ?? 0));
                const yBottom = yScale((data?.[i].average ?? 0) - (data?.[i].deviation ?? 0));
                return <g key={i}>
                    <line
                        x1={xTop - 5}
                        y1={yTop}
                        x2={xTop + 5}
                        y2={yTop}
                        stroke="black"
                        strokeWidth="2" />
                    <line
                        x1={xTop}
                        y1={yTop}
                        x2={xBottom}
                        y2={yBottom}
                        stroke="black"
                        strokeWidth="2" />
                    <line
                        x1={xBottom - 5}
                        y1={yBottom}
                        x2={xBottom + 5}
                        y2={yBottom}
                        stroke="black"
                        strokeWidth="2" />
                </g>
            })}
        </g>
    };

    /** Create a custom tooltip */
    const customTooltip = (props: BarTooltipProps<BarChartData>) => {
        const roundedAverage = analysisService.roundValue(props.data.average, 2);
        const roundedDeviation = analysisService.roundValue(props.data.deviation, 2);
        const reliability = props.data.reliability;
        let reliabilityColor;
        if (reliability) {
            if (reliability < 0.6) reliabilityColor = '#d32f2f';
            else if (reliability < 0.7) reliabilityColor = '#ed6c02';
            else reliabilityColor = '#2e7d32';
        }
        return <div className="p-2 bg-white shadow-md rounded-md">
            <div className="flex items-center">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: props.color }}></div>
                <Typography className="font-bold">{props.data.hackathonTitle}</Typography>
            </div>
            <Typography>M={roundedAverage}</Typography>
            <Typography>N={props.data.participants}</Typography>
            <Typography>SD={roundedDeviation}</Typography>
            {props.data.reliability
                ? <Typography className="col-span-2" color={reliabilityColor}>Cronbach's &alpha;={analysisService.roundValue(reliability ?? 0, 2)}</Typography>
                : <></>
            }
        </div>;
    };

    return data
        ? <div className="h-80">
            <ResponsiveBar
                data={data}
                keys={['average']}
                indexBy="hackathonTitle"
                valueFormat=">-.2f"
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                layers={[
                    'grid',
                    'axes',
                    'bars',
                    'markers',
                    'legends',
                    'annotations',
                    ({ bars, yScale }) => errorBars(bars, yScale)
                ]}
                maxValue={maxValue ?? 'auto'}
                tooltip={customTooltip}
                colorBy="indexValue" />
        </div>
        : <></>;
});
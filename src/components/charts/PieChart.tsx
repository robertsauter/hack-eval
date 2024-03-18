import { PieTooltipProps, ResponsivePie } from '@nivo/pie';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Typography } from '@mui/material';
import { memo } from 'react';

type PieChartData = {
    id: string;
    label: string;
    value: number;
};

export const PieChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.values?.map((hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution;
        if (distribution) {
            const values = (question.answers as string[]).map((answer) => {
                const value = distribution.hasOwnProperty(answer) ? distribution[answer] : 0
                return {
                    id: answer,
                    label: answer,
                    value
                }
            });
            return {
                hackathonTitle: hackathon.hackathonTitle,
                statisticalValues: values
            };
        }
        return {
            hackathonTitle: hackathon.hackathonTitle,
            statisticalValues: []
        }
    });

    const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560', '#f1e15b'];

    /** Create a custom tooltip */
    const customTooltip = (props: PieTooltipProps<PieChartData>) => {
        return <div className="p-2 bg-white shadow-md rounded-md flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: props.datum.color }}></div>
            <Typography>{props.datum.data.label}:</Typography>
            <Typography className="font-bold">{props.datum.data.value}</Typography>
        </div>;
    };

    /** Create a custom legend, beneath all pie charts */
    const customLegend = () => {
        const typedAnswers = question.answers as string[];
        return <div className="flex items-center gap-x-8 gap-y-2 flex-wrap justify-center">{typedAnswers.map((answer, i) =>
            <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: colors[i] }}></div>
                <Typography className="text-xs">{answer}</Typography>
            </div>
        )}
        </div>;
    };

    return data
        ? <>
            <div className="grid grid-cols-2 gap-2">
                {data.map((hackathon) =>
                    <div key={hackathon.hackathonTitle} className={hackathon.statisticalValues.length ? 'h-80' : 'flex items-center justify-center flex-col'}>
                        <Typography className="text-center">{hackathon.hackathonTitle}</Typography>
                        {hackathon.statisticalValues.length
                            ? <ResponsivePie
                                data={hackathon.statisticalValues}
                                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                valueFormat=">-.0f"
                                activeOuterRadiusOffset={4}
                                cornerRadius={4}
                                arcLabelsSkipAngle={5}
                                tooltip={customTooltip}
                                enableArcLinkLabels={false} />
                            : <Alert severity="info">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                        }
                    </div>
                )}
            </div>
            {customLegend()}
        </>
        : <></>;
})
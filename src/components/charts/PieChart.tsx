import { PieTooltipProps, ResponsivePie } from '@nivo/pie';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Typography } from '@mui/material';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';

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
                participants: hackathon.statisticalValues?.participants,
                statisticalValues: values
            };
        }
        return {
            hackathonTitle: hackathon.hackathonTitle,
            participants: hackathon.statisticalValues?.participants,
            statisticalValues: []
        }
    });

    const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560', '#f1e15b'];

    /** Create a custom tooltip */
    const customTooltip = (props: PieTooltipProps<PieChartData>, participants: number) => {
        return <div className="p-2 bg-white shadow-md rounded-md flex items-center gap-2 max-w-xs">
            <div className="min-w-[1rem] h-4" style={{ backgroundColor: props.datum.color }}></div>
            <Typography className="font-bold">{props.datum.data.label}:</Typography>
            <Typography>{`${props.datum.data.value} (${computePercentage(participants, props.datum.data.value)}%)`}</Typography>
        </div>;
    };

    /** Create a custom legend, beneath all pie charts */
    const customLegend = () => {
        const typedAnswers = question.answers as string[];
        return <div className="flex items-center gap-x-8 gap-y-2 flex-wrap justify-center">{typedAnswers.map((answer, i) =>
            <div key={`pieChartLegend${i}`} className="flex items-center">
                <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors[i] }}></div>
                <Typography className="text-xs">{answer}</Typography>
            </div>
        )}
        </div>;
    };

    /** Compute the percentage of a sample of the population */
    const computePercentage = (population: number, sampleSize: number) => {
        return analysisService.roundValue((sampleSize / population) * 100, 0);
    };

    return data
        ? <>
            <div className="grid grid-cols-2 gap-2">
                {data.map((hackathon) =>
                    <div key={hackathon.hackathonTitle} className={hackathon.statisticalValues.length ? 'h-80' : 'flex items-center justify-center flex-col'}>
                        <Typography className="text-center">{`${hackathon.hackathonTitle} (N=${hackathon.participants})`}</Typography>
                        {hackathon.statisticalValues.length
                            ? <ResponsivePie
                                data={hackathon.statisticalValues}
                                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                valueFormat={(value) => `${value} (${computePercentage(hackathon.participants ?? 1, value)}%)`}
                                activeOuterRadiusOffset={4}
                                cornerRadius={4}
                                arcLabelsSkipAngle={5}
                                tooltip={(props) => customTooltip(props, hackathon.participants ?? 1)}
                                enableArcLinkLabels={false} />
                            : <Alert severity="info">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                        }
                    </div>
                )}
            </div>
            {customLegend()}
        </>
        : <></>;
});
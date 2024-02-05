import { ComputedBarDatum, ResponsiveBar } from '@nivo/bar';
import { AnyScale } from '@nivo/scales'
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { SimpleDistributionDialog } from './SimpleDistributionDialog';
import { analysisService } from '../../services/AnalysisService';

export const BarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [distributionOpen, setDistributionOpen] = useState(false);

    const data = question.values?.map((hackathon) => ({
        hackathonTitle: hackathon.hackathonTitle,
        average: hackathon.statisticalValues?.average || 0,
        error: hackathon.statisticalValues?.deviation || 0
    }));

    /** Create error bars for every bar */
    const errorBars = (bars: readonly ComputedBarDatum<{
        hackathonTitle: string;
        average: number;
        error: number;
    }>[],
    yScale: AnyScale) => {
        return <g>
            {bars.map((bar, i) => {
                const xTop = bar.x + bar.width / 2;
                const xBottom = bar.x + bar.width / 2;
                const yTop = yScale((data?.[i].average || 0) + (data?.[i].error || 0 / 2));
                const yBottom = yScale((data?.[i].average || 0) - (data?.[i].error || 0 / 2));
                return <g key={i}>
                    <line
                        x1={xTop - 5}
                        y1={yTop}
                        x2={xTop + 5}
                        y2={yTop}
                        stroke="red"
                        strokeWidth="2" />
                    <line
                        x1={xTop}
                        y1={yTop}
                        x2={xBottom}
                        y2={yBottom}
                        stroke="red"
                        strokeWidth="2" />
                    <line
                        x1={xBottom - 5}
                        y1={yBottom}
                        x2={xBottom + 5}
                        y2={yBottom}
                        stroke="red"
                        strokeWidth="2" />
                </g>
            })}
        </g>
    };

    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values || []);
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values || []);

    return data
        ? hackathonsAmount > 1
            ? <>
                <Card>
                    <CardContent>
                        <Typography className="text-center mb-2">{question.title}</Typography>
                        <div className="h-80">
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
                                    ({bars, yScale}) => errorBars(bars, yScale)
                                ]} />
                        </div>
                        {emptyHackathons?.map(hackathon =>
                            <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                        )}
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => setDistributionOpen(true)}>See value distribution</Button>
                    </CardActions>
                </Card>
                <SimpleDistributionDialog
                    open={distributionOpen}
                    onClose={() => setDistributionOpen(false)}
                    question={question} />
            </>
            : <Card>
                <CardContent>
                    <Typography className="text-center mb-2">{question.title}</Typography>
                    <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
                </CardContent>
            </Card>
        : <></>;
})
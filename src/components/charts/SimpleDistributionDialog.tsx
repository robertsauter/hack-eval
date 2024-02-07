import { memo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Card, CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

export const SimpleDistributionDialog = memo((props: {
    question: MappedAnalysisQuestion,
    open: boolean,
    onClose: () => void
}) => {

    const { question, open, onClose } = props;

    /** Map answer distribution to nivo bar chart format, for questions with predefined values */
    const mapDistributionDefinedValues = (distribution: Record<string, number>) => {
        if(Array.isArray(question.answers)) {
            return question.answers.map((answer) => {
                const value = distribution.hasOwnProperty(answer) ? distribution[answer] : 0;
                return { answer, value };
            });
        }
        return Object.entries(question.answers).map(([answer, value]) => {
            const distributionValue = distribution.hasOwnProperty(value) ? distribution[value] : 0;
            return {
                answer: `${answer} (${value})`,
                value: distributionValue
            };
        });
    };

    /** Map answer distribution to nivo scatter plot format */
    const mapDistribution = (distribution: Record<string, number>, name: string) => {
        return [{
            id: name,
            data: Object.entries(distribution).map(([answer, value]) => ({
                x: +answer,
                y: value
            }))
        }]
    };

    const maxValue = question.values?.reduce((maxOverall, hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution as Record<string, number>;
        const maxInDistribution = Math.max(...Object.keys(distribution).map((key) => +key));
        return maxInDistribution > maxOverall ? maxInDistribution : maxOverall;
    }, 0);

    const highestAnswersAmount = question.values?.reduce((maxOverall, hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution as Record<string, number>;
        const maxInDistribution = Math.max(...Object.values(distribution).map((key) => +key));
        return maxInDistribution > maxOverall ? maxInDistribution : maxOverall;
    }, 0);

    return <Dialog open={open} onClose={onClose} maxWidth="lg">
        <DialogTitle className="font-bold">{question.title}</DialogTitle>
        <DialogContent className="w-full p-0">
            <div className="grid grid-cols-2 gap-5 mx-5 mb-5">
                {question.values?.map((hackathon) => hackathon.statisticalValues?.participants || 0 > 0
                    ? <Card key={hackathon.hackathonTitle}>
                        <CardContent>
                            <Typography variant="h6" className="text-center">{hackathon.hackathonTitle}</Typography>
                            <Typography>Answers: {hackathon.statisticalValues?.participants || 0}</Typography>
                            <Typography>Standard deviation: {hackathon.statisticalValues?.deviation || 0}</Typography>
                            {hackathon.statisticalValues?.distribution
                                ? <div className="h-80">
                                    {question.answers 
                                        ? <ResponsiveBar
                                            data={mapDistributionDefinedValues(hackathon.statisticalValues.distribution)}
                                            indexBy="answer"
                                            keys={['value']}
                                            valueFormat=">-.2f"
                                            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                            maxValue={highestAnswersAmount}
                                            axisBottom={{
                                                truncateTickAt: 6
                                            }} />
                                        : <ResponsiveScatterPlot
                                            data={mapDistribution(hackathon.statisticalValues.distribution, hackathon.hackathonTitle)}
                                            xScale={{ type: 'linear', min: 0, max: maxValue }}
                                            xFormat=">-.2f"
                                            yScale={{ type: 'linear', min: 0, max: highestAnswersAmount }}
                                            yFormat=">-.2f"
                                            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                            axisBottom={{
                                                legend: 'Answer',
                                                legendPosition: 'middle',
                                                legendOffset: 40
                                            }}
                                            axisLeft={{
                                                legend: 'Amount of answers',
                                                legendPosition: 'middle',
                                                legendOffset: -40
                                            }} />
                                    }
                                </div>
                                : <></>
                            }
                        </CardContent>
                    </Card>
                    : <></>
                )}
            </div>
        </DialogContent>
    </Dialog>
});
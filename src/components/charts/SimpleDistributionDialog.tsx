import { memo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Card, CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

export const SimpleDistributionDialog = memo((props: {
    question: MappedAnalysisQuestion,
    open: boolean,
    onClose: () => void
}) => {

    const { question, open, onClose } = props;

    const mapDistribution = (distribution: Record<string, number>) => {
        if(question.answers) {
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
        }
        return Object.entries(distribution).map(([answer, value]) => ({ answer, value }));
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle className="font-bold">{question.title}</DialogTitle>
        <DialogContent>
            <div className="grid grid-cols-1 gap-2">
                {question.values?.map((hackathon) => hackathon.statisticalValues?.participants || 0 > 0
                    ? <Card key={hackathon.hackathonTitle}>
                        <CardContent>
                            <Typography variant="h6" className="text-center">{hackathon.hackathonTitle}</Typography>
                            <Typography>Answers: {hackathon.statisticalValues?.participants || 0}</Typography>
                            <Typography>Standard deviation: {hackathon.statisticalValues?.deviation || 0}</Typography>
                            {hackathon.statisticalValues?.distribution
                                ? <div className="h-80">
                                    <ResponsiveBar
                                        data={mapDistribution(hackathon.statisticalValues.distribution)}
                                        indexBy="answer"
                                        keys={['value']}
                                        valueFormat=">-.2f"
                                        margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
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
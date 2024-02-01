import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { memo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { ResponsiveBar } from '@nivo/bar';
import { ExpandMore } from '@mui/icons-material';

export const GroupDistributionDialog = memo((props: {
    question: MappedAnalysisQuestion,
    open: boolean,
    onClose: () => void
}) => {

    const { question, open, onClose } = props;

    const mapDistribution = (distribution: Record<string, number>) => {
        return Object.entries(question.answers).map(([answer, value]) => {
            const distributionValue = distribution.hasOwnProperty(value) ? distribution[value] : 0;
            return {
                answer: `${answer} (${value})`,
                value: distributionValue
            };
        });
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle className="font-bold">{question.title}</DialogTitle>
        <DialogContent>
            {question.subQuestions?.map((subQuestion) => 
                <Accordion key={subQuestion.title}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography className="font-bold">{subQuestion.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="grid grid-cols-1 gap-2">
                        {subQuestion.values.map((hackathon) =>
                            <Card key={hackathon.hackathonTitle}>
                                <CardContent>
                                    <Typography className="text-center">{hackathon.hackathonTitle}</Typography>
                                    <Typography>Answers: {hackathon.statisticalValues?.participants || 0}</Typography>
                                    <Typography>Standard deviation: {hackathon.statisticalValues?.deviation || 0}</Typography>
                                    <div className="h-80">
                                        <ResponsiveBar
                                            data={mapDistribution(hackathon.statisticalValues.distribution)}
                                            indexBy="answer"
                                            keys={['value']}
                                            valueFormat=">-.2f"
                                            margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
            )}
        </DialogContent>
    </Dialog>;
});
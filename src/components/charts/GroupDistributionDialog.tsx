import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { memo } from 'react';
import type { MappedAnalysisQuestion, MappedAnalysisSubquestion } from '../../models/Analysis';
import { ResponsiveBar } from '@nivo/bar';
import { ExpandMore } from '@mui/icons-material';

export const GroupDistributionDialog = memo((props: {
    question: MappedAnalysisQuestion,
    open: boolean,
    onClose: () => void
}) => {

    const { question, open, onClose } = props;

    /** Map distribution values to bar chart data */
    const mapDistribution = (distribution: Record<string, number>) => {
        return Object.entries(question.answers).map(([answer, value]) => {
            const distributionValue = distribution.hasOwnProperty(value) ? distribution[value] : 0;
            return {
                answer: `${answer} (${value})`,
                value: distributionValue
            };
        });
    };

    /** Round a value to two digits */
    const roundValue = (value: number) => {
        return value > 0 ? (Math.round(value * 100) / 100).toFixed(2) : 0;
    };

    /** Compute highest distribution value of a subquestion */
    const getMaxValue = (subQuestion: MappedAnalysisSubquestion) => {
        return subQuestion.values.reduce((maxOverall, hackathon) => {
            const distribution = hackathon.statisticalValues?.distribution as Record<string, number>;
            const maxInDistribution = Math.max(...Object.values(distribution).map((key) => +key));
            return maxInDistribution > maxOverall ? maxInDistribution : maxOverall;
        }, 0);
    };

    return <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle className="font-bold">{question.title}</DialogTitle>
        <DialogContent>
            {question.subQuestions?.map((subQuestion) => {
                const maxValue = getMaxValue(subQuestion);
                return <Accordion key={subQuestion.title}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography className="font-bold">{subQuestion.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                            {subQuestion.values.map((hackathon) => hackathon.statisticalValues.participants > 0
                                ? <Card key={hackathon.hackathonTitle}>
                                    <CardContent>
                                        <Typography className="text-center font-bold">{hackathon.hackathonTitle}</Typography>
                                        <Typography>Answers: {hackathon.statisticalValues?.participants ?? 0}</Typography>
                                        <Typography>Standard deviation: {roundValue(hackathon.statisticalValues?.deviation ?? 0)}</Typography>
                                        <div className="h-80">
                                            <ResponsiveBar
                                                data={mapDistribution(hackathon.statisticalValues.distribution)}
                                                indexBy="answer"
                                                keys={['value']}
                                                valueFormat=">-.2f"
                                                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                                axisBottom={{
                                                    truncateTickAt: 6
                                                }}
                                                maxValue={maxValue}
                                                colorBy="indexValue" />
                                        </div>
                                    </CardContent>
                                </Card>
                                : <></>
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>;
            })}
        </DialogContent>
    </Dialog>;
});
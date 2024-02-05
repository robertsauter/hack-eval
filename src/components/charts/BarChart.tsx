import { ResponsiveBar } from '@nivo/bar';
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
        average: hackathon.statisticalValues?.average || 0
    }));

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
                                margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
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
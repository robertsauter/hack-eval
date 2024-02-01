import { ResponsiveBar } from '@nivo/bar';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { SimpleDistributionDialog } from './SimpleDistributionDialog';

export const BarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [distributionOpen, setDistributionOpen] = useState(false);

    const data = question.values?.map((value) => ({
        hackathonTitle: value.hackathonTitle,
        average: value.statisticalValues?.average || 0
    }));

    return data
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
        : <></>;
})
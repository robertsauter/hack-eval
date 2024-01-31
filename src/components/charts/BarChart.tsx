import { ResponsiveBar } from '@nivo/bar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { Card, CardContent, Typography } from '@mui/material';
import { memo } from 'react';

export const BarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.values?.map((value) => ({
        hackathonTitle: value.hackathonTitle,
        average: value.statisticalValues?.average || 0
    }));

    return data
        ? <Card>
            <CardContent>
            <Typography variant="h6" className="text-center mb-2">{question.title}</Typography>
                <div className="h-80">
                    <ResponsiveBar
                        data={data}
                        keys={['average']}
                        indexBy="hackathonTitle"
                        valueFormat=">-.2f"
                        margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
                </div>
            </CardContent>
        </Card>
        : <></>;
})
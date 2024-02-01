import { ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { GroupDistributionDialog } from './GroupDistributionDialog';

export const RadarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [distributionOpen, setDistributionOpen] = useState(false);

    const data = question.subQuestions?.map((subQuestion) => {
        const mappedQuestion: Record<string, number | string> = { 'subQuestionTitle': subQuestion.title };
        subQuestion.values.forEach((value) => {
            mappedQuestion[value.hackathonTitle] = value.statisticalValues.average || 0;
        });
        return mappedQuestion;
    });

    const titles = question.subQuestions?.[0]
        ? question.subQuestions?.[0].values.map((value) => value.hackathonTitle)
        : [];

    return data
        ? <>
            <Card>
                <CardContent>
                    <Typography className="text-center mb-2">{question.title}</Typography>
                    <div className="h-80">
                        <ResponsiveRadar
                            data={data}
                            indexBy="subQuestionTitle"
                            keys={titles}
                            maxValue={5}
                            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                            valueFormat=">-.2f" />
                    </div>
                </CardContent>
                <CardActions>
                    <Button onClick={() => setDistributionOpen(true)}>See value distribution</Button>
                </CardActions>
            </Card>
            <GroupDistributionDialog
                open={distributionOpen}
                onClose={() => setDistributionOpen(false)}
                question={question} />
        </>
        : <></>;
})
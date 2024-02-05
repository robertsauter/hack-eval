import { ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { GroupDistributionDialog } from './GroupDistributionDialog';
import { analysisService } from '../../services/AnalysisService';

export const RadarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [distributionOpen, setDistributionOpen] = useState(false);

    const data = question.subQuestions?.filter((subQuestion) => {
        const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(subQuestion.values);
        return hackathonsAmount > 1;
    }).map((subQuestion) => {
        const mappedQuestion: Record<string, number | string> = { 'subQuestionTitle': subQuestion.title };
        subQuestion.values.forEach((value) => {
            mappedQuestion[value.hackathonTitle] = value.statisticalValues.average || 0;
        });
        return mappedQuestion;
    });

    const titles = question.subQuestions?.[0]
        ? question.subQuestions?.[0].values.map((value) => value.hackathonTitle)
        : [];

    const emptySubQuestions = question.subQuestions?.map((subQuestion) => {
        return {
            title: subQuestion.title,
            values: analysisService.getEmptyAnalysesFromQuestion(subQuestion.values)
        };
    });

    return data
        ? data.length
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
                        {emptySubQuestions?.map((subQuestion) =>
                            subQuestion.values.map((hackathon) =>
                                <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for subquestion "{subQuestion.title}"</Alert>
                            )
                        )}
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
            : <Card>
                <CardContent>
                    <Typography className="text-center mb-2">{question.title}</Typography>
                    <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
                </CardContent>
            </Card>
        : <></>;
})
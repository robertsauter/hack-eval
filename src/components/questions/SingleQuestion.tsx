import { memo, useMemo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { BarChart } from '../charts/BarChart';
import { analysisService } from '../../services/AnalysisService';

export const SingleQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    const scale = useMemo(() => {
        const answers = Object.keys(question.answers);
        return `(${answers[0]} - ${answers[answers.length - 1]})`;
    }, [question.answers]);

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                    <Typography variant="body2" className="text-center mb-2">{scale}</Typography>
                    <BarChart question={question} />
                    {emptyHackathons?.map(hackathon =>
                        <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                    )}
                </div>
            </CardContent>
            <CardActions>
                <Button onClick={() => analysisService.saveQuestionAsImage(titleAsId)}>Save chart as image</Button>
            </CardActions>
        </Card>
        : <Card>
            <CardContent>
                <Typography className="text-center mb-2">{question.title}</Typography>
                <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
            </CardContent>
        </Card>;
});
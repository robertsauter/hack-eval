import { memo, useState } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { analysisService } from '../../services/AnalysisService';
import { GroupedBarChart } from '../charts/GroupedBarChart';
import { RadarChart } from '../charts/RadarChart';

export const GroupQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [mode, setMode] = useState<'radar' | 'bar'>('radar');

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();

    const emptySubQuestions = question.subQuestions?.map((subQuestion) => {
        return {
            title: subQuestion.title,
            values: analysisService.getEmptyAnalysesFromQuestion(subQuestion.values)
        };
    });

    const hackathonsAmount = question.subQuestions?.reduce((amount, subQuestion) => {
        const subQuestionAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(subQuestion.values);
        return amount + subQuestionAmount;
    }, 0);

    const scale = () => {
        const answers = Object.keys(question.answers);
        return `(${answers[0]} - ${answers[answers.length - 1]})`;
    };

    return hackathonsAmount && hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center font-bold">{question.title}</Typography>
                    <Typography variant="body2" className="text-center mb-2">{scale()}</Typography>
                    {mode === 'radar'
                        ? <RadarChart question={question} />
                        : <GroupedBarChart question={question} />
                    }
                    {emptySubQuestions?.map((subQuestion) =>
                        subQuestion.values.map((hackathon) =>
                            <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for subquestion "{subQuestion.title}"</Alert>
                        )
                    )}
                </div>
            </CardContent>
            <CardActions>
                <Button variant="outlined" onClick={() => setMode(mode === 'radar' ? 'bar' : 'radar')}>
                    {mode === 'bar'
                        ? 'Show as radar chart'
                        : 'Show as bar chart'
                    }
                </Button>
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
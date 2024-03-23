import { memo, useMemo, useState } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { BarChart } from '../charts/BarChart';
import { analysisService } from '../../services/AnalysisService';
import { GroupedBarChart } from '../charts/GroupedBarChart';

export const ScoreQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [mode, setMode] = useState<'score' | 'subQuestions'>('score');

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    /** Create a string with the first and last answer option */
    const scale = useMemo(() => {
        if (question.answer_type === 'string_to_int') {
            const answers = Object.keys(question.answers);
            return `(${answers[0]} - ${answers[answers.length - 1]})`;
        }
    }, [question.answers, question.answer_type]);

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                    <Typography variant="body2" className="text-center mb-2">{scale}</Typography>
                    {mode === 'score'
                        ? <BarChart question={question} />
                        : <GroupedBarChart question={question} />
                    }
                    {emptyHackathons?.map(hackathon =>
                        <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                    )}
                </div>
            </CardContent>
            <CardActions>
                <Button variant="outlined" onClick={() => setMode(mode === 'score' ? 'subQuestions' : 'score')}>
                    {mode === 'score'
                        ? 'Show subquestions'
                        : 'Show single score'
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
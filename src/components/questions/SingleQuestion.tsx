import { memo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Card, CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import { BarChart } from '../charts/BarChart';
import { analysisService } from '../../services/AnalysisService';
import { Download } from '@mui/icons-material';

export const SingleQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    const scale = () => {
        const answers = Object.keys(question.answers);
        return `(${answers[0]} - ${answers[answers.length - 1]})`;
    };

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.display_name}</Typography>
                    <Typography variant="body2" className="text-center mb-2">{question.title} {scale()}</Typography>
                    <BarChart question={question} />
                    {emptyHackathons?.map(hackathon =>
                        <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                    )}
                </div>
            </CardContent>
            <CardActions>
                <Tooltip title="Download as image" placement="top" arrow>
                    <IconButton onClick={() => analysisService.saveQuestionAsImage(titleAsId)} color="primary">
                        <Download />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
        : <Card>
            <CardContent>
                <Typography className="text-center mb-2">{question.title}</Typography>
                <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
            </CardContent>
        </Card>;
});
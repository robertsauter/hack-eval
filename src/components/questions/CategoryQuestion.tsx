import { memo } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Card, CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import { analysisService } from '../../services/AnalysisService';
import { PieChart } from '../charts/PieChart';
import { Download } from '@mui/icons-material';

export const CategoryQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                    <PieChart question={question} />
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
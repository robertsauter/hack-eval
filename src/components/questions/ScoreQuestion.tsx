import { memo, useState } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Card, CardActions, CardContent, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { BarChart } from '../charts/BarChart';
import { analysisService } from '../../services/AnalysisService';
import { GroupedBarChart } from '../charts/GroupedBarChart';
import { DataTable } from '../charts/DataTable';
import { BarChart as BarChartIcon, Download, StackedBarChart, TableChart } from '@mui/icons-material';


export const ScoreQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [mode, setMode] = useState<'table' | 'score' | 'subQuestions'>('score');

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    /** Create a string with the first and last answer option */
    const scale = () => {
        if (question.answer_type === 'string_to_int') {
            const answers = Object.keys(question.answers);
            return `(${answers[0]} - ${answers[answers.length - 1]})`;
        }
    };

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                    <Typography variant="body2" className="text-center mb-2">{scale()}</Typography>
                    {mode === 'table'
                        ? <DataTable question={question} />
                        : mode === 'score'
                            ? <BarChart question={question} />
                            : <GroupedBarChart question={question} />
                    }
                    {emptyHackathons?.map(hackathon =>
                        <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                    )}
                </div>
            </CardContent>
            <CardActions className="flex justify-between">
                <Tooltip title="Download as image" placement="top" arrow>
                    <IconButton onClick={() => analysisService.saveQuestionAsImage(titleAsId)} color="primary">
                        <Download />
                    </IconButton>
                </Tooltip>
                <ToggleButtonGroup
                    value={mode}
                    onChange={(e, newMode) => setMode(newMode)}
                    exclusive
                    color="primary">
                    <Tooltip title="Display as bar chart (showing average score)" placement="top" arrow>
                        <ToggleButton value="score"><BarChartIcon /></ToggleButton>
                    </Tooltip>
                    <Tooltip title="Display as grouped bar chart (showing subquestions)" placement="top" arrow>
                        <ToggleButton value="subQuestions"><StackedBarChart /></ToggleButton>
                    </Tooltip>
                    <Tooltip title="Display as table" placement="top" arrow>
                        <ToggleButton value="table"><TableChart /></ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
            </CardActions>
        </Card>
        : <Card>
            <CardContent>
                <Typography className="text-center mb-2">{question.title}</Typography>
                <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
            </CardContent>
        </Card>;
});
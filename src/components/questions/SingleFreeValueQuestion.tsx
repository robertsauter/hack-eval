import { memo, useState } from 'react';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Card, CardActions, CardContent, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { BarChart } from '../charts/BarChart';
import { ScatterPlot } from '../charts/ScatterPlot';
import { analysisService } from '../../services/AnalysisService';
import { BarChart as BarChartIcon, Download, ScatterPlot as ScatterPlotIcon } from '@mui/icons-material';

export const SingleFreeValueQuestion = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [mode, setMode] = useState<'scatter' | 'bar'>('bar');

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);
    const emptyHackathons = analysisService.getEmptyAnalysesFromQuestion(question.values ?? []);

    return hackathonsAmount > 1
        ? <Card>
            <CardContent>
                <div id={titleAsId} className="bg-white">
                    <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                    {mode === 'bar'
                        ? <BarChart question={question} />
                        : <ScatterPlot question={question} />
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
                    <Tooltip title="Display as bar chart" placement="top" arrow>
                        <ToggleButton value="bar"><BarChartIcon /></ToggleButton>
                    </Tooltip>
                    <Tooltip title="Display as scatter plot" placement="top" arrow>
                        <ToggleButton value="scatter"><ScatterPlotIcon /></ToggleButton>
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
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from '@mui/material';
import { Analysis } from '../models/Analysis';
import { analysisService } from '../services/AnalysisService';
import { BarChart } from './charts/BarChart';
import { RadarChart } from './charts/RadarChart';
import { PieChartList } from './charts/PieChartList';

export function AnalysisSection(props: {
    title: string,
    analyses: Analysis[],
    questionTitles: string[],
}) {

    const { title, analyses, questionTitles } = props;

    const filteredAnalyses = analysisService.getQuestionsFromAnalysis(analyses, questionTitles);

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5" className="font-bold">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className="grid grid-cols-1 gap-2">
            {filteredAnalyses.map((question) =>
                <Card>
                    <CardContent>
                        <Typography variant="h6" className="text-center mb-2">{question.title}</Typography>
                        {question.question_type === 'single_question' || question.question_type === 'score_question'
                            ? <BarChart question={question} />
                        : question.question_type === 'category_question'
                            ? <PieChartList question={question} />
                        : question.question_type === 'group_question'
                            ? <RadarChart question={question} />
                            : <></>
                        }
                    </CardContent>
                </Card>
            )}
        </AccordionDetails>
    </Accordion>
}
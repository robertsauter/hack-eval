import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import type { MappedAnalysisSection } from '../models/Analysis';
import { BarChart } from './charts/BarChart';
import { RadarChart } from './charts/RadarChart';
import { PieChartList } from './charts/PieChartList';
import { memo, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { filtersService } from '../services/FiltersService';

export const AnalysisSection = memo((props: { section: MappedAnalysisSection }) => {

    const { section } = props;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filtersOpenSubscription, setFiltersOpenSubscription] = useState<Subscription>();

    useEffect(() => {
        setFiltersOpenSubscription(filtersService.filtersOpen$.subscribe((open) => setFiltersOpen(open)));

        return () => {
            filtersOpenSubscription?.unsubscribe();
        };
    }, []);

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" className="font-bold">{section.sectionTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails className={filtersOpen
            ? 'grid grid-cols-1 2xl:grid-cols-2 gap-2'
            : 'grid grid-cols-1 xl:grid-cols-2 gap-2'
        }>
            {section.questions.map((question) => {
                switch (question.question_type) {
                    case 'single_question':
                    case 'score_question':
                        return <BarChart question={question} key={question.title} />;
                    case 'category_question':
                        return <PieChartList
                            question={question}
                            key={question.title} />;
                    case 'group_question':
                        return question.subQuestions?.length ? <RadarChart question={question} key={question.title} /> : <></>;
                }
            })}
        </AccordionDetails>
    </Accordion>;
})
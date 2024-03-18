import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import type { MappedAnalysisSection } from '../models/Analysis';
import { memo, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { filtersService } from '../services/FiltersService';
import { SingleFreeValueQuestion } from './questions/SingleFreeValueQuestion';
import { SingleQuestion } from './questions/SingleQuestion';
import { ScoreQuestion } from './questions/ScoreQuestion';
import { GroupQuestion } from './questions/GroupQuestion';
import { CategoryQuestion } from './questions/CategoryQuestion';

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
                if (question.question_type === 'single_question' && question.answer_type === 'int') {
                    return <SingleFreeValueQuestion question={question} />
                }
                else if (question.question_type === 'single_question') {
                    return <SingleQuestion question={question} />;
                }
                else if (question.question_type === 'score_question') {
                    return <ScoreQuestion question={question} />
                }
                else if (question.question_type === 'group_question') {
                    return <GroupQuestion question={question} />
                }
                else {
                    return <CategoryQuestion question={question} />
                }
            })}
        </AccordionDetails>
    </Accordion>;
})
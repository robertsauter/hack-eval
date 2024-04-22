import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import type { MappedAnalysisSection } from '../models/Analysis';
import { memo, useEffect, useState } from 'react';
import { filtersService } from '../services/FiltersService';
import { SingleFreeValueQuestion } from './questions/SingleFreeValueQuestion';
import { SingleQuestion } from './questions/SingleQuestion';
import { ScoreQuestion } from './questions/ScoreQuestion';
import { GroupQuestion } from './questions/GroupQuestion';
import { CategoryQuestion } from './questions/CategoryQuestion';

export const AnalysisSection = memo((props: { section: MappedAnalysisSection }) => {

    const { section } = props;

    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        const filtersOpenSubscription = filtersService.filtersOpen$.subscribe((open) => setFiltersOpen(open));

        return () => {
            filtersOpenSubscription.unsubscribe();
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
                    return <SingleFreeValueQuestion question={question} key={question.title} />
                }
                else if (question.question_type === 'single_question') {
                    return <SingleQuestion question={question} key={question.title} />;
                }
                else if (question.question_type === 'score_question') {
                    return <ScoreQuestion question={question} key={question.title} />
                }
                else if (question.question_type === 'group_question') {
                    return <GroupQuestion question={question} key={question.title} />
                }
                else {
                    return <CategoryQuestion question={question} key={question.title} />
                }
            })}
        </AccordionDetails>
    </Accordion>;
})
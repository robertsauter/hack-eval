import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';

export function BaseAnalysisSection(props: { title: string, children: ReactNode }) {

    const { title, children } = props;

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5" className="font-bold">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className="grid grid-cols-1 gap-2">
            {children}
        </AccordionDetails>
    </Accordion>
}
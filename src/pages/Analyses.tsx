import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analysisService } from '../services/AnalysisService';
import { Alert, CircularProgress, Drawer, Snackbar, Typography } from '@mui/material';
import type { State } from '../lib/AsyncState';
import { FiltersList } from '../components/FiltersList';
import type { FilterCombination } from '../models/FilterCombination';
import { Analysis } from '../models/Analysis';
import { AnalysisSection } from '../components/AnalysisSection';

export function Analyses() {
    const { ids } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [missingNameErrorShown, setMissingNameErrorShown] = useState(false);

    const individualMeasuresQuestions = [
        'To what extent was your decision to participate in this hackathon motivated by...',
        'How many hackathons have you participated in the past?'
    ];
    const teamCompositionQuestions = [
        'How many people were in your team (including yourself)?',
        'Was there a team leader?',
        'Was there a project manager?',
        'Was there a social-emotional leader?',
        'How well did you know your team members?'
    ];

    /** Load analyses for a filter combination */
    const getAnalyses = async (filters: FilterCombination[] = []) => {
        const missingName = filters.find((filter) => filter.name === '');
        if(missingName) {
            setMissingNameErrorShown(true);
        }
        else {
            setAnalysisState('loading');
            if(ids) {
                const response = await analysisService.getAnalyses(ids, filters);

                if(response.ok) {
                    setAnalyses(await response.json());
                    setAnalysisState('success');
                }
                else {
                    setAnalysisState('error');
                }
            }
        }
    };

    /** Close missing name error message */
    const handleCloseMissingNameError = () => {
        setMissingNameErrorShown(false);
    };
    
    useEffect(() => {
        getAnalyses();
    }, []);

    return <>
        <div className="pt-5 pl-40 pr-[220px] md:pr-[320px] lg:pr-[420px] xl:pr-[520px]">
            <Typography variant="h4" className="font-bold mb-5">Analysis</Typography>
            {analysisState === 'loading'
                ? <div className="flex items-center justify-center p-10">
                    <CircularProgress />
                </div>
            : analysisState === 'error'
                ? <div className="flex items-center justify-center p-10">
                    <Alert severity="error">Analysis could not be loaded.</Alert>
                </div>
            : analysisState === 'success'
                ? <>
                    <AnalysisSection
                        title="Individual measures"
                        analyses={analyses}
                        questionTitles={individualMeasuresQuestions} />
                    <AnalysisSection
                        title="Team composition"
                        analyses={analyses}
                        questionTitles={teamCompositionQuestions} />
                </>
                : <></>
            }
        </div>
        <Drawer
            anchor="right"
            variant="permanent">
            <div className="w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px]">
                <FiltersList onUpdateFilters={(filters) => getAnalyses(filters)} />
            </div>
        </Drawer>
        <Snackbar
            open={missingNameErrorShown}
            autoHideDuration={2000}
            onClose={handleCloseMissingNameError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert
                severity="error"
                sx={{ width: '100%' }}
                onClose={handleCloseMissingNameError}>
                Please provide a name for all filters
            </Alert>
        </Snackbar>
    </>;
}
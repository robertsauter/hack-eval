import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { AnalysisSection } from './AnalysisSection';
import { FilterCombination } from '../models/FilterCombination';
import { analysisService } from '../services/AnalysisService';
import { useParams } from 'react-router-dom';
import { Analysis, AnalysisSectionType, MappedAnalysisSection } from '../models/Analysis';
import { useEffect, useState } from 'react';
import { State } from '../lib/AsyncState';
import { filtersService } from '../services/FiltersService';
import { Subscription } from 'rxjs';

export function AnalysesList() {

    const { id } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [filteredAnalyses, setFilteredAnalyses] = useState<MappedAnalysisSection[]>([]);
    const [missingNameErrorShown, setMissingNameErrorShown] = useState(false);
    const [filtersSubscription, setFiltersSubscription] = useState<Subscription>();
    const [emptyAnalyses, setEmptyAnalyses] = useState<Analysis[]>([]);
    const [numberOfAnalyses, setNumberOfAnalyses] = useState(0);

    const questionTitles: AnalysisSectionType[] = [
        {
            sectionTitle: 'Individual measures',
            questions: [
                'To what extent was your decision to participate in this hackathon motivated by...',
                'How many hackathons have you participated in the past?'
            ]
        },
        {
            sectionTitle: 'Team composition',
            questions: [
                'How many people were in your team (including yourself)?',
                'Was there a team leader?',
                'Was there a project manager?',
                'Was there a social-emotional leader?',
                'How well did you know your team members?'
            ]
        },
        {
            sectionTitle: 'Team process',
            questions: [
                'Would you describe your team process as more...',
                'Please indicate your level of agreement with the following statements related to your GOALS as a team.',
                'Please indicate your level of agreement with the following statements about your TEAM.'
            ]
        },
        {
            sectionTitle: 'Project measures',
            questions: [
                'Please indicate your level of agreement with the following statements related to your SATISFACTION with your project.',
                'Please indicate your level of agreement with the following statements related to the USEFULNESS of your project.',
                'Please indicate your FUTURE INTENTIONS related to your hackathon project.',
                'Please indicate your level of agreement with the following statements related to your ABILITY to continue working on your hackathon project.'
            ]
        },
        {
            sectionTitle: 'Mentoring',
            questions: [
                'To what extent do you agree with the following statements about THE SUPPORT THE MENTORS PROVIDED during this hackathon?'
            ]
        },
        {
            sectionTitle: 'Community measure',
            questions: [
                'Do people identify with the community?',
                'To what extent do you agree with the following statements about your relationship with the community?'
            ]
        },
        {
            sectionTitle: 'Event measures',
            questions: [
                'How do you feel about your OVERALL EXPERIENCE participating in this hackathon?',
                'Do you plan to participate in a similar event in the future?',
                'How likely would you recommend a similar hackathon to a friend or colleague?'
            ]
        },
        {
            sectionTitle: 'Individual programming experience',
            questions: [
                'How many years of programming experience do you have?',
                'Referring back to the people you collaborated with at this hackathon, how do you estimate your programming experience compared to them?'
            ]
        },
        {
            sectionTitle: 'Demographics and individual background',
            questions: [
                'How old are you currently?',
                'Are you...?',
                'What is highest level of formal education that you have completed until now?',
                'Do you consider yourself a minority? (For example in terms of race, gender, expertise or in another way)'
            ]
        }
    ];

    /** Load analyses for a filter combination */
    const getAnalyses = async (filters: FilterCombination[] = []) => {
        const missingName = filters.find((filter) => filter.name === '');
        if (missingName) {
            setMissingNameErrorShown(true);
        }
        else {
            setAnalysisState('loading');
            if (id) {
                const response = await analysisService.getAnalyses(id, filters);

                if (response.ok) {
                    const analyses = await response.json();
                    setEmptyAnalyses(analyses.filter((analysis: Analysis) => !analysis.results.length));
                    const nonEmptyAnalyses = analyses.filter((analysis: Analysis) => analysis.results.length);
                    setNumberOfAnalyses(nonEmptyAnalyses.length);
                    setFilteredAnalyses(analysisService.getQuestionsFromAnalysis(nonEmptyAnalyses, questionTitles));
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
        setFiltersSubscription(filtersService.filtersUpdated$.subscribe((newFilters) => {
            getAnalyses(newFilters);
        }));

        return () => {
            filtersSubscription?.unsubscribe();
        };
    }, []);

    return <>
        {analysisState === 'loading'
            ? <div className="flex items-center justify-center p-10">
                <CircularProgress />
            </div>
            : analysisState === 'error'
                ? <div className="flex items-center justify-center p-10">
                    <Alert severity="error">Analysis could not be loaded.</Alert>
                </div>
                : analysisState === 'success'
                    ? numberOfAnalyses > 1
                        ? <>
                            {emptyAnalyses.map((analysis) =>
                                <Alert
                                    className="mb-2"
                                    severity="warning"
                                    key={analysis.title}>
                                    We could not find any hackathons, that match your filter combination <b>{analysis.title}</b>. Please consider changing this filter combination.
                                </Alert>
                            )}
                            {filteredAnalyses.map((section) =>
                                <AnalysisSection section={section} key={section.sectionTitle} />
                            )}
                        </>
                        : <Alert severity="warning">We could not find any hackathons, that match your filter combinations. Please consider changing or deleting your filter combinations.</Alert>
                    : <></>
        }
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
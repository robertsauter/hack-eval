import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analysisService } from '../services/AnalysisService';
import { Alert, CircularProgress, Drawer, Snackbar, Typography } from '@mui/material';
import type { State } from '../lib/AsyncState';
import { FiltersList } from '../components/FiltersList';
import type { FilterCombination } from '../models/FilterCombination';
import { AnalysisSection } from '../components/AnalysisSection';
import { AnalysisSectionType, MappedAnalysisSection } from '../models/Analysis';

export function Analyses() {
    const { ids } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [filteredAnalyses, setFilteredAnalyses] = useState<MappedAnalysisSection[]>([]);
    const [missingNameErrorShown, setMissingNameErrorShown] = useState(false);

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
                'Do people identify with the community?'
            ]
        },
        {
            sectionTitle: 'Event measures',
            questions: [
                'How do you feel about your OVERALL EXPERIENCE participating in this hackathon?',
                'Do you plan to participate in a similar event in the future?',
                'How likely would you recommend a similar hackathon to a friend or colleague?',
                'Please rate how SATISFIED you were with the following sessions.',
                'Please rate how USEFUL you found the following sessions.',
                'Please rate how ENJOYABLE you found the following sessions.'
            ]
        },
        {
            sectionTitle: 'Individual programming experience',
            questions: [
                'How many years of programming experience do you have?',
                'Referring back to the people you collaborated with at this hackathon, how do you estimate your programming experience compared to them?',
                'To what extend do you agree with the following statements about your ABILITY to use these technologies?',
                'To what extend do you agree with the following statements about your LEVEL OF COMFORT using these technologies?'
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
        if(missingName) {
            setMissingNameErrorShown(true);
        }
        else {
            setAnalysisState('loading');
            if(ids) {
                const response = await analysisService.getAnalyses(ids, filters);

                if(response.ok) {
                    const analyses = await response.json();
                    setFilteredAnalyses(analysisService.getQuestionsFromAnalysis(analyses, questionTitles));
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
        <div className="pt-5 pl-40 pr-[13rem] md:pr-[19rem] lg:pr-[26rem] xl:pr-[31rem]">
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
                ? filteredAnalyses.map((section) =>
                    <AnalysisSection section={section} key={section.sectionTitle} />
                )
                : <></>
            }
        </div>
        <Drawer
            anchor="right"
            variant="permanent">
            <div className="w-[12rem] md:w-[18rem] lg:w-[25rem] xl:w-[30rem]">
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
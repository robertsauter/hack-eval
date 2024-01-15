import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analysisService } from '../services/AnalysisService';
import { Alert, Button, CircularProgress, Collapse, Container, Typography } from '@mui/material';
import { State } from '../lib/AsyncState';
import { FiltersList } from '../components/FiltersList';

export function Analysis() {
    const { ids } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [filtersShown, setFiltersShown] = useState(false);

    const getAnalyses = async () => {
        if(ids) {
            const response = await analysisService.getAnalyses(ids);

            if(response.ok) {
                setAnalysisState('success');
            }
            else {
                setAnalysisState('error');
            }
        }
    };
    
    useEffect(() => {
        setAnalysisState('loading');
        getAnalyses();
    }, []);

    return <div className="flex">
        <Container className="pt-5" maxWidth="md">
            <div className="flex items-center justify-between">
                <Typography variant="h4" className="font-bold">Analysis</Typography>
                <Button variant="contained" onClick={() => setFiltersShown(!filtersShown)}>Filters</Button>
            </div>
            {analysisState === 'loading'
                ? <div className="flex items-center justify-center p-10">
                    <CircularProgress />
                </div>
            : analysisState === 'error'
                ? <div className="flex items-center justify-center p-10">
                    <Alert severity="error">Analysis could not be loaded.</Alert>
                </div>
            : analysisState === 'success'
                ? <Typography>Success</Typography>
                : <></>
            }
        </Container>
        <Collapse in={filtersShown} orientation="horizontal">
            <FiltersList />
        </Collapse>
    </div>;
};
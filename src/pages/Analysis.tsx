import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analysisService } from '../services/AnalysisService';
import { Alert, CircularProgress, Drawer, Typography } from '@mui/material';
import type { State } from '../lib/AsyncState';
import { FiltersList } from '../components/FiltersList';
import type { FilterCombination } from '../models/FilterCombination';

export function Analysis() {
    const { ids } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [filtersShown, setFiltersShown] = useState(false);

    const getAnalyses = async (filters: FilterCombination[] = []) => {
        setAnalysisState('loading');
        if(ids) {
            const response = await analysisService.getAnalyses(ids, filters);

            if(response.ok) {
                setAnalysisState('success');
            }
            else {
                setAnalysisState('error');
            }
        }
    };

    const handleUpdateFilters = (filters: FilterCombination[]) => {
        getAnalyses(filters);
        setFiltersShown(false);
    };
    
    useEffect(() => {
        getAnalyses();
    }, []);

    return <>
        <div className="pt-5 pl-40 pr-[200px] md:pr-[300px] lg:pr-[400px] xl:pr-[500px]">
            <Typography variant="h4" className="font-bold">Analysis</Typography>
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
        </div>
        <Drawer
            open={filtersShown}
            onClose={() => setFiltersShown(false)}
            anchor="right"
            variant="permanent">
            <div className="w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px]">
                <FiltersList onUpdateFilters={handleUpdateFilters} />
            </div>
        </Drawer>
    </>;
}
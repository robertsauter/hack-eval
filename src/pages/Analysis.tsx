import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analysisService } from '../services/AnalysisService';
import { Alert, CircularProgress, Drawer, Typography } from '@mui/material';
import type { State } from '../lib/AsyncState';
import { FiltersList } from '../components/FiltersList';
import type { FilterCombination } from '../models/FilterCombination';
import { IndividualMeasures } from '../components/analysisSections/IndividualMeasures';
import type { AnalysisData } from '../models/Analysis';

export function Analysis() {
    const { ids } = useParams();

    const [analysisState, setAnalysisState] = useState<State>('initial');
    const [data, setData] = useState<AnalysisData>();

    /** Load analyses for a filter combination */
    const getAnalyses = async (filters: FilterCombination[] = []) => {
        setAnalysisState('loading');
        if(ids) {
            const response = await analysisService.getAnalyses(ids, filters);

            if(response.ok) {
                setData(await response.json());
                setAnalysisState('success');
            }
            else {
                setAnalysisState('error');
            }
        }
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
                ? <IndividualMeasures data={data} />
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
    </>;
}
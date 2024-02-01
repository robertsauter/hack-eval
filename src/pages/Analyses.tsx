import { Drawer, Typography } from '@mui/material';
import { FiltersList } from '../components/filters/FiltersList';
import { AnalysesList } from '../components/AnalysesList';

export function Analyses() {

    return <>
        <div className="pt-5 pl-40 pr-[13rem] md:pr-[19rem] lg:pr-[26rem] xl:pr-[31rem]">
            <Typography variant="h4" className="font-bold mb-5">Analyses</Typography>
            <AnalysesList />
        </div>
        <Drawer
            anchor="right"
            variant="permanent">
            <div className="w-[12rem] md:w-[18rem] lg:w-[25rem] xl:w-[30rem]">
                <FiltersList />
            </div>
        </Drawer>
    </>;
}
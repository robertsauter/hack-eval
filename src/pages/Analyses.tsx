import { Divider, Drawer, IconButton, Typography } from '@mui/material';
import { FiltersList } from '../components/filters/FiltersList';
import { AnalysesList } from '../components/AnalysesList';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { filtersService } from '../services/FiltersService';

export function Analyses() {

    const [filtersOpen, setFiltersOpen] = useState(true);

    /** Toggle filters component and send event to other components, that filters have been toggled */
    const toggleFilters = (open: boolean) => {
        setFiltersOpen(open);
        filtersService.emitToggleFilters(open);
    };

    const drawer = <div className="w-screen sm:w-[12rem] md:w-[18rem] lg:w-[25rem] xl:w-[30rem]">
        <IconButton className="m-2" onClick={() => toggleFilters(false)}>
            <ChevronRight />
        </IconButton>
        <Divider />
        <FiltersList />
    </div>;

    useEffect(() => {
        filtersService.emitToggleFilters(true);

        return () => {
            filtersService.emitToggleFilters(false);
        };
    }, []);

    return <>
        <div className={filtersOpen
            ? 'pt-5 px-10 sm:pl-20 md:pl-40 sm:pr-[14rem] md:pr-[20rem] lg:pr-[27rem] xl:pr-[32rem]'
            : 'pt-5 px-10 sm:px-20 md:px-40'
        }>
            <Typography variant="h4" className="font-bold mb-5">Analyses</Typography>
            <AnalysesList />
        </div>
        <Drawer
            open={filtersOpen}
            anchor="right"
            variant="persistent">
            {drawer}
        </Drawer>
        {!filtersOpen
            ? <IconButton onClick={() => toggleFilters(true)} className="fixed top-16 right-2">
                <ChevronLeft />
            </IconButton>
            : <></>
        }
    </>;
}
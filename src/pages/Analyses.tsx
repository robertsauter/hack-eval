import { Divider, Drawer, IconButton, Typography } from '@mui/material';
import { FiltersList } from '../components/filters/FiltersList';
import { AnalysesList } from '../components/AnalysesList';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export function Analyses() {

    const [filtersOpen, setFiltersOpen] = useState(true);

    const drawer = <div className="w-screen sm:w-[12rem] md:w-[18rem] lg:w-[25rem] xl:w-[30rem]">
        <IconButton className="m-2" onClick={() => setFiltersOpen(false)}>
            <ChevronRight />
        </IconButton>
        <Divider />
        <FiltersList />
    </div>;

    return <>
        <div className={filtersOpen
            ? 'pt-5 px-10 sm:pl-20 md:pl-40 sm:pr-[13rem] md:pr-[19rem] lg:pr-[26rem] xl:pr-[31rem]'
            : 'pt-5 px-10 sm:px-20 md:px-40'
        }>
            <Typography variant="h4" className="font-bold mb-5">Analyses</Typography>
            <AnalysesList filtersOpen={filtersOpen} />
        </div>
        <Drawer
            open={filtersOpen}
            anchor="right"
            variant="persistent"
            className="hidden sm:block">
            {drawer}
        </Drawer>
        <Drawer
            open={filtersOpen}
            anchor="right"
            variant="temporary"
            className="block sm:hidden"
            ModalProps={{
                keepMounted: true
            }}>
            {drawer}
        </Drawer>
        {!filtersOpen
            ? <IconButton onClick={() => setFiltersOpen(true)} className="fixed top-2 right-2">
                <ChevronLeft />
            </IconButton>
            : <></>
        }
    </>;
}
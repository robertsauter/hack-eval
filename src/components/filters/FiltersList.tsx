import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Filter } from './Filter';
import type { FilterCombination } from '../../models/FilterCombination';
import { MouseEvent } from 'react';
import { FilterPresetDialog } from './FilterPresetDialog';
import { filtersService } from '../../services/FiltersService';
import { useSearchParams } from 'react-router-dom';

export function FiltersList() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<FilterCombination[]>([]);
    const [dialogFilterIndex, setDialogFilterIndex] = useState(0);
    const [presetDialogOpen, setPresetDialogOpen] = useState(false);

    /** Add a new filter combination to the list */
    const addFilter = () => {
        const indexes = filters.map((filter) => filter.index ? filter.index : 0);
        const highest = indexes.sort((a, b) => a - b).pop() ?? 0;
        setFilters([...filters, {
            name: '',
            index: highest + 1,
            incentives: [],
            venue: [],
            size: [],
            types: [],
            onlyOwn: false
        }]);
    };

    /** Set one of the filter combinations in the list */
    const handleSetFilter = (filter: FilterCombination) => {
        setFilters(filters.map((oldFilter) => oldFilter.index === filter.index ? filter : oldFilter));
    };

    /** Delete a filter combination from the list */
    const handleDeleteFilter = (e: MouseEvent<HTMLButtonElement>, filter: FilterCombination) => {
        e.stopPropagation();
        setFilters(filters.filter((oldFilter) => oldFilter.index !== filter.index));
    };

    /** Open the preset dialog and set the index of the filter, where it was opened */
    const handleOpenDialog = (filter: FilterCombination) => {
        if (filter.index) {
            setDialogFilterIndex(filter.index);
            setPresetDialogOpen(true);
        }
    };

    /** Notify other parts of the application, when the filters have been updated */
    const handleUpdateClick = () => {
        filtersService.emitFiltersUpdated(filters);
    };

    useEffect(() => {
        const urlFilters = JSON.parse(searchParams.get('filters') ?? '[]') as FilterCombination[];
        const filterWithoutNameExists = urlFilters.find((filter) => filter.name === '');
        setFilters(urlFilters);
        if (!filterWithoutNameExists) {
            filtersService.emitFiltersUpdated(urlFilters);
        }
        else {
            filtersService.emitFiltersUpdated([]);
        }
    }, []);

    useEffect(() => {
        setSearchParams({ filters: JSON.stringify(filters) }, { replace: true });
    }, [filters]);

    return <>
        <div className="p-5">
            <Typography variant="h5" className="font-bold mb-5">Filters</Typography>
            <div className="mb-2">
                {filters.map((filter) =>
                    <Filter
                        key={filter.index}
                        filter={filter}
                        onOpenDialog={handleOpenDialog}
                        onSetFilter={handleSetFilter}
                        onDeleteFilter={handleDeleteFilter} />
                )}
            </div>
            <Button
                fullWidth
                variant="outlined"
                endIcon={<Add />}
                onClick={addFilter}
                className="mb-5"
                disabled={filters.length > 2}>
                Add filter
            </Button>
            <Button
                fullWidth
                variant="contained"
                onClick={handleUpdateClick}>
                Update analysis
            </Button>
        </div>
        <FilterPresetDialog
            index={dialogFilterIndex}
            open={presetDialogOpen}
            onClose={() => setPresetDialogOpen(false)}
            onSelect={handleSetFilter} />
    </>;
}
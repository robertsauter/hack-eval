import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Filter } from './Filter';
import type { FilterCombination } from '../../models/FilterCombination';
import { MouseEvent } from 'react';
import { FilterPresetDialog } from './FilterPresetDialog';

export function FiltersList(props: { onUpdateFilters: (newFilters: FilterCombination[]) => void }) {

    const { onUpdateFilters } = props;

    const [filters, setFilters] = useState<FilterCombination[]>([]);
    const [dialogFilterIndex, setDialogFilterIndex] = useState(0);
    const [presetDialogOpen, setPresetDialogOpen] = useState(false);

    /** Add a new filter combination to the list */
    const addFilter = () => {
        const indexes = filters.map((filter) => filter.index ? filter.index : 0);
        const highest = indexes.sort((a, b) => a - b).pop() || 0;
        setFilters([...filters, {
            name: '',
            index: highest + 1,
            incentives: [],
            venue: [],
            size: [],
            types: []
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
        if(filter.index) {
            setDialogFilterIndex(filter.index);
            setPresetDialogOpen(true);
        }
    };

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
                className="mb-5">
                Add filter
            </Button>
            <Button
                fullWidth
                variant="contained"
                onClick={() => onUpdateFilters(filters)}>
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
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Filter } from './Filter';
import type { FilterCombination } from '../models/FilterCombination';
import { MouseEvent } from 'react';

export function FiltersList(props: { onUpdateFilters: (newFilters: FilterCombination[]) => void }) {

    const { onUpdateFilters } = props;

    const [filters, setFilters] = useState<FilterCombination[]>([]);

    /** Add a new filter combination to the list */
    const addFilter = () => {
        const ids = filters.map((filter) => filter.id ? filter.id : 0);
        const highest = ids.sort((a, b) => a - b).pop() || 0;
        setFilters([...filters, {
            name: '',
            id: highest + 1,
            incentives: [],
            venue: [],
            size: [],
            types: []
        }]);
    };

    /** Set one of the filter combinations in the list */
    const handleSetFilter = (filter: FilterCombination) => {
        setFilters(filters.map((oldFilter) => oldFilter.id === filter.id ? filter : oldFilter));
    };

    const handleDeleteFilter = (e: MouseEvent<HTMLButtonElement>, filter: FilterCombination) => {
        e.stopPropagation();
        setFilters(filters.filter((oldFilter) => oldFilter.id !== filter.id));
    }; 

    return <div className="p-5">
        <Typography variant="h5" className="font-bold mb-5">Filters</Typography>
        <div>
            {filters.map((filter) =>
                <Filter
                    key={filter.id}
                    filter={filter}
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
    </div>;
};
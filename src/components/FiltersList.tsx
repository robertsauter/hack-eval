import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { Filter } from "./Filter";
import { FilterCombination } from "../models/FilterCombination";

export function FiltersList() {
    const [filters, setFilters] = useState<FilterCombination[]>([]);

    /** Add a new filter combination to the list */
    const addFilter = () => {
        setFilters([...filters, {
            id: filters.length,
            incentives: [],
            venue: [],
            size: [],
            types: []
        }]);
    };

    /** Set one of the filter combinations in the list */
    const setFilter = (filter: FilterCombination) => {
        setFilters(filters.map((old_filter) => old_filter.id === filter.id ? filter : old_filter));
    };

    /** Load new data with the updated filters */
    const updateAnalysis = () => {
        console.log(filters);
    };

    return <div className="p-5">
        <Typography variant="h5" className="font-bold mb-5">Filters</Typography>
        <div>
            {filters.map((filter) =>
                <Filter key={filter.id} filter={filter} setFilter={setFilter} />
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
            onClick={updateAnalysis}>
            Update analysis 
        </Button>
    </div>;
};
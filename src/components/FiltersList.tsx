import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { Filter } from "./Filter";

export function FiltersList() {
    const [filters, setFilters] = useState<string[]>([]);

    return <div className="p-5">
        <Typography variant="h5" className="font-bold mb-5">Filters</Typography>
        <div>
            {filters.map((filter) =>
                <Filter />
            )}
        </div>
        <Button
            fullWidth
            variant="contained"
            endIcon={<Add />}
            onClick={() => setFilters([...filters, ''])}>
            Add filter
        </Button>
    </div>;
};
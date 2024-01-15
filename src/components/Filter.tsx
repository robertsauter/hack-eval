import { Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import type { FilterCombination } from '../models/FilterCombination';

export function Filter(props: { filter: FilterCombination, setFilter: (filter: FilterCombination) => void }) {

    const { filter, setFilter } = props;

    /** Return a list of chip components */
    const renderChips = (selected: string[]) => {
        return <div className="flex gap-1">
            {selected.map((value) =>
                <Chip key={value} label={value} />
            )}
        </div>;
    };

    /** Update the filter combination with a new value for one of the filters */
    const updateFilters = (e: SelectChangeEvent<any>, fieldName: 'incentives' | 'venue' | 'size' | 'types') => {
        const newFilter = {
            ...filter
        };
        newFilter[fieldName] = e.target.value as any;
        setFilter(newFilter);
    };

    return <form>
        <FormControl fullWidth>
            <InputLabel id="incentives">Incentives</InputLabel>
            <Select
                name="incentives"
                labelId="incentives"
                className="mb-5"
                variant="outlined"
                label="Incentives"
                value={filter.incentives}
                multiple
                onChange={(e) => updateFilters(e, 'incentives')}
                renderValue={renderChips}>
                <MenuItem value="collaboration">Collaboration</MenuItem>
                <MenuItem value="competition">Competition</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="venue">Venue</InputLabel>
            <Select
                name="venue"
                labelId="venue"
                className="mb-5"
                variant="outlined"
                label="Venue"
                value={filter.venue}
                multiple
                onChange={(e) => updateFilters(e, 'venue')}
                renderValue={renderChips}>
                <MenuItem value="in-person">In-person</MenuItem>
                <MenuItem value="virtual">Virtual</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="size">Size of your hackathon</InputLabel>
            <Select
                name="size"
                labelId="size"
                className="mb-5"
                variant="outlined"
                label="Size of your hackathon"
                value={filter.size}
                multiple
                onChange={(e) => updateFilters(e, 'size')}
                renderValue={renderChips}>
                <MenuItem value="small">Small (up to 50 participants)</MenuItem>
                <MenuItem value="medium">Medium (up to 150 participants)</MenuItem>
                <MenuItem value="large">Large (more than 150 participants)</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="types">Type</InputLabel>
            <Select
                name="types"
                labelId="types"
                className="mb-5"
                fullWidth
                required
                multiple
                variant="outlined"
                label="Types"
                value={filter.types}
                onChange={(e) => updateFilters(e, 'types')}
                renderValue={renderChips}>
                <MenuItem value="prototype">Prototype focused</MenuItem>
                <MenuItem value="conceptual">Conceptual solution focused</MenuItem>
                <MenuItem value="analysis">Analysis focused</MenuItem>
                <MenuItem value="education">Education focused</MenuItem>
                <MenuItem value="community">Community focused</MenuItem>
                <MenuItem value="ideation">Ideation focused</MenuItem>
            </Select>
        </FormControl>
    </form>;
};
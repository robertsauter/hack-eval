import { Accordion, AccordionDetails, AccordionSummary, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import type { FilterCombination } from '../models/FilterCombination';
import { Delete } from '@mui/icons-material';
import { MouseEvent } from 'react';

export function Filter(props: {
    filter: FilterCombination,
    onSetFilter: (filter: FilterCombination) => void,
    onDeleteFilter: (e: MouseEvent<HTMLButtonElement>, filter: FilterCombination) => void
}) {

    const { filter, onSetFilter, onDeleteFilter } = props;

    /** Return a list of chip components */
    const renderChips = (selected: string[]) => {
        return <div className="flex gap-1">
            {selected.map((value) =>
                <Chip key={value} label={value} />
            )}
        </div>;
    };

    /** Update the filter combination with a new value for one of the filters */
    const updateFilters = (e: any, fieldName: 'name' | 'incentives' | 'venue' | 'size' | 'types') => {
        const newFilter = {
            ...filter
        };
        newFilter[fieldName] = e.target.value;
        onSetFilter(newFilter);
    };

    return <Accordion className="mb-2">
        <AccordionSummary>
            <div className="flex justify-between items-center w-full">
                <Typography>{filter.name !== '' ? filter.name : `Filter ${filter.id}`}</Typography>
                <IconButton onClick={(e) => onDeleteFilter(e, filter)}><Delete /></IconButton>
            </div>
        </AccordionSummary>
        <AccordionDetails>
            <TextField
                    name="name"
                    className="mb-5"
                    fullWidth
                    variant="outlined"
                    value={filter.name}
                    onChange={(e) => updateFilters(e, 'name')}
                    label="Name" />
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
        </AccordionDetails>
    </Accordion>;
};
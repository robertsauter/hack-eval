import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import type { FilterCombination } from '../../models/FilterCombination';
import { Delete, ExpandMore, Save } from '@mui/icons-material';
import { MouseEvent, useState } from 'react';
import { filtersService } from '../../services/FiltersService';

export function Filter(props: {
    filter: FilterCombination,
    onOpenDialog: (filter: FilterCombination) => void,
    onSetFilter: (filter: FilterCombination) => void,
    onDeleteFilter: (e: MouseEvent<HTMLButtonElement>, filter: FilterCombination) => void
}) {

    const { filter, onOpenDialog, onSetFilter, onDeleteFilter } = props;

    const [saveSuccessShown, setSaveSuccessShown] = useState(false);
    const [saveErrorShown, setSaveErrorShown] = useState(false);

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

    /** Save the current filter combination */
    const saveFilter = async () => {
        const response = await filtersService.saveFilterCombination(filter);

        if(response.ok) {
            filtersService.emitFilterSaved(filter);
            setSaveSuccessShown(true);
        }
        else {
            setSaveErrorShown(true);
        }
    };

    /** Hide success message */
    const handleCloseSaveSuccess = () => {
        setSaveSuccessShown(false);
    };

    /** Hide error message */
    const handleCloseSaveError = () => {
        setSaveErrorShown(false);
    };

    return <>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography className="font-bold">{filter.name !== '' ? filter.name : `Filter ${filter.index}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Button variant="outlined" onClick={() => onOpenDialog(filter)}>Presets</Button>
                <div className="flex justify-end mb-2">
                    <IconButton onClick={saveFilter}><Save /></IconButton>
                    <IconButton onClick={(e) => onDeleteFilter(e, filter)}><Delete /></IconButton>
                </div>
                <TextField
                        name="name"
                        className="mb-5"
                        fullWidth
                        variant="outlined"
                        value={filter.name}
                        onChange={(e) => updateFilters(e, 'name')}
                        label="Name"
                        required />
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
                        <MenuItem value="cooperative">Cooperative</MenuItem>
                        <MenuItem value="competitive">Competitive</MenuItem>
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
                        <MenuItem value="in person">In person</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
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
        </Accordion>
        <Snackbar
            open={saveSuccessShown}
            autoHideDuration={2000}
            onClose={handleCloseSaveSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert
                severity="success"
                sx={{ width: '100%' }}
                onClose={handleCloseSaveSuccess}>
                Filter was saved as preset
            </Alert>
        </Snackbar>
        <Snackbar
            open={saveErrorShown}
            autoHideDuration={2000}
            onClose={handleCloseSaveError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert
                severity="error"
                sx={{ width: '100%' }}
                onClose={handleCloseSaveError}>
                Filter could not be saved as preset
            </Alert>
        </Snackbar>
    </>;
}
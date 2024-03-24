import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Switch, TextField, Typography } from '@mui/material';
import type { FilterCombination } from '../../models/FilterCombination';
import { Delete, ExpandMore, Save } from '@mui/icons-material';
import { MouseEvent, useEffect, useState } from 'react';
import { filtersService } from '../../services/FiltersService';
import { hackathonService } from '../../services/HackathonService';

export function Filter(props: {
    filter: FilterCombination,
    onOpenDialog: (filter: FilterCombination) => void,
    onSetFilter: (filter: FilterCombination) => void,
    onDeleteFilter: (e: MouseEvent<HTMLButtonElement>, filter: FilterCombination) => void
}) {

    const { filter, onOpenDialog, onSetFilter, onDeleteFilter } = props;

    const [saveSuccessShown, setSaveSuccessShown] = useState(false);
    const [saveErrorShown, setSaveErrorShown] = useState(false);
    const [hackathonsAmount, setHackathonsAmount] = useState(0);
    const [hackathonsAmountError, setHackathonsAmountError] = useState(false);

    /** Return a list of chip components */
    const renderChips = (selected: string[]) => {
        return <div className="flex gap-1 items-center flex-wrap">
            {selected.map((value, i) =>
                <><Chip key={value} label={value} />{i === selected.length - 1 ? '' : 'or'}</>
            )}
        </div>;
    };

    /** Update the filter combination with a new value for one of the filters */
    const updateFilters = async (e: any, fieldName: 'name' | 'incentives' | 'venue' | 'size' | 'types' | 'onlyOwn') => {
        const newFilter = {
            ...filter
        };
        if (fieldName === 'onlyOwn') {
            newFilter.onlyOwn = e.target.checked;
        }
        else {
            newFilter[fieldName] = e.target.value;
        }
        onSetFilter(newFilter);
        getHackathonsAmount(newFilter);
    };

    /** Get the amount of hackathons given a filter combination */
    const getHackathonsAmount = async (filter: FilterCombination) => {
        setHackathonsAmountError(false);
        const response = await hackathonService.getHackathonsAmount(filter);

        if (response.ok) {
            setHackathonsAmount(await response.json());
        }
        else {
            setHackathonsAmountError(true);
        }
    };

    /** Save the current filter combination */
    const saveFilter = async () => {
        const response = await filtersService.saveFilterCombination(filter);

        if (response.ok) {
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

    useEffect(() => {
        getHackathonsAmount(filter);
    }, []);

    return <>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography className="font-bold">{filter.name !== '' ? filter.name : `Filter ${filter.index}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className="flex justify-end">
                    <Button
                        variant="outlined"
                        onClick={() => onOpenDialog(filter)}
                        className="mb-5">
                        My filters
                    </Button>
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
                <FormControlLabel
                    control={<Switch />}
                    label="Only my hackathons"
                    className="mb-5 ml-0"
                    checked={filter.onlyOwn}
                    onChange={(e) => updateFilters(e, 'onlyOwn')} />
                <Alert
                    severity={hackathonsAmountError ? 'error' : 'info'}
                    className="mb-5">
                    {hackathonsAmountError
                        ? 'Hackathons amount could not be loaded'
                        : `${hackathonsAmount} hackathons match these criteria`
                    }
                </Alert>
                <div className="flex">
                    <Button
                        className="w-1/2"
                        onClick={(e) => onDeleteFilter(e, filter)}
                        endIcon={<Delete />}>
                        Remove
                    </Button>
                    <Button
                        className="w-1/2"
                        onClick={saveFilter}
                        endIcon={<Save />}>
                        Save
                    </Button>
                </div>
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
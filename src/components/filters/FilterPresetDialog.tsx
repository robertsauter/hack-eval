import { Alert, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogTitle, IconButton, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { filtersService } from '../../services/FiltersService';
import type { FilterCombination } from '../../models/FilterCombination';
import type { State } from '../../lib/AsyncState';
import { Delete } from '@mui/icons-material';
import { Subscription } from 'rxjs';

export function FilterPresetDialog(props: {
    index: number,
    open: boolean,
    onClose: () => void,
    onSelect: (filter: FilterCombination) => void
}) {

    const { index, open, onClose, onSelect } = props;

    const [filters, setFilters] = useState<FilterCombination[]>([]);
    const [filterState, setFilterState] = useState<State>('initial');
    const [deleteErrorShown, setDeleteErrorShown] = useState(false);
    const [saveSubscription, setSaveSubscription] = useState<Subscription>();

    /** Get all filter presets */
    const getFilters = async () => {
        setFilterState('loading');
        const response = await filtersService.getFiltersOfLoggedInUser();

        if (response.ok) {
            setFilters(await response.json());
            setFilterState('success');
        }
        else {
            setFilterState('error');
        }
    };

    /** Select a filter and close the dialog */
    const selectFilter = (filter: FilterCombination) => {
        const filterWithIndex = { ...filter, index }
        onSelect(filterWithIndex);
        onClose();
    };

    /** Delete a filter preset */
    const deletePreset = async (filter: FilterCombination) => {
        if (filter.id) {
            const response = await filtersService.deleteFilterCombination(filter.id);

            if (response.ok) {
                getFilters();
            }
            else {
                setDeleteErrorShown(true);
            }
        }
    };

    /** Hide delete error message */
    const handleCloseDeleteError = () => {
        setDeleteErrorShown(false);
    };

    useEffect(() => {
        getFilters();
        setSaveSubscription(
            filtersService.filterSaved$.subscribe(() => {
                getFilters();
            })
        );

        return () => {
            saveSubscription?.unsubscribe();
        };
    }, []);

    return <>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle className="font-bold">Select a filter</DialogTitle>
            {filterState === 'success'
                ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                    {filters.length
                        ? filters.map((filter) =>
                            <Card key={filter.id} className="flex flex-col justify-between">
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography className="font-bold">{filter.name}</Typography>
                                        <IconButton onClick={() => deletePreset(filter)}>
                                            <Delete></Delete>
                                        </IconButton>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <Typography variant="body2" className="font-bold">Incentives:</Typography>
                                        <Typography variant="body2">{filter.incentives.join(', ')}</Typography>
                                        <Typography variant="body2" className="font-bold">Venues:</Typography>
                                        <Typography variant="body2">{filter.venue.join(', ')}</Typography>
                                        <Typography variant="body2" className="font-bold">Sizes:</Typography>
                                        <Typography variant="body2">{filter.size.join(', ')}</Typography>
                                        <Typography variant="body2" className="font-bold">Focus:</Typography>
                                        <Typography variant="body2">{filter.types.join(', ')}</Typography>
                                        <Typography variant="body2" className="font-bold">Only my hackathons:</Typography>
                                        <Typography variant="body2">{filter.onlyOwn ? 'Yes' : 'No'}</Typography>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" onClick={() => selectFilter(filter)}>Select</Button>
                                </CardActions>
                            </Card>
                        )
                        : <Typography>You did not save any filters yet.</Typography>
                    }
                </div>
                : filterState === 'loading'
                    ? <div className="flex items-center justify-center p-10">
                        <CircularProgress />
                    </div>
                    : filterState === 'error'
                        ? <div className="flex items-center justify-center p-10">
                            <Alert severity="error">Filter presets could not be loaded.</Alert>
                        </div>
                        : <></>
            }
        </Dialog>
        <Snackbar
            open={deleteErrorShown}
            autoHideDuration={2000}
            onClose={handleCloseDeleteError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert
                severity="error"
                sx={{ width: '100%' }}
                onClose={handleCloseDeleteError}>
                Preset could not be deleted
            </Alert>
        </Snackbar>
    </>;
}
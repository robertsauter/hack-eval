import { Alert, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogTitle, IconButton, Snackbar, Table, TableCell, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { filtersService } from '../../services/FiltersService';
import type { FilterCombination } from '../../models/FilterCombination';
import type { State } from '../../lib/AsyncState';
import { Close, Delete } from '@mui/icons-material';

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
        const saveSubscription = filtersService.filterSaved$.subscribe(() => getFilters());

        return () => {
            saveSubscription.unsubscribe();
        };
    }, []);

    return <>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <IconButton className="absolute top-2 right-2" onClick={onClose}>
                <Close />
            </IconButton>
            <DialogTitle className="font-bold">Select a filter</DialogTitle>
            {filterState === 'success'
                ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                    {filters.length
                        ? filters.map((filter) =>
                            <Card key={filter.id} className="flex flex-col justify-between">
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2 pl-4">
                                        <Typography className="font-bold">{filter.name}</Typography>
                                        <IconButton onClick={() => deletePreset(filter)}>
                                            <Delete></Delete>
                                        </IconButton>
                                    </div>
                                    <Table size="small">
                                        <TableRow>
                                            <TableCell align="left" className="font-bold">Incentives</TableCell>
                                            <TableCell>{filter.incentives.join(', ')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className="font-bold">Venues</TableCell>
                                            <TableCell>{filter.venue.join(', ')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className="font-bold">Sizes</TableCell>
                                            <TableCell>{filter.size.join(', ')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className="font-bold">Focus</TableCell>
                                            <TableCell>{filter.types.join(', ')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className="font-bold">Only my hackathons</TableCell>
                                            <TableCell>{filter.onlyOwn ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    </Table>
                                </CardContent>
                                <CardActions className="flex justify-end">
                                    <Button onClick={() => selectFilter(filter)}>Select</Button>
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
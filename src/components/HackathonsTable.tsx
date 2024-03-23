import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { HackathonInformation } from '../models/HackathonInformation';
import { Alert, Snackbar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { hackathonService } from '../services/HackathonService';

type HackathonRow = {
    id: string;
    title: string;
    incentives: string;
    venue: string;
    size: string;
    types: string;
    start: Date;
    end: Date;
};

export function HackathonsTable(props: { hackathons: HackathonInformation[], onDelete: () => void }) {

    const { hackathons, onDelete } = props;

    const [deleteErrorShown, setDeleteErrorShown] = useState(false);

    const columns: GridColDef<HackathonRow>[] = [
        {
            field: 'title',
            headerName: 'Title'
        },
        {
            field: 'start',
            headerName: 'Start date',
            type: 'date'
        },
        {
            field: 'end',
            headerName: 'End date',
            type: 'date'
        },
        {
            field: 'incentives',
            headerName: 'Incentives'
        },
        {
            field: 'venue',
            headerName: 'Venue'
        },
        {
            field: 'size',
            headerName: 'Size'
        },
        {
            field: 'types',
            headerName: 'Types'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params: GridRowParams<HackathonRow>) => {
                return [
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => removeHackathon(params.row.id)} />
                ]
            }
        }
    ];

    const rows: HackathonRow[] = hackathons.map((hackathon) => ({
        id: hackathon.id as string,
        title: hackathon.title,
        start: new Date(hackathon.start),
        end: new Date(hackathon.end),
        incentives: hackathon.incentives,
        venue: hackathon.venue,
        size: hackathon.size,
        types: hackathon.types.join(',')
    }));

    /** Delete a hackathon */
    const removeHackathon = async (hackathonId: string) => {
        const response = await hackathonService.removeHackathon(hackathonId);

        if (response.ok) {
            onDelete();
        }
        else {
            setDeleteErrorShown(true);
        }
    };

    /** Hide the error message */
    const handleCloseError = () => {
        setDeleteErrorShown(false);
    };

    return <>
        <DataGrid
            columns={columns}
            rows={rows}
            autosizeOnMount
            disableRowSelectionOnClick
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10
                    }
                }
            }}
            pageSizeOptions={[10]} />
        <Snackbar
            open={deleteErrorShown}
            autoHideDuration={2000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert severity="error" sx={{ width: '100%' }} onClose={handleCloseError}>
                Hackathon could not be deleted
            </Alert>
        </Snackbar>
    </>;
}
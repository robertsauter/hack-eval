import { Alert, Card, CardActionArea, CardContent, Checkbox, IconButton, Snackbar, Typography } from '@mui/material';
import { HackathonInformation } from '../models/HackathonInformation';
import { useState } from 'react';
import { Delete } from '@mui/icons-material';
import { hackathonService } from '../services/HackathonService';

export function HackathonCard(props: {
    hackathon: HackathonInformation,
    onSelect: (id: string, selected: boolean) => void,
    deleteEvent: () => void,
    selectedAmount: number
}) {
    const { hackathon, onSelect, deleteEvent, selectedAmount } = props;

    const [selected, setSelected] = useState(false);
    const [deleteErrorShown, setDeleteErrorShown] = useState(false);

    /** Mark a hackathon as selected */
    const select = () => {
        if(selectedAmount < 3 || (selectedAmount > 2 && selected)) {
            const newValue = !selected;
            setSelected(newValue);
            onSelect(hackathon.id ?? '', newValue);
        }
    };

    /** Delete a hackathon */
    const removeHackathon = async () => {
        if(hackathon.id) {
            const response = await hackathonService.removeHackathon(hackathon.id);

            if(response.ok) {
                deleteEvent();
            }
            else {
                setDeleteErrorShown(true);
            }
        }
    };

    /** Hide the error message */
    const handleCloseError = () => {
        setDeleteErrorShown(false);
    };

    return <>
        <Card className={`flex flex-col justify-between ${selected ? 'outline outline-2 outline-blue-500' : ''}`}>
            <CardContent className="relative">
                <div className="flex mb-2 items-center justify-between">
                    <Checkbox
                        checked={selected}
                        onClick={select}
                        disabled={!selected && selectedAmount > 2} />
                    <IconButton onClick={removeHackathon}>
                        <Delete></Delete>
                    </IconButton>
                </div>
                <Typography className="font-bold">{ hackathon.title }</Typography>    
                <div className="grid grid-cols-2">
                    <Typography variant="body2" className="font-bold">Incentives:</Typography>
                    <Typography variant="body2">{ hackathon.incentives }</Typography>
                </div>
                <div className="grid grid-cols-2">
                    <Typography variant="body2" className="font-bold">Venue:</Typography>
                    <Typography variant="body2">{ hackathon.venue }</Typography>
                </div>
                <div className="grid grid-cols-2">
                    <Typography variant="body2" className="font-bold">Size:</Typography>
                    <Typography variant="body2">{ hackathon.size }</Typography>
                </div>
                <div className="grid grid-cols-2">
                    <Typography variant="body2" className="font-bold">Types:</Typography>
                    {hackathon.types.map((type) =>
                        <Typography variant="body2" className="col-start-2" key={type}>{ type }</Typography>
                    )}
                </div>
                <div className="grid grid-cols-2">
                    <Typography variant="body2" className="font-bold">Link:</Typography>
                    <Typography variant="body2">{ hackathon.link }</Typography>
                </div>
            </CardContent>
        </Card>
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
import { Button, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { useState, useEffect, FormEvent } from 'react';
import { googleFormsService } from '../services/GoogleFormsService';
import { hackathonService } from '../services/HackathonService';
import type { HackathonInformation } from '../models/HackathonInformation';
import { Subscription } from 'rxjs';

export function UploadHackathonDialog(props: { open: boolean, onClose: () => void }) {
    const { open, onClose } = props;

    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState<HackathonInformation['venue']>('in-person');
    const [participants, setParticipants] = useState(0);
    const [type, setType] = useState<HackathonInformation['type']>('prototype');
    const [id, setId] = useState('');

    const [resultsSubscription, setResultsSubscription] = useState<Subscription>();

    /** Try to get the survey, when an access token is still saved or request a new token */
    const requestSurvey = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const googleAccessToken = window.sessionStorage.getItem('google_access_token');
        if(googleAccessToken) {
            googleFormsService.getSurvey(JSON.parse(googleAccessToken));
        }
        else {
            googleFormsService.googleClient.requestAccessToken();
        }
    };

    const handleVenueChange = (e: SelectChangeEvent<string>) => {
        setVenue(e.target.value as HackathonInformation['venue']);
    };

    const handleParticipantsChange = (e: FormEvent<HTMLDivElement>) => {
        setParticipants(+(e.target as HTMLInputElement).value);
    };

    const handleTypeChange = (e: SelectChangeEvent<string>) => {
        setType(e.target.value as HackathonInformation['type']);
    };

    const handleIdChange = (e: FormEvent<HTMLDivElement>) => {
        const id = (e.target as HTMLInputElement).value;
        setId(id);
        googleFormsService.setFormId(id);
    };

    useEffect(() => {
        //Every time new survey results are received, send the hackathon to the backend
        setResultsSubscription(
            googleFormsService.surveyResults$.subscribe((results) => {
                if(results) {
                    hackathonService.uploadHackathon({
                        title,
                        venue,
                        participants,
                        type,
                        results
                    });
                }
            })
        );
        //Unsubscribe, when the component is destroyed
        return () => {
            resultsSubscription?.unsubscribe();
        }
    }, []);

    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>Upload a new hackathon</DialogTitle>
        <form onSubmit={requestSurvey} id="HackathonForm" className="p-6">
            <TextField
                name="title"
                className="mb-5"
                fullWidth
                required
                variant="outlined"
                label="Title"
                value={title}
                onInput={(e) => setTitle((e.target as HTMLInputElement).value)} />
            <FormControl fullWidth required>
                <InputLabel id="venue">Venue</InputLabel>
                <Select
                    name="venue"
                    labelId="venue"
                    className="mb-5"
                    variant="outlined"
                    label="Venue"
                    value={venue}
                    onChange={handleVenueChange}>
                    <MenuItem value="in-person">In-person</MenuItem>
                    <MenuItem value="virtual">Virtual</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
            </FormControl>
            <TextField
                name="participants"
                className="mb-5"
                fullWidth
                required
                variant="outlined"
                label="Number of participants"
                type="number"
                value={participants}
                onInput={handleParticipantsChange} />
            <FormControl fullWidth required>
                <InputLabel id="type">Type</InputLabel>
                <Select
                    name="type"
                    labelId="type"
                    className="mb-5"
                    fullWidth
                    required
                    variant="outlined"
                    label="Type"
                    value={type}
                    onChange={handleTypeChange}>
                    <MenuItem value="prototype">Prototype focused</MenuItem>
                    <MenuItem value="conceptual">Conceptual solution focused</MenuItem>
                    <MenuItem value="analysis">Analysis focused</MenuItem>
                    <MenuItem value="education">Education focused</MenuItem>
                    <MenuItem value="community">Community focused</MenuItem>
                    <MenuItem value="ideation">Ideation focused</MenuItem>
                </Select>
            </FormControl>
            <div className="flex items-center mb-5">
                <TextField
                    name="id"
                    className="mr-2"
                    fullWidth
                    required
                    variant="outlined"
                    label="Google Forms ID of your survey"
                    value={id}
                    onInput={handleIdChange} />
                <Tooltip title="You can find the ID of your survey in the URL">
                    <HelpIcon></HelpIcon>
                </Tooltip>
            </div>
            <Button
                className="mb-5"
                fullWidth
                variant="contained"
                type="submit">
                Upload
            </Button>
        </form>
    </Dialog>
}
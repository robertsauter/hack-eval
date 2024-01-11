import { Alert, Button, CircularProgress, Dialog, DialogTitle, Fade, FormControl, FormControlLabel, FormLabel, Icon, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Tooltip, Typography } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { googleFormsService } from '../services/GoogleFormsService';
import { hackathonService } from '../services/HackathonService';
import type { HackathonInformation } from '../models/HackathonInformation';
import { Subscription } from 'rxjs';
import type { State } from '../lib/AsyncState';
import { Delete, FileUpload, InsertDriveFile } from '@mui/icons-material';
import { RawHackathon } from '../models/RawHackathon';

export function UploadHackathonDialog(props: { open: boolean, onClose: () => void, onSuccess: () => void }) {
    const { open, onClose, onSuccess } = props;

    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState<HackathonInformation['venue']>('in-person');
    const [participants, setParticipants] = useState(0);
    const [type, setType] = useState<HackathonInformation['type']>('prototype');
    const [id, setId] = useState('');
    const [file, setFile] = useState<File>();

    const [uploadFrom, setUploadFrom] = useState<'forms' | 'csv'>('forms');
    const [fileError, setFileError] = useState(false);

    const [resultsSubscription, setResultsSubscription] = useState<Subscription>();

    const [uploadState, setUploadState] = useState<State>('initial');
    const [uploadErrorMessage, setUploadErrorMessage] = useState('');

    /** Try to get the survey, when an access token is still saved or request a new token */
    const requestSurvey = () => {
        const googleAccessToken = window.sessionStorage.getItem('google_access_token');
        if(googleAccessToken) {
            googleFormsService.getSurvey(JSON.parse(googleAccessToken));
        }
        else {
            googleFormsService.googleClient.requestAccessToken();
        }
    };

    /** Close dialog and reset fields */
    const handleSuccess = () => {
        setUploadState('success');
        onClose();
        onSuccess();
        setTitle('');
        setVenue('in-person');
        setParticipants(0);
        setId('');
        setFile(undefined);
    };

    /** Send CSV file to backend */
    const uploadCsv = async () => {
        if(!file) {
            setFileError(true);
        }
        else {
            setUploadState('loading');
            const response = await hackathonService.uploadHackathonCsv(title, venue, participants, type, file);
            if(response.ok) {
                handleSuccess();
            }
            else {
                setUploadState('error');
                setUploadErrorMessage('Upload failed');
            }
        }
    };

    /** Upload from Google Forms */
    const uploadGoogle = async (resultsData: Partial<RawHackathon>) => {
        if(resultsData && resultsData.results) {
            setUploadState('loading');
            const response = await hackathonService.uploadHackathonGoogle({
                title,
                venue,
                participants,
                type,
                survey: resultsData.survey,
                results: resultsData.results
            });

            if(response.ok) {
                handleSuccess();
            }
            else {
                setUploadState('error');
                setUploadErrorMessage('Upload failed');
            }
        }
    };

    /** Handle the upload of a hackathon */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(uploadFrom === 'forms') {
            requestSurvey();
        }
        else {
            uploadCsv();
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

    const deleteFile = () => {
        setFile(undefined);
    };

    const handleFileUpload = (e: ChangeEvent) => {
        const files = (e.target as HTMLInputElement).files;
        if(files) {
            if(files[0].name.split('.').pop() !== 'csv') {
                setFile(undefined);
                setFileError(true);
            }
            else {
                setFile(files[0]);
                setFileError(false);
            }
        }
    };

    useEffect(() => {
        //Every time new survey results are received, send the hackathon to the backend
        setResultsSubscription(
            googleFormsService.surveyResults$.subscribe((resultsData) => uploadGoogle(resultsData))
        );
        //Unsubscribe, when the component is destroyed
        return () => {
            resultsSubscription?.unsubscribe();
        }
    }, []);

    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>Upload a new hackathon</DialogTitle>
        <form onSubmit={handleSubmit} id="HackathonForm" className="p-6">
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
            <div className="mb-5">
                <FormControl fullWidth className="mb-2">
                    <FormLabel id="upload-source-label">Upload source</FormLabel>
                    <RadioGroup
                        defaultValue="forms"
                        aria-labelledby="upload-source-label"
                        value={uploadFrom}
                        onChange={(e) => setUploadFrom(e.target.value as 'forms' | 'csv')}>
                        <FormControlLabel
                            value="forms"
                            control={<Radio />}
                            label="Upload from Google Forms" />
                        <FormControlLabel
                            value="csv"
                            control={<Radio />}
                            label="Upload as CSV file" />
                    </RadioGroup>
                </FormControl>
                {uploadFrom === 'forms'
                    ? <div className="flex items-center mb-5">
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
                    : <>
                        <Button
                            component="label"
                            className="w-full h-14 mb-2"
                            variant="outlined"
                            endIcon={<FileUpload />}>
                            Click here to upload a CSV file
                            <input
                                type="file"
                                className="hidden"
                                name="file"
                                accept=".csv"
                                onChange={handleFileUpload} />
                        </Button>
                        {file
                            ? <div className="flex items-center justify-center gap-x-2">
                                <InsertDriveFile></InsertDriveFile>
                                <Typography>{file?.name}</Typography>
                                <IconButton onClick={deleteFile}>
                                    <Delete></Delete>
                                </IconButton>
                            </div>
                            : <></>
                        }
                        <Fade in={fileError} unmountOnExit>
                            <Alert severity="error">Please provide a CSV file</Alert>
                        </Fade>
                    </>
                }
            </div>
            <Button
                className="mb-5"
                fullWidth
                variant="contained"
                type="submit">
                {uploadState === 'loading'
                    ? <CircularProgress className="text-white" size={'1.5rem'} />
                    : 'Upload'
                }
            </Button>
            <Fade in={uploadState === 'error'} unmountOnExit>
                <Alert severity="error" className="mb-5">{uploadErrorMessage}</Alert>
            </Fade>
        </form>
    </Dialog>
}
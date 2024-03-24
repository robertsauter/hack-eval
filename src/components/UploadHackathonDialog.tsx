import { Alert, Button, Chip, CircularProgress, Dialog, DialogTitle, Fade, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { googleFormsService } from '../services/GoogleFormsService';
import { hackathonService } from '../services/HackathonService';
import type { HackathonInformation } from '../models/HackathonInformation';
import { Subscription } from 'rxjs';
import type { State } from '../lib/AsyncState';
import { Delete, FileUpload, InsertDriveFile } from '@mui/icons-material';
import { RawHackathon } from '../models/RawHackathon';
import { DatePicker } from '@mui/x-date-pickers';

export function UploadHackathonDialog(props: { open: boolean, onClose: () => void, onSuccess: () => void }) {
    const { open, onClose, onSuccess } = props;

    const [file, setFile] = useState<File>();
    const [uploadFrom, setUploadFrom] = useState<'forms' | 'csv'>('forms');
    const [fileError, setFileError] = useState(false);
    const [types, setTypes] = useState<HackathonInformation['types']>([]);
    const [subscriptions] = useState<Subscription[]>([]);
    const [uploadState, setUploadState] = useState<State>('initial');
    const [errorMessage, setErrorMessage] = useState('');

    /** Reset all form values */
    const resetForm = () => {
        const elements = (document.getElementById('HackathonForm') as HTMLFormElement).elements;
        (elements.namedItem('title') as HTMLInputElement).value = '';
        (elements.namedItem('incentives') as HTMLInputElement).value = '';
        (elements.namedItem('venue') as HTMLInputElement).value = '';
        (elements.namedItem('size') as HTMLInputElement).value = '';
        (elements.namedItem('start') as HTMLInputElement).value = '';
        (elements.namedItem('end') as HTMLInputElement).value = '';
        (elements.namedItem('link') as HTMLInputElement).value = '';
        const id = elements.namedItem('id');
        if (id) {
            (id as HTMLInputElement).value = '';
        }
        setTypes([]);
        setFile(undefined);
    };

    /** Get all hackathon values of the form */
    const getValuesOfForm = (): FormData => {
        const form = document.getElementById('HackathonForm') as HTMLFormElement;
        return new FormData(form);
    };

    /** Try to get the survey, when an access token is still saved or request a new token */
    const requestSurvey = () => {
        const googleAccessToken = window.sessionStorage.getItem('google_access_token');
        if (googleAccessToken) {
            googleFormsService.getSurvey(JSON.parse(googleAccessToken));
        }
        else {
            googleFormsService.googleClient.requestAccessToken();
        }
    };

    /** React to the upload response */
    const handleUploadResponse = (response: Response) => {
        if (response.ok) {
            setUploadState('success');
            onClose();
            onSuccess();
            resetForm();
        }
        else {
            if (response.status === 409) {
                setErrorMessage('A hackathon with the same title and date already exists');
            }
            else {
                setErrorMessage('Upload failed');
            }
            setUploadState('error');
        }
    };

    /** Send CSV file to backend */
    const uploadCsv = async () => {
        if (!file) {
            setFileError(true);
        }
        else {
            setUploadState('loading');
            const formData = getValuesOfForm();
            const response = await hackathonService.uploadHackathonCsv(formData);
            handleUploadResponse(response);
        }
    };

    /** Upload from Google Forms */
    const uploadGoogle = async (resultsData: Partial<RawHackathon>) => {
        if (resultsData && resultsData.results) {
            setUploadState('loading');
            const formData = getValuesOfForm();
            const response = await hackathonService.uploadHackathonGoogle(formData, resultsData.results, resultsData.survey);
            handleUploadResponse(response);
        }
    };

    /** Handle the upload of a hackathon */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (uploadFrom === 'forms') {
            requestSurvey();
        }
        else {
            uploadCsv();
        }
    };

    const handleIdChange = (e: FormEvent<HTMLDivElement>) => {
        const id = (e.target as HTMLInputElement).value;
        googleFormsService.setFormId(id);
    };

    const handleFileUpload = (e: ChangeEvent) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
            if (files[0].name.split('.').pop() !== 'csv') {
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
        const resultsSubscription = googleFormsService.surveyResults$.subscribe((resultsData) => uploadGoogle(resultsData));
        subscriptions.push(resultsSubscription);
        const resultsErrorSubscription = googleFormsService.getResponsesError$.subscribe(() => {
            setUploadState('error');
            setErrorMessage('Your survey could not be loaded from Google forms');
        });
        subscriptions.push(resultsErrorSubscription);
        //Unsubscribe from all subscriptions, when the component is destroyed
        return () => {
            subscriptions.forEach((subscription) => subscription.unsubscribe());
        }
    }, []);

    return <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle className="font-bold">Upload a new hackathon</DialogTitle>
        <form onSubmit={handleSubmit} id="HackathonForm" className="pb-6 px-6">
            <TextField
                name="title"
                className="mb-5"
                fullWidth
                required
                variant="outlined"
                label="Title" />
            <FormControl fullWidth required>
                <InputLabel id="incentives">Incentives</InputLabel>
                <Select
                    name="incentives"
                    labelId="incentives"
                    className="mb-5"
                    variant="outlined"
                    label="Incentives">
                    <MenuItem value="cooperative">Cooperative</MenuItem>
                    <MenuItem value="competitive">Competitive</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel id="venue">Venue</InputLabel>
                <Select
                    name="venue"
                    labelId="venue"
                    className="mb-5"
                    variant="outlined"
                    label="Venue">
                    <MenuItem value="in person">In person</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel id="size">Size of your hackathon</InputLabel>
                <Select
                    name="size"
                    labelId="size"
                    className="mb-5"
                    variant="outlined"
                    label="Size of your hackathon">
                    <MenuItem value="small">Small (up to 50 participants)</MenuItem>
                    <MenuItem value="medium">Medium (up to 150 participants)</MenuItem>
                    <MenuItem value="large">Large (more than 150 participants)</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel id="types">Types</InputLabel>
                <Select
                    name="types"
                    labelId="types"
                    className="mb-5"
                    fullWidth
                    multiple
                    variant="outlined"
                    label="Types"
                    value={types}
                    onChange={(e) => setTypes(e.target.value as HackathonInformation['types'])}
                    renderValue={(selected: string[]) =>
                        <div className="flex gap-1">
                            {selected.map((value) =>
                                <Chip key={value} label={value} />
                            )}
                        </div>
                    }>
                    <MenuItem value="prototype">Prototype focused</MenuItem>
                    <MenuItem value="conceptual">Conceptual solution focused</MenuItem>
                    <MenuItem value="analysis">Analysis focused</MenuItem>
                    <MenuItem value="education">Education focused</MenuItem>
                    <MenuItem value="community">Community focused</MenuItem>
                    <MenuItem value="ideation">Ideation focused</MenuItem>
                </Select>
            </FormControl>
            <DatePicker
                className="mb-5 w-full"
                label="Start date"
                name="start"
                slotProps={{
                    textField: {
                        required: true
                    }
                }} />
            <DatePicker
                className="mb-5 w-full"
                label="End date"
                name="end"
                slotProps={{
                    textField: {
                        required: true
                    }
                }} />
            <TextField
                name="link"
                className="mb-5"
                fullWidth
                variant="outlined"
                label="Link to your hackathon" />
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
                            onInput={handleIdChange} />
                        <Tooltip title="You can find the ID of your survey in the URL" placement="top" arrow>
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
                                <IconButton onClick={() => setFile(undefined)}>
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
                <Alert severity="error" className="mb-5">{errorMessage}</Alert>
            </Fade>
        </form>
    </Dialog>;
}
import { Alert, Button, Checkbox, Chip, CircularProgress, Dialog, DialogTitle, Fade, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, Link, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Tooltip, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { googleFormsService } from '../services/GoogleFormsService';
import { hackathonService } from '../services/HackathonService';
import type { HackathonInformation, HackathonType } from '../models/HackathonInformation';
import type { State } from '../lib/AsyncState';
import { Close, Delete, FileUpload, InsertDriveFile } from '@mui/icons-material';
import { RawHackathon } from '../models/RawHackathon';
import { DatePicker } from '@mui/x-date-pickers';

export function UploadHackathonDialog(props: { open: boolean, onClose: () => void, onSuccess: () => void }) {

    const { open, onClose, onSuccess } = props;

    const [file, setFile] = useState<File>();
    const [uploadFrom, setUploadFrom] = useState<'forms' | 'csv'>('csv');
    const [fileError, setFileError] = useState(false);
    const [types, setTypes] = useState<HackathonInformation['types']>([]);
    const [uploadState, setUploadState] = useState<State>('initial');
    const [errorMessage, setErrorMessage] = useState('');
    const [formValid, setFormValid] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    /** Reset all form values */
    const resetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setTypes([]);
            setFile(undefined);
        }
    };

    /** Get all hackathon values of the form */
    const getValuesOfForm = (): FormData => {
        if (formRef.current) {
            return new FormData(formRef.current)
        }
        return new FormData();
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

    /** Set the inputted survey id for the google forms service to use */
    const handleIdChange = (e: FormEvent<HTMLDivElement>) => {
        const id = (e.target as HTMLInputElement).value;
        googleFormsService.setFormId(id);
    };

    /** Check the upload input element and set the uploaded file */
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

    /** Remove the uploaded file */
    const handleRemoveFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            setFile(undefined);
        }
    };

    /** Set the selected hackathon types */
    const handleChangeTypes = (e: SelectChangeEvent<HackathonType[]>) => {
        setTypes(e.target.value as HackathonInformation['types']);
    };

    /** Check the validity of all form elements to determine if the form is valid */
    const checkValidity = () => {
        if (formRef.current) {
            const formElements = formRef.current.elements;
            let valid = true;
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements.item(i);
                if (element?.tagName === 'INPUT') {
                    const typedElement = element as HTMLInputElement;
                    if (typedElement.type === 'file' && (typedElement.files?.length ?? 0) === 0) {
                        valid = false;
                    }
                    else if (!typedElement.validity.valid) {
                        valid = false;
                    }
                }
            }
            setFormValid(valid);
        }
    };

    /** Close the dialog */
    const handleClose = () => {
        resetForm();
        onClose();
    };

    useEffect(() => {
        //Every time new survey results are received, send the hackathon to the backend
        const resultsSubscription = googleFormsService.surveyResults$.subscribe((resultsData) => uploadGoogle(resultsData));
        const resultsErrorSubscription = googleFormsService.getResponsesError$.subscribe(() => {
            setUploadState('error');
            setErrorMessage('Your survey could not be loaded from Google forms');
        });
        const subscriptions = [resultsSubscription, resultsErrorSubscription];
        //Unsubscribe from all subscriptions, when the component is destroyed
        return () => {
            subscriptions.forEach((subscription) => subscription.unsubscribe());
        }
    }, []);

    useEffect(() => {
        checkValidity();
    }, [types, file]);

    return <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <IconButton className="absolute top-2 right-2" onClick={handleClose}>
            <Close />
        </IconButton>
        <DialogTitle className="font-bold">Upload a new hackathon</DialogTitle>
        <form
            onSubmit={handleSubmit}
            className="pb-6 px-6"
            onInput={checkValidity}
            ref={formRef}>
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
                    label="Incentives"
                    onChange={checkValidity}>
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
                    label="Venue"
                    onChange={checkValidity}>
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
                    label="Size of your hackathon"
                    onChange={checkValidity}>
                    <MenuItem value="small">Small (up to 50 participants)</MenuItem>
                    <MenuItem value="medium">Medium (up to 150 participants)</MenuItem>
                    <MenuItem value="large">Large (more than 150 participants)</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel id="types">Focus</InputLabel>
                <Select
                    name="types"
                    labelId="types"
                    className="mb-5"
                    fullWidth
                    multiple
                    variant="outlined"
                    label="Focus"
                    value={types}
                    onChange={handleChangeTypes}
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
                onChange={checkValidity}
                slotProps={{
                    textField: {
                        required: true
                    }
                }} />
            <DatePicker
                className="mb-5 w-full"
                label="End date"
                name="end"
                onChange={checkValidity}
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
                {/*Google: remove hidden class to show radio buttons again*/}
                <FormControl fullWidth className="mb-2 hidden">
                    <FormLabel id="upload-source-label">Upload source</FormLabel>
                    <RadioGroup
                        defaultValue="csv"
                        aria-labelledby="upload-source-label"
                        value={uploadFrom}
                        onChange={(e) => setUploadFrom(e.target.value as 'forms' | 'csv')}>
                        <FormControlLabel
                            value="csv"
                            control={<Radio />}
                            label="Upload as CSV file" />
                        <FormControlLabel
                            value="forms"
                            control={<Radio />}
                            label="Upload from Google Forms"
                            disabled />
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
                                ref={fileInputRef}
                                onChange={handleFileUpload} />
                        </Button>
                        {file
                            ? <div className="flex items-center justify-center gap-x-2">
                                <InsertDriveFile></InsertDriveFile>
                                <Typography>{file?.name}</Typography>
                                <IconButton onClick={handleRemoveFile}>
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
            <div className="flex items-center mb-5">
                <Checkbox name="consent" required />
                <Typography>I agree to the <Link href="https://hackathon-planning-kit.org/files/terms_and_conditions.pdf" target="_blank">terms and conditions</Link>*</Typography>
            </div>
            <Button
                className="mb-5"
                fullWidth
                variant="contained"
                type="submit"
                disabled={!formValid}>
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
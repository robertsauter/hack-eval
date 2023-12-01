import { Button, TextField } from '@mui/material';
import { googleFormsService } from '../services/GoogleFormsService';
import { FormEvent } from 'react';

export function Overview() {
    const uploadForm = async () => {
        const googleAccessToken = window.sessionStorage.getItem('google_access_token');
        if(googleAccessToken) {
            googleFormsService.getAndSaveSurvey(JSON.parse(googleAccessToken));
        }
        else {
            googleFormsService.googleClient.requestAccessToken();
        }
    };

    const setFormId = (event: FormEvent<HTMLDivElement>) => {
        googleFormsService.setNewFormId((event.target as HTMLInputElement).value);
    };

    return (
        <>
            <TextField onInput={setFormId}></TextField>
            <Button onClick={uploadForm}>Upload survey</Button>
        </>
    );
}
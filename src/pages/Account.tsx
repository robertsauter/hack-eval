import { Save } from '@mui/icons-material';
import { Alert, CircularProgress, Container, IconButton, InputAdornment, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { userService } from '../services/userService';
import { State } from '../lib/AsyncState';

export default function Account() {

    const [updateUsernameState, setUpdateUsernameState] = useState<State>('initial');
    const [updatePasswordState, setUpdatePasswordState] = useState<State>('initial');

    const [snackbarShown, setSnackbarShown] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleUsernameSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdateUsernameState('loading');
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await userService.updateUsername(formData);
        setUpdateUsernameState('initial');
        if (response.ok) {
            showSnackbar('Username updated successfully', 'success');
        }
        else {
            showSnackbar('Username already taken', 'error');
        }
    };

    const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdatePasswordState('loading');
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await userService.updatePassword(formData);
        setUpdatePasswordState('initial');
        if (response.ok) {
            showSnackbar('Password updated successfully', 'success');
        }
        else {
            showSnackbar('Password incorrect', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarShown(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarShown(false);
    };

    return <Container className="pt-5" maxWidth="sm">
        <Typography className="mb-16 text-center font-bold" variant="h4">Your account</Typography>
        <form id="usernameForm" onSubmit={handleUsernameSubmit}>
            <Typography className="mb-4" variant="body1">Change your username</Typography>
            <TextField
                name="username"
                className="mb-10"
                fullWidth
                variant="outlined"
                label="Username"
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        {updateUsernameState === 'loading'
                            ? <CircularProgress size="1.5rem" />
                            : <Tooltip title="Save username" placement="top" arrow>
                                <IconButton type="submit">
                                    <Save />
                                </IconButton>
                            </Tooltip>
                        }
                    </InputAdornment>
                }} />
        </form>
        <form id="passwordForm" onSubmit={handlePasswordSubmit}>
            <Typography className="mb-4" variant="body1">Change your password</Typography>
            <TextField
                name="old_password"
                className="mb-5"
                fullWidth
                variant="outlined"
                label="Old password"
                required
                type="password" />
            <TextField
                name="new_password"
                className="mb-5"
                fullWidth
                variant="outlined"
                label="New password"
                required
                type="password"
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        {updatePasswordState === 'loading'
                            ? <CircularProgress size="1.5rem" />
                            : <Tooltip title="Save password" placement="top" arrow>
                                <IconButton type="submit">
                                    <Save />
                                </IconButton>
                            </Tooltip>
                        }
                    </InputAdornment>
                }} />
        </form>
        <Snackbar
            open={snackbarShown}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
                onClose={handleCloseSnackbar}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    </Container>
}
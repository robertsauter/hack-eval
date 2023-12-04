import { TextField, Button, Container, Typography, Alert, Fade } from '@mui/material';
import { Link as RouterLink, Form as RouterForm, redirect } from 'react-router-dom';
import { userService } from '../services/UserService';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { loginState } from '../lib/AsyncState';

/** Login the user and redirect, if successful */
export async function action(action: { request: Request, params: {} }) {
    const formData = await action.request.formData();
    const response = await userService.login(formData);
    if(response.ok) {
        return redirect('/');
    }
    else if(response.status === 401) {
        loginState.setError('Username or password could not be found.');
        return null;
    }
    loginState.setError('An unknown error occured.');
    return null;
}

export default function Login() {
    const [loginErrorSubscription, setLoginErrorSubscription] = useState<Subscription>();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setLoginErrorSubscription(loginState.stateChanges$.subscribe((stateChange) => {
            if(stateChange.state === 'error') {
                setError(true);
                if(stateChange.message) {
                    setErrorMessage(stateChange.message);
                }
            }
        }));

        return () => {
            loginErrorSubscription?.unsubscribe();
        }
    }, []);

    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center" variant="h4">Login</Typography>
            <RouterForm method="POST" onClick={() => setError(false)}>
                <TextField
                    name="username"
                    className="mb-5"
                    fullWidth
                    required
                    variant="outlined"
                    label="Username" />
                <TextField
                    name="password"
                    className="mb-5"
                    fullWidth
                    required
                    variant="outlined"
                    label="Password"
                    type="password" />
                <Button
                    className="mb-5"
                    fullWidth
                    variant="contained"
                    type="submit">
                    Login
                </Button>
                <Fade in={error} unmountOnExit>
                    <Alert className="mb-5" severity="error">{errorMessage}</Alert>
                </Fade>
            </RouterForm>
            <div className="flex items-center justify-end">
                <Typography className="mr-2">Don't have an account yet?</Typography>
                <RouterLink to={'/register'}>
                    <Typography>Register</Typography>
                </RouterLink>
            </div>
        </Container>
    );
}
import { TextField, Button, Container, Typography, Fade, Alert } from '@mui/material';
import { Form as RouterForm, Link as RouterLink, redirect } from 'react-router-dom';
import { userService } from '../services/UserService';
import { registerState } from '../lib/AsyncState';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

/** Register a new user and redirect if successful */
export async function action(action: { request: Request, params: {} }) {
    const formData = await action.request.formData();
    const response = await userService.register(formData);
    if(response.ok) {
        return redirect('/login');
    }
    else if(response.status === 409) {
        registerState.setError('Username is already taken.');
        return null;
    }
    registerState.setError('An unknown error occured.');
    return null
}

export default function Register() {
    const [registerErrorSubscription, setRegisterErrorSubscription] = useState<Subscription>();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setRegisterErrorSubscription(registerState.stateChanges$.subscribe((change) => {
            if(change.state === 'error') {
                setError(true);
                if(change.message) {
                    setErrorMessage(change.message);
                }
            }
        }));

        return () => {
            registerErrorSubscription?.unsubscribe();
        }
    }, []);

    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center" variant="h4">Register</Typography>
            <RouterForm method="POST" onClick={() => setError(false)}>
                <TextField
                    name="username"
                    type="text"
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
                    type="submit"
                    className="mb-5"
                    fullWidth
                    variant="contained">
                    Register
                </Button>
                <Fade in={error} unmountOnExit>
                    <Alert className="mb-5" severity="error">{errorMessage}</Alert>
                </Fade>
            </RouterForm>
            <div className="flex items-center justify-end">
                <Typography className="mr-2">Already have an account?</Typography>
                <RouterLink to={'/login'}>
                    <Typography>Login</Typography>
                </RouterLink>
            </div>
        </Container>
    );
}
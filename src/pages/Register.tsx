import { TextField, Button, Container, Typography, Fade, Alert, CircularProgress } from '@mui/material';
import { Form as RouterForm, Link, redirect } from 'react-router-dom';
import { userService } from '../services/userService';
import { asyncRegisterState } from '../lib/AsyncState';
import type { State } from '../lib/AsyncState';
import { useEffect, useState } from 'react';

/** Register a new user and redirect if successful */
export async function action(action: { request: Request, params: {} }) {
    asyncRegisterState.setLoading();
    const formData = await action.request.formData();
    const response = await userService.register(formData);
    if (response.ok) {
        return redirect('/login');
    }
    else if (response.status === 409) {
        asyncRegisterState.setError('Username is already taken.');
        return null;
    }
    asyncRegisterState.setError('An unknown error occured.');
    return null
}

export default function Register() {
    const [registerState, setRegisterState] = useState<State>('initial');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const registerStateSubscription = asyncRegisterState.stateChanges$.subscribe((stateChange) => {
            setRegisterState(stateChange.state);
            if (stateChange.state === 'error' && stateChange.message) {
                setErrorMessage(stateChange.message);
            }
        });

        return () => {
            registerStateSubscription.unsubscribe();
        }
    }, []);

    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center font-bold" variant="h4">Register</Typography>
            <RouterForm method="POST" onClick={() => setRegisterState('initial')}>
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
                    {registerState === 'loading'
                        ? <CircularProgress className="text-white" size={'1.5rem'} />
                        : 'Register'
                    }
                </Button>
                <Fade in={registerState === 'error'} unmountOnExit>
                    <Alert className="mb-5" severity="error">{errorMessage}</Alert>
                </Fade>
            </RouterForm>
            <div className="flex items-center justify-end">
                <Typography className="mr-2">Already have an account?</Typography>
                <Link to={'/login'}>
                    <Typography>Login</Typography>
                </Link>
            </div>
        </Container>
    );
}
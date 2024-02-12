import { TextField, Button, Container, Typography, Alert, Fade, CircularProgress } from '@mui/material';
import { Link, Form as RouterForm, redirect } from 'react-router-dom';
import { userService } from '../services/UserService';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { asyncLoginState } from '../lib/AsyncState';
import type { State } from '../lib/AsyncState';

/** Login the user and redirect, if successful */
export async function action(action: { request: Request, params: {} }) {
    asyncLoginState.setLoading();
    const formData = await action.request.formData();
    const response = await userService.login(formData);
    if(response.ok) {
        return redirect('/');
    }
    else if(response.status === 401) {
        asyncLoginState.setError('Username or password could not be found.');
        return null;
    }
    asyncLoginState.setError('An unknown error occured.');
    return null;
}

export default function Login() {
    const [loginStateSubscription, setLoginStateSubscription] = useState<Subscription>();
    const [loginState, setLoginState] = useState<State>('initial');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setLoginStateSubscription(asyncLoginState.stateChanges$.subscribe((stateChange) => {
            setLoginState(stateChange.state);
            if(stateChange.state === 'error' && stateChange.message) {
                setErrorMessage(stateChange.message);
            }
        }));

        return () => {
            loginStateSubscription?.unsubscribe();
        }
    }, []);

    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center font-bold" variant="h4">Login</Typography>
            <RouterForm method="POST" onClick={() => asyncLoginState.setInitial()}>
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
                    {loginState === 'loading'
                        ? <CircularProgress className="text-white" size={'1.5rem'} />
                        : 'Login'
                    }
                </Button>
                <Fade in={loginState === 'error'} unmountOnExit>
                    <Alert className="mb-5" severity="error">{errorMessage}</Alert>
                </Fade>
            </RouterForm>
            <div className="flex items-center justify-end">
                <Typography className="mr-2">Don't have an account yet?</Typography>
                <Link to={'/register'}>
                    <Typography>Register</Typography>
                </Link>
            </div>
        </Container>
    );
}
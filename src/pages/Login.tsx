import { TextField, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink, Form as RouterForm, redirect } from 'react-router-dom';
import { login } from '../services/userService';
import { setUserLoggedIn } from '../lib/auth';
import { Token } from '../models/Token';

export async function action(action: { request: Request, params: {} }) {
    const formData = await action.request.formData();
    const response = await login(formData);
    if(response.ok) {
        const token: Token = await response.json();
        setUserLoggedIn(token);
        return redirect('/');
    }
    //Error handling could be added here
    return null;
}

export default function Login() {
    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center" variant="h4">Login</Typography>
            <RouterForm method="POST">
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
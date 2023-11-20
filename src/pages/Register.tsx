import { TextField, Button, Container, Typography } from '@mui/material';
import { Form as RouterForm, Link as RouterLink, redirect } from 'react-router-dom';
import { userService } from '../services/UserService';

/** Register a new user and redirect if successful */
export async function action(action: { request: Request, params: {} }) {
    const formData = await action.request.formData();
    const success = await userService.register(formData);
    if(success) {
        return redirect('/login');
    }
    //Error handling could be added here
    return null;
}

export default function Register() {
    return (
        <Container className="pt-5" maxWidth="sm">
            <Typography className="mb-8 text-center" variant="h4">Register</Typography>
            <RouterForm method="POST">
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
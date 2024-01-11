import { Button, Container } from '@mui/material';
import { useState } from 'react';
import { UploadHackathonDialog } from '../components/UploadHackathonDialog';

export function Overview() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSuccess = () => {
        console.log('RELOAD ON SUCCESS');
    }

    return (
        <Container className="pt-5" maxWidth="md">
            <Button variant="contained" onClick={() => setIsDialogOpen(true)}>Upload a new hackathon</Button>
            <UploadHackathonDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleSuccess}></UploadHackathonDialog>
        </Container>
    );
}
import { Alert, Button, CircularProgress, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { UploadHackathonDialog } from '../components/UploadHackathonDialog';
import { hackathonService } from '../services/HackathonService';
import { State } from '../lib/AsyncState';
import { HackathonInformation } from '../models/HackathonInformation';
import { HackathonCard } from '../components/HackathonCard';

export function Overview() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hackathons, setHackathons] = useState<HackathonInformation[]>([]);
    const [hackathonsState, setHackathonsState] = useState<State>('initial');
    const [selectedHackathonIds, setSelectedHackathonIds] = useState<string[]>([]);

    const handleUploadSuccess = () => {
        getHackathons();
    };

    const getHackathons = async () => {
        setHackathonsState('loading');
        const response = await hackathonService.getHackathonsOfLoggedInUser();

        if(response.ok) {
            setHackathons(await response.json());
            setHackathonsState('success');
        }
        else {
            setHackathonsState('error');
        }
    };

    const addOrRemoveSelectedHackathon = (id: string, selected: boolean) => {
        if(selected) {
            setSelectedHackathonIds([...selectedHackathonIds, id]);
        }
        else {
            const filteredHackathonIds = selectedHackathonIds.filter((hackathonId) => hackathonId !== id);
            setSelectedHackathonIds(filteredHackathonIds);
        }
    };

    useEffect(() => {
        getHackathons();
    }, []);

    return (
        <Container className="pt-5" maxWidth="md">
            <div className="mb-10">
                <Button variant="contained" onClick={() => setIsDialogOpen(true)}>Upload a new hackathon</Button>
                <UploadHackathonDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleUploadSuccess}></UploadHackathonDialog>
            </div>
            {hackathonsState === 'loading'
                ? <div className="flex items-center justify-center p-10">
                    <CircularProgress />
                </div>
            : hackathonsState === 'error'
                ? <div className="flex items-center justify-center p-10">
                    <Alert severity="error">Hackathons could not be loaded.</Alert>
                </div>
            : hackathonsState === 'success'
                ? <div className="grid grid-cols-3 gap-5">
                    {hackathons.map((hackathon) =>
                        <HackathonCard
                            hackathon={hackathon}
                            selectEvent={addOrRemoveSelectedHackathon}
                            deleteEvent={getHackathons}
                            key={hackathon.id} />
                    )}
                </div>
                : <></>
            }
        </Container>
    );
}
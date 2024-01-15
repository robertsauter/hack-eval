import { Alert, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UploadHackathonDialog } from '../components/UploadHackathonDialog';
import { hackathonService } from '../services/HackathonService';
import { State } from '../lib/AsyncState';
import { HackathonInformation } from '../models/HackathonInformation';
import { HackathonCard } from '../components/HackathonCard';
import { Link as RouterLink } from 'react-router-dom';
import { Add } from '@mui/icons-material';

export function Overview() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hackathons, setHackathons] = useState<HackathonInformation[]>([]);
    const [hackathonsState, setHackathonsState] = useState<State>('initial');
    const [selectedHackathonIds, setSelectedHackathonIds] = useState<string[]>([]);

    /** Reload hackathons, when a new one was successfully uploaded */
    const handleUploadSuccess = () => {
        getHackathons();
    };

    /** Load all uploaded hackathons of the logged in user */
    const getHackathons = async () => {
        setHackathonsState('loading');
        setSelectedHackathonIds([]);
        const response = await hackathonService.getHackathonsOfLoggedInUser();

        if(response.ok) {
            setHackathons(await response.json());
            setHackathonsState('success');
        }
        else {
            setHackathonsState('error');
        }
    };

    /** Update the list of selected hackathon ids */
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
        <>
            <Container className="pt-5" maxWidth="md">
                <div className="mb-10 flex justify-between items-center">
                    <Typography variant="h4" className="font-bold">Your hackathons</Typography>
                    <Button
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                        endIcon={<Add />}>
                        Upload a new hackathon
                    </Button>
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
            <RouterLink to={`/analysis/${selectedHackathonIds.join(',')}`}>
                <Button
                    variant="contained"
                    className="absolute bottom-5 right-5"
                    disabled={selectedHackathonIds.length === 0}>
                    See analysis
                </Button>
            </RouterLink>
            <UploadHackathonDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleUploadSuccess} />
        </>
    );
}
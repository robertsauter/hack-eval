import { Alert, Button, CircularProgress, Container, Fab, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UploadHackathonDialog } from '../components/UploadHackathonDialog';
import { hackathonService } from '../services/HackathonService';
import { State } from '../lib/AsyncState';
import { HackathonInformation } from '../models/HackathonInformation';
import { HackathonCard } from '../components/HackathonCard';
import { Link } from 'react-router-dom';
import { Add, Download } from '@mui/icons-material';

export function Overview() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hackathons, setHackathons] = useState<HackathonInformation[]>([]);
    const [hackathonsState, setHackathonsState] = useState<State>('initial');
    const [selectedHackathonIds, setSelectedHackathonIds] = useState<string[]>([]);
    const [downloadState, setDownloadState] = useState<State>('initial');
    const [downloadErrorShown, setDownloadErrorShown] = useState(false);

    /** Reload hackathons, when a new one was successfully uploaded */
    const handleUploadSuccess = () => {
        getHackathons();
    };

    /** Load all uploaded hackathons of the logged in user */
    const getHackathons = async () => {
        setHackathonsState('loading');
        setSelectedHackathonIds([]);
        const response = await hackathonService.getHackathonsOfLoggedInUser();

        if (response.ok) {
            setHackathons(await response.json());
            setHackathonsState('success');
        }
        else {
            setHackathonsState('error');
        }
    };

    /** Update the list of selected hackathon ids */
    const addOrRemoveSelectedHackathon = (id: string, selected: boolean) => {
        if (selected) {
            setSelectedHackathonIds([...selectedHackathonIds, id]);
        }
        else {
            const filteredHackathonIds = selectedHackathonIds.filter((hackathonId) => hackathonId !== id);
            setSelectedHackathonIds(filteredHackathonIds);
        }
    };

    /** Call service method to download all hackathon data as csv */
    const downloadHackathonData = async () => {
        setDownloadState('loading');
        const response = await hackathonService.getHackathonData();

        if (response.ok) {
            await hackathonService.downloadCsvStringAsFile(await response.json());
            setDownloadState('initial');
        }
        else {
            setDownloadState('initial');
            setDownloadErrorShown(true);
        }
    };

    /** Hide the error message */
    const handleCloseError = () => {
        setDownloadErrorShown(false);
    };

    useEffect(() => {
        getHackathons();
    }, []);

    return (
        <>
            <Container className="pt-5" maxWidth="md">
                <div className="mb-10 flex justify-between items-center">
                    <Typography variant="h4" className="font-bold">Your hackathons</Typography>
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="outlined"
                            onClick={downloadHackathonData}
                            endIcon={<Download />}>
                            {downloadState === 'loading'
                                ? <CircularProgress size={'1.5rem'} />
                                : 'Download hackathon data'
                            }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setIsDialogOpen(true)}
                            endIcon={<Add />}>
                            Upload a new hackathon
                        </Button>
                    </div>
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
                            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {hackathons.map((hackathon) =>
                                    <HackathonCard
                                        hackathon={hackathon}
                                        onSelect={addOrRemoveSelectedHackathon}
                                        deleteEvent={getHackathons}
                                        selectedAmount={selectedHackathonIds.length}
                                        key={hackathon.id} />
                                )}
                            </div>
                            : <></>
                }
            </Container>
            <Link to={`/analysis/${selectedHackathonIds.join(',')}`}>
                <Fab
                    className="fixed bottom-5 right-5"
                    variant="extended"
                    color="primary"
                    disabled={selectedHackathonIds.length === 0}>
                    See analysis
                </Fab>
            </Link>
            <UploadHackathonDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleUploadSuccess} />
            <Snackbar
                open={downloadErrorShown}
                autoHideDuration={2000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="error" sx={{ width: '100%' }} onClose={handleCloseError}>
                    Hackathon data could not be downloaded
                </Alert>
            </Snackbar>
            <a id="DownloadLink" hidden download="hackathonData.csv"></a>
        </>
    );
}
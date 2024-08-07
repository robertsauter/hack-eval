import { Alert, Button, CircularProgress, Container, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UploadHackathonDialog } from '../components/UploadHackathonDialog';
import { hackathonService } from '../services/HackathonService';
import { State } from '../lib/AsyncState';
import { HackathonInformation } from '../models/HackathonInformation';
import { Add, Download } from '@mui/icons-material';
import { HackathonsTable } from '../components/HackathonsTable';
import { userService } from '../services/userService';

export function Overview() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hackathons, setHackathons] = useState<HackathonInformation[]>([]);
    const [hackathonsState, setHackathonsState] = useState<State>('initial');
    const [downloadState, setDownloadState] = useState<State>('initial');
    const [downloadErrorShown, setDownloadErrorShown] = useState(false);
    const [downloadShown, setDownloadShown] = useState(false);

    /** Reload hackathons, when a new one was successfully uploaded */
    const handleUploadSuccess = () => {
        getHackathons();
    };

    /** Load all uploaded hackathons of the logged in user */
    const getHackathons = async () => {
        setHackathonsState('loading');
        const response = await hackathonService.getHackathonsOfLoggedInUser();

        if (response.ok) {
            setHackathons(await response.json());
            setHackathonsState('success');
        }
        else {
            setHackathonsState('error');
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

    /** Check if the logged in user is an admin and if yes show the hackathons download */
    const checkIfAdminUser = async () => {
        const response = await userService.getUser();
        if (response.ok) {
            const user: { username: string, role?: string } = await response.json();
            if (user.role && user.role === 'admin') {
                setDownloadShown(true);
            }
        }
    };

    useEffect(() => {
        getHackathons();
        checkIfAdminUser();
    }, []);

    return <>
        <Container className="pt-5" maxWidth="xl">
            <div className="mb-10 flex justify-between items-center">
                <Typography variant="h4" className="font-bold">Your hackathons</Typography>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                    {downloadShown
                        ? <Button
                            variant="outlined"
                            onClick={downloadHackathonData}
                            endIcon={<Download />}>
                            {downloadState === 'loading'
                                ? <CircularProgress size={'1.5rem'} />
                                : 'Download hackathon data'
                            }
                        </Button>
                        : <></>
                    }
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
                        ? <HackathonsTable hackathons={hackathons} onDelete={getHackathons} />
                        : <></>
            }
        </Container>
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
    </>;
}
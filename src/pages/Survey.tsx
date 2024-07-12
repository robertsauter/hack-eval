import { Container, Link, Typography } from '@mui/material';

export function Survey() {
    return <Container maxWidth="md" className="pt-5">
        <Typography className="mb-10 font-bold" variant="h4">Survey templates</Typography>
        <Typography className="mb-4">This tool is based on a shared survey instrument that can be used to assess the perception of hackathon participants. To get started with the survey, use one of the templates below:</Typography>
        <Link href="/" target="_blank" className="block mb-4">Survey template on LimeSurvey</Link>
        <Link href="/" target="_blank">Download survey template as PDF</Link>
    </Container>;
}
import { Container, Link, Typography } from '@mui/material';

export function Survey() {
    return <Container maxWidth="md" className="pt-5">
        <Typography className="mb-10 font-bold" variant="h4">Survey templates</Typography>
        <Typography className="mb-4">This tool is based on a shared survey instrument that can be used to assess the perception of hackathon participants. To get started with the survey, you can use one of the templates below:</Typography>
        <Link href="https://hackathon-planning-kit.org/files/hackathon_survey_template.pdf" target="_blank" className="block mb-4">Download survey as PDF</Link>
        <Link href="https://hackathon-planning-kit.org/files/hackathon_survey_template.lss" download>Download survey as LimeSurvey template</Link>
    </Container>;
}
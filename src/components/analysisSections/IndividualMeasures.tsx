import { Card, CardContent, Typography } from '@mui/material';
import { RadarChart } from '../charts/RadarChart';
import { AnalysisData } from '../../models/Analysis';
import { BarChart } from '../charts/BarChart';
import { BaseAnalysisSection } from './BaseAnalysisSection';
import { BaseChartCard } from '../charts/BaseChartCard';

export function IndividualMeasures(props: { data: AnalysisData }) {

    const { data } = props;

    const getQuestionFromAnalysis = (data: AnalysisData, questionTitle: string): AnalysisData => {
        return {
            selected: {
                ...data.selected,
                results: data.selected.results.filter((question) => question.title === questionTitle)
            },
            comparisons: data.comparisons.map((comparison) => ({
                ...comparison,
                results: comparison.results.filter((question) => question.title === questionTitle)
            }))
        }
    };

    const motivation = getQuestionFromAnalysis(data, 'To what extent was your decision to participate in this hackathon motivated by...');
    const eventParticipation = getQuestionFromAnalysis(data, 'How many hackathons have you participated in the past?');

    return <BaseAnalysisSection title="Individual measures">
        <BaseChartCard title="Motivation">
            <RadarChart data={motivation} />
        </BaseChartCard>
        <BaseChartCard title="Event participation">
            <BarChart data={eventParticipation} />
        </BaseChartCard>
    </BaseAnalysisSection>;
}
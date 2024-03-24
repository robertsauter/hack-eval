import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';

export const DataTable = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838'];

    /** Decide which color should be displayed for the reliability */
    const getReliabilityColor = (reliability: number) => {
        if (reliability < 0.6) return '#d32f2f';
        else if (reliability < 0.7) return '#ed6c02';
        return '#2e7d32';
    };

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Hackathon</TableCell>
                <TableCell>M</TableCell>
                <TableCell>N</TableCell>
                <TableCell>SD</TableCell>
                <TableCell>Cronbach's &alpha;</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {question.values?.map((hackathon, i) => <TableRow>
                <TableCell className="flex items-center gap-2">
                    <div className={`h-4 min-w-[1rem]`} style={{ backgroundColor: colors[i] }}></div>
                    {hackathon.hackathonTitle}
                </TableCell>
                <TableCell>{analysisService.roundValue(hackathon.statisticalValues?.average ?? 0, 2)}</TableCell>
                <TableCell>{hackathon.statisticalValues?.participants}</TableCell>
                <TableCell>{analysisService.roundValue(hackathon.statisticalValues?.deviation ?? 0, 2)}</TableCell>
                <TableCell
                    style={{ color: getReliabilityColor(hackathon.statisticalValues?.cronbach_alpha ?? 0) }}>
                    {analysisService.roundValue(hackathon.statisticalValues?.cronbach_alpha ?? 0, 2)}
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>;
});
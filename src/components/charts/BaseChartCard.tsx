import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

export function BaseChartCard(props: { title: string, children: ReactNode }) {

    const { title, children } = props;

    return <Card>
        <CardContent>
            <Typography variant="h6" className="text-center mb-2">{title}</Typography>
            {children}
        </CardContent>
    </Card>;
}
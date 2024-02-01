import { ResponsivePie } from '@nivo/pie';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Card, CardContent, Typography } from '@mui/material';
import { memo } from 'react';

export const PieChartList = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.values?.map((hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution;
        if(distribution) {
            const values = (question.answers as string[]).map((answer) => {
                const value = distribution.hasOwnProperty(answer) ? distribution[answer] : 0
                return {
                    id: answer,
                    label: answer,
                    value
                }
            });
            return {
                hackathonTitle: hackathon.hackathonTitle,
                statisticalValues: values
            };
        }
        return {
            hackathonTitle: hackathon.hackathonTitle,
            statisticalValues: []
        }
    });

    return data
            ? <Card>
                <CardContent>
                    <Typography className="text-center mb-2">{question.title}</Typography>
                    <div className="grid grid-cols-1 gap-2">
                    {data.map((hackathon) =>
                        <div key={hackathon.hackathonTitle} className={hackathon.statisticalValues.length ? 'h-80' : 'flex items-center justify-center flex-col'}>
                            <Typography className="text-center">{hackathon.hackathonTitle}</Typography>
                            {hackathon.statisticalValues.length
                                ? <ResponsivePie
                                    data={hackathon.statisticalValues}
                                    margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                    valueFormat=">-.2f" />
                                : <Alert severity="info">Sadly, we don't have enough data to display a chart here :(</Alert>
                            }
                        </div>
                    )}
                    </div>
                </CardContent>
            </Card>
            : <></>;
})
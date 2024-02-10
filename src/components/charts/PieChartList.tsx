import { ComputedDatum, PieTooltipProps, ResponsivePie } from '@nivo/pie';
import type { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo } from 'react';
import { analysisService } from '../../services/AnalysisService';

type PieChartData = {
    id: string;
    label: string;
    value: number;
};

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

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();
    const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(question.values ?? []);

    /** Create a custom tooltip */
    const customTooltip = (props: PieTooltipProps<PieChartData>) => {
        return <div className="p-2 bg-white shadow-md rounded-md flex items-center gap-2">
            <div className="w-3 h-3" style={{backgroundColor: props.datum.color}}></div>
            <Typography>{props.datum.data.label}:</Typography>
            <Typography className="font-bold">{props.datum.data.value}</Typography>
        </div>;
    };

    /** Truncate the label, if it is too long */
    const truncateLabel = (props: ComputedDatum<PieChartData>) => {
        const label = props.data.label;
        if(label.length > 25) return `${label.substring(0, 22)}...`;
        return label;
    };

    return data
            ? hackathonsAmount > 1
                ? <Card>
                    <CardContent>
                        <div>
                            <div id={titleAsId} className="bg-white">
                                <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                                <div className="grid grid-cols-1 gap-2">
                                    {data.map((hackathon) =>
                                        <div key={hackathon.hackathonTitle} className={hackathon.statisticalValues.length ? 'h-80' : 'flex items-center justify-center flex-col'}>
                                            <Typography className="text-center">{hackathon.hackathonTitle}</Typography>
                                            {hackathon.statisticalValues.length
                                                ? <ResponsivePie
                                                    data={hackathon.statisticalValues}
                                                    margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                                    valueFormat=">-.0f"
                                                    arcLinkLabelsThickness={2}
                                                    activeOuterRadiusOffset={4}
                                                    cornerRadius={4}
                                                    arcLinkLabelsSkipAngle={5}
                                                    arcLabelsSkipAngle={5}
                                                    tooltip={customTooltip}
                                                    arcLinkLabel={truncateLabel} />
                                                : <Alert severity="info">Your filter combination "{hackathon.hackathonTitle}" did not return answers for this question.</Alert>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => analysisService.saveQuestionAsImage(titleAsId)}>Save chart as image</Button>
                    </CardActions>
                </Card>
                : <Card>
                    <CardContent>
                        <Typography className="text-center mb-2">{question.title}</Typography>
                        <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
                    </CardContent>
                </Card>
            : <></>;
})
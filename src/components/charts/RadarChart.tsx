import { GridLabelProps, ResponsiveRadar } from '@nivo/radar';
import { MappedAnalysisQuestion } from '../../models/Analysis';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { GroupDistributionDialog } from './GroupDistributionDialog';
import { analysisService } from '../../services/AnalysisService';

export const RadarChart = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const [distributionOpen, setDistributionOpen] = useState(false);

    const data = question.subQuestions?.filter((subQuestion) => {
        const hackathonsAmount = analysisService.getAmountOfNonEmptyAnalysesFromQuestion(subQuestion.values);
        return hackathonsAmount > 1;
    }).map((subQuestion) => {
        const mappedQuestion: Record<string, number | string> = { 'subQuestionTitle': subQuestion.title };
        subQuestion.values.forEach((value) => {
            mappedQuestion[value.hackathonTitle] = value.statisticalValues.average ?? 0;
        });
        return mappedQuestion;
    });

    const titles = question.subQuestions?.[0]
        ? question.subQuestions?.[0].values.map((value) => value.hackathonTitle)
        : [];

    const emptySubQuestions = question.subQuestions?.map((subQuestion) => {
        return {
            title: subQuestion.title,
            values: analysisService.getEmptyAnalysesFromQuestion(subQuestion.values)
        };
    });

    const titleAsId = question.title.replaceAll(' ', '').toLowerCase();

    /** Truncate the label, if it is too long and compute label position */
    const truncateLabel = (props: GridLabelProps) => {
        let label = props.id;
        const translateEnd = label.length > 25 ? -120 : -(label.length * 4);
        const translateMiddle = label.length > 25 ? -60 : -(label.length * 2.5);
        if(label.length > 25) label = `${label.substring(0, 22)}...`;
        return <g transform={`translate(${props.x}, ${props.y})`}>
            <g transform={`translate(${props.anchor === 'end' ? translateEnd : props.anchor === 'middle' ? translateMiddle : 0})`}>
                <text fontSize={11}>{label}</text>
            </g>
        </g>;
    };

    return data
        ? data.length
            ? <>
                <Card className="flex flex-col justify-center h-full">
                    <CardContent>
                        <div>
                            <div id={titleAsId} className="bg-white">
                                <Typography className="text-center mb-2 font-bold">{question.title}</Typography>
                                <div className="h-80">
                                    <ResponsiveRadar
                                        data={data}
                                        indexBy="subQuestionTitle"
                                        keys={titles}
                                        maxValue={5}
                                        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                        valueFormat=">-.2f"
                                        gridShape="linear"
                                        dotColor="white"
                                        dotBorderWidth={2}
                                        dotSize={8}
                                        gridLabel={truncateLabel}
                                        legends={[{
                                            anchor: 'bottom',
                                            direction: 'row',
                                            itemWidth: 100,
                                            itemHeight: 20,
                                            translateX: -50,
                                            translateY: -50
                                        }]} />
                                </div>
                                {emptySubQuestions?.map((subQuestion) =>
                                    subQuestion.values.map((hackathon) =>
                                        <Alert severity="info" className="mb-2">Your filter combination "{hackathon.hackathonTitle}" did not return answers for subquestion "{subQuestion.title}"</Alert>
                                    )
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={() => setDistributionOpen(true)}>See value distribution</Button>
                        <Button onClick={() => analysisService.saveQuestionAsImage(titleAsId)}>Save chart as image</Button>
                    </CardActions>
                </Card>
                <GroupDistributionDialog
                    open={distributionOpen}
                    onClose={() => setDistributionOpen(false)}
                    question={question} />
            </>
            : <Card>
                <CardContent>
                    <Typography className="text-center mb-2">{question.title}</Typography>
                    <Alert severity="info">Your filter combinations did not return answers for this question.</Alert>
                </CardContent>
            </Card>
        : <></>;
})
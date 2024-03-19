import { memo } from "react";
import { MappedAnalysisQuestion } from "../../models/Analysis";
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from "@nivo/scatterplot";
import { Typography } from "@mui/material";

type ScatterPlotData = {
    x: number;
    y: number;
};

export const ScatterPlot = memo((props: { question: MappedAnalysisQuestion }) => {

    const { question } = props;

    const data = question.values?.map((hackathon) => {
        if (hackathon.statisticalValues?.distribution) {
            return {
                id: hackathon.hackathonTitle,
                data: Object.entries(hackathon.statisticalValues?.distribution).map(([answer, value]) => ({
                    x: +answer,
                    y: value
                }))
            };
        }
        else {
            return {
                id: hackathon.hackathonTitle,
                data: []
            };
        }
    });

    const maxValue = question.values?.reduce((maxOverall, hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution as Record<string, number>;
        const maxInDistribution = Math.max(...Object.keys(distribution).map((key) => +key));
        return maxInDistribution > maxOverall ? maxInDistribution : maxOverall;
    }, 0);

    const highestAnswersAmount = question.values?.reduce((maxOverall, hackathon) => {
        const distribution = hackathon.statisticalValues?.distribution as Record<string, number>;
        const maxInDistribution = Math.max(...Object.values(distribution).map((key) => +key));
        return maxInDistribution > maxOverall ? maxInDistribution : maxOverall;
    }, 0);

    /** Create a custom tooltip */
    const scatterPlotTooltip = (props: ScatterPlotTooltipProps<ScatterPlotData>) => {
        return <div className="p-2 bg-white shadow-md rounded-md">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: props.node.color }}></div>
                <Typography className="font-bold">{props.node.serieId}:</Typography>
            </div>
            <Typography>Value={props.node.formattedX}</Typography>
            <Typography>n={props.node.yValue}</Typography>
        </div>;
    };

    return data
        ? <div className="h-80">
            <ResponsiveScatterPlot
                data={data}
                xScale={{ type: 'linear', min: 0, max: maxValue }}
                xFormat=">-.2f"
                yScale={{ type: 'linear', min: 0, max: highestAnswersAmount }}
                yFormat=">-.2f"
                margin={{ top: 50, right: 50, bottom: 75, left: 50 }}
                axisBottom={{
                    legend: 'Answer',
                    legendPosition: 'middle',
                    legendOffset: 40
                }}
                axisLeft={{
                    legend: 'Amount of answers',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                tooltip={scatterPlotTooltip}
                legends={[{
                    anchor: 'bottom',
                    direction: 'row',
                    itemWidth: 100,
                    itemHeight: 20,
                    translateY: 75
                }]} />
        </div>
        : <></>;
});
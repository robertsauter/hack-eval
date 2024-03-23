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

    const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560', '#f1e15b'];

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
                <div className="min-w-[1rem] h-4" style={{ backgroundColor: props.node.color }}></div>
                <Typography className="font-bold">{props.node.serieId}:</Typography>
            </div>
            <Typography>Value={props.node.formattedX}</Typography>
            <Typography>n={props.node.yValue}</Typography>
        </div>;
    };

    /** Create a custom legend */
    const customLegend = () => {
        return <div className="flex items-center justify-center gap-x-8 gap-y-2 flex-wrap">{question.values?.map((hackathon, i) =>
            <div key={`scatterPlotLegend${i}`} className="flex items-center">
                <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors[i] }}></div>
                <Typography className="text-xs">{`${hackathon.hackathonTitle} (N=${hackathon.statisticalValues?.participants})`}</Typography>
            </div>
        )}
        </div>;
    };

    return data
        ? <>
            <div className="h-80">
                <ResponsiveScatterPlot
                    data={data}
                    xScale={{ type: 'linear', min: 0, max: maxValue }}
                    xFormat=">-.2f"
                    yScale={{ type: 'linear', min: 0, max: highestAnswersAmount }}
                    yFormat=">-.2f"
                    margin={{ top: 50, right: 50, bottom: 65, left: 50 }}
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
                    tooltip={scatterPlotTooltip} />
            </div>
            {customLegend()}
        </>
        : <></>;
});
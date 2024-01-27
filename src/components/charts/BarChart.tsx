import { ResponsiveBar } from '@nivo/bar';
import { AnalysisData } from '../../models/Analysis';

export function BarChart(props: { data: AnalysisData }) {

    const { data } = props;

    const mappedData: Record<string, string | number>[] = [{
        'questionTitle': data.selected.title,
        'average': data.selected.results[0].statistical_values?.average || 0
    }];
    data.comparisons.forEach((comparison) => {
        mappedData.push({
            'questionTitle': comparison.title,
            'average': comparison.results[0].statistical_values?.average || 0
        });
    });

    return <div className="h-80">
        <ResponsiveBar
            data={mappedData}
            keys={['average']}
            indexBy="questionTitle"
            valueFormat=">-.2f"
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
    </div>;
}
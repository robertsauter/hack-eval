import { ResponsiveBar } from '@nivo/bar';
import { MappedAnalysisQuestion } from '../../models/Analysis';

export function BarChart(props: { question: MappedAnalysisQuestion }) {

    const { question } = props;

    const data = question.values?.map((value) => ({
            hackathonTitle: value.hackathonTitle,
            average: value.statisticalValues?.average || 0
        }
    ));

    return <div className="h-80">
        {data
            ? <ResponsiveBar
                data={data}
                keys={['average']}
                indexBy="hackathonTitle"
                valueFormat=">-.2f"
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }} />
            : <></>
        }
    </div>;
}
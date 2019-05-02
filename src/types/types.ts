type HasData<T = unknown> = (data: T) => Error | boolean;

type Styles = Partial<{
  width: string;
  height: string;
  margin: string;
  padding: string;
}>;

type Margin = Partial<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}>;

type Formats =
  | 'PERCENTAGE'
  | 'GROUPED_TWO_DIGITS'
  | 'GROUPED_THOUSANDS_TWO_DIGITS'
  | 'DAY_AND_MONTH'
  | 'SHORT_MONTH'
  | 'LARGE_MONTH'
  | 'ANY';

type Axis = Partial<{
  x: Partial<{
    visible: boolean;
    gridVisible: boolean;
    format: Formats;
    label: string;
  }>;
  y: Partial<{
    visible: boolean;
    gridVisible: boolean;
    format: Formats;
    label: string;
  }>;
}>;

type BarChart = Partial<{
  axis: Axis;
  margin: Margin;
}>;


type LineChart = Partial<{
  axis: Axis;
  margin: Margin;
}>;

type GraphData<T = number[][]> = Partial<{
  barChart: BarChart;
  lineChart: LineChart;
  styles: Styles;
  colors: string[];
  labels: string[];
  data: T;
  hasData: HasData;
}>;

type GraphMeta<T = number[][]> = {
  width: number;
  graphData: GraphData<T>;
};

///

// type JMHMetricMinData = {
//   score: number;
//   scoreError: number;
//   scoreUnit: string;
//   rawData: number[][];
// }

// type JMHMetricOptData = Partial<{
//     scoreConfidence?: number[];
//     scorePercentiles?: Partial<{
//       0.0: number;
//       50.0: number;
//       90.0: number;
//       95.0: number;
//       99.0: number;
//       99.9: number;
//       99.99: number;
//       99.999: number;
//       99.9999: number;
//       100.0: number;
//     }>;
// }>;

// type JMHMetric = JMHMetricMinData & JMHMetricOptData;

type JMHMetric = {
  score: number;
  scoreError: number;
  scoreUnit: string;
  rawData: number[][];
  scoreConfidence?: number[];
  scorePercentiles?: Partial<{
    0.0: number;
    50.0: number;
    90.0: number;
    95.0: number;
    99.0: number;
    99.9: number;
    99.99: number;
    99.999: number;
    99.9999: number;
    100.0: number;
  }>;
}

// type JMHMinData = {
//   benchmark: string;
//   mode: string;
//   primaryMetric: JMHMetric;
//   secondaryMetrics: object;
// };

// type JMHMaxData = Partial<{

// }>

type JMHData = Array<{
  benchmark: string;
  mode: string;
  primaryMetric: JMHMetric;
  secondaryMetrics?: object;
  jmhVersion?: string;
  threads?: number;
  forks?: number;
  jvm?: string;
  jvmArgs?: (string | number)[],
  jdkVersion?: string;
  vmName?: string;
  vmVersion?: string;
  warmupIterations?: number;
  warmupTime?: string;
  warmupBatchSize?: number;
  measurementIterations?: number;
  measurementTime?: string;
  measurementBatchSize?: number;
}>;


export { HasData, Styles, Margin, Formats, Axis, LineChart, GraphData, GraphMeta, JMHMetric, JMHData };
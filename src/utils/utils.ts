import { Formats, GraphData, HasData } from '@app/types/types';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';


const THROW_ERROR = (): Error => {
  throw new Error(`The data injected isn't valid.`);
};

export const hasDataIsNotempty: HasData<GraphData> = ({
  data,
  labels,
}): Error | boolean =>
  data.length > 0 && labels.length >= 1 ? true : THROW_ERROR();

export const formatterFunction: {
  [format in Formats]: (
    data: number | string | Date | { valueOf(): number },
  ) => string
} = {
  ['PERCENTAGE']: (data: number) => format('.0%')(data),
  ['GROUPED_TWO_DIGITS']: (data: number) => format('.2s')(data),
  ['GROUPED_THOUSANDS_TWO_DIGITS']: (data: number) => format(',.2r')(data),
  ['SHORT_MONTH']: (data: number) => timeFormat('%b')(new Date(data * 1000)),
  ['LARGE_MONTH']: (data: number) => timeFormat('%B')(new Date(data * 1000)),
  ['DAY_AND_MONTH']: (data: number) =>
    timeFormat('%b %d')(new Date(data * 1000)),
  ['ANY']: (data: string | number) => `${data}`,
};

export const formatter = (
  type: Formats,
  data: number | string | Date | { valueOf(): number }
): string => formatterFunction[type](data);



export const circularFind = (
  array: string[] | number[],
  index: number,
): string | number => {
  const remainder: number = index % array.length;
  return array[remainder];
};



export const initTooltipIfExists = (
  chartElement: HTMLElement,
  key: string = 'tooltip',
): HTMLTooltipChartElement => {
  const tooltip: { element: Element; component: HTMLTooltipChartElement } = {
    element: chartElement.getElementsByClassName(key)[0],
    component: null,
  };

  if (tooltip.element) {
    tooltip.component = chartElement.querySelector(`${key}-chart`);
    tooltip.component.tooltip(tooltip.element);
  }

  return tooltip.component;
};
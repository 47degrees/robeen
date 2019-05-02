import { Formats, GraphData, HasData } from '@app/types/types';

import { format } from 'd3-format';


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
  ['TWO_DECIMALS']: (data: number) => format(',.2f')(data),
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
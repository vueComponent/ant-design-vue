import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import type { PropType, VNodeChild, ExtractPropTypes } from 'vue';

export const progressStatuses = tuple('normal', 'exception', 'active', 'success');
export type ProgressStatusesType = typeof progressStatuses[number];
const ProgressType = tuple('line', 'circle', 'dashboard');
export type ProgressType = typeof ProgressType[number];
const ProgressSize = tuple('default', 'small');
export type ProgressSize = typeof ProgressSize[number];
export type StringGradients = { [percentage: string]: string };
type FromToGradients = { from: string; to: string };
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients);

export interface SuccessProps {
  percent?: number;
  strokeColor?: string;
}

export const progressProps = () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(ProgressType),
  percent: PropTypes.number,
  format: { type: Function as PropType<(percent?: number, successPercent?: number) => VNodeChild> },
  status: PropTypes.oneOf(progressStatuses),
  showInfo: PropTypes.looseBool,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(tuple('butt', 'round', 'square')),
  strokeColor: {
    type: [String, Object] as PropType<string | ProgressGradient>,
  },
  trailColor: PropTypes.string,
  width: PropTypes.number,
  success: {
    type: Object as PropType<SuccessProps>,
    default: (): SuccessProps => ({}),
  },
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(tuple('top', 'bottom', 'left', 'right')),
  size: PropTypes.oneOf(ProgressSize),
  steps: PropTypes.number,
  /** @deprecated Use `success` instead */
  successPercent: PropTypes.number,
});

export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;

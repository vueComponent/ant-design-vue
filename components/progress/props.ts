import PropTypes from '../_util/vue-types';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import type { PropType, ExtractPropTypes } from 'vue';

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
  prefixCls: String,
  type: PropTypes.oneOf(ProgressType),
  percent: Number,
  format: { type: Function as PropType<(percent?: number, successPercent?: number) => VueNode> },
  status: PropTypes.oneOf(progressStatuses),
  showInfo: { type: Boolean, default: undefined },
  strokeWidth: Number,
  strokeLinecap: String as PropType<'butt' | 'square' | 'round'>,
  strokeColor: {
    type: [String, Object] as PropType<string | ProgressGradient>,
    default: undefined as string | ProgressGradient,
  },
  trailColor: String,
  width: Number,
  success: {
    type: Object as PropType<SuccessProps>,
    default: (): SuccessProps => ({}),
  },
  gapDegree: Number,
  gapPosition: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
  size: PropTypes.oneOf(ProgressSize),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
});

export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;

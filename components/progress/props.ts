import type { VueNode } from '../_util/type';
import { functionType, stringType, anyType, objectType } from '../_util/type';
import type { ExtractPropTypes } from 'vue';

export const progressStatuses = ['normal', 'exception', 'active', 'success'] as const;
export type ProgressStatusesType = (typeof progressStatuses)[number];
const ProgressType = ['line', 'circle', 'dashboard'] as const;
export type ProgressType = (typeof ProgressType)[number];
const ProgressSize = ['default', 'small'] as const;
export type ProgressSize = (typeof ProgressSize)[number];
export type StringGradients = { [percentage: string]: string };
type FromToGradients = { from: string; to: string };
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients);

export interface SuccessProps {
  percent?: number;
  /** @deprecated Use `percent` instead */
  progress?: number;
  strokeColor?: string;
}

export const progressProps = () => ({
  prefixCls: String,
  type: stringType<ProgressType>(),
  percent: Number,
  format: functionType<(percent?: number, successPercent?: number) => VueNode>(),
  status: stringType<ProgressStatusesType>(),
  showInfo: { type: Boolean, default: undefined },
  strokeWidth: Number,
  strokeLinecap: stringType<'butt' | 'square' | 'round'>(),
  strokeColor: anyType<string | ProgressGradient>(),
  trailColor: String,
  width: Number,
  success: objectType<SuccessProps>(),
  gapDegree: Number,
  gapPosition: stringType<'top' | 'bottom' | 'left' | 'right'>(),
  size: stringType<ProgressSize>(),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
});

export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;

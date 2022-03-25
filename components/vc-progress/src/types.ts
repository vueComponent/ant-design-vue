import type { PropType, ExtractPropTypes } from 'vue';

export type StrokeColorType = string | string[] | object;

export type GapPositionType = 'top' | 'right' | 'bottom' | 'left';

export type StrokeLinecapType = 'round' | 'butt' | 'square';

export const propTypes = {
  gapDegree: Number,
  gapPosition: {
    type: String as PropType<GapPositionType>,
  },
  percent: {
    type: [Array, Number] as PropType<number | number[]>,
  },
  prefixCls: String,
  strokeColor: {
    type: [Object, String, Array] as PropType<StrokeColorType>,
  },
  strokeLinecap: {
    type: String as PropType<StrokeLinecapType>,
  },
  strokeWidth: Number,
  trailColor: String,
  trailWidth: Number,
  transition: String,
};

export type ProgressProps = Partial<ExtractPropTypes<typeof propTypes>>;

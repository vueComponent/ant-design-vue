import type { PropType, ExtractPropTypes } from 'vue';
import PropTypes from '../../_util/vue-types';

export type StrokeColorType = string | string[] | object;

export type GapPositionType = 'top' | 'right' | 'bottom' | 'left';

export type StrokeLinecapType = 'round' | 'butt' | 'square';

export const propTypes = {
  gapDegree: PropTypes.number,
  gapPosition: {
    type: String as PropType<GapPositionType>,
  },
  percent: {
    type: [Array, Number] as PropType<number | number[]>,
  },
  prefixCls: PropTypes.string,
  strokeColor: {
    type: [Object, String, Array] as PropType<StrokeColorType>,
  },
  strokeLinecap: {
    type: String as PropType<StrokeLinecapType>,
  },
  strokeWidth: PropTypes.number,
  trailColor: PropTypes.string,
  trailWidth: PropTypes.number,
  transition: PropTypes.string,
};

export type ProgressProps = Partial<ExtractPropTypes<typeof propTypes>>;

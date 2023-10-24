import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider/SizeContext';
import PropTypes from '../_util/vue-types';

export const flexProps = {
  prefixCls: String,
  vertical: Boolean,
  wrap: String as PropType<CSSProperties['flex-wrap']>,
  justify: String as PropType<CSSProperties['justify-content']>,
  align: String as PropType<CSSProperties['align-items']>,
  flex: [Number, String] as PropType<CSSProperties['flex']>,
  gap: [Number, String] as PropType<CSSProperties['gap'] | SizeType>,
  component: PropTypes.any,
};

export type FlexProps = Partial<ExtractPropTypes<typeof flexProps> & HTMLElement>;

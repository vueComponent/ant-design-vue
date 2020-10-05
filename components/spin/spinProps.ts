import { PropType } from 'vue';
import { VNodeElement, SpinSize } from './spinTypes';

const slotPropType = {
  type: [String, Number, Object, Array] as PropType<VNodeElement>,
};
export default () => ({
  prefixCls: String as PropType<string>,
  spinning: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  size: {
    type: String as PropType<SpinSize>,
    default: 'default',
    validate: (v: SpinSize) => ['small', 'default', 'large'].includes(v),
  },
  wrapperClassName: {
    type: String as PropType<string>,
    default: '',
  },
  tip: String as PropType<string>,
  delay: Number as PropType<number>,
  indicator: slotPropType,
});

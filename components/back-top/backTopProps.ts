import { PropType } from 'vue';
import { Fn } from './backTopTypes';

export default {
  visibilityHeight: {
    type: Number as PropType<number>,
    default: 400,
  },
  target: {
    type: Function as PropType<Fn>,
  },
  prefixCls: {
    type: String as PropType<string>,
  },
  onClick: {
    type: Function as PropType<Fn>,
  },
};

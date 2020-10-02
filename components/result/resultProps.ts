import { PropType } from 'vue';

import { StatusType, VNodeElement } from './resultTypes';

const slotPropType = {
  type: [String, Number, Object, Array] as PropType<VNodeElement>,
};

export default {
  prefixCls: {
    type: String as PropType<string>,
  },
  icon: slotPropType,
  status: {
    type: String as PropType<StatusType>,
    default: 'info',
  },
  title: slotPropType,
  subTitle: slotPropType,
  extra: slotPropType,
};

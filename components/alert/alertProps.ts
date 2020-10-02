import { PropType } from 'vue';

import { AlertType, VNodeElement } from './alertTypes';

const slotPropType = {
  type: [String, Number, Object, Array] as PropType<VNodeElement>,
};

function noop() {}

export default {
  closeText: slotPropType,
  message: slotPropType,
  description: slotPropType,
  icon: slotPropType,
  type: {
    type: String as PropType<AlertType>,
    validate: (v: AlertType) => ['success', 'info', 'warning', 'error'].includes(v),
  },
  closable: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  afterClose: {
    type: Function as PropType<() => void>,
    default: noop,
  },
  showIcon: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  prefixCls: {
    type: String as PropType<string>,
  },
  banner: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  onClose: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
};

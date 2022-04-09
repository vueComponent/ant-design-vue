import type { CSSProperties, PropType } from 'vue';
import PropTypes from '../_util/vue-types';

import buttonTypes from '../button/buttonTypes';
import type { MouseEventHandler } from '../_util/EventInterface';

export type Align = {
  points?: [string, string];
  offset?: [number, number];
  targetOffset?: [number, number];
  overflow?: {
    adjustX?: boolean;
    adjustY?: boolean;
  };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
};

export type Trigger = 'click' | 'hover' | 'contextmenu';

export type DropdownArrowOptions = {
  pointAtCenter?: boolean;
};
const dropdownProps = () => ({
  arrow: {
    type: [Boolean, Object] as PropType<boolean | DropdownArrowOptions>,
    default: undefined,
  },
  trigger: {
    type: [Array, String] as PropType<Trigger[] | Trigger>,
  },
  overlay: PropTypes.any,
  visible: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  align: { type: Object as PropType<Align> },
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  prefixCls: String,
  transitionName: String,
  placement: String as PropType<
    | 'topLeft'
    | 'topCenter'
    | 'top'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottom'
    | 'bottomRight'
  >,
  overlayClassName: String,
  overlayStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  forceRender: { type: Boolean, default: undefined },
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: { type: Boolean, default: undefined },
  destroyPopupOnHide: { type: Boolean, default: undefined },
  onVisibleChange: {
    type: Function as PropType<(val: boolean) => void>,
  },
  'onUpdate:visible': {
    type: Function as PropType<(val: boolean) => void>,
  },
});

const buttonTypesProps = buttonTypes();
const dropdownButtonProps = () => ({
  ...dropdownProps(),
  type: buttonTypesProps.type,
  size: String as PropType<'small' | 'large'>,
  htmlType: buttonTypesProps.htmlType,
  href: String,
  disabled: { type: Boolean, default: undefined },
  prefixCls: String,
  icon: PropTypes.any,
  title: String,
  loading: buttonTypesProps.loading,
  onClick: {
    type: Function as PropType<MouseEventHandler>,
  },
});

export { dropdownProps, dropdownButtonProps };

export default dropdownProps;

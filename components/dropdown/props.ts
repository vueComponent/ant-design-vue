import type { CSSProperties, PropType } from 'vue';
import PropTypes from '../_util/vue-types';

import buttonTypes from '../button/buttonTypes';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { MenuProps } from '../menu';
import { booleanType, eventType, objectType, someType } from '../_util/type';

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
  arrow: someType<boolean | DropdownArrowOptions>([Boolean, Object]),
  trigger: {
    type: [Array, String] as PropType<Trigger[] | Trigger>,
  },
  menu: objectType<MenuProps>(),
  overlay: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: booleanType(),
  open: booleanType(),
  disabled: booleanType(),
  danger: booleanType(),
  autofocus: booleanType(),
  align: objectType<Align>(),
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
  overlayStyle: objectType<CSSProperties>(),
  forceRender: booleanType(),
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: booleanType(),
  destroyPopupOnHide: booleanType(),
  /** @deprecated Please use `onOpenChange` instead */
  onVisibleChange: {
    type: Function as PropType<(val: boolean) => void>,
  },
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': {
    type: Function as PropType<(val: boolean) => void>,
  },
  onOpenChange: {
    type: Function as PropType<(val: boolean) => void>,
  },
  'onUpdate:open': {
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
  disabled: booleanType(),
  prefixCls: String,
  icon: PropTypes.any,
  title: String,
  loading: buttonTypesProps.loading,
  onClick: eventType<MouseEventHandler>(),
});

export { dropdownProps, dropdownButtonProps };

export default dropdownProps;

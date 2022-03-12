import { tuple } from '../_util/type';
import type { PropType } from 'vue';
import PropTypes from '../_util/vue-types';

import buttonTypes from '../button/buttonTypes';
import type { MouseEventHandler } from '../_util/EventInterface';

type Align = {
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

export type DropdownArrowOptions = {
  pointAtCenter?: boolean;
};
const dropdownProps = () => ({
  arrow: {
    type: [Boolean, Object] as PropType<boolean | DropdownArrowOptions>,
    default: undefined,
  },
  trigger: {
    type: [Array, String] as PropType<
      ('click' | 'hover' | 'contextmenu')[] | 'click' | 'hover' | 'contextmenu'
    >,
  },
  overlay: PropTypes.any,
  visible: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  align: { type: Object as PropType<Align> },
  getPopupContainer: PropTypes.func,
  prefixCls: PropTypes.string,
  transitionName: PropTypes.string,
  placement: PropTypes.oneOf(
    tuple(
      'topLeft',
      'topCenter',
      'top',
      'topRight',
      'bottomLeft',
      'bottomCenter',
      'bottom',
      'bottomRight',
    ),
  ),
  overlayClassName: PropTypes.string,
  overlayStyle: PropTypes.style,
  forceRender: PropTypes.looseBool,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  openClassName: PropTypes.string,
  minOverlayWidthMatchTrigger: PropTypes.looseBool,
  destroyPopupOnHide: PropTypes.looseBool,
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
  size: PropTypes.oneOf(tuple('small', 'large')),
  htmlType: buttonTypesProps.htmlType,
  href: PropTypes.string,
  disabled: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  icon: PropTypes.any,
  title: PropTypes.string,
  loading: buttonTypesProps.loading,
  onClick: {
    type: Function as PropType<MouseEventHandler>,
  },
});

export { dropdownProps, dropdownButtonProps };

export default dropdownProps;

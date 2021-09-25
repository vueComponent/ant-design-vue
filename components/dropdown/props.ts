import { tuple } from '../_util/type';
import type { PropType } from 'vue';
import PropTypes from '../_util/vue-types';

import buttonTypes from '../button/buttonTypes';

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
const dropdownProps = () => ({
  arrow: PropTypes.looseBool,
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
    tuple('topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight'),
  ),
  overlayClassName: PropTypes.string,
  overlayStyle: PropTypes.style,
  forceRender: PropTypes.looseBool,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  openClassName: PropTypes.string,
  minOverlayWidthMatchTrigger: PropTypes.looseBool,
});

const ButtonTypesProps = buttonTypes();
const dropdownButtonProps = () => ({
  ...dropdownProps(),
  type: PropTypes.oneOf(tuple('primary', 'ghost', 'dashed', 'default')),
  size: PropTypes.oneOf(tuple('small', 'large')),
  htmlType: ButtonTypesProps.htmlType,
  href: PropTypes.string,
  disabled: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  icon: PropTypes.any,
  title: PropTypes.string,
});

export { dropdownProps, dropdownButtonProps };

export default dropdownProps;

import { tuple } from '../_util/type';
import type { PropType } from 'vue';
import PropTypes from '../_util/vue-types';
export default () => ({
  trigger: {
    type: [Array, String] as PropType<
      ('click' | 'hover' | 'contextmenu')[] | 'click' | 'hover' | 'contextmenu'
    >,
    default: 'hover',
  },
  overlay: PropTypes.any,
  visible: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  align: PropTypes.object,
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

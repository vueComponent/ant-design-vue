import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
const triggerType = PropTypes.oneOf(tuple('hover', 'focus', 'click', 'contextmenu'));

export default () => ({
  trigger: PropTypes.oneOfType([triggerType, PropTypes.arrayOf(triggerType)]).def('hover'),
  visible: PropTypes.looseBool,
  defaultVisible: PropTypes.looseBool,
  placement: PropTypes.oneOf(
    tuple(
      'top',
      'left',
      'right',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
      'leftTop',
      'leftBottom',
      'rightTop',
      'rightBottom',
    ),
  ).def('top'),
  color: PropTypes.string,
  transitionName: PropTypes.string.def('zoom-big-fast'),
  overlayStyle: PropTypes.object.def(() => ({})),
  overlayClassName: PropTypes.string,
  openClassName: PropTypes.string,
  prefixCls: PropTypes.string,
  mouseEnterDelay: PropTypes.number.def(0.1),
  mouseLeaveDelay: PropTypes.number.def(0.1),
  getPopupContainer: PropTypes.func,
  arrowPointAtCenter: PropTypes.looseBool.def(false),
  autoAdjustOverflow: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]).def(true),
  destroyTooltipOnHide: PropTypes.looseBool.def(false),
  align: PropTypes.object.def(() => ({})),
  builtinPlacements: PropTypes.object,
  children: PropTypes.array,
  onVisibleChange: PropTypes.func,
  'onUpdate:visible': PropTypes.func,
});

import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
export const triggerTypes = tuple('hover', 'focus', 'click', 'contextmenu');

export const placementTypes = tuple(
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
);

export default () => ({
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf(triggerTypes),
    PropTypes.arrayOf(PropTypes.oneOf(triggerTypes)),
  ]),
  visible: PropTypes.looseBool,
  defaultVisible: PropTypes.looseBool,
  placement: PropTypes.oneOf(placementTypes),
  color: PropTypes.string,
  transitionName: PropTypes.string,
  overlayStyle: PropTypes.style,
  overlayClassName: PropTypes.string,
  openClassName: PropTypes.string,
  prefixCls: PropTypes.string,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  getPopupContainer: PropTypes.func,
  arrowPointAtCenter: PropTypes.looseBool,
  autoAdjustOverflow: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  destroyTooltipOnHide: PropTypes.looseBool,
  align: PropTypes.object,
  builtinPlacements: PropTypes.object,
  children: PropTypes.array,
  onVisibleChange: PropTypes.func,
  'onUpdate:visible': PropTypes.func,
});

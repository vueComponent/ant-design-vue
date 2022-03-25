import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import type { CSSProperties, PropType } from 'vue';
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
  visible: { type: Boolean, default: undefined },
  defaultVisible: { type: Boolean, default: undefined },
  placement: PropTypes.oneOf(placementTypes),
  color: String,
  transitionName: String,
  overlayStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  overlayClassName: String,
  openClassName: String,
  prefixCls: String,
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  getPopupContainer: Function,
  arrowPointAtCenter: { type: Boolean, default: undefined },
  autoAdjustOverflow: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  destroyTooltipOnHide: { type: Boolean, default: undefined },
  align: PropTypes.object,
  builtinPlacements: PropTypes.object,
  children: PropTypes.array,
  onVisibleChange: Function,
  'onUpdate:visible': Function,
});

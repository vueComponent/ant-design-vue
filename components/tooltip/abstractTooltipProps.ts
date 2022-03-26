import type { CSSProperties, PropType } from 'vue';
import type { AlignType, BuildInPlacements } from '../vc-trigger/interface';
import type { AdjustOverflow } from './placements';
export type TriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export default () => ({
  trigger: [String, Array] as PropType<TriggerType | TriggerType[]>,
  visible: { type: Boolean, default: undefined },
  defaultVisible: { type: Boolean, default: undefined },
  placement: String as PropType<TooltipPlacement>,
  color: String,
  transitionName: String,
  overlayStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  overlayClassName: String,
  openClassName: String,
  prefixCls: String,
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  arrowPointAtCenter: { type: Boolean, default: undefined },
  autoAdjustOverflow: {
    type: [Boolean, Object] as PropType<boolean | AdjustOverflow>,
    default: undefined as boolean | AdjustOverflow,
  },
  destroyTooltipOnHide: { type: Boolean, default: undefined },
  align: {
    type: Object as PropType<AlignType>,
    default: undefined as AlignType,
  },
  builtinPlacements: {
    type: Object as PropType<BuildInPlacements>,
    default: undefined as BuildInPlacements,
  },
  children: Array,
  onVisibleChange: Function as PropType<(vis: boolean) => void>,
  'onUpdate:visible': Function as PropType<(vis: boolean) => void>,
});

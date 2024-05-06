import type { CSSProperties, PropType } from 'vue';
import type { AlignType, BuildInPlacements } from '../vc-trigger/interface';
import type { AdjustOverflow } from '../_util/placements';
export type TriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';
import type { PresetColorType } from '../_util/colors';
import type { LiteralUnion } from '../_util/type';
import { objectType } from '../_util/type';
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
  open: { type: Boolean, default: undefined },
  /** @deprecated Please use `open` instead. */
  visible: { type: Boolean, default: undefined },
  placement: String as PropType<TooltipPlacement>,
  color: String as PropType<LiteralUnion<PresetColorType>>,
  transitionName: String,
  overlayStyle: objectType<CSSProperties>(),
  overlayInnerStyle: objectType<CSSProperties>(),
  overlayClassName: String,
  openClassName: String,
  prefixCls: String,
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  /**@deprecated Please use `arrow={{ pointAtCenter: true }}` instead. */
  arrowPointAtCenter: { type: Boolean, default: undefined },
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter?: boolean }>,
    default: true as boolean | { pointAtCenter?: boolean },
  },
  autoAdjustOverflow: {
    type: [Boolean, Object] as PropType<boolean | AdjustOverflow>,
    default: undefined as boolean | AdjustOverflow,
  },
  destroyTooltipOnHide: { type: Boolean, default: undefined },
  align: objectType<AlignType>(),
  builtinPlacements: objectType<BuildInPlacements>(),
  children: Array,
  /** @deprecated Please use `onOpenChange` instead. */
  onVisibleChange: Function as PropType<(vis: boolean) => void>,
  /** @deprecated Please use `onUpdate:open` instead. */
  'onUpdate:visible': Function as PropType<(vis: boolean) => void>,
  onOpenChange: Function as PropType<(vis: boolean) => void>,
  'onUpdate:open': Function as PropType<(vis: boolean) => void>,
});

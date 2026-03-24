import type { Placement } from '@floating-ui/vue'
import type { Slot, ScopedSlot } from '@/utils/types'
import type { TriggerType } from '@/_internal/trigger/types'

/** Preset tooltip colors */
export type PresetColor =
  | 'pink'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'cyan'
  | 'green'
  | 'blue'
  | 'purple'
  | 'geekblue'
  | 'magenta'
  | 'volcano'
  | 'gold'
  | 'lime'

/** Tooltip placement — same as antd's 12-position system */
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
  | 'rightBottom'

/** Map antd placement names to floating-ui placement */
export function resolveFloatingPlacement(p: TooltipPlacement): Placement {
  const map: Record<TooltipPlacement, Placement> = {
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    topLeft: 'top-start',
    topRight: 'top-end',
    bottomLeft: 'bottom-start',
    bottomRight: 'bottom-end',
    leftTop: 'left-start',
    leftBottom: 'left-end',
    rightTop: 'right-start',
    rightBottom: 'right-end',
  }
  return map[p] ?? 'top'
}

/** Reverse: floating-ui placement → antd placement name (for CSS classes) */
export function resolveAntPlacement(p: Placement): TooltipPlacement {
  const map: Record<string, TooltipPlacement> = {
    'top': 'top',
    'top-start': 'topLeft',
    'top-end': 'topRight',
    'bottom': 'bottom',
    'bottom-start': 'bottomLeft',
    'bottom-end': 'bottomRight',
    'left': 'left',
    'left-start': 'leftTop',
    'left-end': 'leftBottom',
    'right': 'right',
    'right-start': 'rightTop',
    'right-end': 'rightBottom',
  }
  return map[p] ?? 'top'
}

export const PRESET_COLORS: PresetColor[] = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green',
  'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
]

export interface TooltipProps {
  /** The tooltip content (alternative to title slot) */
  title?: string | number
  /** Whether the tooltip is visible (controlled). null = uncontrolled. */
  open?: boolean | null
  /** Default visibility (uncontrolled) */
  defaultOpen?: boolean
  /** @deprecated Use `open` instead */
  visible?: boolean
  /** How to trigger: hover, focus, click, contextmenu */
  trigger?: TriggerType | TriggerType[]
  /** Tooltip placement */
  placement?: TooltipPlacement
  /** Preset or custom color for the tooltip background */
  color?: PresetColor | string
  /** Whether to show the arrow */
  arrow?: boolean | { pointAtCenter?: boolean }
  /** Delay in ms before showing (hover trigger) */
  mouseEnterDelay?: number
  /** Delay in ms before hiding (hover trigger) */
  mouseLeaveDelay?: number
  /** Class applied to the overlay element */
  overlayClassName?: string
  /** Style applied to the overlay element */
  overlayStyle?: Record<string, string>
  /** Style applied to the inner content */
  overlayInnerStyle?: Record<string, string>
  /** Whether to destroy the tooltip DOM when hidden */
  destroyTooltipOnHide?: boolean
  /** Whether to auto-adjust placement when near viewport edge */
  autoAdjustOverflow?: boolean
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Z-index for the tooltip */
  zIndex?: number
  /** Whether tooltip is fresh (for alignment arrow update) */
  fresh?: boolean
}

export const tooltipDefaultProps = {
  trigger: 'hover' as TriggerType,
  placement: 'top' as TooltipPlacement,
  arrow: true,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyTooltipOnHide: false,
  autoAdjustOverflow: true,
}

export interface TooltipEmits {
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
  /** @deprecated Use update:open */
  (e: 'update:visible', open: boolean): void
  /** @deprecated Use openChange */
  (e: 'visibleChange', open: boolean): void
}

export interface TooltipSlots {
  /** The trigger element */
  default?: Slot
  /** Tooltip content (alternative to title prop) */
  title?: Slot
}

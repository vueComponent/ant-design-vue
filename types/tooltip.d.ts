import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** ATooltip Layout Component */
export declare class ATooltip extends AntdVueComponent {
  title: string | VNode

  arrowPointAtCenter: boolean

  autoAdjustOverflow: boolean

  defaultVisible: boolean

  getPopupContainer: (triggerNode: any) => HTMLElement

  mouseEnterDelay: number

  mouseLeaveDelay: number

  overlayClassName: string

  overlayStyle: object

  placement: string

  trigger: string

  visible: boolean

  visibleChange: (visible: boolean) => void
}

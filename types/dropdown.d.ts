import Vue, { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

type PlaceMent = 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';

type Trigger = 'click' | 'hover' | 'contextmenu';

/** ADropdown Layout Component */
export declare class ADropdown extends AntdVueComponent {
  disabled: boolean

  getPopupContainer (): HTMLElement

  overlay: VNode

  placement: PlaceMent

  trigger: Array<Trigger>

  visable: boolean

  visibleChange: (visible: boolean) => void
}


/** ADropdownButton Layout Component */
export declare class ADropdownButton extends AntdVueComponent {
  disabled: boolean

  overlay: any

  placement: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight'

  size: AntdVueComponentSize

  trigger: string[]

  type: string

  visible: boolean

  click: Function

  visibleChange: (visible: boolean) => void
}

import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ASwitch Layout Component */
export declare class ASwitch extends AntdVueComponent {
  autoFocus: boolean

  checked: boolean

  checkedChildren: string | VNode

  defaultChecked: boolean

  disabled: boolean

  loading: boolean

  size: AntdVueComponentSize

  unCheckedChildren: string | VNode

  static change(checked: boolean): void

  blur(): void

  focus(): void
}

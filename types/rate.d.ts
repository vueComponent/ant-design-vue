import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** ARate Layout Component */
export declare class ARate extends AntdVueComponent {
  allowClear: boolean

  allowHalf: boolean

  autoFocus: boolean

  character: string | VNode

  count: number

  defaultValue: number

  disabled: boolean

  value: number

  static blur(): void

  static change(value: number): void

  static focus(): void

  static hoverChange(value: number): void

  static keydown(e: Event): void
}

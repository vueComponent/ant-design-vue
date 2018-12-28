import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** AInput Layout Component */
export declare class AInput extends AntdVueComponent {
  addonAfter: string | VNode

  addonBefore: string | VNode

  defaultValue: string

  disabled: boolean

  id: string

  prefix: string | VNode

  size: AntdVueComponentSize

  suffix: string | VNode

  type: string

  value: string

  pressEnter(): void
}

/** AInputTextArea Layout Component */
export declare class AInputTextArea extends AInput {
  autosize: boolean | object

  defaultValue: string

  value: string
}

/** AInputSearch Layout Component */
export declare class AInputSearch extends AInput {
  enterButton: boolean | VNode

  search(value: string): void
}

/** AInputGroup Layout Component */
export declare class AInputGroup {
  compact: boolean

  size: AntdVueComponentSize
}

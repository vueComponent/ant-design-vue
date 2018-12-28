import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

interface Options { value: any, label: string }

export declare class ASelectOption extends AntdVueComponent {
  disabled: boolean

  key: string

  title: string

  value: string | number

  class: string
}

/** ASelect Layout Component */
export declare class ASelect extends AntdVueComponent {
  allowClear: boolean

  autoClearSearchValue: boolean

  autoFocus: boolean

  defaultActiveFirstOption: boolean

  defaultValue: string | string[] | number | number[]

  disabled: boolean

  dropdownClassName: string

  dropdownMatchSelectWidth: boolean

  dropdownStyle: object

  filterOption:(inputValue: string, option: any) => boolean | boolean

  firstActiveValue: string | string[]

  getPopupContainer: (triggerNode: VNode) => HTMLElement

  labelInValue: boolean

  maxTagCount: number

  maxTagPlaceholder: (omittedValues: any) => void | VNode

  mode: 'default' | 'multiple' | 'tags' | 'combobox'

  notFoundContent: string | VNode

  optionFilterProp: string

  optionLabelProp: string

  placeholder: string | VNode

  showSearch: boolean

  showArrow: boolean

  size: AntdVueComponentSize

  tokenSeparators: string[]

  value: string | string[] | number | number[]

  options: Array<Options>

  defaultOpen: boolean

  open: boolean

  static blur(): void

  static change(value: any, option: ASelectOption| Array<ASelectOption>): void

  static deselect(value: any, option:ASelectOption): void

  static focus(): void

  static inputKeydown(): void

  static mouseenter(): void

  static mouseleave(): void

  static popupScroll(): void

  static search(value: string): void

  static select(value: string, option:ASelectOption): void
}

/** AOptGroup Layout Component */
export declare class AOptGroup extends AntdVueComponent {
  key: string

  label: (h: any) => void | string | VNode
}

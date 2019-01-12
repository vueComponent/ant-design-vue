// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare type Value = { key: string };

export declare type SelectValue = string | number | Value | Array<Value | string | number>;

export declare class AutoComplete extends AntdComponent {
  /**
   * Show clear button, effective in multiple mode only.
   * @default false
   * @type boolean
   */
  allowClear: boolean;

  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * backfill selected item the input when using keyboard
   * @default false
   * @type boolean
   */
  backfill: boolean;

  /**
   * Data source for autocomplete
   * @type slot | Array<{ value: String, text: String }>
   */
  dataSource: any;

  /**
   * Whether active first option by default
   * @default true
   * @type boolean
   */
  defaultActiveFirstOption: boolean;

  /**
   * Initial selected option.
   * @type SelectValue
   */
  defaultValue: SelectValue;

  /**
   * Whether disabled select
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * If true, filter options by input, if function, filter options against it.
   * The function will receive two arguments, inputValue and option,
   * if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded.
   * @default true
   * @type boolean | Function
   */
  filterOption: boolean | Function;

  /**
   * Which prop value of option will render as content of select.
   * @default 'children'
   * @type string
   */
  optionLabelProp: string;

  /**
   * placeholder of input
   * @type string
   */
  placeholder: string;

  /**
   * selected option
   * @type SelectValue
   */
  value: SelectValue;

  /**
   * Initial open state of dropdown
   * @type boolean
   */
  defaultOpen: boolean;

  /**
   * Controlled open state of dropdown
   * @type boolean
   */
  open: boolean;

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}

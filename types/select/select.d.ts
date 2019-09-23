// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Option } from './option';
import { OptionGroup } from './option-group';
import { VNode } from 'vue';

export declare class Select extends AntdComponent {
  static Option: typeof Option;
  static OptGroup: typeof OptionGroup;

  /**
   * Show clear button.
   * @default false
   * @type boolean
   */
  allowClear: boolean;

  /**
   * Whether the current search will be cleared on selecting an item. Only applies when mode is set to multiple or tags.
   * @default true
   * @type boolean
   */
  autoClearSearchValue: boolean;

  /**
   * Get focus by default
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * Whether active first option by default
   * @default true
   * @type boolean
   */
  defaultActiveFirstOption: boolean;

  /**
   * Initial selected option.
   * @type string | number | Array<string | number>
   */
  defaultValue: string | number | Array<string | number>;

  /**
   * Whether disabled select
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * className of dropdown menu
   * @type string
   */
  dropdownClassName: string;

  /**
   * Whether dropdown's width is same with select.
   * @default true
   * @type boolean
   */
  dropdownMatchSelectWidth: boolean;

  /**
   * Customize dropdown content
   * @type function | slot-scope
   */
  dropdownRender?: (menu?: VNode, props?: object) => VNode;

  /**
   * style of dropdown menu
   * @type object
   */
  dropdownStyle: object;

  /**
   * If true, filter options by input, if function, filter options against it. The function will receive two arguments, inputValue and option,
   * if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded.
   * @default true
   * @type boolean | Function
   */
  filterOption: boolean | Function;

  /**
   * Value of action option by default
   * @type string | string[]
   */
  firstActiveValue: string | string[];

  /**
   * Parent Node which the selector should be rendered to. Default to body.
   * When position issues happen, try to modify it into scrollable content and position it relative.
   * @default () => document.body
   * @type Function
   */
  getPopupContainer: (triggerNode: any) => any;

  /**
   * whether to embed label in value, turn the format of value from string to {key: string, label: vNodes}
   * @default false
   * @type boolean
   */
  labelInValue: boolean;

  /**
   * Max tag count to show
   * @type number
   */
  maxTagCount: number;

  /**
   * Placeholder for not showing tags
   * @type any (slot | Function)
   */
  maxTagPlaceholder: any;

  /**
   * Max text length to show
   * @type number
   */
  maxTagTextLength: number;

  /**
   * Set mode of Select
   * @default 'default'
   * @type string
   */
  mode: 'default' | 'multiple' | 'tags';

  /**
   * Specify content to show when no result matches..
   * @default 'Not Found'
   * @type any (string | slot)
   */
  notFoundContent: any;

  /**
   * Which prop value of option will be used for filter if filterOption is true
   * @default 'value'
   * @type string
   */
  optionFilterProp: string;

  /**
   * Which prop value of option will render as content of select.
   * @default 'value' for combobox, 'children' for other modes
   * @type string
   */
  optionLabelProp: string;

  /**
   * Placeholder of select
   * @type any (string | slot)
   */
  placeholder: any;

  /**
   * Whether show search input in single mode.
   * @default false
   * @type boolean
   */
  showSearch: boolean;

  /**
   * Whether to show the drop-down arrow
   * @default true
   * @type boolean
   */
  showArrow: boolean;

  /**
   * Size of Select input. default large small
   * @default 'default'
   * @type string
   */
  size: 'default' | 'large' | 'small';

  /**
   * The custom suffix icon
   * @type any (VNode | slot)
   */
  suffixIcon: any;

  /**
   * The custom remove icon
   * @type any (VNode | slot)
   */
  removeIcon: any;

  /**
   * The custom clear icon
   * @type any (VNode | slot)
   */
  clearIcon: any;

  /**
   * The custom menuItemSelected icon
   * @type any (VNode | slot)
   */
  menuItemSelectedIcon: any;

  /**
   * Separator used to tokenize on tag/multiple mode
   * @type string[]
   */
  tokenSeparators: string[];

  /**
   * Current selected option.
   * @type string | number | Array<string | number>
   */
  value: string | number | Array<string | number>;

  /**
   * Data of the selectOption, manual construction work is no longer needed if this property has been set
   * @default []
   * @type Array<{ value; label; disabled?; key?; title? }>
   */
  options: Array<{
    value: any;
    label: any;
    disabled?: boolean;
    key?: any;
    title?: any;
  }>;

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

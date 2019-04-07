// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNode } from 'vue';

export interface CascaderOptionType {
  value?: string | number;
  label?: any;
  disabled?: boolean;
  children?: any;
  key?: string | number;
}

export interface ShowSearchType {
  /**
   * The function will receive two arguments, inputValue and option,
   * if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded.
   * @type Function
   */
  filter?: (inputValue: any, path: any) => boolean;

  /**
   * Used to render filtered options, you can use slot="showSearchRender" and slot-scope="{inputValue, path}"
   * @type Function
   */
  render?: ({ inputValue, path }: { inputValue: any; path: any }) => VNode;

  /**
   * Used to sort filtered options.
   * @type Function
   */
  sort?: (a: any, b: any, inputValue: any) => any;

  /**
   * Whether the width of result list equals to input's
   * @type boolean
   */
  matchInputWidth?: boolean;

  /**
   * Set the count of filtered items
   * @type number | false
   */
  limit?: number | false;
}

export declare class Cascader extends AntdComponent {
  /**
   * whether allow clear
   * @default true
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
   * change value on each selection if set to true.
   * @default false
   * @type boolean
   */
  changeOnSelect: boolean;

  /**
   * initial selected value
   * @type Array<string | number>
   */
  defaultValue: Array<string | number>;

  /**
   * Whether disabled select
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * render function of displaying selected options, you can use slot="displayRender" and slot-scope="{labels, selectedOptions}"
   * @default labels => labels.join(' / ')
   * @type Function
   */
  displayRender: ({
    labels,
    selectedOptions,
  }: {
    labels: string[];
    selectedOptions: CascaderOptionType[];
  }) => VNode;

  /**
   * expand current item when click or hover, one of 'click' 'hover'
   * @default 'click'
   * @type string
   */
  expandTrigger: 'click' | 'hover';

  /**
   * custom field name for label and value and children
   * @default { label: 'label', value: 'value', children: 'children' }
   * @type { value: string; label: string; children?: string; }
   */
  fieldNames: {
    value: string;
    label: string;
    children?: string;
  };

  /**
   * Parent Node which the selector should be rendered to. Default to body.
   * When position issues happen, try to modify it into scrollable content and position it relative.
   * @default () => document.body
   * @type Function
   */
  getPopupContainer: (triggerNode: any) => HTMLElement;

  /**
   * To load option lazily, and it cannot work with showSearch
   * @type Function
   */
  loadData: (selectedOptions: CascaderOptionType[]) => void;

  /**
   * Specify content to show when no result matches.
   * @default 'Not Found'
   * @type string
   */
  notFoundContent: string;

  /**
   * data options of cascade
   * @type CascaderOptionType
   */
  options: CascaderOptionType;

  /**
   * input placeholder
   * @default 'Please select'
   * @type string
   */
  placeholder: string;

  /**
   * additional className of popup overlay
   * @type string
   */
  popupClassName: string;

  /**
   * additional style of popup overlay
   * @type object
   */
  popupStyle: object;

  /**
   * use preset popup align config from builtinPlacements：bottomLeft bottomRight topLeft topRight
   * @default 'bottomLeft'
   * @type string
   */
  popupPlacement: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

  /**
   * set visible of cascader popup
   * @type boolean
   */
  popupVisible: boolean;

  /**
   * Whether show search input in single mode.
   * @default false
   * @type boolean | ShowSearchType
   */
  showSearch: boolean | ShowSearchType;

  /**
   * input size, one of large default small
   * @default 'default'
   * @type string
   */
  size: 'large' | 'default' | 'small';

  /**
   * The custom suffix icon
   * @type 	String | VNode | slot
   */
  suffixIcon: any;

  /**
   * selected value
   * @type Array<string | number>
   */
  value: Array<string | number>;

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}

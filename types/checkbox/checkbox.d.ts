// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { CheckboxGroup } from './checkbox-group';
import { AntdComponent, AntdProps } from '../component';

export interface CheckboxChangeEvent {
  target: CheckboxProps & { checked: boolean };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface CheckboxProps {
  prefixCls?: string;
  name?: string;
  id?: string;
  type?: string;

  /**
   * Specifies the initial state: whether or not the checkbox is selected.
   * @default false
   * @type boolean
   */
  defaultChecked?: boolean;

  /**
   * Specifies whether the checkbox is selected.
   * @default false
   * @type boolean
   */
  checked?: boolean;

  /**
   * Disable checkbox
   * @default false
   * @type boolean
   */
  disabled?: boolean;
  tabindex?: string | number;
  readonly?: boolean;

  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autofocus?: boolean;
  value?: any;
}

export declare class Checkbox extends AntdComponent {
  static Group: typeof CheckboxGroup;

  $props: Omit<AntdProps, 'onChange'> &
    CheckboxProps & {
      /**
       * indeterminate checked state of checkbox
       * @default false
       * @type boolean
       */
      indeterminate?: boolean;

      /**
       * remove focus
       */
      onBlur?: (e: FocusEvent) => void;

      /**
       * get focus
       */
      onFocus?: (e: FocusEvent) => void;

      /**
       * The callback function that is triggered when the state changes.
       * @param event
       */
      onChange?: (e: CheckboxChangeEvent) => void;
    };
}

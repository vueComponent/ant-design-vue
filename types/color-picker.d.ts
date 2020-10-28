// Project: https://github.com/vueComponent/ant-design-vue Definitions by:
// https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import Pickr from '@simonwep/pickr';

export declare class ColorPicker extends AntdComponent {
  /** simonwep/pickr's options */
  config?: Pickr.Options;
  /**prefix class name */
  prefixCls?: string;
  /** default color value */
  defaultValue?: string;
  /** color value */
  value?: string;
  /**
   * language package setting
   * @type object
   */
  locale: object;
  /**
   * precision of color value
   * @default 0
   * @type number
   * */
  colorRounded?: number;
  /**
   * descriptions size type
   * @default 'default'
   * @type string
   */
  size: 'large' | 'default' | 'small';
  /**
   * Parent Node which the selector should be rendered to. Default to body.
   * When position issues happen, try to modify it into scrollable content and position it relative.
   * @default () => document.body
   * @type Function
   */
  getPopupContainer: (triggerNode: any) => HTMLElement;
  /**
   * Disabled or not
   * @default false
   * @type boolean
   */
  disabled: boolean;
  /**
   * to set the color format
   * @default "HEXA"
   */
  format: Pickr.Representation;
}

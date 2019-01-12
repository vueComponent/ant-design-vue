// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Spin extends AntdComponent {
  /**
   * As indicator, you can define the global default spin element
   * @param param0 indicator
   */
  static setDefaultIndicator({ indicator }: { indicator: any }): void;

  /**
   * specifies a delay in milliseconds for loading state (prevent flush)
   * @type number (milliseconds)
   */
  delay: number;

  /**
   * vue node of the spinning indicator
   * @type any (VNode | slot)
   */
  indicator: any;

  /**
   * size of Spin, options: small, default and large
   * @default 'default'
   * @type string
   */
  size: 'small' | 'default' | 'large';

  /**
   * whether Spin is spinning
   * @default true
   * @type boolean
   */
  spinning: boolean;

  /**
   * customize description content when Spin has children
   * @type string
   */
  tip: string;

  /**
   * className of wrapper when Spin has children
   * @type string
   */
  wrapperClassName: string;
}

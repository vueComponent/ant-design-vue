// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class BackTop extends AntdComponent {
  /**
   * specifies the scrollable area dom node
   * @default () => window
   * @type Function
   */
  target: () => HTMLElement;

  /**
   * the BackTop button will not show until the scroll height reaches this value
   * @default 400
   * @type number
   */
  visibilityHeight: number;
}

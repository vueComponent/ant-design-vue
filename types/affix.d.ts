// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Affix extends AntdComponent {
  /**
   * Pixels to offset from top when calculating position of scroll
   * @default 0
   * @type number
   */
  offsetTop: number;

  /**
   * Pixels to offset from bottom when calculating position of scroll
   * @type number
   */
  offsetBottom: number;

  /**
   * specifies the scrollable area dom node
   * @default () => window
   * @type Function
   */
  target: () => HTMLElement;
}

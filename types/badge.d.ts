// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNode } from 'vue';

export declare class Badge extends AntdComponent {
  color: string;
  /**
   * Number to show in badge, support slot
   * @type number | string | VNode
   */
  count: number | string | VNode;

  /**
   * to display a red dot instead of count
   * @default false
   * @type boolean
   */
  dot: boolean;

  /**
   * set offset of the badge dot, like [x, y]
   * @type Array<number | string>
   */
  offset: Array<number | string>;

  /**
   * Max count to show
   * @default 99
   * @type number
   */
  overflowCount: number;

  /**
   * Whether to show badge when count is zero
   * @default false
   * @type boolean
   */
  showZero: boolean;

  /**
   * Set Badge as a status dot
   * @type string
   */
  status: 'success' | 'processing' | 'default' | 'error' | 'warning';

  /**
   * If status is set, text sets the display text of the status dot
   * @type string
   */
  text: string;

  /**
   * sets the display style of the status dot
   * @type
   */
  numberStyle: object;

  /**
   * Text to show when hovering over the badge
   * @default 'count'
   * @type string
   */
  title: string;
}

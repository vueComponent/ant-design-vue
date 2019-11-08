// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { VNode } from 'vue';

export declare class StatisticCountdown extends AntdComponent {
  format: string;
  /**
   * prefix node of value
   * @type string | VNode
   */
  prefix: string | VNode;

  /**
   * suffix node of value
   * @type string | VNode
   */
  suffix: string | VNode;

  /**
   * Display title
   * @type string | VNode
   */
  title: string | VNode;

  /**
   * Display value
   * @type string or number
   */
  value: string | number;
  valueStyle: object;
}

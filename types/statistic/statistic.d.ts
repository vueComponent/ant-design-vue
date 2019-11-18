// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { VNode } from 'vue';
import { StatisticCountdown } from './statistic-countdown';

export declare class Statistic extends AntdComponent {
  static Countdown: typeof StatisticCountdown;
  /**
   * decimal separator
   * @default '.'
   * @type string
   */
  decimalSeparator: string;

  /**
   * the shape of statistic
   * @type string
   */
  formatter: () => VNode;

  /**
   * group separator
   * @default ','
   * @type string
   */
  groupSeparator: string;

  /**
   * precision of input value
   * @type number
   */
  precision: number;

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
}

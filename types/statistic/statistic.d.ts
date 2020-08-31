// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild } from 'vue';
import { StatisticCountdown } from './statistic-countdown';

export declare class Statistic extends AntdComponent {
  static Countdown: typeof StatisticCountdown;
  $props: AntdProps & {
    /**
     * decimal separator
     * @default '.'
     * @type string
     */
    decimalSeparator?: string;

    /**
     * the shape of statistic
     * @type string
     */
    formatter?: () => VNodeChild | JSX.Element;

    /**
     * group separator
     * @default ','
     * @type string
     */
    groupSeparator?: string;

    /**
     * precision of input value
     * @type number
     */
    precision?: number;

    /**
     * prefix node of value
     * @type string | VNodeChild
     */
    prefix?: VNodeChild | JSX.Element;

    /**
     * suffix node of value
     * @type string | VNodeChild
     */
    suffix?: VNodeChild | JSX.Element;

    /**
     * Display title
     * @type string | VNodeChild
     */
    title?: VNodeChild | JSX.Element;

    /**
     * Display value
     * @type string or number
     */
    value?: string | number;
  };
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { VNodeChild } from 'vue';

export declare class StatisticCountdown extends AntdComponent {
  $props:{
    format?: string;
    /**
     * prefix node of value
     * @type string | VNode
     */
    prefix?: VNodeChild | JSX.Element;

    /**
     * suffix node of value
     * @type string | VNode
     */
    suffix?: VNodeChild | JSX.Element;

    /**
     * Display title
     * @type string | VNode
     */
    title?: VNodeChild | JSX.Element;

    /**
     * Display value
     * @type string or number
     */
    value?: string | number;
    valueStyle?: object;
  }
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild, CSSProperties } from 'vue';

export declare class StatisticCountdown extends AntdComponent {
  $props: AntdProps & {
    /**
     * Format as moment
     * @default 'HH:mm:ss'
     */
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
    /**
     * Set value css style
     */
    valueStyle?: CSSProperties;
  };
}

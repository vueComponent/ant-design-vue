// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';

export declare class TimelineItem extends AntdComponent {
  $props: AntdProps & {
    /**
     * Set the circle's color to blue, red, green or other custom colors
     * @default 'blue'
     * @type string
     */
    color?: string;

    /**
     * Customize timeline dot
     * @type any (string | slot)
     */
    dot?: VNodeChild | JSX.Element;
  };
}

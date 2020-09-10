// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';

export declare class DescriptionsItem extends AntdComponent {
  $props: AntdProps & {
    /**
     * the label of descriptions item
     * @type any
     */
    label?: VNodeChild | JSX.Element;

    /**
     * can be set to small large or omitted
     * @default 1
     * @type number
     */
    span?: number;
  };
}

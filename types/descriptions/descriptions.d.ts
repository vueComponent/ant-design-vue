// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';
import { DescriptionsItem } from './descriptions-item';

import { Breakpoint } from '../pub';

export declare class Descriptions extends AntdComponent {
  static Item: typeof DescriptionsItem;

  $props: AntdProps & {
    /**
     * descriptions size type
     * @default 'default'
     * @type string
     */
    size?: 'default' | 'middle' | 'small';

    /**
     * custom prefixCls
     * @type string
     */
    prefixCls?: string;

    /**
     * whether descriptions have border
     * @default false
     * @type boolean
     */
    bordered?: boolean;

    /**
     * custom title
     * @type any
     */
    title?: VNodeChild | JSX.Element;

    /**
     * the number of descriptionsitem in one line
     * @default 3
     * @type number | object
     */
    column?: number | Partial<Breakpoint>;

    /**
     * descriptions layout
     * @default 'horizontal'
     * @type string
     */
    layout?: 'horizontal' | 'vertical';

    /**
     * whether have colon in descriptionsitem
     * @default true
     * @type boolean
     */
    colon?: boolean;
  };
}

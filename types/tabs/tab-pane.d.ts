// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild } from 'vue';

export declare class TabPane extends AntdComponent {
  $props: AntdProps & {
    /**
     * Forced render of content in tabs, not lazy render after clicking on tabs
     * @default false
     * @type boolean
     */
    forceRender?: boolean;

    /**
     * TabPane's key
     * @type string
     */
    key?: string;

    /**
     * Show text in TabPane's head
     * @type any (string | slot)
     */
    tab?: VNodeChild | JSX.Element;
  };
}

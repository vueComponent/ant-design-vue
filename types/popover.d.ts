// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { TooltipCommon } from './tootip/common';
import { VNodeChild } from 'vue';
import { AntdComponent } from './component';
export declare class Popover extends AntdComponent {
  $props: {
    /**
     * Content of the card
     * @type any (string | slot | VNode)
     */
    content?: VNodeChild | JSX.Element;

    /**
     * Title of the card
     * @type any (string | slot | VNode)
     */
    title?: VNodeChild | JSX.Element;
  } & TooltipCommon
}

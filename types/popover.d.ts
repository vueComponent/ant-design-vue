// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { TooltipCommon } from './tootip/common';
import { VNodeChild } from 'vue';
export declare class Popover extends TooltipCommon {
  /**
   * Content of the card
   * @type any (string | slot | VNode)
   */
  content?: string | VNodeChild | JSX.Element;

  /**
   * Title of the card
   * @type any (string | slot | VNode)
   */
  title?: string | VNodeChild | JSX.Element;
}

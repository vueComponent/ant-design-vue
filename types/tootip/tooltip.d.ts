// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import Vue, { VNodeChild } from 'vue';
import { AntdComponent } from '../component';
import { TooltipCommon } from './common';

export declare class Tooltip  extends AntdComponent {
  $props: {
    /**
     * The text shown in the tooltip
     * @type any (string | slot)
     */
    title: VNodeChild | JSX.Element
  } & TooltipCommon
}

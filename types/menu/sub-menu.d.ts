// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { MenuItem } from './menu-item';
import { VNodeChild } from 'vue';

export declare class SubMenu extends AntdComponent {
  $props: AntdProps & {
    /**
     * unique id of the menu item
     * @type string
     */
    key?: string;

    /**
     * whether menu item is disabled or not
     * @default false
     * @type boolean
     */
    disabled?: boolean;

    /**
     * title of the sub menu
     * @type string | slot
     */
    title?: VNodeChild | JSX.Element;
    /**
     * Sub-menu class name (1.5.0)
     */
    popupClassName?: string;
  };
}

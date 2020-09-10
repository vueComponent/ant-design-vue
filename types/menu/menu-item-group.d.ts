// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { MenuItem } from './menu-item';
import { VNodeChild } from 'vue';

export declare class MenuItemGroup extends AntdComponent {
  $props: AntdProps & {
    /**
     * sub menu items
     * @type MenuItem[]
     */
    children?: MenuItem[];
    /**
     * title of the group
     * @type string | slot
     */
    title?: VNodeChild | JSX.Element;
  };
}

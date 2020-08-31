// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { Meta } from '../meta';
import { VNodeChild } from 'vue';

export declare class ListItem extends AntdComponent {
  static Meta: typeof Meta;

  $props: AntdProps & {
    /**
     * The actions content of list item. If itemLayout is vertical, shows the content on bottom,
     * otherwise shows content on the far right.
     * @type any (VNode[] | slot)
     */
    actions?: VNodeChild | JSX.Element;

    /**
     * The extra content of list item. If itemLayout is vertical, shows the content on right,
     * otherwise shows content on the far right.
     * @type any (string | slot)
     */
    extra?: VNodeChild | JSX.Element;
  };
}

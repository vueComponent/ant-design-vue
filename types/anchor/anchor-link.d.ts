// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';

export declare class AnchorLink extends AntdComponent {
  $props: AntdProps & {
    /**
     * target of hyperlink
     * @type string
     */
    href?: string;

    /**
     * content of hyperlink
     * @type any (string | slot)
     */
    title?: VNodeChild | JSX.Element;

    /**
     * Specifies where to display the linked URL
     * @version 1.5.0
     */
    target?: string;
  };
}

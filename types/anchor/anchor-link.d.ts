// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNode } from 'vue';

export declare class AnchorLink {
  $props: {
    /**
     * target of hyperlink
     * @type string
     */
    href: string;

    /**
     * content of hyperlink
     * @type any (string | slot)
     */
    title?: string | VNode | VNode[];

    /**
     * Specifies where to display the linked URL
     * @version 1.5.0
     */
    target?: string;
  };
}

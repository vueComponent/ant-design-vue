// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';

export declare class Meta {
  $props: AntdProps & {
    /**
     * The avatar of list item
     * @type any (slot)
     */
    avatar?: VNodeChild;

    /**
     * The description of list item
     * @type any (string | slot)
     */
    description?: VNodeChild | JSX.Element;

    /**
     * The title of list item
     * @type any (string | slot)
     */
    title?: VNodeChild | JSX.Element;
  };
}

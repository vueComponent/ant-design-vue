// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent } from '../component';

export declare class ColumnGroup extends AntdComponent {
  $props: {
    /**
     * Title of the column group
     * @type any
     */
    title?: VNodeChild | JSX.Element;
  };
}

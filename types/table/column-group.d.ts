// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild, Slots } from 'vue';
import { AntdComponent } from '../component';

export declare class ColumnGroup extends AntdComponent {
  $props: {
    /**
     * Title of the column group
     * @type any
     */
    title?: VNodeChild | JSX.Element;

    /**
     * When using columns, you can use this property to configure the properties that support the slot,
     * such as slots: { title: 'XXX'}
     * @type object
     */
    slots?: Slots;
  };
}

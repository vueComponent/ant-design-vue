// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild } from 'vue';

export declare class InputSearch extends AntdComponent {
  $props: AntdProps & {
    /**
     * to show an enter button after input
     * @default false
     * @type any (boolean | slot)
     */
    enterButton?: boolean | VNodeChild | JSX.Element;
  };
}

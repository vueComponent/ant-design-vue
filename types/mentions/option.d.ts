// Project: https://github.com/vueComponent/ant-design-vue
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';

export declare class Option extends AntdComponent {
  $props: AntdProps & {
    /**
     * value of suggestion, the value will insert into input filed while selected
     * @default ''
     * @type string
     */
    value?: string;
  };
}

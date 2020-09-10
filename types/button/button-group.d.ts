// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';

export declare class ButtonGroup extends AntdComponent {
  $props: AntdProps & {
    /**
     * can be set to small large or omitted
     * @default 'default'
     * @type string
     */
    size?: 'small' | 'large' | 'default';
  };
}

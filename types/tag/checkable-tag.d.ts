// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';

export declare class CheckableTag extends AntdComponent {
  $props: AntdProps & {
    /**
     * Checked status of Tag
     * @default false
     * @type boolean
     */
    checked?: boolean;
  };
}

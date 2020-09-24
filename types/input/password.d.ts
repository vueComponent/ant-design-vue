// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { InputProps } from './input';

export declare class Password extends AntdComponent {
  $props: Omit<InputProps, 'type' | 'suffix'> & {
    /**
     * Whether show toggle button
     * @default true
     */
    visibilityToggle?: boolean;
  };
}

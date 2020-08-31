// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { VNodeChild } from 'vue';

export declare class Alert extends AntdComponent {
  $props: AntdProps & {
    /**
     * Called when close animation is finished
     * @type Function
     */
    afterClose?: () => void;

    /**
     * Whether to show as banner
     * @default false
     * @type boolean
     */
    banner?: boolean;

    /**
     * Whether Alert can be closed
     * @type boolean
     */
    closable?: boolean;

    /**
     * Close text to show
     * @type any (string | slot)
     */
    closeText?: VNodeChild | JSX.Element;

    /**
     * additional content of Alert
     * @type any (string | slot)
     */
    description?: VNodeChild | JSX.Element;

    /**
     * Custom icon, effective when showIcon is true
     * @type any (VNode | slot)
     */
    icon?: VNodeChild | JSX.Element;

    /**
     * Content of Alert
     * @type any (string | slot)
     */
    message?: VNodeChild | JSX.Element;

    /**
     * Whether to show icon
     * @default false, in banner mode default is true
     * @type boolean
     */
    showIcon?: boolean;

    /**
     * Type of Alert styles, options: success, info, warning, error
     * @default info, in banner mode default is warning
     * @type string
     */
    type?: 'success' | 'info' | 'warning' | 'error';
  };
}

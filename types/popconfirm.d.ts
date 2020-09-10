// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { TooltipCommon } from './tootip/common';
import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from './component';
export declare class Popconfirm extends AntdComponent {
  $props: AntdProps & {
    /**
     * text of the Cancel button
     * @default 'Cancel'
     * @type any (string | slot)
     */
    cancelText?: VNodeChild | JSX.Element;

    /**
     * text of the Confirm button
     * @default 'Confirm'
     * @type any (string | slot)
     */
    okText?: VNodeChild | JSX.Element;

    /**
     * Button type of the Confirm button
     * @default 'primary'
     * @type string
     */
    okType?: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';

    /**
     * title of the confirmation box
     * @type any (string | slot)
     */
    title?: VNodeChild | JSX.Element;

    /**
     * customize icon of confirmation
     * @default <ExclamationCircleOutlined />
     * @type any (VNode | slot)
     */
    icon?: VNodeChild | JSX.Element;
    /**
     * is show popconfirm when click its childrenNode
     * @default false
     * @type boolean
     */
    disabled?: boolean;
  } & TooltipCommon;
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { TooltipCommon } from './tootip/common';
import { VNodeChild } from 'vue';
export declare class Popconfirm extends TooltipCommon {
  /**
   * text of the Cancel button
   * @default 'Cancel'
   * @type any (string | slot)
   */
  cancelText?: string | VNodeChild | JSX.Element;

  /**
   * text of the Confirm button
   * @default 'Confirm'
   * @type any (string | slot)
   */
  okText?: string | VNodeChild | JSX.Element;

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
  title?: string | VNodeChild | JSX.Element;

  /**
   * customize icon of confirmation
   * @default <ExclamationCircleOutlined />
   * @type any (VNode | slot)
   */
  icon?: VNodeChild | JSX.Element;

  disabled?: boolean;
}

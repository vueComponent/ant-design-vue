// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { TooltipCommon } from './tootip/common';

export declare class Popconfirm extends TooltipCommon {
  /**
   * text of the Cancel button
   * @default 'Cancel'
   * @type any (string | slot)
   */
  cancelText: any;

  /**
   * text of the Confirm button
   * @default 'Confirm'
   * @type any (string | slot)
   */
  okText: any;

  /**
   * Button type of the Confirm button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';

  /**
   * title of the confirmation box
   * @type any (string | slot)
   */
  title: any;

  /**
   * customize icon of confirmation
   * @default <Icon type="exclamation-circle" />
   * @type any (VNode | slot)
   */
  icon: any;
}

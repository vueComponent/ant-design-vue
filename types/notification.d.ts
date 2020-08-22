// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild, CSSProperties } from 'vue';
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export interface NotificationOptions extends NotificationConfigOptions {
  /**
   * Customized close button
   * @type VNode | Function
   */
  btn?: VNodeChild | JSX.Element | Function;

  /**
   * Customized CSS class
   * @type string
   */
  class?: string;

  /**
   * The content of notification box (required)
   * @type string | VNode | Function
   */
  description?: VNodeChild | JSX.Element | Function;

  /**
   * Customized icon
   * @type VNode | Function
   */
  icon?: VNodeChild | JSX.Element | Function;

  /**
   * The unique identifier of the Notification
   * @type string
   */
  key?: string;

  /**
   * The title of notification box (required)
   * @type string | VNode | Function
   */
  message: VNodeChild | JSX.Element | Function;

  /**
   * Customized inline style
   * @type object | string
   */
  style?: CSSProperties | string;

  /**
   * Specify a function that will be called when the close button is clicked
   * @type Function
   */
  onClose?: () => void;

  /**
   * Specify a function that will be called when the notification is clicked
   * @type Function
   */
  onClick?: () => void;
}

export interface NotificationConfigOptions {
  /**
   * Distance from the bottom of the viewport, when placement is bottomRight or bottomLeft (unit: pixels).
   * @default '24px'
   * @type string
   */
  bottom?: string;

  /**
   * Time in seconds before Notification is closed. When set to 0 or null, it will never be closed automatically
   * @default 4.5
   * @type number
   */
  duration?: number | null;

  /**
   * Return the mount node for Notification
   * @default () => document.body
   * @type Function
   */
  getContainer?: () => HTMLElement;

  /**
   * Position of Notification, can be one of topLeft topRight bottomLeft bottomRight
   * @default 'topRight'
   * @type string
   */
  placement?: NotificationPlacement;

  /**
   * Distance from the top of the viewport, when placement is topRight or topLeft (unit: pixels).
   * @default '24px'
   * @type string
   */
  top?: string;
  /**
   * custom close icon
   * @type VNode | function
   */
  closeIcon?: VNodeChild | JSX.Element | Function;
}

export interface Notification {
  success(config: NotificationOptions): void;
  warning(config: NotificationOptions): void;
  warn(config: NotificationOptions): void;
  info(config: NotificationOptions): void;
  error(config: NotificationOptions): void;
  open(config: NotificationOptions): void;
  config(options: NotificationConfigOptions): void;
  close(key: string): void;
  destroy(): void;
}

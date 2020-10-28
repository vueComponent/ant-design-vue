// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNode, CreateElement } from 'vue';

export interface ThenableArgument {
  (val: any): void;
}
export interface MessageType {
  (): void;
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
  promise: Promise<void>;
}
export type ConfigType = string | VNode | ((h: CreateElement) => VNode);
export type ConfigDuration = number | (() => void);
export type ConfigOnClose = () => void;

export interface MessageOptions {
  /**
   * content of the message
   * @type any (string | VNode | (h) => VNode)
   */
  content: ConfigType;

  /**
   * time(seconds) before auto-dismiss, don't dismiss if set to 0
   * @default 3
   * @type number
   */
  duration?: number;

  /**
   * type of message
   * @type string
   */
  type?: 'success' | 'info' | 'warning' | 'error' | 'loading';

  /**
   * Customized Icon
   * @type any  (string | VNode | (h) => VNode)
   */
  icon?: ConfigType;

  /**
   * Specify a function that will be called when the message is closed
   * @type Function
   */
  onClose?: ConfigOnClose;
  key?: string | number;
}

export interface MessageConfigOptions {
  /**
   * time before auto-dismiss, in seconds
   * @default 1.5
   * @type number
   */
  duration?: number;

  /**
   * Return the mount node for Message
   * @default () => document.body
   * @type Function
   */
  getContainer?: () => HTMLElement;

  /**
   * max message show, drop oldest if exceed limit
   * @type number
   */
  maxCount?: number;

  /**
   * distance from top
   * @default '24px'
   * @type string
   */
  top?: string;
}

export declare interface Message {
  success(content: MessageOptions): MessageType;
  success(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warning(content: MessageOptions): MessageType;
  warning(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warn(content: MessageOptions): MessageType;
  warn(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  info(content: MessageOptions): MessageType;
  info(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  error(content: MessageOptions): MessageType;
  error(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  loading(content: MessageOptions): MessageType;
  loading(content: ConfigType, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  open: (config: MessageOptions) => MessageType;
  config: (options: MessageConfigOptions) => void;
  destroy: () => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    $message: Message;
  }
}

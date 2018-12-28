import { CreateElement, VNode } from 'vue';
import { AntdVueComponent } from './component';

type Placement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
/** ANotification Layout Component */
export declare class ANotification {
  static success: (params: Params) => void

  static error: (params: Params) => void

  static info: (params: Params) => void

  static warning: (params: Params) => void

  static warn: (params: Params) => void

  static open: (params: Params) => void

  static close: (params: Params) => void

  static destroy: () => void

  static config: (params: Config) => void
}

interface Params {
  btn?: (h: CreateElement) => any | VNode

  class?: string

  description?: (h: CreateElement) => any | VNode | string

  duration?: number

  icon?: (h: CreateElement) => any | VNode

  key?: string

  message?: (h: CreateElement) => any | VNode | string

  placement?: Placement

  style?: object | string

  onClose?: Function
}

interface Config {
  bottom?: string

  duration?: number

  getContainer?: () => HTMLElement

  placement?: Placement

  top?: string
}

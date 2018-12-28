import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** AModal Layout Component */
export declare class AModal extends AntdVueComponent {
  afterClose?: Function

  bodyStyle?: object

  cancelText?: string | VNode

  centered: boolean

  closable?: boolean

  confirmLoading?: boolean

  destroyOnClose?: boolean

  footer?: string | VNode

  getContainer?: (instance: any) => HTMLElement

  keyboard: boolean

  mask?: boolean

  maskClosable?: boolean

  maskStyle?: object

  okText?: string | VNode

  okType?: string

  okButtonProps: {props: object, on: {}}

  cancelButtonProps: {props: object, on: {}}

  style?: object

  title?: string | VNode

  visible?: boolean

  width?: string | number

  wrapClassName?: string

  zIndex?: number

  content?: string | VNode

  cancel?: (e: Event) => void

  ok?: (e: Event) => void

  onOk?: (e: Event) => void

  static info: (params: AModalParams) => void

  static success: (params: AModalParams) => void

  static error: (params: AModalParams) => void

  static warning: (params: AModalParams) => void

  static confirm: (params: AModalParams) => void
}

export declare class AModalParams {

  autoFocusButton: null | 'ok' | 'cancel'

  afterClose?: Function

  bodyStyle?: object

  cancelText?: string | VNode

  centered: boolean

  class: string

  closable?: boolean

  iconType: string

  confirmLoading?: boolean

  destroyOnClose?: boolean

  footer?: string | VNode

  getContainer?: (instance: any) => HTMLElement

  mask?: boolean

  maskClosable?: boolean

  maskStyle?: object

  okText?: string | VNode

  okType?: string

  style?: object

  title?: string | VNode

  visible?: boolean

  width?: string | number

  wrapClassName?: string

  zIndex?: number

  content?: string | VNode

  cancel?: (e: Event) => void

  ok?: (e: Event) => void

  onOk?: (e: Event) => void
}

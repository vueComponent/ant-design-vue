// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNode } from 'vue';
import { TreeNode } from './tree-node';
import { Button } from './button/button';

export interface ModalOptions {
  /**
   * Specify which button to autofocus
   * @default 'ok'
   * @type string | null
   */
  autoFocusButton?: string | null;

  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText?: string;

  /**
   * Centered Modal
   * @default false
   * @type boolean
   */
  centered?: boolean;

  /**
   * class of container
   * @type string
   */
  class?: string;

  /**
   * Modal content
   * @type string | VNode | (h) => VNode
   */
  content?: any;

  /**
   * Icon type of the Icon component
   * @default 'question-circle'
   * @type string
   */
  iconType?: string;

  /**
   * Whether support press esc to close
   * @default true
   * @type boolean
   */
  keyboard?: boolean;

  /**
   * Whether to close the modal dialog when the mask (area outside the modal) is clicked
   * @default false
   * @type boolean
   */
  maskClosable?: boolean;

  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText?: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType?: string;

  /**
   * The ok button props
   * @type object
   */
  okButtonProps?: Button;

  /**
   * The cancel button props
   * @type object
   */
  cancelButtonProps?: Button;

  /**
   * Title
   * @type string | VNode | (h) => VNode
   */
  title?: any;

  /**
   * Width of the modal dialog
   * @default 416
   * @type string | number
   */
  width?: string | number;

  /**
   * The z-index of the Modal
   * @default 100
   * @type number
   */
  zIndex?: number;

  /**
   * Specify a function that will be called when the user clicks the Cancel button.
   * The parameter of this function is a function whose execution should include closing the dialog.
   * You can also just return a promise and when the promise is resolved, the modal dialog will also be closed
   * @type Function
   */
  onCancel?: () => any;

  /**
   * Specify a function that will be called when the user clicks the OK button.
   * The parameter of this function is a function whose execution should include closing the dialog.
   * You can also just return a promise and when the promise is resolved, the modal dialog will also be closed
   * @type Function
   */
  onOk?: () => any;
}

export interface ModalConfirm {
  /**
   * Updates modal options
   * @param modalOptions modal option
   */
  update(modalOptions: ModalOptions): void;

  /**
   * Destroy the current model instace
   */
  destroy(): void;
}

export declare class Modal extends AntdComponent {
  /**
   * Specify a function that will be called when modal is closed completely.
   * @type Function
   */
  afterClose: () => any;

  /**
   * Body style for modal body element. Such as height, padding etc.
   * @default {}
   * @type object
   */
  bodyStyle: object;

  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;

  /**
   * Centered Modal
   * @default false
   * @type boolean
   */
  centered: boolean;

  /**
   * Whether a close (x) button is visible on top right of the modal dialog or not
   * @default true
   * @type boolean
   */
  closable: boolean;

  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  /**
   * Whether to unmount child components on onClose
   * @default false
   * @type boolean
   */
  destroyOnClose: boolean;

  /**
   * Footer content, set as :footer="null" when you don't need default buttons
   * @default OK and Cancel buttons
   * @type any (string | slot)
   */
  footer: any;

  /**
   * Return the mount node for Modal
   * @default () => document.body
   * @type Function
   */
  getContainer: (instance: any) => HTMLElement;

  /**
   * Whether show mask or not.
   * @default true
   * @type boolean
   */
  mask: boolean;

  /**
   * Whether to close the modal dialog when the mask (area outside the modal) is clicked
   * @default true
   * @type boolean
   */
  maskClosable: boolean;

  /**
   * Style for modal's mask element.
   * @default {}
   * @type object
   */
  maskStyle: object;

  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';

  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { props: Button; on: {} };

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { props: Button; on: {} };

  /**
   * The modal dialog's title
   * @type any (string | slot)
   */
  title: any;

  /**
   * Whether the modal dialog is visible or not
   * @default false
   * @type boolean
   */
  visible: boolean;

  /**
   * Width of the modal dialog
   * @default 520
   * @type string | number
   */
  width: string | number;

  /**
   * The class name of the container of the modal dialog
   * @type string
   */
  wrapClassName: string;

  /**
   * The z-index of the Modal
   * @default 1000
   * @type number
   */
  zIndex: number;

  static info(options: ModalOptions): ModalConfirm;
  static success(options: ModalOptions): ModalConfirm;
  static error(options: ModalOptions): ModalConfirm;
  static warning(options: ModalOptions): ModalConfirm;
  static confirm(options: ModalOptions): ModalConfirm;
}

declare module 'vue/types/vue' {
  interface Vue {
    $info: (modalOptios: ModalOptions) => ModalConfirm;
    $success: (modalOptios: ModalOptions) => ModalConfirm;
    $error: (modalOptios: ModalOptions) => ModalConfirm;
    $warning: (modalOptios: ModalOptions) => ModalConfirm;
    $confirm: (modalOptios: ModalOptions) => ModalConfirm;
  }
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Drawer extends AntdComponent {
  /**
   * Whether a close (x) button is visible on top right of the Drawer dialog or not.
   * @default true
   * @type boolean
   */
  closable: boolean;

  /**
   * Whether to unmount child components on closing drawer or not.
   * @default false
   * @type boolean
   */
  destroyOnClose: boolean;

  /**
   * Return the mounted node for Drawer.
   * @default 'body'
   * @type any
   */
  getContainer: any;

  /**
   * Whether to show mask or not.
   * @default true
   * @type boolean
   */
  mask: boolean;

  /**
   * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
   * @default true
   * @type boolean
   */
  maskClosable: boolean;

  /**
   * Style for Drawer's mask element.
   * @default {}
   * @type object
   */
  maskStyle: object;

  /**
   * The title for Drawer.
   * @type any (string | slot)
   */
  title: any;

  /**
   * Whether the Drawer dialog is visible or not.
   * @default false
   * @type boolean
   */
  visible: boolean;

  /**
   * The class name of the container of the Drawer dialog.
   * @type string
   */
  wrapClassName: string;

  /**
   * The style of the container of the Drawer dialog.
   * @type object
   */
  wrapStyle: object;

  /**
   * Width of the Drawer dialog.
   * @default 256
   * @type string | number
   */
  width: string | number;

  /**
   * placement is top or bottom, height of the Drawer dialog.
   * @type string | number
   */
  height: string | number;

  /**
   * The z-index of the Drawer.
   * @default 1000
   * @type number
   */
  zIndex: number;

  /**
   * The placement of the Drawer.
   * @default 'right'
   * @type string
   */
  placement: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  close(): void;
}

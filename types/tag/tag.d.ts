// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { CheckableTag } from './checkable-tag';

export declare class Tag extends AntdComponent {
  static CheckableTag: typeof CheckableTag;

  /**
   * Callback executed when close animation is completed
   * @type Function
   */
  afterClose: () => void;

  /**
   * Whether the Tag can be closed
   * @default false
   * @type boolean
   */
  closable: boolean;

  /**
   * Color of the Tag
   * @type string
   */
  color: string;

  /**
   * Whether the Tag is closed or not
   * @default true
   * @type boolean
   */
  visible: boolean;
}

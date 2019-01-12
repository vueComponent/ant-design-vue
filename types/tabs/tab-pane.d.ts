// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class TabPane extends AntdComponent {
  /**
   * Forced render of content in tabs, not lazy render after clicking on tabs
   * @default false
   * @type boolean
   */
  forceRender: boolean;

  /**
   * TabPane's key
   * @type string
   */
  key: string;

  /**
   * Show text in TabPane's head
   * @type any (string | slot)
   */
  tab: any;
}

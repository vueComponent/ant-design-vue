// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class CollapsePanel extends AntdComponent {
  /**
   * If true, panel cannot be opened or closed
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Forced render of content on panel, instead of lazy rending after clicking on header
   * @default false
   * @type boolean
   */
  forceRender: boolean;

  /**
   * Title of the panel
   * @type string
   */
  header: string;

  /**
   * Unique key identifying the panel from among its siblings
   * @type string
   */
  key: string;

  /**
   * If false, panel will not show arrow icon
   * @default true
   * @type boolean
   */
  showArrow: boolean;
}

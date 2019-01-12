// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { LayoutSider } from './layout-sider';

export declare class Layout extends AntdComponent {
  static Sider: LayoutSider;

  /**
   * container className
   * @default undefined
   * @type string
   */
  class: string;

  /**
   * to customize the styles
   * @type string | object
   */
  style: string | object;

  /**
   * whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering
   * @type boolean
   */
  hasSider: boolean;
}

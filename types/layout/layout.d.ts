// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { LayoutSider } from './layout-sider';
import LayoutHeader from './layout-header';
import LayoutContent from './layout-content';
import LayoutFooter from './layout-footer';
import { CSSProperties } from 'vue';

export interface LayoutProps {
  /**
   * whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering
   * @type boolean
   */
  hasSider?: boolean;
}

export declare class Layout extends AntdComponent {
  static Header: typeof LayoutHeader;
  static Content: typeof LayoutContent;
  static Footer: typeof LayoutFooter;
  static Sider: typeof LayoutSider;

  $props: LayoutProps;
}

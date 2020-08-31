import { CSSProperties } from 'vue';
// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: Pythonfo <https://github.com/Pythonfo>
// Copy from: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';

export interface LayoutHeaderProps {
  /**
   * whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering
   * @type boolean
   */
  hasSider?: boolean;
}

export default class LayoutHeader extends AntdComponent {
  $props: LayoutHeaderProps;
}

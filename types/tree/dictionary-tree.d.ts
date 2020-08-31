// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { TreeProps } from './tree';

interface DictionaryTreeProps extends TreeProps {
  /**
   * Directory open logic, optional `false` 'click' 'dblclick'
   * @default 'click'
   * @type string
   */
  expandAction?: string | boolean;
}
export declare class DictionaryTree extends AntdComponent {
  $props: DictionaryTreeProps;
}

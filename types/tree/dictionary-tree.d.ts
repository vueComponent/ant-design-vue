// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Tree } from './tree';

export declare class DictionaryTree extends Tree {
  /**
   * Directory open logic, optional false 'click' 'dblclick'
   * @default 'click'
   * @type string
   */
  expandAction: string;
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: Svreber <https://github.com/Svreber>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNode } from 'vue';

export declare class Empty extends AntdComponent {
  /**
   * customize description
   * @type string | VNode
   */
  description: string | VNode;

  /**
   * customize image. Will tread as image url when string provided
   * @default false
   * @type string | VNode
   */
  image: string | VNode;
  imageStyle: object;
}

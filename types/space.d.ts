// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: drafish <https://github.com/drafish>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Space extends AntdComponent {
  /**
   * 对齐方式
   */
  align: 'start' | 'end' | 'center' | 'baseline';
  /**
   * 间距方向
   */
  direction: 'vertical' | 'horizontal';
  /**
   * 间距大小
   */
  size: 'small' | 'middle' | 'large' | number;
}

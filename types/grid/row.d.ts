// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class Row extends AntdComponent {
  /**
   * spacing between grids, could be a number or a object like { xs: 8, sm: 16, md: 24}
   * @default 0
   * @type numner | object
   */
  gutter:
    | number
    | {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };

  /**
   * layout mode, optional flex
   * @type string
   */
  type: string;

  /**
   * the vertical alignment of the flex layout: top middle bottom
   * @default 'top'
   * @type string
   */
  align: 'top' | 'middle' | 'bottom';

  /**
   * horizontal arrangement of the flex layout: start end center space-around space-between
   * @default 'start'
   * @type string
   */
  justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
}

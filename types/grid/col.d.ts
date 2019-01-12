// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class Col extends AntdComponent {
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type number
   */
  span: number;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type number
   */
  order: number;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type number
   */
  offset: number;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type number
   */
  push: number;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type number
   */
  pull: number;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  xs: { span: number; offset: number } | number;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  sm: { span: number; offset: number } | number;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  md: { span: number; offset: number } | number;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  lg: { span: number; offset: number } | number;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  xl: { span: number; offset: number } | number;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: number, offset: number } | number
   */
  xxl: { span: number; offset: number } | number;
}

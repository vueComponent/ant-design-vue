// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Progress extends AntdComponent {
  /**
   * template function of the content
   * @default percent => percent + '%'
   * @type Function
   */
  format: (percent?: number, successPercent?: number) => any;

  /**
   * the gap degree of half circle, 0 ~ 360
   * @default 0
   * @type number
   */
  gapDegree: number;

  /**
   * the gap position, options: top bottom left right
   * @default 'top'
   * @type string
   */
  gapPosition: 'top' | 'bottom' | 'left' | 'right';

  /**
   * to set the completion percentage
   * @default 0
   * @type number
   */
  percent: number;

  /**
   * whether to display the progress value and the status icon
   * @default true
   * @type boolean
   */
  showInfo: boolean;

  /**
   * to set the status of the Progress, options: normal success exception active
   * @default 'normal'
   * @type string
   */
  status: 'normal' | 'success' | 'active' | 'exception';

  /**
   * to set the width of the progress bar, unit: px.
   * to set the width of the circular progress bar, unit: percentage of the canvas width
   * @default 10 if type = 'line', else 6
   * @type number
   */
  strokeWidth: number;

  /**
   * to set the style of the progress linecap
   * @default 'round'
   * @type Enum{ 'round', 'square' }
   */
  strokeLinecap: 'round' | 'square';

  /**
   * color of progress bar
   * @type string
   */
  strokeColor: string;

  /**
   * segmented success percent, works when type="line"
   * @default 0
   * @type number
   */
  successPercent: number;

  /**
   * to set the type, options: line circle dashboard
   * @default 'line'
   * @type string
   */
  type: 'line' | 'circle' | 'dashboard';

  /**
   * to set the canvas width of the circular progress bar, unit: px
   * @default 120
   * @type number
   */
  width: number;
}

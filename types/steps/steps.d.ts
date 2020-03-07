// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Step } from './step';

export declare class Steps extends AntdComponent {
  static Step: typeof Step;
  type: 'default' | 'navigation';
  /**
   * to set the current step, counting from 0. You can overwrite this state by using status of Step
   * @default 0
   * @type number
   */
  current: number;

  /**
   * set the initial step, counting from 0
   * @default 0
   * @type number
   */
  initial: number;

  /**
   * support vertial title and description
   * @default 'horizontal'
   * @type string
   */
  labelPlacement: 'horizontal' | 'vertical';

  /**
   * to specify the status of current step, can be set to one of the following values: wait process finish error
   * @default 'process'
   * @type string
   */
  status: 'wait' | 'process' | 'finish' | 'error';

  /**
   * to specify the size of the step bar, default and small are currently supported
   * @default 'default'
   * @type string
   */
  size: 'default' | 'small';

  /**
   * to specify the direction of the step bar, horizontal and vertical are currently supported
   * @default 'horizontal'
   * @type string
   */
  direction: 'horizontal' | 'vertical';

  /**
   * Steps with progress dot style, customize the progress dot by setting a scoped slot. labelPlacement will be vertical
   * @default false
   * @type boolean | Funtion
   */
  progressDot: boolean | Function;
}

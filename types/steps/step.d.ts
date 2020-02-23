// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class Step extends AntdComponent {
  /**
   * description of the step, optional property
   * @type any (string | slot)
   */
  description: any;

  /**
   * icon of the step, optional property
   * @type any (string | slot)
   */
  icon: any;

  /**
   * to specify the status. It will be automatically set by current of Steps if not configured. Optional values are: wait process finish error
   * @default 'wait'
   * @type string
   */
  status: 'wait' | 'process' | 'finish' | 'error';

  /**
   * title of the step
   * @type  any (string | slot)
   */
  title: any;
  disabled: boolean;
  subTitle: any;
}

// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { RadioProps, Radio } from './radio';

declare class RadioButtonProps extends RadioProps {
  /**
   * Type of radio button
   * @type string
   */
  type?: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
}
export declare class RadioButton extends Radio {
  $props: RadioButtonProps;
}

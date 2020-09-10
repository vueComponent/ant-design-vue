// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { VNodeChild } from 'vue';
export declare class Rate extends AntdComponent {
  $props: AntdProps & {
    /**
     * whether to allow clear when click again
     * @default true
     * @type boolean
     */
    allowClear?: boolean;

    /**
     * whether to allow semi selection
     * @default false
     * @type boolean
     */
    allowHalf?: boolean;

    /**
     * get focus when component mounted
     * @default false
     * @type boolean
     */
    autofocus?: boolean;

    /**
     * custom character of rate
     * @default <StarOutlined />
     * @type any (String or slot="character")
     */
    character?: VNodeChild | JSX.Element;

    /**
     * star count
     * @default 5
     * @type number
     */
    count?: number;

    /**
     * default value
     * @default 0
     * @type number
     */
    defaultValue?: number;

    /**
     * read only, unable to interact
     * @default false
     * @type boolean
     */
    disabled?: boolean;

    /**
     * current value
     * @type number
     */
    value?: number;

    tooltips?: Array<string>;
  };
  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}

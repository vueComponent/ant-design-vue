// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild } from 'vue';
import { InputProps } from './input';

export declare class InputSearch extends AntdComponent {
  $props: AntdProps &
    InputProps & {
      /**
       * to show an enter button after input
       * @default false
       * @type any (boolean | slot)
       */
      enterButton?: boolean | VNodeChild | JSX.Element;

      /**
       * Callback when search is clicked or enter is pressed
       * @type Function
       */
      onSearch?: (value: string | number, event: Event) => void;
    };
}

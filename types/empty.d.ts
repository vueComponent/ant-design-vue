// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: Svreber <https://github.com/Svreber>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { VNodeChild, CSSProperties } from 'vue';

export declare class Empty extends AntdComponent {
  $props: AntdProps & {
    /**
     * customize description
     * @type string | VNode
     */
    description?: VNodeChild | JSX.Element;

    /**
     * customize image. Will tread as image url when string provided
     * @default false
     * @type string | VNode
     */
    image?: VNodeChild | JSX.Element;

    imageStyle?: CSSProperties | string;
  };
}

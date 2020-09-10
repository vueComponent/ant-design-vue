// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from './component';

export declare class Avatar extends AntdComponent {
  $props: AntdProps & {
    /**
     * the Icon type for an icon avatar, see Icon Component
     * @type any (VNode | slot)
     */
    icon?: VNodeChild | JSX.Element;

    /**
     * the shape of avatar
     * @default 'circle'
     * @type string
     */
    shape?: 'circle' | 'square';

    /**
     * the size of the avatar
     * @default 'default'
     * @type number | string
     */
    size?: 'small' | 'large' | 'default' | number;

    /**
     * the address of the image for an image avatar
     * @type string
     */
    src?: string;

    /**
     * a list of sources to use for different screen resolutions
     * @type string
     */
    srcSet?: string;

    /**
     * This attribute defines the alternative text describing the image
     * @type string
     */
    alt?: string;

    /**
     * handler when img load error，return false to prevent default fallback behavior
     * @type
     */
    loadError?: () => boolean;
  };
}

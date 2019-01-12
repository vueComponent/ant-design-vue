// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Avatar extends AntdComponent {
  /**
   * the Icon type for an icon avatar, see Icon Component
   * @type string
   */
  icon: string;

  /**
   * the shape of avatar
   * @default 'circle'
   * @type string
   */
  shape: 'circle' | 'square';

  /**
   * the size of the avatar
   * @default 'default'
   * @type number | string
   */
  size: 'small' | 'large' | 'default' | number;

  /**
   * the address of the image for an image avatar
   * @type string
   */
  src: string;

  /**
   * a list of sources to use for different screen resolutions
   * @type string
   */
  srcSet: string;

  /**
   * This attribute defines the alternative text describing the image
   * @type string
   */
  alt: string;

  /**
   * handler when img load error，return false to prevent default fallback behavior
   * @type
   */
  loadError: () => boolean;
}

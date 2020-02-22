// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export interface SkeletonAvatarProps {
  size?: 'large' | 'small' | 'default' | number;
  shape?: 'circle' | 'square';
}

export interface SkeletonTitleProps {
  width?: number | string;
}

export interface SkeletonParagraphProps {
  width?: string | number | Array<string | number>;
  rows?: number;
}

export declare class Skeleton extends AntdComponent {
  /**
   * Show animation effect
   * @default false
   * @type boolean
   */
  active: boolean;

  /**
   * Show avatar placeholder
   * @default false
   * @type boolean | object
   */
  avatar: boolean | SkeletonAvatarProps;

  /**
   * Display the skeleton when true
   * @type boolean
   */
  loading: boolean;

  /**
   * Show paragraph placeholder
   * @default true
   * @type boolean | object
   */
  paragraph: boolean | SkeletonParagraphProps;

  /**
   * Show title placeholder
   * @default true
   * @type boolean | object
   */
  title: boolean | SkeletonTitleProps;
}

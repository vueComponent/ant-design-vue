// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: drafish <https://github.com/drafish>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class PageHeader extends AntdComponent {
  /**
   * Custom backIcon
   * @default <Icon type="arrow-left" />
   * @type any (string | slot)
   */
  backIcon: any;

  /**
   * Custom prefixCls
   * @type string
   */
  prefixCls: string;

  /**
   * Custom title
   * @type any (string | slot)
   */
  title: any;

  /**
   * Custom subTitle
   * @type any (string | slot)
   */
  subTitle: any;

  breadcrumb: object;

  /**
   * Custom tags
   * @type any (string | slot)
   */
  tags: any;

  /**
   * Custom footer
   * @type any (string | slot)
   */
  footer: any;

  /**
   * Custom extra
   * @type any (string | slot)
   */
  extra: any;

  avatar: object;

  ghost: boolean;

  /**
   * Specify a callback that will be called when a user clicks backIcon.
   */
  back(): void;
}

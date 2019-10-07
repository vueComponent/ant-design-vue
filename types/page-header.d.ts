// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: drafish <https://github.com/drafish>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { Avatar } from './avatar'
import { Breadcrumb } from './breadcrumb/breadcrumb';

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

  breadcrumb: Breadcrumb;

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

  avatar: Avatar;

  /**
   * Specify a callback that will be called when a user clicks backIcon.
   */
  back(): void;

  /**
   * Custom class
   * @type string
   */
  className: string;

}

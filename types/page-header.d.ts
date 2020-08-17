// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: drafish <https://github.com/drafish>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNodeChild } from 'vue';

export declare class PageHeader extends AntdComponent {
  /**
   * Custom backIcon
   * @default <ArrowLeftOutlined />
   * @type any (string | slot)
   */
  backIcon?: VNodeChild | JSX.Element;

  /**
   * Custom prefixCls
   * @type string
   */
  prefixCls?: string;

  /**
   * Custom title
   * @type any (string | slot)
   */
  title?: VNodeChild | JSX.Element;

  /**
   * Custom subTitle
   * @type any (string | slot)
   */
  subTitle?: VNodeChild | JSX.Element;

  breadcrumb?: object;

  /**
   * Custom tags
   * @type any (string | slot)
   */
  tags?: VNodeChild | JSX.Element;

  /**
   * Custom footer
   * @type any (string | slot)
   */
  footer?: VNodeChild | JSX.Element;

  /**
   * Custom extra
   * @type any (string | slot)
   */
  extra?: VNodeChild | JSX.Element;

  avatar?: object;

  ghost?: boolean;

  /**
   * Specify a callback that will be called when a user clicks backIcon.
   */
  back(): void;
}

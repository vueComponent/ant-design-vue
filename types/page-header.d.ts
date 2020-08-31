// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: drafish <https://github.com/drafish>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { VNodeChild } from 'vue';

export declare class PageHeader extends AntdComponent {
  $props: AntdProps & {
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
    /**
     * Breadcrumb configuration
     * @type breadcrumb
     */
    breadcrumb?: object;

    /**
     * Tag list next to title
     * @type any (string | slot)
     */
    tags?: VNodeChild | JSX.Element;

    /**
     * PageHeader's footer, generally used to render TabBar
     * @type any (string | slot)
     */
    footer?: VNodeChild | JSX.Element;

    /**
     * Operating area, at the end of the line of the title line
     * @type any (string | slot)
     */
    extra?: VNodeChild | JSX.Element;
    /**
     * Avatar next to the title bar
     * @type Avatar
     */
    avatar?: object;
    /**
     * PageHeader type, will change background color
     * @default true
     * @type boolean
     */
    ghost?: boolean;

    /**
     * Specify a callback that will be called when a user clicks backIcon.
     */
    onBack(): () => void;
  };
}

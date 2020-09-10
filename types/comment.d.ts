// Project: https://github.com/vueComponent/ant-design-vue
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from './component';

export declare class Comment extends AntdComponent {
  $props: AntdProps & {
    /** List of action items rendered below the comment content
     * any ( array | slot )
     */
    actions?: VNodeChild | JSX.Element;

    /** The element to display as the comment author
     * @type any ( string | slot)
     */
    author?: VNodeChild | JSX.Element;

    /** The element to display as the comment avatar - generally an antd Avatar
     * @type any ( string | slot)
     */
    avatar?: VNodeChild | JSX.Element;

    /** The main content of the comment
     * @type any ( string | slot)
     */
    content?: VNodeChild | JSX.Element;

    /** Comment prefix defaults to '.ant-comment'
     * @type string
     */
    prefixCls?: string;

    /** A datetime element containing the time to be displayed
     * @type any ( string | slot)
     */
    datetime?: VNodeChild | JSX.Element;
  };
}

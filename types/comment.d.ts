// Project: https://github.com/vueComponent/ant-design-vue
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Comment extends AntdComponent {
  /** List of action items rendered below the comment content */
  actions?: Array<any>;
  /** The element to display as the comment author. */
  author?: any;
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar?: any;
  /** The main content of the comment */
  content: any;
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls?: string;
  /** A datetime element containing the time to be displayed */
  datetime?: any;
}

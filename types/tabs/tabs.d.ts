// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { TabPane } from './tab-pane';

export declare class Tabs extends AntdComponent {
  static TabPane: typeof TabPane;

  /**
   * Current TabPane's key
   * @type string
   */
  activeKey: string;

  /**
   * Whether to change tabs with animation. Only works while tabPosition="top"\|"bottom"
   * @default true, false when type="card"
   * @type boolean | object
   */
  animated: boolean | { inkBar: boolean; tabPane: boolean };

  /**
   * Initial active TabPane's key, if activeKey is not set.
   * @type string
   */
  defaultActiveKey: string;

  /**
   * Hide plus icon or not. Only works while type="editable-card"
   * @default false
   * @type boolean
   */
  hideAdd: boolean;

  /**
   * preset tab bar size
   * @default 'default'
   * @type string
   */
  size: 'default' | 'small' | 'large';

  /**
   * Extra content in tab bar
   * @type any
   */
  tabBarExtraContent: any;

  /**
   * Tab bar style object
   * @type object
   */
  tabBarStyle: object;

  /**
   * Position of tabs
   * @default 'top'
   * @type string
   */
  tabPosition: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Basic style of tabs
   * @default 'line'
   * @type string
   */
  type: 'line' | 'card' | 'editable-card';

  /**
   * The gap between tabs
   * @type number
   */
  tabBarGutter: number;
}

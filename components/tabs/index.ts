import Tabs, { TabPane } from './src';
export type { TabsProps, TabPaneProps } from './src';

Tabs.TabPane = TabPane;

/* istanbul ignore next */

export default Object.assign(Tabs, {
  TabPane,
});

export { TabPane };

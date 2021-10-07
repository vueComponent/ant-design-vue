import type { App, Plugin } from 'vue';
import Tabs, { TabPane } from './src';
export type { TabsProps, TabPaneProps } from './src';

Tabs.TabPane = { ...TabPane, name: 'ATabPane', __ANT_TAB_PANE: true };

/* istanbul ignore next */
Tabs.install = function (app: App) {
  app.component(Tabs.name, Tabs);
  app.component(Tabs.TabPane.name, Tabs.TabPane);
  return app;
};

export default Tabs as typeof Tabs &
  Plugin & {
    readonly TabPane: typeof TabPane;
  };

export { TabPane };

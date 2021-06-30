import type { App, Plugin } from 'vue';
import Tabs from './tabs';
import TabPane from '../vc-tabs/src/TabPane';
import TabContent from '../vc-tabs/src/TabContent';

Tabs.TabPane = { ...TabPane, name: 'ATabPane', __ANT_TAB_PANE: true };
Tabs.TabContent = { ...TabContent, name: 'ATabContent' };

/* istanbul ignore next */
Tabs.install = function (app: App) {
  app.component(Tabs.name, Tabs);
  app.component(Tabs.TabPane.name, Tabs.TabPane);
  app.component(Tabs.TabContent.name, Tabs.TabContent);
  return app;
};

export default Tabs as typeof Tabs &
  Plugin & {
    readonly TabPane: typeof TabPane;
    readonly TabContent: typeof TabContent;
  };

export { TabPane, TabContent };

import ref from 'vue-ref';
import Vue from 'vue';
import Tabs from './tabs';
import TabPane from '../vc-tabs/src/TabPane';
import TabContent from '../vc-tabs/src/TabContent';
Tabs.TabPane = { ...TabPane, name: 'ATabPane', __ANT_TAB_PANE: true };
Tabs.TabContent = { ...TabContent, name: 'ATabContent' };
Vue.use(ref, { name: 'ant-ref' });

/* istanbul ignore next */
Tabs.install = function(Vue) {
  Vue.component(Tabs.name, Tabs);
  Vue.component(Tabs.TabPane.name, Tabs.TabPane);
  Vue.component(Tabs.TabContent.name, Tabs.TabContent);
};

export default Tabs;
export { TabPane, TabContent };

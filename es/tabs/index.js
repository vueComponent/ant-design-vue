import _extends from 'babel-runtime/helpers/extends';
import Tabs from './tabs';
import TabPane from '../vc-tabs/src/TabPane';
import TabContent from '../vc-tabs/src/TabContent';
Tabs.TabPane = _extends({}, TabPane, { name: 'ATabPane', __ANT_TAB_PANE: true });
Tabs.TabContent = _extends({}, TabContent, { name: 'ATabContent' });
export default Tabs;
export { TabPane, TabContent };
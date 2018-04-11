import Tabs from './tabs'
import TabPane from '../vc-tabs/src/TabPane'
import TabContent from '../vc-tabs/src/TabContent'
Tabs.TabPane = { ...TabPane, name: 'ATabPane', __ANT_TAB_PANE: true }
Tabs.TabContent = { ...TabContent, name: 'ATabContent' }
export default Tabs
export { TabPane, TabContent }

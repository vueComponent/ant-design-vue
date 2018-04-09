import Tabs from './tabs'
import TabPane from '../vc-tabs/src/TabPane'
import TabContent from '../vc-tabs/src/TabContent'
Tabs.TabPane = { ...TabPane, name: 'ATabPane' }
Tabs.TabContent = { ...TabContent, name: 'ATabContent' }
export default Tabs
export { TabPane, TabContent }

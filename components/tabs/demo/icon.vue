<template>
<div>
  <Tabs defaultActiveKey="2">
    <TabPane :tab="(h, tabKey) => renderTab(h, tabKey, 'apple')" key="1">
      Tab 1
    </TabPane>
    <TabPane :tab="(h, tabKey) => renderTab(h, tabKey, 'android')" key="2">
      Tab 2
    </TabPane>
  </Tabs>
  <Tabs defaultActiveKey="2">
    <span slot="tab_1">
      <Icon type="apple" />
      Tab 1
    </span>
    <TabPane key="1">
      Tab 1
    </TabPane>
    <span slot="tab_2">
      <Icon type="android" />
      Tab 2
    </span>
    <TabPane key="2">
      Tab 2
    </TabPane>
  </Tabs>
</div>
</template>
<script>
import { Tabs, Icon } from 'antd'
export default {
  methods: {
    renderTab (h, tabKey, iconType) {
      return h('span', [<Icon type={iconType} />, `Tab ${tabKey}`])
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
    Icon,
  },
}
</script>

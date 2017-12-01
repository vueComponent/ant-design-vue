<template>
  <Tabs defaultActiveKey="2">
    <TabPane :tab="(h, tabKey) => renderTab(h, tabKey, 'apple')" tabKey="1">
      Tab 1
    </TabPane>
    <TabPane :tab="(h, tabKey) => renderTab(h, tabKey, 'android')" tabKey="2">
      Tab 2
    </TabPane>
  </Tabs>
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

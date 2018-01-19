<template>
<div>
  <Tabs defaultActiveKey="2">
    <TabPane :tab="(h) => renderTab(h, '1', 'apple')" key="1">
      Tab 1
    </TabPane>
    <TabPane :tab="(h) => renderTab(h, '2', 'android')" key="2">
      Tab 2
    </TabPane>
  </Tabs>
  <Tabs defaultActiveKey="2">
    <TabPane key="1">
      <span slot="tab">
        <Icon type="apple" />
        Tab 1
      </span>
      Tab 1
    </TabPane>
    <TabPane key="2">
      <span slot="tab">
        <Icon type="android" />
        Tab 2
      </span>
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

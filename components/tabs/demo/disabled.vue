<template>
  <Tabs defaultActiveKey="1">
    <TabPane tab="Tab 1" tabKey="1">Tab 1</TabPane>
    <TabPane tab="Tab 2" disabled tabKey="2">Tab 2</TabPane>
    <TabPane tab="Tab 3" tabKey="3">Tab 3</TabPane>
  </Tabs>
</template>
<script>
import { Tabs } from 'antd'
export default {
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
}
</script>

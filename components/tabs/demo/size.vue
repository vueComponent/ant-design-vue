<template>
  <Tabs defaultActiveKey="2" size="small">
    <TabPane tab="Tab 1" key="1">Content of tab 1</TabPane>
    <TabPane tab="Tab 2" key="2">Content of tab 2</TabPane>
    <TabPane tab="Tab 3" key="3">Content of tab 3</TabPane>
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

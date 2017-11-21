<template>
  <div>
    <Tabs activeKey="test1">
      <TabPane pKey="test1" tab="tab1">hello</TabPane>
      <TabPane pKey="test2" tab="tab2">world</TabPane>
    </Tabs>
  </div>
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

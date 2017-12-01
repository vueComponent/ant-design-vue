<template>
  <Tabs :tabBarExtraContent="operations">
    <TabPane tab="Tab 1" tabKey="1">Content of tab 1</TabPane>
    <TabPane tab="Tab 2" tabKey="2">Content of tab 2</TabPane>
    <TabPane tab="Tab 3" tabKey="3">Content of tab 3</TabPane>
  </Tabs>
</template>
<script>
import { Tabs, Button } from 'antd'
export default {
  methods: {
    operations (h) {
      return h('span', [<Button>Extra Action</Button>])
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
}
</script>

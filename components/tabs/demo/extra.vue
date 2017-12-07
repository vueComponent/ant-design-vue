<template>
<div>
  <Tabs :tabBarExtraContent="operations">
    <TabPane tab="Tab 1" tabKey="1">Content of tab 1</TabPane>
    <TabPane tab="Tab 2" tabKey="2">Content of tab 2</TabPane>
    <TabPane tab="Tab 3" tabKey="3">Content of tab 3</TabPane>
  </Tabs>
  <Tabs>
    <TabPane tab="Tab 1" tabKey="1">Content of tab 1</TabPane>
    <TabPane tab="Tab 2" tabKey="2">Content of tab 2</TabPane>
    <TabPane tab="Tab 3" tabKey="3">Content of tab 3</TabPane>
    <AntButton slot="tabBarExtraContent">Extra Action</AntButton>
  </Tabs>
</div>

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
    AntButton: Button,
  },
}
</script>

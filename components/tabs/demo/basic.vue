<template>
  <Tabs defaultActiveKey="1" @change="callback">
    <TabPane tab="Tab 1" tabKey="1">Content of Tab Pane 1</TabPane>
    <TabPane tab="Tab 2" tabKey="2">Content of Tab Pane 2</TabPane>
    <TabPane tab="Tab 3" tabKey="3">Content of Tab Pane 3</TabPane>
  </Tabs>
</template>
<script>
import { Tabs } from 'antd'
export default {
  data () {
    return {
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
}
</script>

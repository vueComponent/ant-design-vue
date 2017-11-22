<template>
  <div>
    <Tabs v-model="activeKey">
      <span slot="tabBarExtraContent">kkk</span>
      <TabPane pKey="test1" tab="tab1">hello</TabPane>
      <TabPane pKey="test2" tab="tab2">world</TabPane>
    </Tabs>
  </div>
</template>
<script>
import { Tabs } from 'antd'
export default {
  data () {
    return {
      activeKey: 'test1',
    }
  },
  methods: {
    tabBarExtraContent (h) {
      return h('span', 'hhhh')
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
}
</script>

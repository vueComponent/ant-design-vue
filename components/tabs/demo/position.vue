<template>
  <div style="width: 500px">
    <RadioGroup v-model="tabPosition" style="margin:8px">
      <RadioButton value="top">top</RadioButton>
      <RadioButton value="bottom">bottom</RadioButton>
      <RadioButton value="left">left</RadioButton>
      <RadioButton value="right">right</RadioButton>
    </RadioGroup>
    <Tabs defaultActiveKey="1" :tabPosition="tabPosition">
      <TabPane tab="Tab 1" key="1">Content of Tab 1</TabPane>
      <TabPane tab="Tab 2" key="2">Content of Tab 2</TabPane>
      <TabPane tab="Tab 3" key="3">Content of Tab 3</TabPane>
    </Tabs>
  </div>

</template>
<script>
import { Tabs, Radio } from 'antd'
export default {
  data () {
    return {
      tabPosition: 'top',
    }
  },
  methods: {
    callback (val) {
      console.log(val)
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
    Radio,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
  },
}
</script>

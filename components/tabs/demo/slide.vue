<template>
  <div style="width: 500px">
    <RadioGroup v-model="mode" :style="{ marginBottom: 8 }">
      <RadioButton value="top">Horizontal</RadioButton>
      <RadioButton value="left">Vertical</RadioButton>
    </RadioGroup>
    <Tabs defaultActiveKey="1" :tabPosition="mode" :style="{ height: '200px'}">
      <TabPane tab="Tab 1" tabKey="1">Content of tab 1</TabPane>
      <TabPane tab="Tab 2" tabKey="2">Content of tab 2</TabPane>
      <TabPane tab="Tab 3" tabKey="3">Content of tab 3</TabPane>
      <TabPane tab="Tab 4" tabKey="4">Content of tab 4</TabPane>
      <TabPane tab="Tab 5" tabKey="5">Content of tab 5</TabPane>
      <TabPane tab="Tab 6" tabKey="6">Content of tab 6</TabPane>
      <TabPane tab="Tab 7" tabKey="7">Content of tab 7</TabPane>
      <TabPane tab="Tab 8" tabKey="8">Content of tab 8</TabPane>
      <TabPane tab="Tab 9" tabKey="9">Content of tab 9</TabPane>
      <TabPane tab="Tab 10" tabKey="10">Content of tab 10</TabPane>
      <TabPane tab="Tab 11" tabKey="11">Content of tab 11</TabPane>
    </Tabs>
  </div>

</template>
<script>
import { Tabs, Radio } from 'antd'
export default {
  data () {
    return {
      mode: 'top',
    }
  },
  methods: {
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

<template>
<div>
  <RadioGroup v-model="size" style="margin-bottom: 16px">
    <RadioButton value="small">Small</RadioButton>
    <RadioButton value="default">Default</RadioButton>
    <RadioButton value="large">Large</RadioButton>
  </RadioGroup>
  <Tabs defaultActiveKey="2" :size="size">
    <TabPane tab="Tab 1" key="1">Content of tab 1</TabPane>
    <TabPane tab="Tab 2" key="2">Content of tab 2</TabPane>
    <TabPane tab="Tab 3" key="3">Content of tab 3</TabPane>
  </Tabs>
</div>
</template>
<script>
import { Tabs, Radio } from 'antd'
export default {
  data () {
    return {
      size: 'small',
    }
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
  },
}
</script>

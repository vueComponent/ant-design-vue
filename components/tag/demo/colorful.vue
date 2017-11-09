<template>
  <div>
    <h4 style="margin-bottom: 16px">Presets:</h4>
    <div>
      <Tag color="pink">pink</Tag>
      <Tag color="red">red</Tag>
      <Tag color="orange">orange</Tag>
      <Tag color="green">green</Tag>
      <Tag color="cyan">cyan</Tag>
      <Tag color="blue">blue</Tag>
      <Tag color="purple">purple</Tag>
    </div>
    <h4 style="margin: '16px 0'">Custom:</h4>
    <div>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#2db7f5">#2db7f5</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
    </div>
  </div>
</template>
<script>
import { Tag } from 'antd'
export default {
  components: {
    Tag,
  },
}
</script>

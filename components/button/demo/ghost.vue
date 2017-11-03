<template>
  <div :style="{ background: 'rgb(190, 200, 200)', padding: '26px 16px 16px' }">
    <AntButton type="primary" ghost>Primary</AntButton>
    <AntButton ghost>Default</AntButton>
    <AntButton type="dashed" ghost>Dashed</AntButton>
    <AntButton type="danger" ghost>danger</AntButton>
  </div>
</template>
<script>
import { Button } from 'antd'
export default {
  components: {
    AntButton: Button,
  },
}
</script>

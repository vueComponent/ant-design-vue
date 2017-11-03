// TODO: 依赖组件开发中
<template>
  <div>
    <AntButton type="primary">Primary</AntButton>
    <AntButton>Default</AntButton>
    <AntButton type="dashed">Dashed</AntButton>
    <AntButton type="danger">Danger</AntButton>
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

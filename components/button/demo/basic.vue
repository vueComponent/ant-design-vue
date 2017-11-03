<template>
  <div>
    <AntButton type="primary">Primary</AntButton>
    <AntButton>Default</AntButton>
    <AntButton type="dashed">Dashed</AntButton>
    <AntButton type="danger">Danger</AntButton>
  </div>
</template>
<script>
import '../style'
import { Button } from 'antd'
export default {
  components: {
    AntButton: Button,
  },
}
</script>

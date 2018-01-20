<template>
<div>
<md>
## 无边框
</md>
<div style="background:#ECECEC; padding:30px">
  <Card title="Card title" :bordered="false" style="width: 300px">
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
</div>
</div>
</template>

<script>
import '../style'
import { Card } from 'antd'
export default {
  components: {
    Card,
  },
}
</script>

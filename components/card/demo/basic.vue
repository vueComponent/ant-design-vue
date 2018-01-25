<template>
<div>
<md>
## 基本
</md>
<Card title="Card title">
  <a href="#" slot="extra">More</a>
  <p>Card content</p>
  <p>Card content</p>
  <p>Card content</p>
</Card>
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

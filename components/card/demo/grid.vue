<template>
<div>
<md>
## 网格型内嵌卡片
</md>
<Card title="Card Title">
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
</Card>
</div>
</template>

<script>
import '../style'
import { Card } from 'antd'
export default {
  components: {
    Card,
    CardGrid: Card.Grid,
  },
}
</script>

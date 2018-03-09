[>_<]:
    这个卡片没起作用还报错！一堆的那种！！！

<cn>
####  网格型内嵌卡片
一种常见的卡片内容区隔模式。
</cn>

<us>
#### Grid card
Grid style card content.
</us>

```html
<template>
<Card title="Card Title">
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
  <CardGrid style="width:25%;textAlign:'center'">Content</CardGrid>
</Card>
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
```

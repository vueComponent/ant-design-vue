<cn>
  #### 无边框
  在灰色背景上使用无边框的卡片
</cn>
<us>
  #### No border
  A borderless card on a gray background.
</us>

```html
<template>
<div style="background:#ECECEC; padding:30px">
  <Card title="Card title" :bordered="false" style="width: 300px">
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
```

<template>
<div>
<md>
## 预加载卡片
</md>
<Card loading title="Card title" style="width: 34%">
  Whatever content
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

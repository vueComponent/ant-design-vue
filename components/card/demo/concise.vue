<template>
<div>
<md>
## 简洁卡片
</md>
<Card
  hoverable
  style="width: 240px"
>
  <img
    alt="example"
    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
    slot="cover"
  />
  <Meta
    title="Europe Street beat"
    description="www.instagram.com"
  />
</Card>
</div>
</template>

<script>
import '../style'
import { Card } from 'antd'
export default {
  components: {
    Card,
    Meta: Card.Meta,
  },
}
</script>

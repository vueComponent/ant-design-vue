<template>
<div>
<md>
## 内部卡片
</md>
<Card title="Card title">
    <p
      style="fontSize: 14px;color: 'rgba(0, 0, 0, 0.85)'; marginBottom: 16px;fontWeight: 500"
    >
      Group title
    </p>
    <Card
      type="inner"
      title="Inner Card title"
    >
      <a href="#" slot="extra">More</a>
      Inner Card content
    </Card>
    <Card
      style="margin-top: 16px"
      type="inner"
      title="Inner Card title"
    >
      <a href="#" slot="extra">More</a>
      Inner Card content
    </Card>
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

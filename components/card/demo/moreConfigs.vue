<template>
<div>
<md>
## 支持更多内容配置
</md>
<Card
  hoverable
  style="width: 300px"
>
  <img
    alt="example"
    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
    slot="cover"
  />
  <ul class="ant-card-actions" slot="actions">
    <li style="width: 33.3333%;"><Icon type="setting" /></li>
    <li style="width: 33.3333%;"><Icon type="edit" /></li>
    <li style="width: 33.3333%;"> <Icon type="ellipsis" /></li>
  </ul>
  <Meta
    title="Card title"
    description="This is the description">
    <Avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
  </Meta>
</Card>
</div>
</template>

<script>
import '../style'
import { Card, Icon, Avatar } from 'antd'
export default {
  components: {
    Card,
    Icon,
    Avatar,
    Meta: Card.Meta,
  },
}
</script>

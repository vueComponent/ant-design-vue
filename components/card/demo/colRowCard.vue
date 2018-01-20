<template>
<div>
<md>
## 栅格卡片
</md>
<div style="background: #ECECEC; padding: 30px">
  <Row :gutter="16">
    <Col :span="8">
      <Card title="Card title" :bordered="false">Card content</Card>
    </Col>
    <Col :span="8">
      <Card title="Card title" :bordered="false">Card content</Card>
    </Col>
    <Col :span="8">
      <Card title="Card title" :bordered="false">Card content</Card>
    </Col>
  </Row>
</div>
</div>
</template>

<script>
import '../style'
import { Card, Col, Row } from 'antd'
export default {
  components: {
    Card,
    Col,
    Row,
  },
}
</script>

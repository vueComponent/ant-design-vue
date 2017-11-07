<template>
  <CheckboxGroup @change="onChange">
    <Row>
      <Col :span="8"><Checkbox value="A">A</Checkbox></Col>
      <Col :span="8"><Checkbox value="B">B</Checkbox></Col>
      <Col :span="8"><Checkbox value="C">C</Checkbox></Col>
      <Col :span="8"><Checkbox value="D">D</Checkbox></Col>
      <Col :span="8"><Checkbox value="E">E</Checkbox></Col>
    </Row>
  </CheckboxGroup>
</template>
<script>
import { Checkbox, Row, Col } from 'antd'
export default {
  methods: {
    onChange (checkedValues) {
      console.log('checked = ', checkedValues)
    },
  },
  components: {
    Checkbox,
    Row,
    Col,
    CheckboxGroup: Checkbox.Group,
  },
}
</script>

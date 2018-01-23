<template>
  <a-checkbox-group @change="onChange">
    <AntRow>
      <AntCol :span="8"><a-checkbox value="A">A</a-checkbox></AntCol>
      <AntCol :span="8"><a-checkbox value="B">B</a-checkbox></AntCol>
      <AntCol :span="8"><a-checkbox value="C">C</a-checkbox></AntCol>
      <AntCol :span="8"><a-checkbox value="D">D</a-checkbox></AntCol>
      <AntCol :span="8"><a-checkbox value="E">E</a-checkbox></AntCol>
    </AntRow>
  </a-checkbox-group>
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
    AntRow: Row,
    AntCol: Col,
    CheckboxGroup: Checkbox.Group,
  },
}
</script>

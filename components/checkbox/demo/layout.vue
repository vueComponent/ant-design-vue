<template>
  <CheckboxGroup @change="onChange">
    <AntRow>
      <AntCol :span="8"><Checkbox value="A">A</Checkbox></AntCol>
      <AntCol :span="8"><Checkbox value="B">B</Checkbox></AntCol>
      <AntCol :span="8"><Checkbox value="C">C</Checkbox></AntCol>
      <AntCol :span="8"><Checkbox value="D">D</Checkbox></AntCol>
      <AntCol :span="8"><Checkbox value="E">E</Checkbox></AntCol>
    </AntRow>
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
    AntRow: Row,
    AntCol: Col,
    CheckboxGroup: Checkbox.Group,
  },
}
</script>

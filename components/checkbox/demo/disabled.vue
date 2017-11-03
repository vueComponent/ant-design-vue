<template>
  <div>
    <Checkbox :defaultChecked="false" disabled />
    <br />
    <Checkbox defaultChecked disabled />
  </div>
</template>
<script>
import { Checkbox } from 'antd'
export default {
  components: {
    Checkbox,
  },
}
</script>

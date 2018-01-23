<template>
  <div>
    <a-checkbox :defaultChecked="false" disabled />
    <br />
    <a-checkbox defaultChecked disabled />
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

<template>
<div class="example-input">
  <AntInput size="large" placeholder="large size" />
  <AntInput placeholder="default size" />
  <AntInput size="small" placeholder="small size" />
</div>

</template>
<script>

import { Input } from 'antd'
export default {
  components: {
    AntInput: Input,
  },
}
</script>
<style>
.example-input .ant-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
</style>

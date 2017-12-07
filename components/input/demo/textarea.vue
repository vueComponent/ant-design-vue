<template>
  <AntTextArea placeholder="Basic usage" :rows="4"/>
</template>
<script>

import { Input } from 'antd'
export default {
  components: {
    AntTextArea: Input.TextArea,
  },
}
</script>

<template>
  <div>
    <AntTextArea placeholder="Autosize height based on content lines" autosize />
    <div style="margin: 24px 0" />
    <ant-textArea placeholder="Autosize height with minimum and maximum number of lines" :autosize="{ minRows: 2, maxRows: 6 }" />
  </div>
</template>
<script>

import { Input } from 'antd'
export default {
  components: {
    AntTextArea: Input.TextArea,
  },
}
</script>

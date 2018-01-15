<template>
<div>
<md>
## 基本
最简单的用法。
</md>
<Tooltip>
  <template slot='title'>
    prompt text
  </template>
  Tooltip will show when mouse enter.
</Tooltip>
</div>
</template>

<script>
import { Tooltip } from 'antd'
export default {
  components: {
    Tooltip,
  },
}
</script>

<template>
<div>
<md>
## 箭头指向
设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。
</md>
  <Tooltip placement="topLeft" title="Prompt Text">
    <AntButton>Align edge / 边缘对齐</AntButton>
  </Tooltip>
  <Tooltip placement="topLeft" title="Prompt Text" arrowPointAtCenter>
    <AntButton>Arrow points to center / 箭头指向中心</AntButton>
  </Tooltip>
</div>
</template>

<script>
import { Tooltip, Button } from 'antd'
export default {
  components: {
    Tooltip,
    AntButton: Button,
  },
}
</script>

<docs>
---
order: 5
title:
  zh-CN: 延迟
  en-US: delay
---

## zh-CN

延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。

## en-US

Specifies a delay for loading state. If `spinning` ends during delay, loading status won't appear.

</docs>

<template>
  <a-spin :spinning="spinning" :delay="delayTime">
    <a-alert
      message="Alert message title"
      description="Further details about the context of this alert."
    ></a-alert>
  </a-spin>
  <div class="spin-state">
    Loading state：
    <a-switch v-model:checked="spinning" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const spinning = ref<boolean>(false);
const delayTime = 500;
</script>
<style scoped>
.spin-state {
  margin-top: 16px;
}
</style>

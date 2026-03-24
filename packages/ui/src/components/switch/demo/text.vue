<script setup lang="ts">
import { ref } from 'vue'
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined'
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked1">
      <template #checkedChildren>ON</template>
      <template #unCheckedChildren>OFF</template>
    </a-switch>

    <a-switch v-model:checked="checked2">
      <template #checkedChildren>1</template>
      <template #unCheckedChildren>0</template>
    </a-switch>

    <a-switch v-model:checked="checked3">
      <template #checkedChildren><CheckOutlined /></template>
      <template #unCheckedChildren><CloseOutlined /></template>
    </a-switch>
  </div>
</template>

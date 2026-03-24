<script setup lang="ts">
import { ref } from 'vue'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked1">
      <template #checkedChildren>开启</template>
      <template #unCheckedChildren>关闭</template>
    </a-switch>

    <a-switch v-model:checked="checked2">
      <template #checkedChildren>1</template>
      <template #unCheckedChildren>0</template>
    </a-switch>

    <a-switch v-model:checked="checked3">
      <template #checkedChildren>
        <CheckOutlined />
      </template>
      <template #unCheckedChildren>
        <CloseOutlined />
      </template>
    </a-switch>
  </div>
</template>

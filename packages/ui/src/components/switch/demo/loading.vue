<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  checked1: true,
  checked2: false,
  checked3: true,
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="state.checked1" loading />
    <a-switch v-model:checked="state.checked2" loading />
    <a-switch v-model:checked="state.checked3" size="small" loading />
  </div>
</template>

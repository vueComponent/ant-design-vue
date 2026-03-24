<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  checked1: true,
  checked2: false,
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="state.checked1" loading />
    <a-switch v-model:checked="state.checked2" size="small" loading />
  </div>
</template>

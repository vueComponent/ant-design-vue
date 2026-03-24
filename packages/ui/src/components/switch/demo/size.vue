<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked" />
    <a-switch v-model:checked="checked" size="small" />
  </div>
</template>

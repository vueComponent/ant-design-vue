<script setup lang="ts">
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked1" />
    <a-switch v-model:checked="checked2" size="small" />
  </div>
</template>

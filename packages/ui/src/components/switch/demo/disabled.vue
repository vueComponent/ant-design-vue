<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
const disabled = ref(true)

function onToggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked" :disabled="disabled" />
    <a-switch :disabled="disabled" />
    <a-button type="primary" @click="onToggle">Toggle disabled</a-button>
  </div>
</template>

<template>
  <a-space>
    <a-radio-group v-model:value="placement">
      <a-radio value="top">Top</a-radio>
      <a-radio value="right">Right</a-radio>
      <a-radio value="bottom">Bottom</a-radio>
      <a-radio value="left">Left</a-radio>
    </a-radio-group>
    <a-button variant="solid" @click="open = true">Open</a-button>
  </a-space>
  <a-drawer
    v-model:open="open"
    title="Placement Drawer"
    :placement="placement"
  >
    <p>Some contents...</p>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerPlacement } from '../types'
const open = ref(false)
const placement = ref<DrawerPlacement>('right')
</script>
